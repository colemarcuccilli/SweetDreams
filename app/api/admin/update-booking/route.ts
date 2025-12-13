import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';

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
      .select('duration, start_time, end_time, first_name, last_name')
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

    // Calculate new start_time and end_time
    const startDateTime = new Date(date);
    startDateTime.setHours(startTime, 0, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + booking.duration);

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
        old_start_time_local: oldStartTime.toLocaleString('en-US', { timeZone: 'America/New_York' }),
        new_start_time_local: startDateTime.toLocaleString('en-US', { timeZone: 'America/New_York' }),
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
