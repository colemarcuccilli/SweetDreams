import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { verifyAdminAccess } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const isAdmin = await verifyAdminAccess(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serviceSupabase = createServiceRoleClient();

    // Get recent webhook failures
    const { data: failures, error } = await serviceSupabase
      .from('webhook_failures')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching webhook failures:', error);
      return NextResponse.json({ error: 'Failed to fetch webhook failures' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      failures: failures || []
    });

  } catch (error: unknown) {
    console.error('Debug webhook failures error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
