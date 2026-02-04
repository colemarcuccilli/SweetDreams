import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { verifyAdminAccess } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const isAdmin = await verifyAdminAccess(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleClient();

    // Get user from auth - need pagination since default only returns 50
    let user = null;
    let page = 1;
    const perPage = 1000;

    while (!user) {
      const { data: { users: pageUsers }, error: usersError } = await serviceSupabase.auth.admin.listUsers({
        page,
        perPage
      });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        break;
      }

      // Search for user in this page
      user = pageUsers?.find(u => u.email === email);

      // If no more users to fetch, stop
      if (!pageUsers || pageUsers.length < perPage) {
        break;
      }

      page++;
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all bookings for this user
    const { data: bookings, error: bookingsError } = await serviceSupabase
      .from('bookings')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    // Get profile
    const { data: profile, error: profileError } = await serviceSupabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Count deliverables
    const { count: filesCount } = await serviceSupabase
      .from('deliverables')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Count notes
    const { count: notesCount } = await serviceSupabase
      .from('library_notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Extract name from user_metadata, profile, or bookings
    let firstName = '';
    let lastName = '';
    let displayName = '';

    if (user.user_metadata?.full_name) {
      const parts = user.user_metadata.full_name.trim().split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
      displayName = user.user_metadata.full_name;
    } else if (profile?.display_name) {
      const parts = profile.display_name.trim().split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
      displayName = profile.display_name;
    } else if (user.user_metadata?.first_name) {
      firstName = user.user_metadata.first_name;
      lastName = user.user_metadata.last_name || '';
      displayName = `${firstName} ${lastName}`.trim();
    } else if (bookings && bookings.length > 0 && bookings[0].first_name) {
      firstName = bookings[0].first_name;
      lastName = bookings[0].last_name || '';
      displayName = `${firstName} ${lastName}`.trim();
    } else {
      displayName = user.email?.split('@')[0] || 'User';
      firstName = displayName;
    }

    return NextResponse.json({
      success: true,
      profile: {
        userId: user.id,
        email: user.email,
        firstName,
        lastName,
        displayName,
        profilePhotoUrl: user.user_metadata?.profile_photo_url || profile?.profile_picture_url || null,
        userMetadata: user.user_metadata,
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at,
        emailConfirmedAt: user.email_confirmed_at,
        bookingsCount: bookings?.length || 0,
        filesCount: filesCount || 0,
        notesCount: notesCount || 0,
        bookings: bookings || []
      }
    });

  } catch (error: unknown) {
    console.error('Get user profile error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
