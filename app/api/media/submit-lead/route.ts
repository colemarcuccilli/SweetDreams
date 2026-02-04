import { NextRequest, NextResponse } from 'next/server';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';

// Turnstile secret key from environment variables (required)
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

async function verifyTurnstileToken(token: string, remoteip?: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    console.error('TURNSTILE_SECRET_KEY is not configured');
    return false;
  }

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
    const { name, email, phone, message, turnstileToken } = body;

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
      console.warn('Invalid Turnstile token received (media form)', { name, email });
      return NextResponse.json(
        { error: 'Invalid verification' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const emailData = {
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Media Production Inquiry from ${name}`,
      html: `
        <h2>New Media Production Lead</h2>
        <p style="background: #f3f4f6; padding: 12px 16px; border-radius: 8px; display: inline-block;">
          <strong>Submitted from:</strong> Media Production Page
        </p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Project Details:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #059669; font-size: 14px;"><strong>✓ Verified submission</strong> - Passed Cloudflare Turnstile bot protection</p>
        <p><small style="color: #9ca3af;">This inquiry came from the Sweet Dreams Media production page contact form.</small></p>
      `,
    };

    await resend.emails.send(emailData);

    console.log(`✅ Media lead form submitted successfully:`, { name, email });

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Media lead form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
