import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max execution time

/**
 * DELETE ABANDONED CHECKOUTS
 *
 * Runs every 10 minutes to delete bookings where:
 * - Status is 'pending_approval'
 * - No payment_intent_id (customer never completed Stripe checkout)
 * - Created more than 15 minutes ago
 *
 * This prevents abandoned checkouts from blocking time slots.
 */
export async function GET(request: NextRequest) {
  console.log('🗑️ Running abandoned checkout cleanup cron job...');

  // Optional security: Check if request is from Vercel Cron OR has correct secret
  const authHeader = request.headers.get('authorization');
  const userAgent = request.headers.get('user-agent') || '';
  const isVercelCron = userAgent.includes('vercel-cron') || userAgent.includes('vercel');
  const cronSecret = process.env.CRON_SECRET;

  // Allow if:
  // 1. Called by Vercel's automatic cron (no auth needed)
  // 2. Called with correct CRON_SECRET
  if (!isVercelCron && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.log('❌ Unauthorized cron call attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  console.log('🕐 Called by:', userAgent);

  try {
    const supabase = createServiceRoleClient();

    // Calculate 15 minutes ago
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    console.log('🕐 Looking for abandoned checkouts created before:', fifteenMinutesAgo.toISOString());

    // Find abandoned checkouts:
    // - Status is 'pending_approval'
    // - No stripe_payment_intent_id (never completed checkout)
    // - Created more than 15 minutes ago
    const { data: abandonedBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('id, customer_email, artist_name, created_at, start_time')
      .eq('status', 'pending_approval')
      .is('stripe_payment_intent_id', null)
      .lt('created_at', fifteenMinutesAgo.toISOString());

    if (fetchError) {
      console.error('❌ Error fetching abandoned bookings:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!abandonedBookings || abandonedBookings.length === 0) {
      console.log('✅ No abandoned checkouts to clean up');
      return NextResponse.json({
        success: true,
        message: 'No abandoned checkouts found',
        deleted: 0
      });
    }

    console.log(`🗑️ Found ${abandonedBookings.length} abandoned checkout(s) to delete`);

    // Delete each abandoned booking
    let deletedCount = 0;
    let errorCount = 0;

    for (const booking of abandonedBookings) {
      try {
        console.log(`🗑️ Deleting abandoned booking: ${booking.id} (${booking.customer_email})`);

        const { error: deleteError } = await supabase
          .from('bookings')
          .delete()
          .eq('id', booking.id);

        if (deleteError) {
          console.error(`❌ Failed to delete booking ${booking.id}:`, deleteError);
          errorCount++;
        } else {
          console.log(`✅ Deleted abandoned booking ${booking.id}`);
          deletedCount++;
        }
      } catch (err) {
        console.error(`❌ Error deleting booking ${booking.id}:`, err);
        errorCount++;
      }
    }

    console.log(`✅ Cleanup complete: ${deletedCount} deleted, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      message: 'Abandoned checkouts cleaned up',
      deleted: deletedCount,
      errors: errorCount,
      total: abandonedBookings.length
    });

  } catch (error) {
    console.error('❌ Cleanup cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to run cleanup' },
      { status: 500 }
    );
  }
}
