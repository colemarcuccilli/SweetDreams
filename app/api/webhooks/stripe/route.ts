import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { AdminBookingNotification } from '@/lib/emails/admin-booking-notification';
import { CustomerBookingConfirmation } from '@/lib/emails/customer-booking-confirmation';
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

    console.log('Payment successful for session:', session.id);

    // Get the booking from Supabase using the session ID
    const supabase = createServiceRoleClient();
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();

    if (fetchError || !booking) {
      console.error('Error finding booking:', fetchError);
      console.error('Looking for session ID:', session.id);
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Extract coupon and discount information
    let couponCode = null;
    let discountAmount = 0;
    let actualDepositPaid = session.amount_total || 0; // Amount actually paid after discount

    if (session.total_details?.amount_discount && session.total_details.amount_discount > 0) {
      discountAmount = session.total_details.amount_discount;
      console.log('💰 Discount applied:', discountAmount, 'cents');
    }

    // Get coupon code if available (discounts is an array in Stripe Session)
    if (session.discounts && session.discounts.length > 0) {
      const discount = session.discounts[0];
      if (discount && typeof discount === 'object' && 'coupon' in discount && discount.coupon) {
        // discount.coupon can be a string (coupon ID) or Coupon object
        if (typeof discount.coupon === 'string') {
          couponCode = discount.coupon;
        } else if (typeof discount.coupon === 'object') {
          couponCode = discount.coupon.name || discount.coupon.id;
        }
        console.log('🎟️ Coupon used:', couponCode);
      }
    }

    console.log('📊 Payment details:', {
      originalAmount: booking.deposit_amount,
      discountAmount,
      actualPaid: actualDepositPaid,
      couponCode
    });

    // Update booking status to 'confirmed' and save payment info
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        stripe_payment_intent_id: session.payment_intent as string,
        coupon_code: couponCode,
        discount_amount: discountAmount,
        actual_deposit_paid: actualDepositPaid
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Error updating booking status:', updateError);
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }

    // Format date and time strings for emails
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
    const formattedStartTime = format(startTime, 'h:mm a');
    const formattedEndTime = format(endTime, 'h:mm a');

    console.log('📧 Preparing to send booking confirmation emails...');
    console.log('📧 FROM:', FROM_EMAIL);
    console.log('📧 TO Admin:', ADMIN_EMAIL);
    console.log('📧 TO Customer:', booking.customer_email);
    console.log('📧 Resend API Key configured:', !!process.env.RESEND_API_KEY);

    // Send admin notification email
    try {
      console.log('📧 Sending admin notification email...');
      const adminResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Booking Confirmed: ${booking.artist_name} - ${formattedDate}`,
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
      console.log('✅ Admin notification email sent successfully:', adminResult);
    } catch (emailError) {
      console.error('❌ Failed to send admin notification email:', emailError);
      if (emailError instanceof Error) {
        console.error('❌ Error message:', emailError.message);
        console.error('❌ Error stack:', emailError.stack);
      }
      console.error('❌ Full error:', JSON.stringify(emailError, null, 2));
    }

    // Send customer confirmation email
    try {
      console.log('📧 Sending customer confirmation email...');
      const customerResult = await resend.emails.send({
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
      console.log('✅ Customer confirmation email sent successfully:', customerResult);
    } catch (emailError) {
      console.error('❌ Failed to send customer confirmation email:', emailError);
      if (emailError instanceof Error) {
        console.error('❌ Error message:', emailError.message);
        console.error('❌ Error stack:', emailError.stack);
      }
      console.error('❌ Full error:', JSON.stringify(emailError, null, 2));
    }

    console.log('✅ Webhook processing complete for session:', session.id);
  }

  return NextResponse.json({ received: true });
}
