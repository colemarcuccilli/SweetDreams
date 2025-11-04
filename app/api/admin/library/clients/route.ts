import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { verifyAdminAccess } from '@/lib/admin-auth';

/**
 * GET /api/admin/library/clients
 * Get list of ALL registered users for library management
 */
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

    console.log('👥 Fetching ALL registered users for library management');

    // Use service role client to list users (requires admin privileges)
    const serviceRoleClient = createServiceRoleClient();
    const { data: { users }, error: usersError } = await serviceRoleClient.auth.admin.listUsers();

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch users', details: usersError.message },
        { status: 500 }
      );
    }

    console.log(`👤 Found ${users?.length || 0} total registered users`);

    if (!users || users.length === 0) {
      console.log('⚠️ No registered users found');
      return NextResponse.json({
        success: true,
        clients: []
      });
    }

    // Get all users' data in parallel
    const clientsPromises = users.map(async (user) => {
      // Try to get name from bookings first (use service role to see all bookings)
      const { data: bookings } = await serviceRoleClient
        .from('bookings')
        .select('first_name, last_name')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false })
        .limit(1);

      const booking = bookings?.[0];

      // Count deliverables for this user (use service role to see all data)
      const { count: filesCount } = await serviceRoleClient
        .from('deliverables')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Count notes for this user (use service role to see all data)
      const { count: notesCount } = await serviceRoleClient
        .from('library_notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Try to get name from user metadata, then booking, then email
      const firstName = user.user_metadata?.first_name ||
                       booking?.first_name ||
                       user.email?.split('@')[0] ||
                       'User';

      const lastName = user.user_metadata?.last_name ||
                      booking?.last_name ||
                      '';

      console.log(`✅ User: ${user.email} (${firstName} ${lastName}) - ${filesCount} files, ${notesCount} notes`);

      return {
        id: user.id,
        email: user.email || '',
        firstName,
        lastName,
        filesCount: filesCount || 0,
        notesCount: notesCount || 0
      };
    });

    const clients = await Promise.all(clientsPromises);

    console.log(`✅ Returning ${clients.length} total clients`);

    return NextResponse.json({
      success: true,
      clients
    });

  } catch (error: unknown) {
    console.error('❌ Fetch clients error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch clients', details: errorMessage },
      { status: 500 }
    );
  }
}
