import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { verifyAdminAccess } from '@/lib/admin-auth';

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

    const serviceSupabase = createServiceRoleClient();

    // Fetch ALL bookings including pending_payment
    const { data: bookings, error: bookingsError } = await serviceSupabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Last 100 bookings

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }

    // Fetch ALL audit logs
    const { data: auditLogs, error: auditError } = await serviceSupabase
      .from('booking_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500); // Last 500 log entries

    if (auditError) {
      console.error('Error fetching audit logs:', auditError);
    }

    // Fetch webhook failures
    const { data: webhookFailures, error: webhookError } = await serviceSupabase
      .from('webhook_failures')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (webhookError) {
      console.error('Error fetching webhook failures:', webhookError);
    }

    // Group audit logs by booking_id
    const auditLogsByBooking: Record<string, any[]> = {};
    if (auditLogs) {
      for (const log of auditLogs) {
        if (!auditLogsByBooking[log.booking_id]) {
          auditLogsByBooking[log.booking_id] = [];
        }
        auditLogsByBooking[log.booking_id].push(log);
      }
    }

    // Analyze each booking
    const analysisResults = bookings?.map((booking) => {
      const logs = auditLogsByBooking[booking.id] || [];

      // Calculate timezone-aware display times
      const startTime = new Date(booking.start_time);
      const endTime = new Date(booking.end_time);

      return {
        // Basic Info
        id: booking.id,
        created_at: booking.created_at,
        customer_email: booking.customer_email,
        artist_name: booking.artist_name,

        // Timing (both UTC and local)
        start_time_utc: booking.start_time,
        end_time_utc: booking.end_time,
        start_time_local: startTime.toLocaleString('en-US', { timeZone: 'America/New_York' }),
        end_time_local: endTime.toLocaleString('en-US', { timeZone: 'America/New_York' }),
        duration: booking.duration,

        // Status & Flow
        status: booking.status,
        approved_at: booking.approved_at,
        rejected_at: booking.rejected_at,
        deleted_at: booking.deleted_at,

        // Payment Info
        deposit_amount: booking.deposit_amount,
        total_amount: booking.total_amount,
        remainder_amount: booking.remainder_amount,
        actual_deposit_paid: booking.actual_deposit_paid,
        discount_amount: booking.discount_amount,
        coupon_code: booking.coupon_code,

        // Fees
        same_day_fee: booking.same_day_fee,
        same_day_fee_amount: booking.same_day_fee_amount,
        after_hours_fee: booking.after_hours_fee,
        after_hours_fee_amount: booking.after_hours_fee_amount,

        // Stripe IDs
        stripe_session_id: booking.stripe_session_id,
        stripe_payment_intent_id: booking.stripe_payment_intent_id,
        stripe_customer_id: booking.stripe_customer_id,

        // Audit Trail
        audit_log_count: logs.length,
        audit_actions: logs.map(l => `${l.action} by ${l.performed_by} at ${l.created_at}`),

        // Analysis Flags
        issues: {
          no_payment_intent: !booking.stripe_payment_intent_id && booking.status !== 'pending_payment',
          status_pending_payment: booking.status === 'pending_payment',
          confirmed_but_no_deposit_paid: booking.status === 'confirmed' && (!booking.actual_deposit_paid || booking.actual_deposit_paid === 0),
          no_audit_logs: logs.length === 0,
          approved_but_no_approved_at: booking.status === 'confirmed' && !booking.approved_at,
        }
      };
    }) || [];

    return NextResponse.json({
      success: true,
      summary: {
        total_bookings: bookings?.length || 0,
        total_audit_logs: auditLogs?.length || 0,
        total_webhook_failures: webhookFailures?.length || 0,
        bookings_by_status: bookings?.reduce((acc: Record<string, number>, b) => {
          acc[b.status] = (acc[b.status] || 0) + 1;
          return acc;
        }, {}),
      },
      bookings: analysisResults,
      audit_logs: auditLogs,
      webhook_failures: webhookFailures,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error: unknown) {
    console.error('Error in debug-bookings API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch debug data', details: errorMessage },
      { status: 500 }
    );
  }
}
