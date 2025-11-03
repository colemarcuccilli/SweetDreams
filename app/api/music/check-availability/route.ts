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

    // Fetch all blocked slots for the requested date
    const { data: blockedSlots, error } = await supabase
      .from('blocked_availability')
      .select('*')
      .eq('blocked_date', date);

    if (error) {
      console.error('Error checking availability:', error);
      return NextResponse.json(
        { error: 'Failed to check availability' },
        { status: 500 }
      );
    }

    // Check if any blocked slot conflicts with requested time
    const isBlocked = blockedSlots.some((slot) => {
      // If entire day is blocked
      if (slot.block_entire_day) {
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
        return hasOverlap;
      }

      return false;
    });

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
