import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';

/**
 * GET /api/admin/library/deliverables?userId=xxx
 * Fetch all deliverables for a specific user (admin only)
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

    // Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch deliverables for this user
    const { data: deliverables, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deliverables:', error);
      return NextResponse.json(
        { error: 'Failed to fetch deliverables', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deliverables: deliverables || []
    });

  } catch (error: unknown) {
    console.error('Get deliverables error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch deliverables', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/library/deliverables
 * Delete a deliverable and its file from storage
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

    const body = await request.json();
    const { deliverableId } = body;

    if (!deliverableId) {
      return NextResponse.json(
        { error: 'Deliverable ID is required' },
        { status: 400 }
      );
    }

    // Get the deliverable to find file path
    const { data: deliverable, error: fetchError } = await supabase
      .from('deliverables')
      .select('*')
      .eq('id', deliverableId)
      .single();

    if (fetchError || !deliverable) {
      return NextResponse.json(
        { error: 'Deliverable not found' },
        { status: 404 }
      );
    }

    console.log('🗑️ Deleting deliverable:', deliverableId);

    // Delete file from storage
    const { deleteAudioFile } = await import('@/lib/supabase/storage');
    try {
      await deleteAudioFile(supabase, deliverable.file_path);
      console.log('✅ File deleted from storage');
    } catch (storageError) {
      console.error('⚠️ Storage deletion failed:', storageError);
      // Continue with database deletion even if storage fails
    }

    // Delete database record
    const { error: deleteError } = await supabase
      .from('deliverables')
      .delete()
      .eq('id', deliverableId);

    if (deleteError) {
      console.error('Error deleting deliverable:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete deliverable', details: deleteError.message },
        { status: 500 }
      );
    }

    console.log('✅ Deliverable deleted from database');

    return NextResponse.json({
      success: true,
      message: 'Deliverable deleted successfully'
    });

  } catch (error: unknown) {
    console.error('Delete deliverable error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to delete deliverable', details: errorMessage },
      { status: 500 }
    );
  }
}
