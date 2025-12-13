import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/emails/resend';
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

    // ========================================================================
    // COMPREHENSIVE VALIDATION - Prevent math errors before capturing payment
    // ========================================================================
    const depositAmount = booking.deposit_amount || 0;
    const sameDayFeeAmount = booking.same_day_fee_amount || 0;
    const afterHoursFeeAmount = booking.after_hours_fee_amount || 0;
    const discountAmount = booking.discount_amount || 0;
    const totalAmount = booking.total_amount || 0;
    const remainderAmount = booking.remainder_amount || 0;

    // Calculate expected amounts
    const expectedDepositCapture = (depositAmount + sameDayFeeAmount) - discountAmount;
    const expectedTotal = totalAmount;
    const calculatedTotal = depositAmount + remainderAmount + sameDayFeeAmount;

    console.log('📊 VALIDATION CHECK:');
    console.log('  Base Deposit:', depositAmount, 'cents ($' + (depositAmount/100).toFixed(2) + ')');
    console.log('  Same-Day Fee:', sameDayFeeAmount, 'cents ($' + (sameDayFeeAmount/100).toFixed(2) + ')');
    console.log('  After-Hours Fee:', afterHoursFeeAmount, 'cents ($' + (afterHoursFeeAmount/100).toFixed(2) + ')');
    console.log('  Discount:', discountAmount, 'cents ($' + (discountAmount/100).toFixed(2) + ')');
    console.log('  Expected Deposit Capture:', expectedDepositCapture, 'cents ($' + (expectedDepositCapture/100).toFixed(2) + ')');
    console.log('  Remainder:', remainderAmount, 'cents ($' + (remainderAmount/100).toFixed(2) + ')');
    console.log('  Total Amount:', totalAmount, 'cents ($' + (totalAmount/100).toFixed(2) + ')');
    console.log('  Calculated Total:', calculatedTotal, 'cents ($' + (calculatedTotal/100).toFixed(2) + ')');

    // Validation: Total should match deposit + remainder + same-day fee
    if (Math.abs(totalAmount - calculatedTotal) > 1) { // Allow 1 cent rounding error
      console.error('❌ MATH ERROR: Total amount mismatch!');
      console.error('  Database total:', totalAmount);
      console.error('  Calculated total:', calculatedTotal);
      console.error('  Difference:', totalAmount - calculatedTotal, 'cents');

      await serviceSupabase.from('webhook_failures').insert({
        webhook_type: 'approval_validation_failed',
        booking_id: bookingId,
        error_message: 'Math validation failed - total amount mismatch',
        error_details: {
          deposit_amount: depositAmount,
          same_day_fee_amount: sameDayFeeAmount,
          after_hours_fee_amount: afterHoursFeeAmount,
          remainder_amount: remainderAmount,
          total_amount: totalAmount,
          calculated_total: calculatedTotal,
          difference: totalAmount - calculatedTotal
        }
      });

      return NextResponse.json(
        {
          error: 'Math validation failed',
          details: `Total ($${(totalAmount/100).toFixed(2)}) does not match calculated ($${(calculatedTotal/100).toFixed(2)}). Please check booking data.`
        },
        { status: 400 }
      );
    }

    // Validation: Expected deposit capture should be positive (unless 100% coupon)
    if (expectedDepositCapture < 0) {
      console.error('❌ MATH ERROR: Negative deposit capture amount!');
      return NextResponse.json(
        { error: 'Invalid deposit calculation - amount would be negative', details: `Deposit: $${(depositAmount/100).toFixed(2)}, Discount: $${(discountAmount/100).toFixed(2)}` },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed - proceeding with capture');

    let paymentIntent;
    let amountCaptured = 0;

    // Check if we have a payment intent to capture
    // For 100% coupon bookings, there may be no payment intent (Stripe doesn't create one for $0)
    if (booking.stripe_payment_intent_id) {
      // First, retrieve the payment intent to check its current status
      try {
        console.log('💳 Retrieving payment intent:', booking.stripe_payment_intent_id);

        const retrievedPI = await stripe.paymentIntents.retrieve(booking.stripe_payment_intent_id);
        console.log('📊 Payment Intent Status:', retrievedPI.status);
        console.log('📊 Amount:', retrievedPI.amount, 'cents');
        console.log('📊 Amount Received:', retrievedPI.amount_received, 'cents');

        // If already succeeded (already captured), use the received amount
        if (retrievedPI.status === 'succeeded') {
          amountCaptured = retrievedPI.amount_received;
          console.log('✅ Payment already captured:', amountCaptured, 'cents');
        }
        // If requires_capture, capture it now
        else if (retrievedPI.status === 'requires_capture') {
          console.log('💳 Payment requires capture. Capturing now...');
          paymentIntent = await stripe.paymentIntents.capture(booking.stripe_payment_intent_id);
          amountCaptured = paymentIntent.amount_received;

          if (amountCaptured === 0 && paymentIntent.amount > 0) {
            console.error('⚠️ Capture returned 0 but amount was > 0. Status:', paymentIntent.status);
            throw new Error(`Payment capture failed - amount 0 returned. Status: ${paymentIntent.status}`);
          }

          console.log('✅ Payment captured successfully:', amountCaptured, 'cents');
        }
        // If in any other state, throw error
        else {
          throw new Error(`Cannot capture payment - current status: ${retrievedPI.status}. Payment intent may have been canceled or failed.`);
        }

      } catch (stripeError) {
        console.error('❌ Stripe capture error:', stripeError);
        console.error('❌ Error details:', stripeError instanceof Error ? stripeError.message : String(stripeError));

        // Log error to webhook failures
        await serviceSupabase.from('webhook_failures').insert({
          webhook_type: 'payment_capture_failed',
          booking_id: bookingId,
          stripe_event_id: booking.stripe_payment_intent_id,
          error_message: stripeError instanceof Error ? stripeError.message : 'Unknown error',
          error_details: {
            error: String(stripeError),
            booking_id: bookingId,
            payment_intent_id: booking.stripe_payment_intent_id,
            deposit_amount: booking.deposit_amount
          }
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

      console.log('📧 ATTEMPTING TO SEND CUSTOMER CONFIRMATION EMAIL');
      console.log('📧 From:', FROM_EMAIL);
      console.log('📧 To:', booking.customer_email);
      console.log('📧 Booking ID:', bookingId);

      const emailResult = await resend.emails.send({
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

      console.log('✅ Customer confirmation email SENT SUCCESSFULLY');
      console.log('✅ Resend response:', JSON.stringify(emailResult, null, 2));

      // Log successful email send
      await serviceSupabase.rpc('log_booking_action', {
        p_booking_id: bookingId,
        p_action: 'customer_confirmation_sent',
        p_performed_by: 'approve_api',
        p_details: {
          email_to: booking.customer_email,
          email_id: emailResult.data?.id || null,
          timestamp: new Date().toISOString()
        }
      });

    } catch (emailError) {
      console.error('❌❌❌ CRITICAL: Failed to send customer confirmation email ❌❌❌');
      console.error('❌ Error:', emailError);
      console.error('❌ Error message:', emailError instanceof Error ? emailError.message : 'Unknown');
      console.error('❌ Error stack:', emailError instanceof Error ? emailError.stack : 'N/A');

      // Log email failure but don't fail the approval
      await serviceSupabase.from('webhook_failures').insert({
        webhook_type: 'customer_confirmation_email',
        booking_id: bookingId,
        error_message: emailError instanceof Error ? emailError.message : 'Unknown error',
        error_details: {
          error: String(emailError),
          stack: emailError instanceof Error ? emailError.stack : null,
          to_email: booking.customer_email,
          booking_id: bookingId
        }
      });

      console.log('⚠️ Approval succeeded but customer email failed - logged to webhook_failures');
    }

    // Send admin notification of successful capture
    try {
      const startTime = new Date(booking.start_time);
      const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
      const formattedTime = format(startTime, 'h:mm a');

      console.log('📧 SENDING ADMIN CAPTURE SUCCESS EMAIL');

      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `✅ Payment Captured - ${booking.artist_name} - $${(amountCaptured / 100).toFixed(2)}`,
        html: `
          <h2>Payment Successfully Captured</h2>
          <p><strong>A booking has been approved and payment captured.</strong></p>

          <h3>Customer Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${booking.first_name} ${booking.last_name}</li>
            <li><strong>Artist Name:</strong> ${booking.artist_name}</li>
            <li><strong>Email:</strong> ${booking.customer_email}</li>
            <li><strong>Phone:</strong> ${booking.customer_phone || 'N/A'}</li>
          </ul>

          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${formattedTime}</li>
            <li><strong>Duration:</strong> ${booking.duration} hours</li>
          </ul>

          <h3>Payment Details:</h3>
          <ul>
            <li><strong>Amount Captured:</strong> $${(amountCaptured / 100).toFixed(2)}</li>
            <li><strong>Total Booking Value:</strong> $${(booking.total_amount / 100).toFixed(2)}</li>
            <li><strong>Remainder Due:</strong> $${(booking.remainder_amount / 100).toFixed(2)}</li>
            ${booking.discount_amount && booking.discount_amount > 0 ? `<li><strong>Discount Applied:</strong> $${(booking.discount_amount / 100).toFixed(2)}</li>` : ''}
          </ul>

          <p><strong>Status:</strong> Booking confirmed - customer has been notified.</p>
        `
      });

      console.log('✅ Admin capture success email sent');

      // Log email send
      await serviceSupabase.rpc('log_booking_action', {
        p_booking_id: bookingId,
        p_action: 'admin_capture_email_sent',
        p_performed_by: 'approve_api',
        p_details: {
          email_to: ADMIN_EMAIL,
          amount_captured: amountCaptured,
          timestamp: new Date().toISOString()
        }
      });

    } catch (emailError) {
      console.error('❌ Failed to send admin capture email:', emailError);
      // Don't fail the request - booking is still approved
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
