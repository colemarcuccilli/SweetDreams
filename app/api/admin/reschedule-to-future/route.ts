import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { resend, FROM_EMAIL } from '@/lib/emails/resend';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { bookingId, reason } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    const serviceSupabase = createServiceRoleClient();

    // Fetch booking
    const { data: booking, error: fetchError } = await serviceSupabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      console.error('Error finding booking:', fetchError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    console.log('📅 RESCHEDULING BOOKING TO FUTURE TBD');
    console.log('  Booking ID:', bookingId);
    console.log('  Customer:', booking.customer_email);
    console.log('  Original date:', booking.start_time);
    console.log('  Reason:', reason);

    // Set date to far future (1 year from now) as placeholder
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    futureDate.setHours(12, 0, 0, 0); // Noon placeholder

    const futureEndDate = new Date(futureDate);
    futureEndDate.setHours(futureEndDate.getHours() + booking.duration);

    // Update booking to future TBD date
    // Keep status as confirmed since payment was already made
    const { error: updateError } = await serviceSupabase
      .from('bookings')
      .update({
        start_time: futureDate.toISOString(),
        end_time: futureEndDate.toISOString(),
        admin_notes: (booking.admin_notes || '') + `\n\n[${new Date().toLocaleDateString()}] Rescheduled to TBD by admin. Reason: ${reason || 'Customer needs to book later'}. Original date was: ${new Date(booking.start_time).toLocaleDateString()}`
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to reschedule booking' },
        { status: 500 }
      );
    }

    // Log to audit trail
    await serviceSupabase.rpc('log_booking_action', {
      p_booking_id: bookingId,
      p_action: 'rescheduled_to_tbd',
      p_performed_by: (await supabase.auth.getUser()).data.user?.email || 'admin',
      p_details: {
        original_date: booking.start_time,
        future_placeholder_date: futureDate.toISOString(),
        reason: reason || 'Not specified',
        timestamp: new Date().toISOString()
      }
    });

    // Send email to customer
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.customer_email,
        subject: 'Your Sweet Dreams Session - Rescheduling Needed',
        html: `
          <h2>Session Rescheduling</h2>
          <p>Hi ${booking.first_name},</p>

          <p>We need to reschedule your upcoming session.</p>

          <h3>Original Session:</h3>
          <ul>
            <li><strong>Date:</strong> ${new Date(booking.start_time).toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${new Date(booking.start_time).toLocaleTimeString()}</li>
            <li><strong>Duration:</strong> ${booking.duration} hours</li>
          </ul>

          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}

          <p><strong>Your payment has already been processed and will be honored for your rescheduled session.</strong></p>

          <p>Please reply to this email or call us to book your new date and time.</p>

          <p>We apologize for any inconvenience and look forward to seeing you soon!</p>

          <p>Sweet Dreams Music Team</p>
        `,
      });

      console.log('✅ Reschedule notification email sent to customer');
    } catch (emailError) {
      console.error('❌ Failed to send reschedule email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Booking rescheduled to TBD - customer notified'
    });

  } catch (error: unknown) {
    console.error('Reschedule error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to reschedule booking', details: errorMessage },
      { status: 500 }
    );
  }
}
