import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSessionProducts, BOOKING_PRODUCTS } from '@/lib/booking-config';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

export async function POST(request: NextRequest) {
  // Initialize Stripe inside the function to avoid build-time errors
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  });

  try {
    const body = await request.json();
    const {
      date,
      startTime,
      duration,
      depositAmount,
      totalAmount,
      fees,
      firstName,
      lastName,
      artistName,
      customerEmail,
      customerPhone
    } = body;

    // Validate required fields
    if (!date || startTime === undefined || !duration || !firstName || !lastName || !artistName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Combine first and last name for full name
    const customerName = `${firstName} ${lastName}`;

    // Get the deposit product for this session duration
    const { deposit: depositProduct } = getSessionProducts(duration);

    if (!depositProduct || !depositProduct.priceId || depositProduct.priceId === 'price_XXX') {
      return NextResponse.json(
        { error: 'Price ID not configured. Please update lib/booking-config.ts with your Stripe price IDs.' },
        { status: 500 }
      );
    }

    // Build line items for checkout
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: depositProduct.priceId,
        quantity: 1,
      }
    ];

    // Add same-day fee if applicable (per hour)
    if (fees.sameDayFee) {
      const sameDayFeeProduct = BOOKING_PRODUCTS.same_day_fee;
      if (sameDayFeeProduct.priceId && sameDayFeeProduct.priceId !== 'price_XXX') {
        lineItems.push({
          price: sameDayFeeProduct.priceId,
          quantity: duration, // $10 per hour
        });
      }
    }

    // Add after-hours fee if applicable (per hour)
    if (fees.afterHoursFee) {
      const afterHoursFeeProduct = BOOKING_PRODUCTS.after_hours_fee;
      if (afterHoursFeeProduct.priceId && afterHoursFeeProduct.priceId !== 'price_XXX') {
        lineItems.push({
          price: afterHoursFeeProduct.priceId,
          quantity: duration, // $10 per hour
        });
      }
    }

    // Check for booking conflicts in Supabase
    const supabase = createServiceRoleClient();
    const bookingStartTime = new Date(date);
    bookingStartTime.setHours(startTime, 0, 0, 0);

    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('start_time', bookingStartTime.toISOString())
      .neq('status', 'cancelled');

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      );
    }

    // Create or retrieve Stripe customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        phone: customerPhone || undefined,
        metadata: {
          source: 'Sweet Dreams Music Booking'
        }
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: lineItems,
      mode: 'payment',
      allow_promotion_codes: true, // Enable promo codes at checkout
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/music/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/music#booking`,
      payment_intent_data: {
        setup_future_usage: 'off_session', // Save payment method for future charges
        metadata: {
          booking_date: date,
          booking_start_time: startTime.toString(),
          booking_duration: duration.toString(),
          deposit_amount: depositAmount.toString(),
          total_amount: totalAmount.toString(),
        }
      },
      metadata: {
        booking_date: date,
        booking_start_time: startTime.toString(),
        booking_duration: duration.toString(),
        customer_name: customerName,
        artist_name: artistName,
        customer_phone: customerPhone || '',
      }
    });

    // Save booking to Supabase with status 'pending_deposit'
    const bookingEndTime = new Date(date);
    bookingEndTime.setHours(startTime + duration, 0, 0, 0);

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        first_name: firstName,
        last_name: lastName,
        artist_name: artistName,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,
        start_time: bookingStartTime.toISOString(),
        end_time: bookingEndTime.toISOString(),
        duration,
        deposit_amount: depositAmount,
        total_amount: totalAmount,
        remainder_amount: duration === 1 ? 0 : totalAmount - depositAmount,
        same_day_fee: fees.sameDayFee,
        after_hours_fee: fees.afterHoursFee,
        status: 'pending_deposit',
        stripe_session_id: session.id, // Save session ID (available immediately)
        stripe_customer_id: customer.id,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking in database:', bookingError);
      // Continue anyway - the booking can be manually created if needed
    }

    // Note: Emails will be sent AFTER successful payment via Stripe webhook
    // See /api/webhooks/stripe/route.ts for confirmation email logic

    console.log('✅ BOOKING CREATED SUCCESSFULLY');
    console.log('📋 Booking ID:', booking?.id);
    console.log('📋 Session ID:', session.id);
    console.log('📋 Customer Email:', customerEmail);
    console.log('📋 Status:', 'pending_deposit');
    console.log('💳 Stripe Checkout URL:', session.url);
    console.log('⏳ Waiting for Stripe webhook to confirm payment and send emails...');

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });

  } catch (error: unknown) {
    console.error('Booking creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create booking', details: errorMessage },
      { status: 500 }
    );
  }
}
