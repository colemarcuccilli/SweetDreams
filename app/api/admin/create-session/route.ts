import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { format } from 'date-fns';
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/emails/resend';

/**
 * POST /api/admin/create-session
 * Admin creates a session for a user (no payment required)
 */
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
    const { userId, email, firstName, lastName, date, startTime, duration, notes } = body;

    if (!userId || !email || !firstName || !date || startTime === undefined || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse date the same way as create-booking route
    // This treats the date as local time which is correct for booking display
    const dateParts = date.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
    const day = parseInt(dateParts[2]);

    const startDateTime = new Date(year, month, day, startTime, 0, 0, 0);
    const endDateTime = new Date(year, month, day, startTime + duration, 0, 0, 0);

    // Get admin user info
    const { data: { user: adminUser } } = await supabase.auth.getUser();

    // Build the full customer name
    const customerName = `${firstName} ${lastName || ''}`.trim();

    console.log('📋 Creating admin session:', {
      userId,
      email,
      customerName,
      date,
      startTime,
      duration
    });

    // Create the booking in the database - EXACT SAME as create-booking route
    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        first_name: firstName,
        last_name: lastName || '',
        artist_name: customerName,
        customer_name: customerName,
        customer_email: email,
        customer_phone: null,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        duration,
        deposit_amount: 0,
        total_amount: 0,
        remainder_amount: 0,
        same_day_fee: false,
        after_hours_fee: false,
        same_day_fee_amount: 0,
        after_hours_fee_amount: 0,
        status: 'confirmed',
        stripe_session_id: null,
        stripe_customer_id: null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating session:', insertError);
      console.error('❌ Insert error details:', JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { error: 'Failed to create session', details: insertError.message || JSON.stringify(insertError) },
        { status: 500 }
      );
    }

    console.log('✅ Admin created session:', {
      bookingId: booking.id,
      userId,
      email,
      date,
      startTime,
      createdBy: adminUser?.email
    });

    // Log the action
    try {
      await supabase.rpc('log_booking_action', {
        p_booking_id: booking.id,
        p_action: 'admin_session_created',
        p_performed_by: adminUser?.email || 'admin',
        p_details: {
          customer_name: `${firstName} ${lastName || ''}`,
          customer_email: email,
          date: date,
          start_time: startDateTime.toISOString(),
          duration: duration,
          notes: notes || null,
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log action:', logError);
      // Don't fail the request for logging errors
    }

    // Send notification emails
    try {
      const dateFormatted = format(startDateTime, 'EEEE, MMMM d, yyyy');
      const timeFormatted = format(startDateTime, 'h:mm a');

      // Email to customer
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `Session Scheduled - Sweet Dreams Music Studio`,
        html: `
          <h2>Your Session Has Been Scheduled</h2>
          <p>Hi ${firstName},</p>
          <p>A session has been scheduled for you at Sweet Dreams Music Studio.</p>

          <h3>Session Details:</h3>
          <ul>
            <li><strong>Date:</strong> ${dateFormatted}</li>
            <li><strong>Time:</strong> ${timeFormatted}</li>
            <li><strong>Duration:</strong> ${duration} hour${duration > 1 ? 's' : ''}</li>
          </ul>

          <p><strong>Location:</strong> 3943 Parnell Ave, Fort Wayne, IN 46805</p>

          <p>If you have any questions, please contact us.</p>
          <p>Thank you,<br>Sweet Dreams Music Studio</p>
        `
      });

      console.log('✅ Customer notification sent');

      // Email to admin
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `Session Created - ${firstName} ${lastName || ''}`,
        html: `
          <h2>Admin Session Created</h2>
          <p>You created a new session.</p>

          <h3>Customer:</h3>
          <ul>
            <li><strong>Name:</strong> ${firstName} ${lastName || ''}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>

          <h3>Session Details:</h3>
          <ul>
            <li><strong>Date:</strong> ${dateFormatted}</li>
            <li><strong>Time:</strong> ${timeFormatted}</li>
            <li><strong>Duration:</strong> ${duration} hour${duration > 1 ? 's' : ''}</li>
          </ul>

          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          <p><strong>Created by:</strong> ${adminUser?.email || 'admin'}</p>
          <p><strong>Customer has been notified.</strong></p>
        `
      });

      console.log('✅ Admin notification sent');
    } catch (emailError) {
      console.error('Failed to send notification emails:', emailError);
      // Don't fail the request for email errors
    }

    return NextResponse.json({
      success: true,
      message: 'Session created successfully',
      bookingId: booking.id
    });

  } catch (error: unknown) {
    console.error('Create session error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create session', details: errorMessage },
      { status: 500 }
    );
  }
}
