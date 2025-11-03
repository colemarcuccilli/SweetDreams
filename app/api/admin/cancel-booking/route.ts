import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { resend, FROM_EMAIL } from '@/lib/emails/resend';
import { BookingCancellation } from '@/lib/emails/booking-cancellation';
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
    const { bookingId, stripePaymentIntentId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    // Fetch booking from database
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if booking is in the future AND has a payment to refund
    const bookingDate = new Date(booking.start_time);
    const now = new Date();
    const isFuture = bookingDate > now;
    const hasPayment = stripePaymentIntentId && booking.deposit_amount > 0;

    let refunded = false;
    let refundMessage = '';

    if (isFuture && hasPayment) {
      try {
        // Verify the payment intent was actually charged
        const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentIntentId);

        if (paymentIntent.status === 'succeeded' && paymentIntent.amount_received > 0) {
          // Create a refund for the deposit payment
          const refund = await stripe.refunds.create({
            payment_intent: stripePaymentIntentId,
            reason: 'requested_by_customer',
            metadata: {
              booking_id: bookingId,
              cancelled_by: 'admin'
            }
          });

          console.log('✅ Refund created:', refund.id, 'Amount:', paymentIntent.amount_received);
          refunded = true;
          refundMessage = `Refunded $${(paymentIntent.amount_received / 100).toFixed(2)}`;
        } else {
          console.log('⚠️ No refund needed - payment was $0 or not completed');
          refundMessage = 'No refund needed (100% coupon used or payment not completed)';
        }
      } catch (stripeError) {
        console.error('❌ Stripe refund error:', stripeError);
        refundMessage = 'Refund failed - please check Stripe dashboard';
        // Continue with cancellation even if refund fails
      }
    } else if (!isFuture) {
      refundMessage = 'No refund (booking was in the past)';
    } else if (!hasPayment) {
      refundMessage = 'No refund needed (100% coupon or no payment made)';
    }

    // Update booking status to cancelled
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to cancel booking in database' },
        { status: 500 }
      );
    }

    // Send cancellation email to customer
    try {
      const startTime = new Date(booking.start_time);
      const endTime = new Date(booking.end_time);
      const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
      const formattedStartTime = format(startTime, 'h:mm a');
      const formattedEndTime = format(endTime, 'h:mm a');

      console.log('📧 Sending cancellation email to:', booking.customer_email);

      await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.customer_email,
        subject: 'Booking Cancelled - Sweet Dreams Music Studio',
        react: BookingCancellation({
          firstName: booking.first_name,
          artistName: booking.artist_name,
          date: formattedDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          duration: booking.duration,
          refunded,
          refundAmount: refunded ? booking.deposit_amount : undefined,
        }) as React.ReactElement,
      });

      console.log('✅ Cancellation email sent');
    } catch (emailError) {
      console.error('❌ Failed to send cancellation email:', emailError);
      // Don't fail the cancellation if email fails
    }

    return NextResponse.json({
      success: true,
      refunded,
      message: `Booking cancelled. ${refundMessage}`
    });

  } catch (error: unknown) {
    console.error('Cancel booking error:', error);

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
        error: 'Failed to cancel booking',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
