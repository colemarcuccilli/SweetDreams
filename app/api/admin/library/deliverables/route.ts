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
 * POST /api/admin/library/deliverables
 * Create database record for uploaded audio file
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

    // Get current admin user
    const { data: { user: adminUser } } = await supabase.auth.getUser();
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, fileName, displayName, filePath, fileSize, fileType, description } = body;

    // Validate inputs
    if (!userId || !fileName || !filePath) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get admin name from user metadata or email
    const adminName = adminUser.user_metadata?.full_name ||
                     adminUser.email?.split('@')[0] ||
                     'Admin';

    // Create database record
    const { data: deliverable, error: dbError } = await supabase
      .from('deliverables')
      .insert({
        user_id: userId,
        file_name: fileName,
        display_name: displayName || fileName,
        file_path: filePath,
        file_size: fileSize,
        file_type: fileType,
        uploaded_by: adminUser.id,
        uploaded_by_name: adminName,
        description: description
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save file record to database', details: dbError.message },
        { status: 500 }
      );
    }

    console.log('✅ Deliverable created:', deliverable.id);

    return NextResponse.json({
      success: true,
      deliverable: {
        id: deliverable.id,
        fileName: deliverable.file_name,
        displayName: deliverable.display_name,
        fileSize: deliverable.file_size,
        fileType: deliverable.file_type,
        uploadedBy: deliverable.uploaded_by_name,
        createdAt: deliverable.created_at
      }
    });

  } catch (error: unknown) {
    console.error('Create deliverable error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create deliverable record', details: errorMessage },
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
