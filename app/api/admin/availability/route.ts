import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';

/**
 * GET /api/admin/availability
 * Fetch all blocked availability slots
 */
export async function GET(request: NextRequest) {
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

    // Fetch all blocked slots ordered by date
    const { data: blockedSlots, error } = await supabase
      .from('blocked_availability')
      .select('*')
      .order('blocked_date', { ascending: true });

    if (error) {
      console.error('Error fetching blocked availability:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blocked availability' },
        { status: 500 }
      );
    }

    return NextResponse.json({ blockedSlots });
  } catch (error: unknown) {
    console.error('Error in availability API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch availability', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/availability
 * Block a specific date/time slot
 */
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
    const { blocked_date, start_time, end_time, reason, block_entire_day } = body;

    // Validate required fields
    if (!blocked_date) {
      return NextResponse.json(
        { error: 'blocked_date is required' },
        { status: 400 }
      );
    }

    // If not blocking entire day, validate time slots
    if (!block_entire_day && (!start_time || !end_time)) {
      return NextResponse.json(
        { error: 'start_time and end_time required when not blocking entire day' },
        { status: 400 }
      );
    }

    // Get current user for created_by
    const { data: { user } } = await supabase.auth.getUser();

    // Insert blocked slot
    const { data: newSlot, error } = await supabase
      .from('blocked_availability')
      .insert({
        blocked_date,
        start_time: block_entire_day ? null : start_time,
        end_time: block_entire_day ? null : end_time,
        reason: reason || null,
        block_entire_day: block_entire_day || false,
        created_by: user?.email || 'unknown'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating blocked slot:', error);
      return NextResponse.json(
        { error: 'Failed to create blocked slot' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      blockedSlot: newSlot
    });
  } catch (error: unknown) {
    console.error('Error in availability POST:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create blocked slot', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/availability
 * Remove a blocked slot
 */
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id parameter is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('blocked_availability')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blocked slot:', error);
      return NextResponse.json(
        { error: 'Failed to delete blocked slot' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error in availability DELETE:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to delete blocked slot', details: errorMessage },
      { status: 500 }
    );
  }
}
