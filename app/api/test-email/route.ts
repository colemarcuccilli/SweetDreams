import { NextResponse } from 'next/server';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';

export async function GET() {
  console.log('🧪 TEST EMAIL ROUTE CALLED');
  console.log('📧 Testing email configuration...');
  console.log('📧 FROM:', FROM_EMAIL);
  console.log('📧 TO:', ADMIN_EMAIL);
  console.log('📧 Resend API Key exists:', !!process.env.RESEND_API_KEY);
  console.log('📧 Resend API Key value:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');

  try {
    console.log('📧 Attempting to send test email...');

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: 'Test Email - Sweet Dreams Booking System',
      html: `
        <h1>Test Email Successful!</h1>
        <p>This is a test email from your Sweet Dreams booking system.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>From:</strong> ${FROM_EMAIL}</p>
        <p><strong>To:</strong> ${ADMIN_EMAIL}</p>
        <p>If you received this email, your email system is configured correctly!</p>
      `,
    });

    console.log('✅ TEST EMAIL SENT SUCCESSFULLY!');
    console.log('📧 Result:', JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      result: result,
    });

  } catch (error: any) {
    console.error('❌ TEST EMAIL FAILED!');
    console.error('❌ Error:', error);
    console.error('❌ Error message:', error?.message);
    console.error('❌ Error stack:', error?.stack);
    console.error('❌ Full error object:', JSON.stringify(error, null, 2));

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Unknown error',
        details: error,
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
      },
      { status: 500 }
    );
  }
}
