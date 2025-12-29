import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { verifyAdminAccess } from '@/lib/admin-auth';

// Helper to detect spam/gibberish names
function isLikelySpam(name: string): boolean {
  if (!name || name.length < 2) return true;

  // Random string pattern: mostly consonants, no vowels, or random case mixing
  const vowelRatio = (name.match(/[aeiouAEIOU]/g) || []).length / name.length;
  const hasNormalVowelRatio = vowelRatio > 0.15 && vowelRatio < 0.6;

  // Check for random character patterns (long strings without spaces, unusual patterns)
  const hasRandomPattern = /^[a-zA-Z]{15,}$/.test(name) || // Long random string
                           /[A-Z]{3,}/.test(name) || // Multiple caps in a row
                           /\d{3,}/.test(name); // Numbers in name

  // Names should have reasonable length and pattern
  const isReasonableLength = name.length >= 2 && name.length <= 50;
  const hasSpaces = name.includes(' '); // Real names often have spaces

  return !isReasonableLength || (!hasNormalVowelRatio && name.length > 8) || hasRandomPattern;
}

/**
 * GET /api/admin/library/clients
 * Get list of VERIFIED registered users for library management
 * Filters out spam/bot accounts
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

    console.log('👥 Fetching verified registered users for library management');

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

    // Filter out spam accounts BEFORE processing
    const verifiedUsers = users.filter(user => {
      // Must have confirmed email
      if (!user.email_confirmed_at) {
        console.log(`⚠️ Skipping unconfirmed: ${user.email}`);
        return false;
      }

      // Check if they have a real name set
      const fullName = user.user_metadata?.full_name || '';
      const firstName = user.user_metadata?.first_name || '';

      // If they have a proper full_name, check if it's spam
      if (fullName && !isLikelySpam(fullName)) {
        return true;
      }

      // If they have first_name set, check if it's spam
      if (firstName && !isLikelySpam(firstName)) {
        return true;
      }

      // Check email prefix as last resort - but filter obvious spam
      const emailPrefix = user.email?.split('@')[0] || '';
      if (emailPrefix.length > 15 && isLikelySpam(emailPrefix)) {
        console.log(`⚠️ Skipping spam account: ${user.email}`);
        return false;
      }

      return true;
    });

    console.log(`✅ ${verifiedUsers.length} verified users after filtering`);

    // Get all users' data in parallel
    const clientsPromises = verifiedUsers.map(async (user) => {
      // Try to get name from bookings first (use service role to see all bookings)
      const { data: bookings } = await serviceRoleClient
        .from('bookings')
        .select('first_name, last_name')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false })
        .limit(1);

      const booking = bookings?.[0];

      // Get profile data from profiles table
      const { data: profile } = await serviceRoleClient
        .from('profiles')
        .select('profile_picture_url, display_name')
        .eq('user_id', user.id)
        .single();

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

      // DEBUG: Log what we have
      console.log(`🔍 DEBUG for ${user.email}:`, {
        user_metadata: user.user_metadata,
        profile: profile,
        booking: booking
      });

      // Get name from account settings (user_metadata.full_name), then profile, then booking, then email
      let firstName = 'User';
      let lastName = '';

      if (user.user_metadata?.full_name) {
        // Split full name from account settings
        const parts = user.user_metadata.full_name.trim().split(' ');
        firstName = parts[0] || 'User';
        lastName = parts.slice(1).join(' ') || '';
      } else if (profile?.display_name) {
        // Split display name from public profile
        const parts = profile.display_name.trim().split(' ');
        firstName = parts[0] || 'User';
        lastName = parts.slice(1).join(' ') || '';
      } else if (user.user_metadata?.first_name) {
        // Fallback to first_name/last_name if they exist
        firstName = user.user_metadata.first_name;
        lastName = user.user_metadata.last_name || '';
      } else if (booking?.first_name) {
        // Last resort: use booking data
        firstName = booking.first_name;
        lastName = booking.last_name || '';
      } else {
        // Ultimate fallback: use email
        firstName = user.email?.split('@')[0] || 'User';
      }

      console.log(`✅ User: ${user.email} (${firstName} ${lastName}) - ${filesCount} files, ${notesCount} notes - Photo: ${profile?.profile_picture_url ? 'YES' : 'NO'}`);

      return {
        id: user.id,
        email: user.email || '',
        firstName,
        lastName,
        // Use user_metadata.profile_photo_url first (from account upload), then public_profiles
        profilePhotoUrl: user.user_metadata?.profile_photo_url || profile?.profile_picture_url || null,
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
