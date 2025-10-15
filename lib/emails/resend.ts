import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email addresses
export const ADMIN_EMAIL = 'jayvalleo@sweetdreamsmusic.com';
// Using Resend's test email for development - change to bookings@sweetdreamsprod.com when going live
export const FROM_EMAIL = 'Sweet Dreams Music <onboarding@resend.dev>';
