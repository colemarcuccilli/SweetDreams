import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { resend, FROM_EMAIL } from '@/lib/emails/resend';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
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
    const { bookingId, reason } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    // Use service role client for database operations
    const serviceSupabase = createServiceRoleClient();

    // Fetch booking from database
    const { data: booking, error: fetchError } = await serviceSupabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      console.error('Error finding booking:', fetchError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if booking is in pending_approval status
    if (booking.status !== 'pending_approval') {
      return NextResponse.json(
        { error: `Booking cannot be rejected - current status: ${booking.status}` },
        { status: 400 }
      );
    }

    // Cancel the payment intent (release the hold)
    if (booking.stripe_payment_intent_id) {
      try {
        console.log('💳 Cancelling payment intent:', booking.stripe_payment_intent_id);

        await stripe.paymentIntents.cancel(booking.stripe_payment_intent_id);

        console.log('✅ Payment intent cancelled successfully - hold released');
      } catch (stripeError) {
        console.error('❌ Stripe cancel error:', stripeError);

        // Log error but continue with rejection
        await serviceSupabase.from('webhook_failures').insert({
          webhook_type: 'payment_cancel_failed',
          booking_id: bookingId,
          stripe_event_id: booking.stripe_payment_intent_id,
          error_message: stripeError instanceof Error ? stripeError.message : 'Unknown error',
          error_details: { error: String(stripeError) }
        });
      }
    }

    // Update booking status to 'rejected'
    const { error: updateError } = await serviceSupabase
      .from('bookings')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejected_reason: reason || 'Booking was not approved by admin'
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to update booking in database' },
        { status: 500 }
      );
    }

    // Log rejection action to audit log
    await serviceSupabase.rpc('log_booking_action', {
      p_booking_id: bookingId,
      p_action: 'rejected',
      p_performed_by: (await supabase.auth.getUser()).data.user?.email || 'admin',
      p_details: {
        reason: reason || 'No reason provided',
        payment_intent_id: booking.stripe_payment_intent_id,
        timestamp: new Date().toISOString()
      }
    });

    // Send rejection email to customer
    try {
      const startTime = new Date(booking.start_time);
      const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
      const formattedTime = format(startTime, 'h:mm a');

      console.log('📧 Sending booking rejection email to customer:', booking.customer_email);

      await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.customer_email,
        subject: `Booking Request Not Approved - Sweet Dreams Music Studio`,
        html: `
          <h2>Booking Request Not Approved</h2>
          <p>Hi ${booking.first_name},</p>
          <p>We're sorry, but we're unable to approve your booking request for the following session:</p>
          <ul>
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${formattedTime}</li>
            <li><strong>Duration:</strong> ${booking.duration} hours</li>
          </ul>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>No charge was made to your card - the authorization hold has been released.</p>
          <p>If you have any questions or would like to book a different time, please contact us.</p>
          <p>Thank you,<br>Sweet Dreams Music Studio</p>
        `,
      });

      console.log('✅ Rejection email sent to customer');
    } catch (emailError) {
      console.error('❌ Failed to send rejection email:', emailError);

      // Log email failure but don't fail the rejection
      await serviceSupabase.from('webhook_failures').insert({
        webhook_type: 'rejection_email_failed',
        booking_id: bookingId,
        error_message: emailError instanceof Error ? emailError.message : 'Unknown error',
        error_details: { error: String(emailError) }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Booking rejected and payment authorization released'
    });

  } catch (error: unknown) {
    console.error('Reject booking error:', error);

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
        error: 'Failed to reject booking',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
