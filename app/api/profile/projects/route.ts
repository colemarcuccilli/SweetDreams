import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET - Fetch all projects for the logged-in user
export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: projects, error } = await supabase
    .from('profile_projects')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects });
}

// POST - Create a new project
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    project_name,
    project_type,
    description,
    cover_image_url,
    release_date,
    display_order,
    is_public,
    spotify_link,
    apple_music_link,
    youtube_link,
    soundcloud_link,
    bandcamp_link,
    tidal_link,
    amazon_music_link,
    deezer_link,
    custom_links
  } = body;

  if (!project_name) {
    return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
  }

  const { data: project, error } = await supabase
    .from('profile_projects')
    .insert({
      user_id: user.id,
      project_name,
      project_type,
      description,
      cover_image_url,
      release_date,
      display_order: display_order || 0,
      is_public: is_public !== undefined ? is_public : true,
      spotify_link,
      apple_music_link,
      youtube_link,
      soundcloud_link,
      bandcamp_link,
      tidal_link,
      amazon_music_link,
      deezer_link,
      custom_links: custom_links || {}
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project }, { status: 201 });
}

// PUT - Update an existing project
export async function PUT(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    project_id,
    project_name,
    project_type,
    description,
    cover_image_url,
    release_date,
    display_order,
    is_public,
    spotify_link,
    apple_music_link,
    youtube_link,
    soundcloud_link,
    bandcamp_link,
    tidal_link,
    amazon_music_link,
    deezer_link,
    custom_links
  } = body;

  if (!project_id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const { data: project, error } = await supabase
    .from('profile_projects')
    .update({
      project_name,
      project_type,
      description,
      cover_image_url,
      release_date,
      display_order,
      is_public,
      spotify_link,
      apple_music_link,
      youtube_link,
      soundcloud_link,
      bandcamp_link,
      tidal_link,
      amazon_music_link,
      deezer_link,
      custom_links,
      updated_at: new Date().toISOString()
    })
    .eq('id', project_id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project });
}

// DELETE - Remove a project
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const project_id = searchParams.get('project_id');

  if (!project_id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('profile_projects')
    .delete()
    .eq('id', project_id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
