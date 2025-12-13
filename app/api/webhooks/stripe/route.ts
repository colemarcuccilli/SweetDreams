import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { format } from 'date-fns';
import * as React from 'react';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

// Disable body parsing for webhooks - Next.js 15 App Router
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('');
  console.log('🔔 ==========================================');
  console.log('🔔 STRIPE WEBHOOK CALLED!');
  console.log('🔔 Timestamp:', new Date().toISOString());
  console.log('🔔 ==========================================');
  console.log('');

  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    console.error('❌ ERROR: No Stripe signature header found');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Read the raw request body as text (preserves exact formatting for signature verification)
    const body = await request.text();

    console.log('Verifying webhook signature...');
    console.log('Webhook secret exists:', !!process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Body length:', body.length);
    console.log('Signature:', sig.substring(0, 20) + '...');

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('✅ Webhook signature verified! Event type:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    if (err instanceof Error) {
      console.error('Error message:', err.message);
    }
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    );
  }

  // ============================================================================
  // Handle payment_intent.payment_failed - Notify admin of payment failures
  // ============================================================================
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    console.log('❌ Payment failed:', paymentIntent.id);
    console.log('❌ Failure code:', paymentIntent.last_payment_error?.code);
    console.log('❌ Failure message:', paymentIntent.last_payment_error?.message);

    const supabase = createServiceRoleClient();

    // Find booking by payment intent ID
    const { data: booking } = await supabase
      .from('bookings')
      .select('*')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single();

    if (booking) {
      // Log the failure
      await supabase.rpc('log_booking_action', {
        p_booking_id: booking.id,
        p_action: 'payment_failed',
        p_performed_by: 'webhook',
        p_details: {
          payment_intent_id: paymentIntent.id,
          error_code: paymentIntent.last_payment_error?.code || 'unknown',
          error_message: paymentIntent.last_payment_error?.message || 'Unknown error',
          timestamp: new Date().toISOString()
        }
      });

      // Send admin alert email
      try {
        const startTime = new Date(booking.start_time);
        const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
        const formattedTime = format(startTime, 'h:mm a');

        await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `🚨 PAYMENT FAILED - ${booking.artist_name} - ${formattedDate}`,
          html: `
            <h2>Payment Failure Alert</h2>
            <p><strong>A payment has failed for an existing booking.</strong></p>

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
              <li><strong>Amount:</strong> $${(booking.deposit_amount / 100).toFixed(2)}</li>
            </ul>

            <h3>Failure Details:</h3>
            <ul>
              <li><strong>Error Code:</strong> ${paymentIntent.last_payment_error?.code || 'unknown'}</li>
              <li><strong>Error Message:</strong> ${paymentIntent.last_payment_error?.message || 'Unknown error'}</li>
            </ul>

            <p><strong>Action Required:</strong> Contact the customer to resolve the payment issue.</p>
          `
        });

        console.log('✅ Admin payment failure email sent');
      } catch (emailError) {
        console.error('❌ Failed to send payment failure email:', emailError);
      }
    }
  }

  // ============================================================================
  // Handle checkout.session.completed - Customer completed checkout (authorized)
  // ============================================================================
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log('💳 Checkout session completed:', session.id);
    console.log('💳 Payment status:', session.payment_status);

    // Get the booking from Supabase using the session ID
    const supabase = createServiceRoleClient();
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();

    if (fetchError || !booking) {
      console.error('❌ Error finding booking:', fetchError);
      console.error('Looking for session ID:', session.id);

      // Log to webhook failures
      await supabase.from('webhook_failures').insert({
        webhook_type: 'checkout_session_completed',
        stripe_event_id: event.id,
        stripe_session_id: session.id,
        error_message: 'Booking not found for session',
        error_details: { error: String(fetchError) }
      });

      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    console.log('📋 Found booking:', booking.id, 'Status:', booking.status);

    // Extract coupon and discount information
    let couponCode = null;
    let discountAmount = 0;

    if (session.total_details?.amount_discount && session.total_details.amount_discount > 0) {
      discountAmount = session.total_details.amount_discount;
      console.log('💰 Discount applied:', discountAmount, 'cents');
    }

    // Get coupon code if available
    if (session.discounts && session.discounts.length > 0) {
      const discount = session.discounts[0];
      if (discount && typeof discount === 'object' && 'coupon' in discount && discount.coupon) {
        if (typeof discount.coupon === 'string') {
          couponCode = discount.coupon;
        } else if (typeof discount.coupon === 'object') {
          couponCode = discount.coupon.name || discount.coupon.id;
        }
        console.log('🎟️ Coupon used:', couponCode);
      }
    }

    // Update booking with payment intent ID and coupon info
    // NOTE: We do NOT change status to 'confirmed' yet - stays in 'pending_approval'
    // Payment is AUTHORIZED but NOT CAPTURED until admin approves
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        stripe_payment_intent_id: session.payment_intent as string,
        coupon_code: couponCode,
        discount_amount: discountAmount,
        status: 'pending_approval', // ✅ Payment authorized, now ready for admin approval
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('❌ Error updating booking with payment intent:', updateError);

      // Log to webhook failures
      await supabase.from('webhook_failures').insert({
        webhook_type: 'checkout_session_completed',
        stripe_event_id: event.id,
        stripe_session_id: session.id,
        booking_id: booking.id,
        error_message: 'Failed to update booking with payment intent',
        error_details: { error: String(updateError) }
      });

      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }

    // Log to audit trail
    await supabase.rpc('log_booking_action', {
      p_booking_id: booking.id,
      p_action: 'payment_authorized',
      p_performed_by: 'webhook',
      p_details: {
        stripe_session_id: session.id,
        payment_intent_id: session.payment_intent as string,
        coupon_code: couponCode,
        discount_amount: discountAmount,
        payment_status: session.payment_status
      }
    });

    // Send admin approval request email NOW (after checkout completes)
    try {
      const startTime = new Date(booking.start_time);
      const endTime = new Date(booking.end_time);
      const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
      const formattedStartTime = format(startTime, 'h:mm a');
      const formattedEndTime = format(endTime, 'h:mm a');

      console.log('📧 ATTEMPTING TO SEND ADMIN EMAIL');
      console.log('📧 From:', FROM_EMAIL);
      console.log('📧 To:', ADMIN_EMAIL);
      console.log('📧 Resend API Key exists:', !!process.env.RESEND_API_KEY);
      console.log('📧 Booking details:', {
        id: booking.id,
        artist: booking.artist_name,
        email: booking.customer_email,
        date: formattedDate,
        time: `${formattedStartTime} - ${formattedEndTime}`
      });

      const { PendingBookingAlert } = await import('@/lib/emails/pending-booking-alert');

      const emailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `⚠️ NEW BOOKING NEEDS APPROVAL - ${booking.artist_name} on ${formattedDate}`,
        react: PendingBookingAlert({
          firstName: booking.first_name,
          lastName: booking.last_name,
          artistName: booking.artist_name,
          email: booking.customer_email,
          phone: booking.customer_phone || '',
          date: formattedDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          duration: booking.duration,
          depositAmount: booking.deposit_amount,
          totalAmount: booking.total_amount,
        }) as React.ReactElement,
      });

      console.log('✅ Admin approval email SENT SUCCESSFULLY');
      console.log('✅ Resend response:', JSON.stringify(emailResult, null, 2));

      // Log successful email send
      await supabase.rpc('log_booking_action', {
        p_booking_id: booking.id,
        p_action: 'admin_email_sent',
        p_performed_by: 'webhook',
        p_details: {
          email_to: ADMIN_EMAIL,
          email_id: emailResult.data?.id || null,
          timestamp: new Date().toISOString()
        }
      });

      // Send customer confirmation email
      console.log('📧 Sending customer confirmation email to:', booking.customer_email);

      const customerEmailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.customer_email,
        subject: 'Booking Request Received - Sweet Dreams Music Studio',
        html: `
          <h2>Thank You for Your Booking Request!</h2>
          <p>Hi ${booking.first_name},</p>

          <p>We've received your studio booking request and our team is reviewing the details.</p>

          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Artist Name:</strong> ${booking.artist_name}</li>
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</li>
            <li><strong>Duration:</strong> ${booking.duration} hours</li>
          </ul>

          <h3>Payment Information:</h3>
          <p>Your payment card has been <strong>authorized but not charged yet</strong>. Here's how our payment process works:</p>
          <ul>
            <li><strong>Step 1:</strong> We've authorized $${(booking.deposit_amount / 100).toFixed(2)} (50% deposit) on your card</li>
            <li><strong>Step 2:</strong> Our engineer will review and confirm your session within 24-48 hours</li>
            <li><strong>Step 3:</strong> Once approved, the deposit will be captured (charged)</li>
            <li><strong>Step 4:</strong> The remaining balance of $${(booking.remainder_amount / 100).toFixed(2)} is due after your session</li>
          </ul>

          <h3>What Happens Next?</h3>
          <p>You'll receive another email once your booking is confirmed by our engineer. If you need to make any changes or have questions, please contact us immediately.</p>

          <p>We're excited to work with you!</p>

          <p>Best regards,<br>
          Sweet Dreams Music Studio<br>
          <a href="mailto:jayvalleo@sweetdreamsmusic.com">jayvalleo@sweetdreamsmusic.com</a></p>
        `
      });

      console.log('✅ Customer confirmation email sent:', customerEmailResult.data?.id);

      // Log customer email send
      await supabase.rpc('log_booking_action', {
        p_booking_id: booking.id,
        p_action: 'customer_confirmation_sent',
        p_performed_by: 'webhook',
        p_details: {
          email_to: booking.customer_email,
          email_id: customerEmailResult.data?.id || null,
          timestamp: new Date().toISOString()
        }
      });

    } catch (emailError) {
      console.error('❌❌❌ CRITICAL: Failed to send admin approval email ❌❌❌');
      console.error('❌ Error:', emailError);
      console.error('❌ Error message:', emailError instanceof Error ? emailError.message : 'Unknown');
      console.error('❌ Error stack:', emailError instanceof Error ? emailError.stack : 'N/A');

      // Log to webhook failures with full details
      await supabase.from('webhook_failures').insert({
        webhook_type: 'admin_approval_email',
        booking_id: booking.id,
        stripe_session_id: session.id,
        error_message: emailError instanceof Error ? emailError.message : 'Unknown error',
        error_details: {
          error: String(emailError),
          stack: emailError instanceof Error ? emailError.stack : null,
          from_email: FROM_EMAIL,
          to_email: ADMIN_EMAIL,
          resend_key_exists: !!process.env.RESEND_API_KEY,
          booking_id: booking.id,
          artist_name: booking.artist_name
        }
      });

      // CRITICAL: Don't fail the webhook - booking is still valid even if email fails
      console.log('⚠️ Webhook will continue despite email failure');
    }

    console.log('✅ Webhook processing complete');
    console.log('💳 Payment AUTHORIZED (not captured yet)');
    console.log('⏳ Waiting for admin approval to capture funds');
  }

  return NextResponse.json({ received: true });
}
