import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSessionProducts } from '@/lib/booking-config';
import { createClient } from '@/utils/supabase/server';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, customerId, amount, duration } = body;

    // Validate required fields
    if (!bookingId || !customerId || !amount || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Add authentication check for admin
    // Verify the request is from an authenticated admin user
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Fetch booking from Supabase to verify status
    const supabase = await createClient();
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

    if (booking.status !== 'confirmed') {
      return NextResponse.json(
        { error: 'Booking is not in confirmed status' },
        { status: 400 }
      );
    }

    // Get the remainder product for this session duration
    const { remainder: remainderProduct } = getSessionProducts(duration);

    if (!remainderProduct || !remainderProduct.priceId || remainderProduct.priceId === 'price_XXX') {
      return NextResponse.json(
        { error: 'Remainder price ID not configured. Please update lib/booking-config.ts with your Stripe price IDs.' },
        { status: 500 }
      );
    }

    // Retrieve customer's payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
      limit: 1
    });

    if (paymentMethods.data.length === 0) {
      return NextResponse.json(
        { error: 'No saved payment method found for this customer' },
        { status: 400 }
      );
    }

    const paymentMethod = paymentMethods.data[0];

    // Create a Payment Intent for the remainder amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customerId,
      payment_method: paymentMethod.id,
      off_session: true,
      confirm: true,
      description: `Studio Session Remainder - ${duration}hr`,
      metadata: {
        booking_id: bookingId,
        type: 'remainder_payment',
        duration: duration.toString()
      }
    });

    // Check if payment was successful
    if (paymentIntent.status === 'succeeded') {
      // Update booking in Supabase
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'completed',
          stripe_remainder_payment_intent_id: paymentIntent.id,
        })
        .eq('id', bookingId);

      if (updateError) {
        console.error('Error updating booking:', updateError);
        // Return success anyway since payment went through
      }

      return NextResponse.json({
        success: true,
        paymentIntentId: paymentIntent.id,
        message: 'Remainder charged successfully'
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment was not successful',
          status: paymentIntent.status
        },
        { status: 400 }
      );
    }

  } catch (error: unknown) {
    console.error('Charge remainder error:', error);

    // Handle specific Stripe errors
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
        error: 'Failed to charge remainder',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
