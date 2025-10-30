import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max execution time

export async function GET(request: NextRequest) {
  console.log('🕐 Running 1-hour reminder cron job...');

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

    // Get the current time and 1 hour from now
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + (60 * 60 * 1000));
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));

    console.log('🕐 Looking for bookings between:', oneHourFromNow.toISOString(), 'and', twoHoursFromNow.toISOString());

    // Query bookings that start in approximately 1 hour (between 1-2 hours from now)
    const { data: upcomingBookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'confirmed')
      .gte('start_time', oneHourFromNow.toISOString())
      .lt('start_time', twoHoursFromNow.toISOString());

    if (error) {
      console.error('❌ Error fetching upcoming bookings:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!upcomingBookings || upcomingBookings.length === 0) {
      console.log('✅ No upcoming bookings in the next hour');
      return NextResponse.json({
        success: true,
        message: 'No reminders to send',
        count: 0
      });
    }

    console.log(`📧 Found ${upcomingBookings.length} booking(s) requiring reminders`);

    // Send reminders for each booking
    let successCount = 0;
    let errorCount = 0;

    for (const booking of upcomingBookings) {
      try {
        const startTime = new Date(booking.start_time);
        const endTime = new Date(booking.end_time);
        const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
        const formattedStartTime = format(startTime, 'h:mm a');
        const formattedEndTime = format(endTime, 'h:mm a');

        // Send reminder to customer
        await resend.emails.send({
          from: FROM_EMAIL,
          to: booking.customer_email,
          subject: `Reminder: Your Session Starts in 1 Hour - Sweet Dreams Music`,
          html: `
            <h2>Session Reminder</h2>
            <p>Hi ${booking.first_name},</p>
            <p>This is a friendly reminder that your studio session starts in approximately <strong>1 hour</strong>.</p>

            <h3>Session Details:</h3>
            <ul>
              <li><strong>Artist Name:</strong> ${booking.artist_name}</li>
              <li><strong>Date:</strong> ${formattedDate}</li>
              <li><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</li>
              <li><strong>Duration:</strong> ${booking.duration} hours</li>
            </ul>

            <h3>Studio Address:</h3>
            <p>
              3943 Parnell Ave<br>
              Fort Wayne, IN 46805
            </p>

            <p><strong>Please arrive 5-10 minutes early.</strong></p>

            <p>If you need to make any last-minute changes, please call us immediately.</p>

            <p>See you soon!</p>
            <p>Sweet Dreams Music Team</p>
          `,
        });

        // Send reminder to admin
        await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `Session Reminder: ${booking.artist_name} in 1 Hour`,
          html: `
            <h2>Upcoming Session Reminder</h2>
            <p>Session starting in approximately 1 hour:</p>

            <h3>Client Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${booking.first_name} ${booking.last_name}</li>
              <li><strong>Artist Name:</strong> ${booking.artist_name}</li>
              <li><strong>Email:</strong> ${booking.customer_email}</li>
              <li><strong>Phone:</strong> ${booking.customer_phone || 'N/A'}</li>
            </ul>

            <h3>Session Details:</h3>
            <ul>
              <li><strong>Date:</strong> ${formattedDate}</li>
              <li><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</li>
              <li><strong>Duration:</strong> ${booking.duration} hours</li>
              <li><strong>Total Amount:</strong> $${(booking.total_amount / 100).toFixed(2)}</li>
              <li><strong>Deposit Paid:</strong> $${(booking.deposit_amount / 100).toFixed(2)}</li>
            </ul>
          `,
        });

        console.log(`✅ Reminder sent for booking ${booking.id} (${booking.artist_name})`);
        successCount++;

      } catch (emailError) {
        console.error(`❌ Failed to send reminder for booking ${booking.id}:`, emailError);
        errorCount++;
      }
    }

    console.log(`✅ Cron job complete: ${successCount} sent, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      message: 'Reminders processed',
      sent: successCount,
      errors: errorCount,
      total: upcomingBookings.length
    });

  } catch (error) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to process reminders' },
      { status: 500 }
    );
  }
}
