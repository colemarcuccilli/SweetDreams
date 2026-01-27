import { NextRequest, NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/emails/resend';

// Both team members receive booking requests
const BOOKING_EMAILS = ['jayvalleo@sweetdreamsmusic.com', 'cole@sweetdreamsmusic.com'];

// Google Sheets Web App URL
const GOOGLE_SHEETS_URL = 'https://script.google.com/a/macros/sweetdreamsmusic.com/s/AKfycbyMxEPnirW3FVVTafQ8l3P_1udp-qYD1Zs5c8-KPat63AIJI0yv-N9iAXbtzlgMOV-reQ/exec';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message, preferredDate, preferredTime } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Format the date nicely if provided
    const formattedDate = preferredDate
      ? new Date(preferredDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'Not specified';

    // Send email to both team members
    const emailData = {
      from: FROM_EMAIL,
      to: BOOKING_EMAILS,
      subject: `New Call Request from ${name}${company ? ` (${company})` : ''}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 24px; margin-bottom: 8px;">New 15-Minute Call Request</h1>
          <p style="color: #666; margin-bottom: 32px;">Someone wants to schedule a discovery call!</p>

          <div style="background: #f9f9f9; padding: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin: 0 0 16px 0;">Contact Information</h2>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
            ${company ? `<p style="margin: 8px 0;"><strong>Company:</strong> ${company}</p>` : ''}
          </div>

          <div style="background: #000; color: #fff; padding: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin: 0 0 16px 0;">Preferred Time</h2>
            <p style="margin: 8px 0; font-size: 18px;"><strong>${formattedDate}</strong></p>
            <p style="margin: 8px 0; font-size: 18px;">${preferredTime || 'Time not specified'}</p>
          </div>

          ${message ? `
          <div style="background: #f9f9f9; padding: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin: 0 0 16px 0;">Project Details</h2>
            <p style="margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}

          <div style="border-top: 1px solid #e0e0e0; padding-top: 24px; margin-top: 24px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Remember to add this to your calendar and send them a confirmation email!
            </p>
          </div>
        </div>
      `,
    };

    await resend.emails.send(emailData);

    // Also send a confirmation email to the person who submitted
    const confirmationEmail = {
      from: FROM_EMAIL,
      to: email,
      subject: `Call Request Received - Sweet Dreams`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 24px; margin-bottom: 8px;">Thanks for reaching out, ${name}!</h1>
          <p style="color: #666; margin-bottom: 32px;">We've received your request for a 15-minute discovery call.</p>

          <div style="background: #f9f9f9; padding: 24px; margin-bottom: 24px;">
            <p style="margin: 0; line-height: 1.6;">
              Our team will review your request and get back to you within 24 hours to confirm the call time.
            </p>
          </div>

          ${preferredDate || preferredTime ? `
          <div style="background: #000; color: #fff; padding: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin: 0 0 16px 0;">Your Preferred Time</h2>
            <p style="margin: 8px 0;">${formattedDate}</p>
            <p style="margin: 8px 0;">${preferredTime || ''}</p>
          </div>
          ` : ''}

          <p style="color: #666; font-size: 14px;">
            In the meantime, feel free to check out our recent work at <a href="https://sweetdreamsmusic.com/work" style="color: #000;">sweetdreamsmusic.com/work</a>
          </p>

          <div style="border-top: 1px solid #e0e0e0; padding-top: 24px; margin-top: 24px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Sweet Dreams Music & Media<br>
              Fort Wayne, Indiana
            </p>
          </div>
        </div>
      `,
    };

    await resend.emails.send(confirmationEmail);

    // Send to Google Sheets
    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone || '',
          company: company || '',
          preferredDate: preferredDate || '',
          preferredTime: preferredTime || '',
          message: message || '',
        }),
      });
    } catch (sheetError) {
      // Log but don't fail the request if Google Sheets fails
      console.error('Google Sheets error:', sheetError);
    }

    console.log(`Call booking request received from ${name} (${email})`);

    return NextResponse.json({ success: true, message: 'Booking request sent successfully' });
  } catch (error) {
    console.error('Book call form error:', error);
    return NextResponse.json(
      { error: 'Failed to send booking request. Please try again later.' },
      { status: 500 }
    );
  }
}
