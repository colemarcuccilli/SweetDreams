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

    // Get user from auth
    const { data: { users }, error: userError } = await serviceSupabase.auth.admin.listUsers();
    const user = users?.find(u => u.email === email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get bookings
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

    return NextResponse.json({
      success: true,
      debug: {
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
          created_at: user.created_at
        },
        bookings: bookings || [],
        profile: profile || null,
        errors: {
          userError,
          bookingsError,
          profileError
        }
      }
    });

  } catch (error: unknown) {
    console.error('Debug user error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
