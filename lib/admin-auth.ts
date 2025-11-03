/**
 * Admin Authentication Utilities
 * Checks if a user has admin access
 */

export const ADMIN_EMAILS = [
  'cole@sweetdreamsmusic.com',
  'jayvalleo@sweetdreamsmusic.com',
];

/**
 * Check if an email address has admin privileges
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Verify admin access from Supabase user
 */
export async function verifyAdminAccess(supabase: any): Promise<boolean> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return false;
    }

    return isAdmin(user.email);
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return false;
  }
}
