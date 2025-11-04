import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';

/**
 * GET /api/admin/library/clients
 * Get list of all clients who have bookings (potential library users)
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

    console.log('👥 Fetching client list for library management');

    // Get unique clients from bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('customer_email, first_name, last_name')
      .in('status', ['confirmed', 'completed'])
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return NextResponse.json(
        { error: 'Failed to fetch clients', details: bookingsError.message },
        { status: 500 }
      );
    }

    // Get unique clients and their IDs from auth
    const uniqueEmails = [...new Set(bookings?.map(b => b.customer_email) || [])];

    const clientsPromises = uniqueEmails.map(async (email) => {
      // Get user ID from auth.users via Supabase Admin API
      const { data: { users }, error } = await supabase.auth.admin.listUsers();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      const user = users?.find(u => u.email === email);
      if (!user) return null;

      // Get booking info for display
      const booking = bookings?.find(b => b.customer_email === email);

      // Count deliverables for this user
      const { count: filesCount } = await supabase
        .from('deliverables')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Count notes for this user
      const { count: notesCount } = await supabase
        .from('library_notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      return {
        id: user.id,
        email: user.email,
        firstName: booking?.first_name || '',
        lastName: booking?.last_name || '',
        filesCount: filesCount || 0,
        notesCount: notesCount || 0
      };
    });

    const clients = (await Promise.all(clientsPromises)).filter(c => c !== null);

    console.log(`✅ Found ${clients.length} clients`);

    return NextResponse.json({
      success: true,
      clients
    });

  } catch (error: unknown) {
    console.error('Fetch clients error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch clients', details: errorMessage },
      { status: 500 }
    );
  }
}
