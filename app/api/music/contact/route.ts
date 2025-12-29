import { NextRequest, NextResponse } from 'next/server';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';

// Turnstile secret key - should be in environment variables
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAACJodA6KPvgvIZS9IQ8ksWHhJG4';

// Map source to human-readable label
const SOURCE_LABELS: Record<string, string> = {
  music: 'Music Studio Page',
  media: 'Media Production Page',
  solutions: 'Solutions Page',
};

async function verifyTurnstileToken(token: string, remoteip?: string): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    if (remoteip) {
      formData.append('remoteip', remoteip);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, turnstileToken, source = 'music' } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Verification required' },
        { status: 400 }
      );
    }

    // Get client IP for additional validation
    const clientIp = request.headers.get('cf-connecting-ip') ||
                     request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     undefined;

    const isValidToken = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!isValidToken) {
      console.warn('Invalid Turnstile token received', { name, email, source });
      return NextResponse.json(
        { error: 'Invalid verification' },
        { status: 400 }
      );
    }

    // Get human-readable source label
    const sourceLabel = SOURCE_LABELS[source] || source;

    // Send email using Resend
    const emailData = {
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New ${sourceLabel} Inquiry from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p style="background: #f3f4f6; padding: 12px 16px; border-radius: 8px; display: inline-block;">
          <strong>Submitted from:</strong> ${sourceLabel}
        </p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #059669; font-size: 14px;"><strong>✓ Verified submission</strong> - Passed Cloudflare Turnstile bot protection</p>
        <p><small style="color: #9ca3af;">This inquiry came from the Sweet Dreams ${sourceLabel.toLowerCase()} contact form.</small></p>
      `,
    };

    await resend.emails.send(emailData);

    console.log(`✅ Contact form submitted successfully from ${sourceLabel}:`, { name, email });

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Music contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
