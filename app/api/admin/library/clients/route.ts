import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { verifyAdminAccess } from '@/lib/admin-auth';

// Helper to detect obvious spam/gibberish names
// Catches random mixed-case strings that bots generate
function isLikelySpam(name: string): boolean {
  if (!name || name.length < 1) return false; // Empty names are OK

  // Only check single-word names (real names usually have spaces)
  const trimmedName = name.trim();

  // If it has a space, it's more likely a real name - be lenient
  if (trimmedName.includes(' ')) {
    return false;
  }

  // Check for random mixed-case gibberish pattern
  // Bot names look like: "lnHqQKpCemPoEBZdIZ", "HCscWelewwLwjcdkef"
  // Real names look like: "hooperreal4", "blamzshop", "aziel.jordan08"

  // Count case switches (e.g., "aB" or "Ba")
  let caseSwitches = 0;
  for (let i = 1; i < trimmedName.length; i++) {
    const prevChar = trimmedName[i - 1];
    const currChar = trimmedName[i];
    const prevIsUpper = /[A-Z]/.test(prevChar);
    const currIsUpper = /[A-Z]/.test(currChar);
    const prevIsLetter = /[a-zA-Z]/.test(prevChar);
    const currIsLetter = /[a-zA-Z]/.test(currChar);

    if (prevIsLetter && currIsLetter && prevIsUpper !== currIsUpper) {
      caseSwitches++;
    }
  }

  // If there are many case switches in a name with no spaces, it's likely spam
  // Real usernames: "hooperreal4" (0 switches), "JohnSmith" (1 switch)
  // Bot names: "lnHqQKpCemPoEBZdIZ" (8+ switches)
  if (caseSwitches >= 4 && trimmedName.length >= 10) {
    return true;
  }

  // Check for random character patterns
  const obviousSpamPatterns = [
    /^[a-z]{20,}$/i, // Very long single word (20+ chars) with no spaces
    /^[bcdfghjklmnpqrstvwxyz]{8,}$/i, // 8+ consonants only (no vowels)
    /^asdf/i, // keyboard mash
    /^qwerty/i, // keyboard mash
    /spam/i,
    /^bot\d+$/i, // bot123
    /^user\d{6,}$/i, // user followed by 6+ numbers
  ];

  for (const pattern of obviousSpamPatterns) {
    if (pattern.test(trimmedName)) {
      return true;
    }
  }

  return false;
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

    console.log('👥 Fetching ALL registered users for library management');

    // Use service role client to list users (requires admin privileges)
    const serviceRoleClient = createServiceRoleClient();

    // Fetch ALL users with pagination (Supabase default is 50 per page)
    let allUsers: any[] = [];
    let page = 1;
    const perPage = 1000; // Max allowed per request

    while (true) {
      const { data: { users: pageUsers }, error: usersError } = await serviceRoleClient.auth.admin.listUsers({
        page,
        perPage
      });

      if (usersError) {
        console.error('❌ Error fetching users:', usersError);
        return NextResponse.json(
          { error: 'Failed to fetch users', details: usersError.message },
          { status: 500 }
        );
      }

      if (!pageUsers || pageUsers.length === 0) {
        break;
      }

      allUsers = [...allUsers, ...pageUsers];
      console.log(`📄 Page ${page}: fetched ${pageUsers.length} users (total so far: ${allUsers.length})`);

      // If we got less than perPage, we've reached the end
      if (pageUsers.length < perPage) {
        break;
      }

      page++;
    }

    console.log(`👤 Found ${allUsers.length} total registered users`);

    if (allUsers.length === 0) {
      console.log('⚠️ No registered users found');
      return NextResponse.json({
        success: true,
        clients: []
      });
    }

    // Filter out ONLY obvious spam - be very permissive
    // Don't require email_confirmed_at since many users signed up through booking
    const validUsers = allUsers.filter(user => {
      // Get any name we can find
      const fullName = user.user_metadata?.full_name || '';
      const firstName = user.user_metadata?.first_name || '';
      const emailPrefix = user.email?.split('@')[0] || '';

      // Only filter if name is OBVIOUSLY spam
      if (fullName && isLikelySpam(fullName)) {
        console.log(`⚠️ Skipping obvious spam name: ${user.email} (${fullName})`);
        return false;
      }

      // Only filter if email prefix is OBVIOUSLY spam (and no real name set)
      if (!fullName && !firstName && isLikelySpam(emailPrefix)) {
        console.log(`⚠️ Skipping obvious spam email: ${user.email}`);
        return false;
      }

      // Include all other users
      return true;
    });

    console.log(`✅ ${validUsers.length} valid users after filtering`);

    // Get all users' data in parallel
    const clientsPromises = validUsers.map(async (user) => {
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
