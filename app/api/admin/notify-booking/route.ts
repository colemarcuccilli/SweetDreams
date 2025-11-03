import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { resend, FROM_EMAIL } from '@/lib/emails/resend';
import { CustomerBookingConfirmation } from '@/lib/emails/customer-booking-confirmation';
import { format } from 'date-fns';
import * as React from 'react';

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
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    // Fetch booking from database
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

    // Format date and time strings for email
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
    const formattedStartTime = format(startTime, 'h:mm a');
    const formattedEndTime = format(endTime, 'h:mm a');

    console.log('📧 Sending booking reminder email...');
    console.log('📧 TO:', booking.customer_email);

    // Send reminder email using the same template as confirmation
    try {
      const emailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.customer_email,
        subject: `Booking Reminder - Sweet Dreams Music Studio - ${formattedDate}`,
        react: CustomerBookingConfirmation({
          firstName: booking.first_name,
          artistName: booking.artist_name,
          date: formattedDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          duration: booking.duration,
          depositAmount: booking.deposit_amount,
          totalAmount: booking.total_amount,
          sameDayFee: booking.same_day_fee,
          afterHoursFee: booking.after_hours_fee,
        }) as React.ReactElement,
      });

      console.log('✅ Reminder email sent successfully:', emailResult);

      return NextResponse.json({
        success: true,
        message: 'Reminder email sent successfully'
      });
    } catch (emailError) {
      console.error('❌ Failed to send reminder email:', emailError);
      if (emailError instanceof Error) {
        console.error('❌ Error message:', emailError.message);
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send reminder email',
          details: emailError instanceof Error ? emailError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error('Notify booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send reminder',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
