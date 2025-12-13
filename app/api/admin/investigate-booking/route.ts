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

    // Fetch booking
    const { data: booking, error: fetchError } = await serviceSupabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const investigation: any = {
      booking_id: booking.id,
      status: booking.status,
      stripe_session_id: booking.stripe_session_id,
      stripe_payment_intent_id: booking.stripe_payment_intent_id,
      stripe_customer_id: booking.stripe_customer_id,
      deposit_amount: booking.deposit_amount,
      total_amount: booking.total_amount,
      actual_deposit_paid: booking.actual_deposit_paid,
      discount_amount: booking.discount_amount,
      coupon_code: booking.coupon_code,
      stripe_session_data: null,
      payment_intent_data: null,
      webhook_failures: []
    };

    // Check webhook failures for this booking
    const { data: failures } = await serviceSupabase
      .from('webhook_failures')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });

    investigation.webhook_failures = failures || [];

    // If we have a session ID, fetch it from Stripe
    if (booking.stripe_session_id) {
      try {
        const session = await stripe.checkout.sessions.retrieve(booking.stripe_session_id, {
          expand: ['payment_intent', 'customer']
        });

        investigation.stripe_session_data = {
          id: session.id,
          status: session.status,
          payment_status: session.payment_status,
          payment_intent_id: session.payment_intent,
          customer_id: session.customer,
          amount_total: session.amount_total,
          amount_subtotal: session.amount_subtotal,
          currency: session.currency,
          created: session.created,
          expires_at: session.expires_at,
          mode: session.mode,
          discounts: session.discounts,
          total_details: session.total_details
        };

        // If session has a payment intent, fetch it
        if (session.payment_intent && typeof session.payment_intent === 'string') {
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
              expand: ['charges']
            });
            investigation.payment_intent_data = {
              id: paymentIntent.id,
              status: paymentIntent.status,
              amount: paymentIntent.amount,
              amount_received: paymentIntent.amount_received,
              amount_capturable: paymentIntent.amount_capturable,
              currency: paymentIntent.currency,
              capture_method: paymentIntent.capture_method,
              created: paymentIntent.created
            };
          } catch (piError) {
            investigation.payment_intent_error = piError instanceof Error ? piError.message : 'Unknown error';
          }
        }

      } catch (sessionError) {
        investigation.stripe_session_error = sessionError instanceof Error ? sessionError.message : 'Unknown error';
      }
    }

    return NextResponse.json({
      success: true,
      investigation
    });

  } catch (error: unknown) {
    console.error('Investigate booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
