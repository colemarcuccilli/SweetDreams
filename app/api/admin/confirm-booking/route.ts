import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { AdminBookingNotification } from '@/lib/emails/admin-booking-notification';
import { CustomerBookingConfirmation } from '@/lib/emails/customer-booking-confirmation';
import { format } from 'date-fns';
import * as React from 'react';

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

    if (booking.status !== 'pending_deposit') {
      return NextResponse.json(
        { error: 'Booking is not pending confirmation' },
        { status: 400 }
      );
    }

    // Update booking status to confirmed
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to confirm booking' },
        { status: 500 }
      );
    }

    // Send confirmation emails
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
    const formattedStartTime = format(startTime, 'h:mm a');
    const formattedEndTime = format(endTime, 'h:mm a');

    console.log('📧 Sending confirmation emails...');

    // Send admin notification
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `Booking Confirmed (Manual): ${booking.artist_name} - ${formattedDate}`,
        react: AdminBookingNotification({
          firstName: booking.first_name,
          lastName: booking.last_name,
          artistName: booking.artist_name,
          email: booking.customer_email,
          phone: booking.customer_phone,
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
      console.log('✅ Admin notification sent');
    } catch (emailError) {
      console.error('❌ Failed to send admin email:', emailError);
    }

    // Send customer confirmation
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.customer_email,
        subject: `Booking Confirmed - Sweet Dreams Music Studio - ${formattedDate}`,
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
      console.log('✅ Customer confirmation sent');
    } catch (emailError) {
      console.error('❌ Failed to send customer email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed and emails sent'
    });

  } catch (error: unknown) {
    console.error('Confirm booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to confirm booking',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
