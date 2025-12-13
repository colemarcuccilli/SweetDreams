import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSessionProducts } from '@/lib/booking-config';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { resend, FROM_EMAIL } from '@/lib/emails/resend';
import { RemainderCharged } from '@/lib/emails/remainder-charged';
import { format } from 'date-fns';
import * as React from 'react';

export async function POST(request: NextRequest) {
  // Initialize Stripe inside the function to avoid build-time errors
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
    const { bookingId, customerId, amount, duration } = body;

    // Validate required fields
    if (!bookingId || !customerId || !amount || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch booking to verify status
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

    // Check if this booking has a remainder to charge
    if (booking.remainder_amount === 0) {
      return NextResponse.json(
        { error: 'This booking was paid in full - no remainder to charge (full payment product like 1-hour session or 3-hour holiday special)' },
        { status: 400 }
      );
    }

    // ========================================================================
    // VALIDATION - Verify amount being charged is correct
    // ========================================================================
    const expectedRemainder = booking.remainder_amount;
    const requestedAmount = amount;

    console.log('📊 REMAINDER CHARGE VALIDATION:');
    console.log('  Expected Remainder:', expectedRemainder, 'cents ($' + (expectedRemainder/100).toFixed(2) + ')');
    console.log('  Requested Amount:', requestedAmount, 'cents ($' + (requestedAmount/100).toFixed(2) + ')');

    // Allow admin to charge custom amount, but warn
    if (requestedAmount !== expectedRemainder) {
      console.warn('⚠️ WARNING: Charging different amount than expected remainder');
      console.warn('  Expected:', expectedRemainder, 'cents');
      console.warn('  Charging:', requestedAmount, 'cents');
      console.warn('  Difference:', requestedAmount - expectedRemainder, 'cents');

      // Log custom amount charge
      await supabase.from('webhook_failures').insert({
        webhook_type: 'custom_remainder_charge',
        booking_id: bookingId,
        error_message: 'Admin charged custom remainder amount',
        error_details: {
          expected_remainder: expectedRemainder,
          actual_charge: requestedAmount,
          difference: requestedAmount - expectedRemainder,
          admin_note: 'This is informational only - not an error'
        }
      });
    }

    // Validate amount is positive
    if (requestedAmount <= 0) {
      console.error('❌ MATH ERROR: Remainder amount must be positive!');
      return NextResponse.json(
        { error: 'Invalid remainder amount', details: 'Amount must be greater than zero' },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed - proceeding with charge');

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

      // Send email notification to customer
      try {
        const startTime = new Date(booking.start_time);
        const endTime = new Date(booking.end_time);
        const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
        const formattedStartTime = format(startTime, 'h:mm a');
        const formattedEndTime = format(endTime, 'h:mm a');

        console.log('📧 Sending remainder charge notification to:', booking.customer_email);

        await resend.emails.send({
          from: FROM_EMAIL,
          to: booking.customer_email,
          subject: 'Payment Processed - Sweet Dreams Music Studio',
          react: RemainderCharged({
            firstName: booking.first_name,
            artistName: booking.artist_name,
            date: formattedDate,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            duration: booking.duration,
            remainderAmount: amount,
          }) as React.ReactElement,
        });

        console.log('✅ Remainder charge notification sent');
      } catch (emailError) {
        console.error('❌ Failed to send remainder charge email:', emailError);
        // Don't fail the charge if email fails
      }

      return NextResponse.json({
        success: true,
        paymentIntentId: paymentIntent.id,
        message: 'Remainder charged successfully and notification sent'
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
