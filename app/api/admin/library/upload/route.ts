import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { uploadAudioFile, isValidAudioFile, isValidFileSize } from '@/lib/supabase/storage';

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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const displayName = formData.get('displayName') as string | null;
    const description = formData.get('description') as string | null;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!isValidAudioFile(file)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only audio files are allowed (.mp3, .wav, .flac, .aiff, .m4a, .aac)' },
        { status: 400 }
      );
    }

    // Validate file size
    if (!isValidFileSize(file)) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit of 5GB' },
        { status: 400 }
      );
    }

    // Note: userId validation is already done by admin selecting from client list
    // No need to verify user exists since it came from our authenticated user list

    console.log('📤 Uploading file:', file.name, 'for user:', userId);

    // Upload file to Supabase Storage
    const filePath = await uploadAudioFile(supabase, file, userId);

    console.log('✅ File uploaded to storage:', filePath);

    // Get admin name from user metadata or email
    const adminName = adminUser.user_metadata?.full_name ||
                     adminUser.email?.split('@')[0] ||
                     'Admin';

    // Create database record
    const { data: deliverable, error: dbError } = await supabase
      .from('deliverables')
      .insert({
        user_id: userId,
        file_name: file.name,
        display_name: displayName || file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: adminUser.id,
        uploaded_by_name: adminName,
        description: description
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);

      // Try to clean up uploaded file if database insert fails
      try {
        const { deleteAudioFile } = await import('@/lib/supabase/storage');
        await deleteAudioFile(supabase, filePath);
        console.log('🗑️ Cleaned up uploaded file after database error');
      } catch (cleanupError) {
        console.error('⚠️ Failed to clean up file:', cleanupError);
      }

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
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to upload file', details: errorMessage },
      { status: 500 }
    );
  }
}
