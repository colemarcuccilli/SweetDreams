import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
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
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    // Use service role client for database operations
    const serviceSupabase = createServiceRoleClient();

    // Fetch booking from database
    const { data: booking, error: fetchError } = await serviceSupabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      console.error('Error finding booking:', fetchError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if booking is in confirmed status
    if (booking.status !== 'confirmed') {
      return NextResponse.json(
        { error: `Booking cannot be marked complete - current status: ${booking.status}. Only confirmed bookings can be completed.` },
        { status: 400 }
      );
    }

    // Update booking status to 'completed'
    const { error: updateError } = await serviceSupabase
      .from('bookings')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to update booking in database' },
        { status: 500 }
      );
    }

    // Log completion action to audit log
    await serviceSupabase.rpc('log_booking_action', {
      p_booking_id: bookingId,
      p_action: 'marked_completed',
      p_performed_by: (await supabase.auth.getUser()).data.user?.email || 'admin',
      p_details: {
        previous_status: booking.status,
        completed_at: new Date().toISOString(),
        note: 'Manually marked as completed by admin'
      }
    });

    console.log(`✅ Booking ${bookingId} marked as completed`);

    return NextResponse.json({
      success: true,
      message: 'Booking marked as completed'
    });

  } catch (error: unknown) {
    console.error('Complete booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to complete booking',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
