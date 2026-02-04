import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSessionProducts } from '@/lib/booking-config';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/emails/resend';
import { format } from 'date-fns';

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

    // Get the payment method from the ORIGINAL deposit payment intent
    if (!booking.stripe_payment_intent_id) {
      return NextResponse.json(
        { error: 'No original payment intent found for this booking' },
        { status: 400 }
      );
    }

    console.log('💳 Retrieving payment method from original payment intent:', booking.stripe_payment_intent_id);

    const originalPaymentIntent = await stripe.paymentIntents.retrieve(booking.stripe_payment_intent_id);

    if (!originalPaymentIntent.payment_method) {
      return NextResponse.json(
        { error: 'No payment method found on original payment intent' },
        { status: 400 }
      );
    }

    const paymentMethodId = typeof originalPaymentIntent.payment_method === 'string'
      ? originalPaymentIntent.payment_method
      : originalPaymentIntent.payment_method.id;

    console.log('✅ Found payment method from original payment:', paymentMethodId);

    // Create a Payment Intent for the remainder amount using the same payment method
    console.log('💳 Creating payment intent for remainder charge...');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      description: `Studio Session Remainder - ${duration}hr`,
      metadata: {
        booking_id: bookingId,
        type: 'remainder_payment',
        duration: duration.toString()
      }
    });

    console.log('✅ Payment intent created:', paymentIntent.id, '- Status:', paymentIntent.status);

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
      const startTime = new Date(booking.start_time);
      const endTime = new Date(booking.end_time);
      const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
      const formattedStartTime = format(startTime, 'h:mm a');
      const formattedEndTime = format(endTime, 'h:mm a');

      try {
        console.log('📧 Sending remainder charge notification to customer:', booking.customer_email);

        await resend.emails.send({
          from: FROM_EMAIL,
          to: booking.customer_email,
          subject: 'Final Payment Processed - Thank You! - Sweet Dreams Music Studio',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="text-align: center;">Payment Processed</h1>

              <p>Hi ${booking.first_name},</p>

              <p>The remainder payment for your studio session has been successfully processed. Thank you!</p>

              <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Session Details</h3>
                <p><strong>Artist Name:</strong> ${booking.artist_name}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
                <p><strong>Duration:</strong> ${booking.duration} ${booking.duration === 1 ? 'hour' : 'hours'}</p>
              </div>

              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border: 2px solid #2196f3; margin: 20px 0;">
                <h3 style="margin-top: 0;">Payment Information</h3>
                <p><strong>Amount Charged:</strong> $${(amount / 100).toFixed(2)}</p>
                <p>This charge has been applied to your saved payment method.</p>
              </div>

              <p>Thank you for choosing Sweet Dreams Music Studio! We hope you had a great session and look forward to working with you again.</p>

              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #666; font-size: 14px;">Sweet Dreams Music Studio<br>Professional Recording Studio</p>
                <p style="color: #999; font-size: 12px;">📧 jayvalleo@sweetdreamsmusic.com</p>
              </div>
            </div>
          `,
        });

        console.log('✅ Customer remainder charge notification sent');
      } catch (emailError) {
        console.error('❌ Failed to send customer remainder charge email:', emailError);
        // Don't fail the charge if email fails
      }

      // Send admin notification about remainder payment
      try {
        console.log('📧 Sending remainder charge notification to admin:', ADMIN_EMAIL);

        await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `💰 Remainder Charged - ${booking.artist_name} - $${(amount / 100).toFixed(2)}`,
          html: `
            <h2>Final Payment Successfully Processed</h2>
            <p><strong>The remainder balance has been charged and the booking is now complete.</strong></p>

            <h3>Customer Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${booking.first_name} ${booking.last_name}</li>
              <li><strong>Artist Name:</strong> ${booking.artist_name}</li>
              <li><strong>Email:</strong> ${booking.customer_email}</li>
              <li><strong>Phone:</strong> ${booking.customer_phone || 'N/A'}</li>
            </ul>

            <h3>Session Details:</h3>
            <ul>
              <li><strong>Date:</strong> ${formattedDate}</li>
              <li><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</li>
              <li><strong>Duration:</strong> ${booking.duration} hours</li>
            </ul>

            <h3>Payment Summary:</h3>
            <ul>
              <li><strong>Deposit (Already Charged):</strong> $${(booking.deposit_amount / 100).toFixed(2)}</li>
              <li><strong>Remainder (Just Charged):</strong> $${(amount / 100).toFixed(2)}</li>
              <li><strong>Total Collected:</strong> $${((booking.deposit_amount + amount) / 100).toFixed(2)}</li>
            </ul>

            <p style="color: green;"><strong>✅ Booking Status: COMPLETED</strong></p>
            <p>Customer has been notified via email.</p>
          `
        });

        console.log('✅ Admin remainder charge notification sent');
      } catch (emailError) {
        console.error('❌ Failed to send admin remainder charge email:', emailError);
        // Don't fail the charge if email fails
      }

      return NextResponse.json({
        success: true,
        paymentIntentId: paymentIntent.id,
        message: 'Remainder charged successfully and notifications sent'
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
