import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * GET /api/music/check-availability
 * Check if a specific date/time is available for booking
 * Query params: date (YYYY-MM-DD), startTime (hour), duration (hours)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const startTimeStr = searchParams.get('startTime');
    const durationStr = searchParams.get('duration');

    if (!date || !startTimeStr || !durationStr) {
      return NextResponse.json(
        { error: 'date, startTime, and duration are required' },
        { status: 400 }
      );
    }

    const startTime = parseInt(startTimeStr);
    const duration = parseInt(durationStr);
    const endTime = startTime + duration;

    const supabase = await createClient();

    // Check 1: Fetch all blocked slots for the requested date
    const { data: blockedSlots, error } = await supabase
      .from('blocked_availability')
      .select('*')
      .eq('blocked_date', date);

    if (error) {
      console.error('❌ Error checking availability:', error);
      return NextResponse.json(
        { error: 'Failed to check availability' },
        { status: 500 }
      );
    }

    console.log(`🔍 Checking availability for ${date} at ${startTime}:00 (${duration}h duration)`);
    console.log(`📋 Found ${blockedSlots?.length || 0} blocked slots for this date`);

    // Check 2: Fetch existing bookings for this date (excluding cancelled and old pending ones)
    const requestedStartTime = new Date(date);
    requestedStartTime.setHours(startTime, 0, 0, 0);
    const requestedEndTime = new Date(requestedStartTime);
    requestedEndTime.setHours(startTime + duration, 0, 0, 0);

    const { data: existingBookings, error: bookingError } = await supabase
      .from('bookings')
      .select('start_time, end_time, status, created_at')
      .gte('start_time', `${date}T00:00:00`)
      .lte('start_time', `${date}T23:59:59`)
      .in('status', ['confirmed', 'completed']); // Only check confirmed/completed, ignore old pending

    if (bookingError) {
      console.error('❌ Error checking existing bookings:', bookingError);
    }

    // Check for booking time conflicts
    const hasBookingConflict = existingBookings?.some((booking) => {
      const bookingStart = new Date(booking.start_time);
      const bookingEnd = new Date(booking.end_time);

      // Check for time overlap
      const hasOverlap = requestedStartTime < bookingEnd && requestedEndTime > bookingStart;
      if (hasOverlap) {
        console.log(`🚫 BLOCKED: Existing booking conflict (${bookingStart.getHours()}:00-${bookingEnd.getHours()}:00)`);
      }
      return hasOverlap;
    });

    if (hasBookingConflict) {
      console.log('❌ Slot NOT available (booking conflict)');
      return NextResponse.json({
        available: false,
        reason: 'Time slot already booked',
      });
    }

    // Check if any blocked slot conflicts with requested time
    const isBlocked = blockedSlots.some((slot) => {
      // If entire day is blocked
      if (slot.block_entire_day) {
        console.log(`🚫 BLOCKED: Entire day is blocked`);
        return true;
      }

      // Check for time overlap
      // Requested: startTime to endTime
      // Blocked: slot.start_time to slot.end_time
      if (slot.start_time !== null && slot.end_time !== null) {
        const blockedStart = slot.start_time;
        const blockedEnd = slot.end_time;

        // Check if there's any overlap
        const hasOverlap = startTime < blockedEnd && endTime > blockedStart;
        if (hasOverlap) {
          console.log(`🚫 BLOCKED: Time overlap detected (blocked ${blockedStart}:00-${blockedEnd}:00)`);
        }
        return hasOverlap;
      }

      return false;
    });

    console.log(isBlocked ? '❌ Slot NOT available' : '✅ Slot available');

    return NextResponse.json({
      available: !isBlocked,
      blockedSlots: isBlocked ? blockedSlots : [],
    });
  } catch (error: unknown) {
    console.error('Error in check-availability API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to check availability', details: errorMessage },
      { status: 500 }
    );
  }
}
