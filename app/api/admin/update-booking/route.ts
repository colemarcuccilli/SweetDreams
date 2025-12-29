import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/emails/resend';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
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
    const { bookingId, date, startTime } = body;

    if (!bookingId || !date || startTime === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch booking to get duration and current times (for audit log)
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('duration, start_time, end_time, first_name, last_name, artist_name, customer_email')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Store old values for audit log
    const oldStartTime = new Date(booking.start_time);
    const oldEndTime = new Date(booking.end_time);

    // Parse date the same way as create-booking route
    const dateParts = date.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);

    const startDateTime = new Date(year, month, day, startTime, 0, 0, 0);
    const endDateTime = new Date(year, month, day, startTime + booking.duration, 0, 0, 0);

    // Update booking in database
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      );
    }

    // Log the booking time change to audit log
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.rpc('log_booking_action', {
      p_booking_id: bookingId,
      p_action: 'booking_time_edited',
      p_performed_by: user?.email || 'admin',
      p_details: {
        customer_name: `${booking.first_name} ${booking.last_name}`,
        old_start_time: oldStartTime.toISOString(),
        old_end_time: oldEndTime.toISOString(),
        new_start_time: startDateTime.toISOString(),
        new_end_time: endDateTime.toISOString(),
        old_start_time_local: format(oldStartTime, 'EEEE, MMMM d, yyyy h:mm a'),
        new_start_time_local: format(startDateTime, 'EEEE, MMMM d, yyyy h:mm a'),
        duration: booking.duration,
        timestamp: new Date().toISOString()
      }
    });

    console.log('✅ Booking time updated and logged:', {
      bookingId,
      oldStartTime: oldStartTime.toISOString(),
      newStartTime: startDateTime.toISOString(),
      changed_by: user?.email || 'admin'
    });

    // Send email notifications to customer and admin
    try {
      const oldDateFormatted = format(oldStartTime, 'EEEE, MMMM d, yyyy');
      const oldTimeFormatted = format(oldStartTime, 'h:mm a');
      const newDateFormatted = format(startDateTime, 'EEEE, MMMM d, yyyy');
      const newTimeFormatted = format(startDateTime, 'h:mm a');

      // Email to customer
      console.log('📧 Sending booking change email to customer:', booking.customer_email);

      await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.customer_email,
        subject: `Booking Time Changed - Sweet Dreams Music Studio`,
        html: `
          <h2>Your Booking Time Has Been Changed</h2>
          <p>Hi ${booking.first_name},</p>
          <p>Your booking at Sweet Dreams Music Studio has been rescheduled.</p>

          <h3>Previous Time:</h3>
          <ul>
            <li><strong>Date:</strong> ${oldDateFormatted}</li>
            <li><strong>Time:</strong> ${oldTimeFormatted}</li>
          </ul>

          <h3>New Time:</h3>
          <ul>
            <li><strong>Date:</strong> ${newDateFormatted}</li>
            <li><strong>Time:</strong> ${newTimeFormatted}</li>
            <li><strong>Duration:</strong> ${booking.duration} hours</li>
          </ul>

          <p>If you have any questions or concerns about this change, please contact us immediately.</p>
          <p>Thank you,<br>Sweet Dreams Music Studio</p>
        `
      });

      console.log('✅ Customer notification email sent');

      // Email to admin
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `Booking Time Changed - ${booking.artist_name}`,
        html: `
          <h2>Booking Rescheduled</h2>
          <p><strong>You changed a booking time.</strong></p>

          <h3>Customer:</h3>
          <ul>
            <li><strong>Name:</strong> ${booking.first_name} ${booking.last_name}</li>
            <li><strong>Artist Name:</strong> ${booking.artist_name}</li>
            <li><strong>Email:</strong> ${booking.customer_email}</li>
          </ul>

          <h3>Previous Time:</h3>
          <ul>
            <li><strong>Date:</strong> ${oldDateFormatted}</li>
            <li><strong>Time:</strong> ${oldTimeFormatted}</li>
          </ul>

          <h3>New Time:</h3>
          <ul>
            <li><strong>Date:</strong> ${newDateFormatted}</li>
            <li><strong>Time:</strong> ${newTimeFormatted}</li>
            <li><strong>Duration:</strong> ${booking.duration} hours</li>
          </ul>

          <p><strong>Changed by:</strong> ${user?.email || 'admin'}</p>
          <p><strong>Customer has been notified</strong> of this change.</p>
        `
      });

      console.log('✅ Admin notification email sent');

    } catch (emailError) {
      console.error('❌ Failed to send booking change emails:', emailError);
      // Don't fail the request - booking was still updated
    }

    return NextResponse.json({
      success: true,
      message: 'Booking time updated successfully'
    });

  } catch (error: unknown) {
    console.error('Update booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update booking',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
