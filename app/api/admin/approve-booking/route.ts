import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { resend, FROM_EMAIL } from '@/lib/emails/resend';
import { CustomerBookingConfirmation } from '@/lib/emails/customer-booking-confirmation';
import { format } from 'date-fns';
import * as React from 'react';

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  });

  try {
    const supabase = await createClient();

    // Verify admin access
    const isAdmin = await verifyAdminAccess(supabase);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    // Use service role client for database operations
    const serviceSupabase = createServiceRoleClient();

    // Fetch booking from database
    const { data: booking, error: fetchError } = await serviceSupabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      console.error('Error finding booking:', fetchError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if booking is in pending_approval status
    if (booking.status !== 'pending_approval') {
      return NextResponse.json(
        { error: `Booking cannot be approved - current status: ${booking.status}` },
        { status: 400 }
      );
    }

    let paymentIntent;
    let amountCaptured = 0;

    // Check if we have a payment intent to capture
    // For 100% coupon bookings, there may be no payment intent (Stripe doesn't create one for $0)
    if (booking.stripe_payment_intent_id) {
      // Capture the authorized payment
      try {
        console.log('💳 Capturing payment intent:', booking.stripe_payment_intent_id);

        paymentIntent = await stripe.paymentIntents.capture(booking.stripe_payment_intent_id);
        amountCaptured = paymentIntent.amount_received;

        console.log('✅ Payment captured successfully:', amountCaptured, 'cents');
      } catch (stripeError) {
        console.error('❌ Stripe capture error:', stripeError);

        // Log error to webhook failures
        await serviceSupabase.from('webhook_failures').insert({
          webhook_type: 'payment_capture_failed',
          booking_id: bookingId,
          stripe_event_id: booking.stripe_payment_intent_id,
          error_message: stripeError instanceof Error ? stripeError.message : 'Unknown error',
          error_details: { error: String(stripeError) }
        });

        return NextResponse.json(
          { error: 'Failed to capture payment', details: stripeError instanceof Error ? stripeError.message : 'Unknown error' },
          { status: 500 }
        );
      }
    } else {
      // No payment intent - this is a 100% coupon booking ($0 total)
      console.log('💰 No payment intent found - this is a $0 booking (100% coupon)');
      console.log('✅ Approving booking without payment capture');
      amountCaptured = 0;
    }

    // Update booking status to 'confirmed' (approved + payment captured)
    const { error: updateError } = await serviceSupabase
      .from('bookings')
      .update({
        status: 'confirmed',
        approved_at: new Date().toISOString(),
        actual_deposit_paid: amountCaptured
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to update booking in database' },
        { status: 500 }
      );
    }

    // Log approval action to audit log
    await serviceSupabase.rpc('log_booking_action', {
      p_booking_id: bookingId,
      p_action: 'approved',
      p_performed_by: (await supabase.auth.getUser()).data.user?.email || 'admin',
      p_details: {
        payment_intent_id: booking.stripe_payment_intent_id || null,
        amount_captured: amountCaptured,
        is_free_booking: amountCaptured === 0,
        timestamp: new Date().toISOString()
      }
    });

    // Send confirmation email to customer
    try {
      const startTime = new Date(booking.start_time);
      const endTime = new Date(booking.end_time);
      const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
      const formattedStartTime = format(startTime, 'h:mm a');
      const formattedEndTime = format(endTime, 'h:mm a');

      console.log('📧 Sending booking confirmation email to customer:', booking.customer_email);

      await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.customer_email,
        subject: `Booking Confirmed - Sweet Dreams Music Studio - ${formattedDate}`,
        react: CustomerBookingConfirmation({
          firstName: booking.first_name,
          artistName: booking.artist_name,
          date: formattedDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          duration: booking.duration,
          depositAmount: booking.deposit_amount,
          totalAmount: booking.total_amount,
          sameDayFee: booking.same_day_fee,
          afterHoursFee: booking.after_hours_fee,
        }) as React.ReactElement,
      });

      console.log('✅ Customer confirmation email sent');
    } catch (emailError) {
      console.error('❌ Failed to send customer confirmation email:', emailError);

      // Log email failure but don't fail the approval
      await serviceSupabase.from('webhook_failures').insert({
        webhook_type: 'customer_confirmation_email',
        booking_id: bookingId,
        error_message: emailError instanceof Error ? emailError.message : 'Unknown error',
        error_details: { error: String(emailError) }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Booking approved and payment captured',
      amountCaptured
    });

  } catch (error: unknown) {
    console.error('Approve booking error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          type: error.type
        },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to approve booking',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
