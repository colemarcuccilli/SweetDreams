import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors
let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set in environment variables');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

// Export a proxy object that initializes Resend only when methods are called
export const resend = {
  get emails() {
    return getResend().emails;
  }
};

// Email addresses
export const ADMIN_EMAIL = 'jayvalleo@sweetdreamsmusic.com';
// Using Resend's test email for development - change to bookings@sweetdreamsprod.com when going live
export const FROM_EMAIL = 'Sweet Dreams Music <onboarding@resend.dev>';
