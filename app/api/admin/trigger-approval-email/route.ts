import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { format } from 'date-fns';
import * as React from 'react';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Get the booking by session ID
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (fetchError || !booking) {
      console.error('❌ Error finding booking:', fetchError);
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    console.log('📋 Found booking:', booking.id, 'for session:', sessionId);

    // Send admin approval request email
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
    const formattedStartTime = format(startTime, 'h:mm a');
    const formattedEndTime = format(endTime, 'h:mm a');

    console.log('📧 Sending admin approval request email to:', ADMIN_EMAIL);

    const { PendingBookingAlert } = await import('@/lib/emails/pending-booking-alert');

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `⚠️ NEW BOOKING NEEDS APPROVAL - ${booking.artist_name} on ${formattedDate}`,
      react: PendingBookingAlert({
        firstName: booking.first_name,
        lastName: booking.last_name,
        artistName: booking.artist_name,
        email: booking.customer_email,
        phone: booking.customer_phone || '',
        date: formattedDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        duration: booking.duration,
        depositAmount: booking.deposit_amount,
        totalAmount: booking.total_amount,
      }) as React.ReactElement,
    });

    console.log('✅ Admin approval request email sent successfully');

    // Log to audit trail
    await supabase.rpc('log_booking_action', {
      p_booking_id: booking.id,
      p_action: 'admin_notified',
      p_performed_by: 'system',
      p_details: {
        email_sent_to: ADMIN_EMAIL,
        triggered_from: 'booking_success_page',
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json({ success: true, message: 'Admin email sent' });

  } catch (error: unknown) {
    console.error('Error sending admin email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to send admin email', details: errorMessage },
      { status: 500 }
    );
  }
}
