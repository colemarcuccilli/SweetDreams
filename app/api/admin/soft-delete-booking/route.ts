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

    // Soft delete: Set status to 'deleted' and set deleted_at timestamp
    const { error: updateError } = await serviceSupabase
      .from('bookings')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error soft-deleting booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to soft-delete booking' },
        { status: 500 }
      );
    }

    // Log soft delete action to audit log
    await serviceSupabase.rpc('log_booking_action', {
      p_booking_id: bookingId,
      p_action: 'soft_deleted',
      p_performed_by: (await supabase.auth.getUser()).data.user?.email || 'admin',
      p_details: {
        timestamp: new Date().toISOString(),
        note: 'Soft deleted - no cancellation email sent (used for duplicates, test bookings, etc.)'
      }
    });

    console.log('✅ Booking soft-deleted:', bookingId, '(no cancellation email sent)');

    return NextResponse.json({
      success: true,
      message: 'Booking soft-deleted (marked as deleted but kept in database for audit)'
    });

  } catch (error: unknown) {
    console.error('Soft delete booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to soft-delete booking',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
