import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * GET /api/profile/me
 * Fetch current user's profile
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

    console.log('👤 Fetching profile for user:', user.email);

    // Fetch user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (profile doesn't exist yet)
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: profileError.message },
        { status: 500 }
      );
    }

    console.log('✅ Profile fetched successfully');

    return NextResponse.json({
      success: true,
      profile: profile || null
    });

  } catch (error: unknown) {
    console.error('Get profile error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile/me
 * Create or update current user's profile
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
    const {
      display_name,
      public_profile_slug,
      bio,
      cover_photo_url,
      profile_picture_url,
      square_photo_url,
      tall_photo_url,
      gallery_photo_1_url,
      gallery_photo_2_url,
      gallery_photo_3_url,
      social_links
    } = body;

    // Validate required fields
    if (!display_name || !public_profile_slug) {
      return NextResponse.json(
        { error: 'Display name and profile slug are required' },
        { status: 400 }
      );
    }

    // Validate slug format (lowercase, alphanumeric, hyphens only)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(public_profile_slug)) {
      return NextResponse.json(
        { error: 'Profile slug can only contain lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    console.log('💾 Saving profile for user:', user.email);

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let result;

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          display_name,
          public_profile_slug,
          bio,
          cover_photo_url,
          profile_picture_url,
          square_photo_url,
          tall_photo_url,
          gallery_photo_1_url,
          gallery_photo_2_url,
          gallery_photo_3_url,
          social_links,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      result = { data, error };
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          display_name,
          public_profile_slug,
          bio,
          cover_photo_url,
          profile_picture_url,
          square_photo_url,
          tall_photo_url,
          gallery_photo_1_url,
          gallery_photo_2_url,
          gallery_photo_3_url,
          social_links
        })
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      console.error('Error saving profile:', result.error);

      // Check for unique constraint violation on slug
      if (result.error.code === '23505' && result.error.message.includes('public_profile_slug')) {
        return NextResponse.json(
          { error: 'This profile URL is already taken. Please choose a different one.' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to save profile', details: result.error.message },
        { status: 500 }
      );
    }

    console.log('✅ Profile saved successfully');

    return NextResponse.json({
      success: true,
      profile: result.data
    });

  } catch (error: unknown) {
    console.error('Save profile error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to save profile', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile/me
 * Delete current user's profile
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

    console.log('🗑️ Deleting profile for user:', user.email);

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting profile:', error);
      return NextResponse.json(
        { error: 'Failed to delete profile', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Profile deleted successfully');

    return NextResponse.json({
      success: true
    });

  } catch (error: unknown) {
    console.error('Delete profile error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to delete profile', details: errorMessage },
      { status: 500 }
    );
  }
}
