import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * GET /api/profile/showcase
 * Fetch current user's audio showcase items
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

    console.log('🎵 Fetching showcase for user:', user.email);

    // Fetch showcase items with deliverable details (includes private tracks for editing)
    const { data: showcaseItems, error: showcaseError } = await supabase
      .from('profile_audio_showcase')
      .select(`
        id,
        custom_title,
        custom_description,
        display_order,
        is_public,
        is_released,
        release_date,
        spotify_link,
        apple_music_link,
        youtube_link,
        soundcloud_link,
        deliverable_id,
        deliverables (
          id,
          display_name,
          file_name,
          file_type,
          file_size,
          description
        )
      `)
      .eq('user_id', user.id)
      .order('display_order', { ascending: true });

    if (showcaseError) {
      console.error('Error fetching showcase:', showcaseError);
      return NextResponse.json(
        { error: 'Failed to fetch showcase', details: showcaseError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Found ${showcaseItems?.length || 0} showcase items`);

    return NextResponse.json({
      success: true,
      showcase: showcaseItems || []
    });

  } catch (error: unknown) {
    console.error('Get showcase error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch showcase', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile/showcase
 * Add a deliverable to user's public showcase
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { deliverable_id, custom_title, custom_description, display_order } = body;

    if (!deliverable_id) {
      return NextResponse.json(
        { error: 'deliverable_id is required' },
        { status: 400 }
      );
    }

    console.log('➕ Adding deliverable to showcase:', deliverable_id);

    // Verify the deliverable belongs to the user
    const { data: deliverable, error: delivError } = await supabase
      .from('deliverables')
      .select('id, user_id')
      .eq('id', deliverable_id)
      .single();

    if (delivError || !deliverable) {
      return NextResponse.json(
        { error: 'Deliverable not found' },
        { status: 404 }
      );
    }

    if (deliverable.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only add your own files to your showcase' },
        { status: 403 }
      );
    }

    // Add to showcase
    const { data: showcaseItem, error: insertError } = await supabase
      .from('profile_audio_showcase')
      .insert({
        user_id: user.id,
        deliverable_id,
        custom_title,
        custom_description,
        display_order: display_order ?? 0
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error adding to showcase:', insertError);

      // Check for duplicate
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'This file is already in your showcase' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to add to showcase', details: insertError.message },
        { status: 500 }
      );
    }

    console.log('✅ Added to showcase successfully');

    return NextResponse.json({
      success: true,
      showcaseItem
    });

  } catch (error: unknown) {
    console.error('Add to showcase error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to add to showcase', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile/showcase
 * Update a showcase item
 */
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const {
      showcase_id,
      custom_title,
      custom_description,
      display_order,
      is_public,
      is_released,
      release_date,
      spotify_link,
      apple_music_link,
      youtube_link,
      soundcloud_link
    } = body;

    if (!showcase_id) {
      return NextResponse.json(
        { error: 'showcase_id is required' },
        { status: 400 }
      );
    }

    console.log('✏️ Updating showcase item:', showcase_id);

    // Update showcase item
    const { data: showcaseItem, error: updateError } = await supabase
      .from('profile_audio_showcase')
      .update({
        custom_title,
        custom_description,
        display_order,
        is_public,
        is_released,
        release_date,
        spotify_link,
        apple_music_link,
        youtube_link,
        soundcloud_link,
        updated_at: new Date().toISOString()
      })
      .eq('id', showcase_id)
      .eq('user_id', user.id) // Ensure user owns this item
      .select()
      .single();

    if (updateError) {
      console.error('Error updating showcase:', updateError);
      return NextResponse.json(
        { error: 'Failed to update showcase item', details: updateError.message },
        { status: 500 }
      );
    }

    if (!showcaseItem) {
      return NextResponse.json(
        { error: 'Showcase item not found or you do not have permission' },
        { status: 404 }
      );
    }

    console.log('✅ Showcase item updated successfully');

    return NextResponse.json({
      success: true,
      showcaseItem
    });

  } catch (error: unknown) {
    console.error('Update showcase error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to update showcase', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile/showcase
 * Remove a deliverable from showcase
 */
export async function DELETE(request: NextRequest) {
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

    const body = await request.json();
    const { showcase_id } = body;

    if (!showcase_id) {
      return NextResponse.json(
        { error: 'showcase_id is required' },
        { status: 400 }
      );
    }

    console.log('🗑️ Removing from showcase:', showcase_id);

    const { error: deleteError } = await supabase
      .from('profile_audio_showcase')
      .delete()
      .eq('id', showcase_id)
      .eq('user_id', user.id); // Ensure user owns this item

    if (deleteError) {
      console.error('Error removing from showcase:', deleteError);
      return NextResponse.json(
        { error: 'Failed to remove from showcase', details: deleteError.message },
        { status: 500 }
      );
    }

    console.log('✅ Removed from showcase successfully');

    return NextResponse.json({
      success: true
    });

  } catch (error: unknown) {
    console.error('Delete from showcase error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to remove from showcase', details: errorMessage },
      { status: 500 }
    );
  }
}
