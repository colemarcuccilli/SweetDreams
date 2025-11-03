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

    // Fetch booking to get duration
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('duration')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

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

    console.log('✅ Booking time updated:', {
      bookingId,
      newStartTime: startDateTime.toISOString(),
      newEndTime: endDateTime.toISOString()
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
