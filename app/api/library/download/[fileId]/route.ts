import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getDownloadUrl } from '@/lib/supabase/storage';

/**
 * GET /api/library/download/[fileId]
 * Generate a signed download URL for a file
 * Only works if the user owns the file (RLS enforced)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    console.log('⬇️ Generating download URL for file:', fileId, 'user:', user.email);

    // Fetch file record (RLS ensures user can only access their own files)
    const { data: deliverable, error: fetchError } = await supabase
      .from('deliverables')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', user.id) // Extra safety check
      .single();

    if (fetchError || !deliverable) {
      console.error('File not found or unauthorized:', fetchError);
      return NextResponse.json(
        { error: 'File not found or you do not have access to this file' },
        { status: 404 }
      );
    }

    // Generate signed download URL (valid for 24 hours)
    const signedUrl = await getDownloadUrl(deliverable.file_path);

    console.log('✅ Download URL generated successfully');

    return NextResponse.json({
      success: true,
      signedUrl,
      fileName: deliverable.file_name,
      displayName: deliverable.display_name,
      fileSize: deliverable.file_size,
      fileType: deliverable.file_type
    });

  } catch (error: unknown) {
    console.error('Download URL generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to generate download URL', details: errorMessage },
      { status: 500 }
    );
  }
}
