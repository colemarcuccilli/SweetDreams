import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, userEmail } = await request.json();

    if (!bookingId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing booking ID or user email' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Get the booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('customer_email', userEmail)
      .single();

    if (fetchError || !booking) {
      console.error('Error finding booking:', fetchError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      );
    }

    // Check if booking is more than 24 hours away
    const bookingStartTime = new Date(booking.start_time);
    const now = new Date();
    const hoursUntilBooking = (bookingStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilBooking < 24) {
      return NextResponse.json(
        { error: 'Cannot cancel bookings less than 24 hours before the session' },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error cancelling booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to cancel booking' },
        { status: 500 }
      );
    }

    // Format date and time for emails
    const formattedDate = format(bookingStartTime, 'EEEE, MMMM d, yyyy');
    const formattedTime = format(bookingStartTime, 'h:mm a');

    // Send cancellation notification to admin
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `Booking Cancelled: ${booking.artist_name} - ${formattedDate}`,
        html: `
          <h2>Booking Cancellation</h2>
          <p><strong>Artist:</strong> ${booking.artist_name}</p>
          <p><strong>Customer:</strong> ${booking.first_name} ${booking.last_name}</p>
          <p><strong>Email:</strong> ${booking.customer_email}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Duration:</strong> ${booking.duration} hours</p>
          <p><strong>Cancelled on:</strong> ${format(now, 'MMMM d, yyyy h:mm a')}</p>
        `,
      });
      console.log('✅ Admin cancellation notification sent');
    } catch (emailError) {
      console.error('❌ Failed to send admin cancellation email:', emailError);
    }

    // Send cancellation confirmation to customer
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.customer_email,
        subject: `Booking Cancelled - Sweet Dreams Music Studio`,
        html: `
          <h2>Booking Cancellation Confirmed</h2>
          <p>Hi ${booking.first_name},</p>
          <p>Your booking has been successfully cancelled:</p>
          <ul>
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${formattedTime}</li>
            <li><strong>Duration:</strong> ${booking.duration} hours</li>
          </ul>
          <p>If you have any questions, please contact us at ${ADMIN_EMAIL}.</p>
          <p>Thank you,<br>Sweet Dreams Music Team</p>
        `,
      });
      console.log('✅ Customer cancellation confirmation sent');
    } catch (emailError) {
      console.error('❌ Failed to send customer cancellation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
