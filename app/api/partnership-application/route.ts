import { NextRequest, NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/emails/resend';

// Team members who receive partnership applications
const PARTNERSHIP_EMAILS = ['jayvalleo@sweetdreamsmusic.com', 'cole@sweetdreamsmusic.com'];

// Turnstile secret key from environment variables
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

// Google Sheets Web App URL (optional)
const GOOGLE_SHEETS_URL = process.env.PARTNERSHIP_SHEETS_URL || '';

// Map revenue range to human-readable label
const REVENUE_LABELS: Record<string, string> = {
  '10-25k': '$10,000 - $25,000/month',
  '25-50k': '$25,000 - $50,000/month',
  '50-100k': '$50,000 - $100,000/month',
  '100k+': '$100,000+/month',
};

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
    const {
      businessName,
      industry,
      website,
      yourName,
      email,
      phone,
      revenue,
      challenge,
      whyPartner,
      turnstileToken,
    } = body;

    // Validate required fields
    if (!businessName || !yourName || !email || !revenue || !challenge) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
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
      console.warn('Invalid Turnstile token received for partnership application', { businessName, email });
      return NextResponse.json(
        { error: 'Invalid verification' },
        { status: 400 }
      );
    }

    // Get human-readable revenue label
    const revenueLabel = REVENUE_LABELS[revenue] || revenue;

    // Send notification email to team
    const teamEmailData = {
      from: FROM_EMAIL,
      to: PARTNERSHIP_EMAILS,
      subject: `New Partnership Application: ${businessName}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); color: white; padding: 32px; text-align: center;">
            <h1 style="font-size: 28px; margin: 0 0 8px 0;">New Partnership Application</h1>
            <p style="margin: 0; opacity: 0.8;">Grand Slam Growth Partnership</p>
          </div>

          <div style="padding: 32px; background: #f9f9f9;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin: 0 0 24px 0; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px;">Business Information</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 140px;">Business Name:</td>
                <td style="padding: 8px 0; font-weight: 600;">${businessName}</td>
              </tr>
              ${industry ? `
              <tr>
                <td style="padding: 8px 0; color: #666;">Industry:</td>
                <td style="padding: 8px 0;">${industry}</td>
              </tr>
              ` : ''}
              ${website ? `
              <tr>
                <td style="padding: 8px 0; color: #666;">Website/Social:</td>
                <td style="padding: 8px 0;"><a href="${website.startsWith('http') ? website : `https://${website}`}" style="color: #0066cc;">${website}</a></td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #666;">Monthly Revenue:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #059669;">${revenueLabel}</td>
              </tr>
            </table>
          </div>

          <div style="padding: 32px; background: white;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin: 0 0 24px 0; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px;">Contact Information</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 140px;">Name:</td>
                <td style="padding: 8px 0;">${yourName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0066cc;">${email}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 8px 0; color: #666;">Phone:</td>
                <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #0066cc;">${phone}</a></td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="padding: 32px; background: #1a1a1a; color: white;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 0 0 16px 0;">Biggest Growth Challenge</h2>
            <p style="margin: 0; line-height: 1.6; font-size: 15px;">${challenge.replace(/\n/g, '<br>')}</p>
          </div>

          ${whyPartner ? `
          <div style="padding: 32px; background: #f9f9f9;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin: 0 0 16px 0;">Why They Want to Partner</h2>
            <p style="margin: 0; line-height: 1.6; font-size: 15px; color: #333;">${whyPartner.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}

          <div style="padding: 24px 32px; background: white; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0; color: #059669; font-size: 14px;">
              <strong>✓ Verified submission</strong> - Passed Cloudflare Turnstile bot protection
            </p>
          </div>

          <div style="padding: 24px 32px; background: #f9f9f9; text-align: center;">
            <a href="mailto:${email}?subject=Re: Partnership Application - ${businessName}" style="display: inline-block; background: black; color: white; padding: 14px 32px; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Reply to ${yourName}</a>
          </div>
        </div>
      `,
    };

    await resend.emails.send(teamEmailData);

    // Send confirmation email to applicant
    const confirmationEmail = {
      from: FROM_EMAIL,
      to: email,
      subject: `Application Received - Sweet Dreams Partnership`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: black; color: white; padding: 48px 32px; text-align: center;">
            <h1 style="font-size: 32px; margin: 0 0 8px 0;">Thanks, ${yourName}!</h1>
            <p style="margin: 0; opacity: 0.7; font-size: 16px;">We've received your partnership application.</p>
          </div>

          <div style="padding: 48px 32px; background: white;">
            <h2 style="font-size: 20px; margin: 0 0 16px 0; color: black;">What happens next?</h2>
            <p style="margin: 0 0 24px 0; line-height: 1.7; color: #666; font-size: 16px;">
              Our team will review your application within the next 48 hours. If we think there's a potential fit, we'll reach out to schedule a discovery call.
            </p>

            <div style="background: #f9f9f9; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
              <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin: 0 0 12px 0;">Your Application Summary</h3>
              <p style="margin: 0 0 8px 0;"><strong>Business:</strong> ${businessName}</p>
              <p style="margin: 0;"><strong>Revenue Range:</strong> ${revenueLabel}</p>
            </div>

            <p style="margin: 0; line-height: 1.7; color: #666; font-size: 16px;">
              In the meantime, feel free to check out some of our recent work at <a href="https://sweetdreamsmusic.com/work" style="color: black; font-weight: 600;">sweetdreamsmusic.com/work</a>
            </p>
          </div>

          <div style="padding: 32px; background: #f9f9f9; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0; color: #999; font-size: 14px;">
              Sweet Dreams Music & Media<br>
              Fort Wayne, Indiana
            </p>
          </div>
        </div>
      `,
    };

    await resend.emails.send(confirmationEmail);

    // Log to Google Sheets (optional, don't fail if this errors)
    if (GOOGLE_SHEETS_URL) {
      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            businessName,
            industry: industry || '',
            website: website || '',
            yourName,
            email,
            phone: phone || '',
            revenue: revenueLabel,
            challenge,
            whyPartner: whyPartner || '',
          }),
        });
      } catch (sheetError) {
        console.error('Google Sheets logging error:', sheetError);
      }
    }

    console.log(`✅ Partnership application received from ${businessName} (${email})`);

    return NextResponse.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Partnership application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again later.' },
      { status: 500 }
    );
  }
}
