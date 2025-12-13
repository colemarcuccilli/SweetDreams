import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { verifyAdminAccess } from '@/lib/admin-auth';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  });

  try {
    const supabase = await createClient();
    const isAdmin = await verifyAdminAccess(supabase);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleClient();

    // Fetch the booking
    const { data: booking, error: fetchError } = await serviceSupabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    console.log('🔄 REFRESH PAYMENT DATA for booking:', bookingId);
    console.log('📊 Current state:');
    console.log('  Payment Intent ID:', booking.stripe_payment_intent_id || 'MISSING');
    console.log('  Session ID:', booking.stripe_session_id || 'MISSING');
    console.log('  Customer ID:', booking.stripe_customer_id || 'MISSING');
    console.log('  Actual Deposit Paid:', booking.actual_deposit_paid || 0, 'cents');

    let paymentIntentId = booking.stripe_payment_intent_id;
    let amountCaptured = booking.actual_deposit_paid || 0;

    // If payment intent ID is missing, try to find it via session ID
    if (!paymentIntentId && booking.stripe_session_id) {
      console.log('🔍 Payment Intent ID missing - fetching from Stripe Session...');

      try {
        const session = await stripe.checkout.sessions.retrieve(booking.stripe_session_id);
        console.log('✅ Session retrieved');
        console.log('  Session status:', session.status);
        console.log('  Payment status:', session.payment_status);

        if (session.payment_intent) {
          paymentIntentId = session.payment_intent as string;
          console.log('✅ Found Payment Intent ID:', paymentIntentId);
        } else {
          console.log('⚠️ Session has no payment intent - may be a $0 booking');
        }
      } catch (sessionError) {
        console.error('❌ Error fetching session:', sessionError);
        return NextResponse.json({
          error: 'Failed to fetch Stripe session',
          details: sessionError instanceof Error ? sessionError.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    // If we have a payment intent, get its current status and amount
    if (paymentIntentId) {
      console.log('💳 Fetching Payment Intent details...');

      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        console.log('✅ Payment Intent retrieved');
        console.log('  Status:', paymentIntent.status);
        console.log('  Amount:', paymentIntent.amount, 'cents');
        console.log('  Amount Received:', paymentIntent.amount_received, 'cents');

        // Update amount based on status
        if (paymentIntent.status === 'succeeded') {
          amountCaptured = paymentIntent.amount_received;
          console.log('✅ Payment succeeded - captured:', amountCaptured, 'cents');
        } else if (paymentIntent.status === 'requires_capture') {
          console.log('⚠️ Payment requires capture - amount not yet captured');
          amountCaptured = 0;
        } else {
          console.log('⚠️ Payment in status:', paymentIntent.status);
        }

      } catch (piError) {
        console.error('❌ Error fetching payment intent:', piError);
        return NextResponse.json({
          error: 'Failed to fetch payment intent',
          details: piError instanceof Error ? piError.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    // Update booking with refreshed data
    const { error: updateError } = await serviceSupabase
      .from('bookings')
      .update({
        stripe_payment_intent_id: paymentIntentId,
        actual_deposit_paid: amountCaptured
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('❌ Error updating booking:', updateError);
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }

    // Log the refresh action
    await serviceSupabase.rpc('log_booking_action', {
      p_booking_id: bookingId,
      p_action: 'payment_data_refreshed',
      p_performed_by: (await supabase.auth.getUser()).data.user?.email || 'admin',
      p_details: {
        old_payment_intent_id: booking.stripe_payment_intent_id || null,
        new_payment_intent_id: paymentIntentId || null,
        old_amount_paid: booking.actual_deposit_paid || 0,
        new_amount_paid: amountCaptured,
        timestamp: new Date().toISOString()
      }
    });

    console.log('✅ Payment data refreshed successfully');
    console.log('  Payment Intent ID:', paymentIntentId || 'None ($0 booking)');
    console.log('  Amount Captured:', amountCaptured, 'cents');

    return NextResponse.json({
      success: true,
      message: 'Payment data refreshed from Stripe',
      data: {
        payment_intent_id: paymentIntentId,
        amount_captured: amountCaptured
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Refresh payment data error:', errorMessage);
    return NextResponse.json({ error: 'Failed to refresh payment data', details: errorMessage }, { status: 500 });
  }
}
