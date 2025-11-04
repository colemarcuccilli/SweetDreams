import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';

// GET - Fetch notes for a specific user
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

    // Fetch notes for this user
    const { data: notes, error } = await supabase
      .from('library_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notes', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notes: notes || []
    });

  } catch (error: unknown) {
    console.error('Get notes error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch notes', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Create a new note
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
    const { userId, noteContent } = body;

    // Validate inputs
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!noteContent || noteContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      );
    }

    // Get admin name from user metadata or email
    const adminName = adminUser.user_metadata?.full_name ||
                     adminUser.email?.split('@')[0] ||
                     'Admin';

    console.log('📝 Creating note for user:', userId, 'by:', adminName);

    // Create note
    const { data: note, error } = await supabase
      .from('library_notes')
      .insert({
        user_id: userId,
        admin_id: adminUser.id,
        admin_name: adminName,
        note_content: noteContent.trim()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      return NextResponse.json(
        { error: 'Failed to create note', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Note created:', note.id);

    return NextResponse.json({
      success: true,
      note: {
        id: note.id,
        adminName: note.admin_name,
        noteContent: note.note_content,
        createdAt: note.created_at
      }
    });

  } catch (error: unknown) {
    console.error('Create note error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create note', details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Delete a note
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
    const { noteId } = body;

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    console.log('🗑️ Deleting note:', noteId);

    // Delete note
    const { error } = await supabase
      .from('library_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting note:', error);
      return NextResponse.json(
        { error: 'Failed to delete note', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Note deleted');

    return NextResponse.json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error: unknown) {
    console.error('Delete note error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to delete note', details: errorMessage },
      { status: 500 }
    );
  }
}
