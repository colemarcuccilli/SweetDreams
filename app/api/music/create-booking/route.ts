import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSessionProducts, BOOKING_PRODUCTS } from '@/lib/booking-config';
import { createClient } from '@/utils/supabase/server';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { AdminBookingNotification } from '@/lib/emails/admin-booking-notification';
import { CustomerBookingConfirmation } from '@/lib/emails/customer-booking-confirmation';
import { format } from 'date-fns';
import * as React from 'react';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
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

    // Add same-day fee if applicable
    if (fees.sameDayFee) {
      const sameDayFeeProduct = BOOKING_PRODUCTS.same_day_fee;
      if (sameDayFeeProduct.priceId && sameDayFeeProduct.priceId !== 'price_XXX') {
        lineItems.push({
          price: sameDayFeeProduct.priceId,
          quantity: 1,
        });
      }
    }

    // Add after-hours fee if applicable
    if (fees.afterHoursFee) {
      const afterHoursFeeProduct = BOOKING_PRODUCTS.after_hours_fee;
      if (afterHoursFeeProduct.priceId && afterHoursFeeProduct.priceId !== 'price_XXX') {
        lineItems.push({
          price: afterHoursFeeProduct.priceId,
          quantity: 1,
        });
      }
    }

    // Check for booking conflicts in Supabase
    const supabase = await createClient();
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
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_customer_id: customer.id,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking in database:', bookingError);
      // Continue anyway - the booking can be manually created if needed
    }

    // Format date and time strings for emails
    const formattedDate = format(new Date(date), 'EEEE, MMMM d, yyyy');
    const formattedStartTime = format(new Date(date).setHours(startTime, 0), 'h:mm a');
    const formattedEndTime = format(bookingEndTime, 'h:mm a');

    // Send admin notification email
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Booking: ${artistName} - ${formattedDate}`,
        react: AdminBookingNotification({
          firstName,
          lastName,
          artistName,
          email: customerEmail,
          phone: customerPhone,
          date: formattedDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          duration,
          depositAmount,
          totalAmount,
          sameDayFee: fees.sameDayFee,
          afterHoursFee: fees.afterHoursFee,
        }) as React.ReactElement,
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't fail the booking if email fails
    }

    // Send customer confirmation email
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: customerEmail,
        subject: `Your Sweet Dreams Music Studio Booking - ${formattedDate}`,
        react: CustomerBookingConfirmation({
          firstName,
          artistName,
          date: formattedDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          duration,
          depositAmount,
          totalAmount,
          sameDayFee: fees.sameDayFee,
          afterHoursFee: fees.afterHoursFee,
        }) as React.ReactElement,
      });
    } catch (emailError) {
      console.error('Failed to send customer confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

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
