import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * GET /api/profile/[slug]
 * Fetch public profile by slug (no auth required)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const { slug } = await params;

    console.log('🔍 Fetching public profile for slug:', slug);

    // Fetch profile by slug
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('public_profile_slug', slug)
      .single();

    if (profileError || !profile) {
      console.log('❌ Profile not found for slug:', slug);
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Fetch audio showcase for this profile (only public tracks)
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
      .eq('user_id', profile.user_id)
      .eq('is_public', true)
      .order('display_order', { ascending: true });

    if (showcaseError) {
      console.error('Error fetching showcase:', showcaseError);
      // Don't fail the whole request, just return empty showcase
    }

    console.log('✅ Profile fetched successfully:', profile.display_name);

    return NextResponse.json({
      success: true,
      profile,
      showcase: showcaseItems || []
    });

  } catch (error: unknown) {
    console.error('Get public profile error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: errorMessage },
      { status: 500 }
    );
  }
}
