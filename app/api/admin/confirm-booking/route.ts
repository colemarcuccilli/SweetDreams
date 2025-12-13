import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { AdminBookingNotification } from '@/lib/emails/admin-booking-notification';
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

    // Fetch booking from database
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      console.error('❌ Booking not found:', bookingId, fetchError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    console.log('📋 BOOKING FOUND:', {
      id: booking.id,
      email: booking.customer_email,
      status: booking.status,
      stripe_session_id: booking.stripe_session_id,
      stripe_payment_intent_id: booking.stripe_payment_intent_id,
      deposit_amount: booking.deposit_amount,
      current_actual_deposit_paid: booking.actual_deposit_paid
    });

    // Allow confirming/recapturing for:
    // 1. pending_approval (webhook fired, waiting for admin)
    // 2. pending_deposit (legacy status)
    // 3. confirmed but missing payment data (fallback for webhook failures)
    const needsPaymentData = booking.status === 'confirmed' &&
      (booking.actual_deposit_paid === null || booking.actual_deposit_paid === undefined);

    const isValidStatus = booking.status === 'pending_approval' ||
                           booking.status === 'pending_deposit' ||
                           needsPaymentData;

    if (!isValidStatus) {
      return NextResponse.json(
        { error: `Booking cannot be confirmed - current status: ${booking.status}. Use this for pending_approval or to refresh payment data.` },
        { status: 400 }
      );
    }

    // Try to get actual payment info from Stripe if available
    let actualDepositPaid = booking.deposit_amount; // Default to deposit amount
    let couponCode = null;
    let discountAmount = 0;

    // Try session first
    if (booking.stripe_session_id) {
      try {
        const session = await stripe.checkout.sessions.retrieve(booking.stripe_session_id, {
          expand: ['payment_intent', 'total_details']
        });

        if (session.amount_total !== null && session.amount_total !== undefined) {
          actualDepositPaid = session.amount_total;
        }

        if (session.total_details?.amount_discount && session.total_details.amount_discount > 0) {
          discountAmount = session.total_details.amount_discount;
        }

        if (session.discounts && session.discounts.length > 0) {
          const discount = session.discounts[0];
          if (discount && typeof discount === 'object' && 'coupon' in discount && discount.coupon) {
            // discount.coupon can be a string (coupon ID) or Coupon object
            if (typeof discount.coupon === 'string') {
              couponCode = discount.coupon;
            } else if (typeof discount.coupon === 'object') {
              couponCode = discount.coupon.name || discount.coupon.id;
            }
          }
        }

        console.log('✅ Retrieved payment info from Stripe session:', {
          sessionId: booking.stripe_session_id,
          actualPaid: actualDepositPaid,
          discount: discountAmount,
          coupon: couponCode
        });
      } catch (stripeError) {
        console.error('⚠️ Could not retrieve Stripe session:', stripeError);
      }
    }

    // Fallback: Try payment intent if session didn't work or isn't available
    if (booking.stripe_payment_intent_id) {
      try {
        let paymentIntent = await stripe.paymentIntents.retrieve(
          booking.stripe_payment_intent_id,
          { expand: ['charges'] }
        );

        // CHECK IF NEEDS CAPTURE (Auth-and-Capture flow)
        if (paymentIntent.status === 'requires_capture') {
          console.log('💳 Payment authorization found. Capturing now...');
          paymentIntent = await stripe.paymentIntents.capture(booking.stripe_payment_intent_id);
          console.log('✅ Captured successfully:', paymentIntent.amount_received);
        }

        // Get the actual amount charged
        if (paymentIntent.amount_received !== null && paymentIntent.amount_received !== undefined) {
          actualDepositPaid = paymentIntent.amount_received;
        }

        console.log('✅ Retrieved payment info from PaymentIntent:', {
          paymentIntentId: booking.stripe_payment_intent_id,
          actualPaid: actualDepositPaid,
          discount: discountAmount,
          coupon: couponCode,
          status: paymentIntent.status
        });
      } catch (piError) {
        console.error('⚠️ Could not retrieve/capture PaymentIntent:', piError);
        return NextResponse.json(
          { error: 'Failed to capture payment', details: piError instanceof Error ? piError.message : 'Unknown error' },
          { status: 500 }
        );
      }
    }

    // Update booking status to confirmed with payment details
    console.log('💾 UPDATING DATABASE WITH:', {
      status: 'confirmed',
      actual_deposit_paid: actualDepositPaid,
      coupon_code: couponCode,
      discount_amount: discountAmount,
    });

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        actual_deposit_paid: actualDepositPaid,
        coupon_code: couponCode,
        discount_amount: discountAmount,
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('❌ ERROR UPDATING BOOKING:', updateError);
      return NextResponse.json(
        { error: 'Failed to confirm booking' },
        { status: 500 }
      );
    }

    console.log('✅ DATABASE UPDATED SUCCESSFULLY');

    // Log confirmation action to audit log
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.rpc('log_booking_action', {
        p_booking_id: bookingId,
        p_action: 'confirmed_manually',
        p_performed_by: user?.email || 'admin',
        p_details: {
          payment_intent_id: booking.stripe_payment_intent_id || null,
          session_id: booking.stripe_session_id || null,
          amount_captured: actualDepositPaid,
          coupon_code: couponCode,
          discount_amount: discountAmount,
          method: 'manual_confirm_button',
          timestamp: new Date().toISOString()
        }
      });
      console.log('✅ Audit log entry created');
    } catch (logError) {
      console.error('⚠️ Failed to create audit log:', logError);
      // Don't fail the request if logging fails
    }

    // Send confirmation emails
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
    const formattedStartTime = format(startTime, 'h:mm a');
    const formattedEndTime = format(endTime, 'h:mm a');

    console.log('📧 Sending confirmation emails...');

    // Send admin notification
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `Booking Confirmed (Manual): ${booking.artist_name} - ${formattedDate}`,
        react: AdminBookingNotification({
          firstName: booking.first_name,
          lastName: booking.last_name,
          artistName: booking.artist_name,
          email: booking.customer_email,
          phone: booking.customer_phone,
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
      console.log('✅ Admin notification sent');
    } catch (emailError) {
      console.error('❌ Failed to send admin email:', emailError);
    }

    // Send customer confirmation
    try {
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
      console.log('✅ Customer confirmation sent');
    } catch (emailError) {
      console.error('❌ Failed to send customer email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed and emails sent'
    });

  } catch (error: unknown) {
    console.error('Confirm booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to confirm booking',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
