import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * GET /api/library/my-files
 * Fetch current user's deliverables and library notes
 */
export async function GET(request: NextRequest) {
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

    console.log('📚 Fetching library for user:', user.email);

    // Fetch deliverables (files)
    const { data: deliverables, error: delivError } = await supabase
      .from('deliverables')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (delivError) {
      console.error('Error fetching deliverables:', delivError);
      return NextResponse.json(
        { error: 'Failed to fetch files', details: delivError.message },
        { status: 500 }
      );
    }

    // Fetch library notes
    const { data: notes, error: notesError } = await supabase
      .from('library_notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (notesError) {
      console.error('Error fetching notes:', notesError);
      return NextResponse.json(
        { error: 'Failed to fetch notes', details: notesError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Found ${deliverables?.length || 0} files and ${notes?.length || 0} notes`);

    return NextResponse.json({
      success: true,
      deliverables: deliverables || [],
      notes: notes || []
    });

  } catch (error: unknown) {
    console.error('My files error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch library', details: errorMessage },
      { status: 500 }
    );
  }
}
