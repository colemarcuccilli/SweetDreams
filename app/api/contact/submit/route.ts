import { NextRequest, NextResponse } from 'next/server';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { ContactFormNotification } from '@/lib/emails/contact-form-notification';
import { ContactFormConfirmation } from '@/lib/emails/contact-form-confirmation';
import * as React from 'react';

export const dynamic = 'force-dynamic';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}

export async function POST(request: NextRequest) {
  console.log('');
  console.log('📬 ==========================================');
  console.log('📬 CONTACT FORM SUBMISSION');
  console.log('📬 Timestamp:', new Date().toISOString());
  console.log('📬 ==========================================');
  console.log('');

  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, message, source = 'Contact Form' } = body;

    // Validate required fields
    if (!name || !email || !message) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      console.error('❌ Message too short');
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      console.error('❌ Message too long');
      return NextResponse.json(
        { error: 'Message must be less than 5000 characters' },
        { status: 400 }
      );
    }

    console.log('📧 Preparing to send contact form emails...');
    console.log('📧 FROM:', FROM_EMAIL);
    console.log('📧 TO Admin:', ADMIN_EMAIL);
    console.log('📧 TO Customer:', email);
    console.log('📧 Source:', source);

    // Send admin notification email
    try {
      console.log('📧 Sending admin notification email...');
      const adminResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Contact Form Submission from ${name}`,
        react: ContactFormNotification({
          name,
          email,
          phone,
          message,
          source,
        }) as React.ReactElement,
      });
      console.log('✅ Admin notification email sent successfully:', adminResult);
    } catch (emailError) {
      console.error('❌ Failed to send admin notification email:', emailError);
      // Don't fail the request if admin email fails
    }

    // Send customer confirmation email
    try {
      console.log('📧 Sending customer confirmation email...');
      const customerResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Thank you for contacting Sweet Dreams Music',
        react: ContactFormConfirmation({
          name,
        }) as React.ReactElement,
      });
      console.log('✅ Customer confirmation email sent successfully:', customerResult);
    } catch (emailError) {
      console.error('❌ Failed to send customer confirmation email:', emailError);
      // Don't fail the request if customer email fails
    }

    console.log('✅ Contact form submission processed successfully');

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form submission' },
      { status: 500 }
    );
  }
}
