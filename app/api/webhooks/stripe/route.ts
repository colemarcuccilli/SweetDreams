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

  // Handle the checkout.session.completed event
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

      console.log('📧 Sending admin approval request email to:', ADMIN_EMAIL);

      const { PendingBookingAlert } = await import('@/lib/emails/pending-booking-alert');

      await resend.emails.send({
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

      console.log('✅ Admin approval request email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send admin approval email:', emailError);
      // Log but don't fail the webhook
      await supabase.from('webhook_failures').insert({
        webhook_type: 'admin_approval_email',
        booking_id: booking.id,
        stripe_session_id: session.id,
        error_message: emailError instanceof Error ? emailError.message : 'Unknown error',
        error_details: { error: String(emailError) }
      });
    }

    console.log('✅ Webhook processing complete');
    console.log('💳 Payment AUTHORIZED (not captured yet)');
    console.log('⏳ Waiting for admin approval to capture funds');
  }

  return NextResponse.json({ received: true });
}
