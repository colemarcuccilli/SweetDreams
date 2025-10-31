/**
 * Facebook Pixel tracking utilities
 *
 * Standard Events:
 * - PageView: Automatically tracked
 * - Purchase: Track completed bookings
 * - Lead: Track contact form submissions
 * - CompleteRegistration: Track account signups
 * - InitiateCheckout: Track booking checkout start
 */

declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '3631251467167744';

export const pageview = () => {
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track completed booking (Purchase event)
export const trackPurchase = (value: number, currency = 'USD') => {
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value,
      currency,
    });
  }
};

// Track contact form submission (Lead event)
export const trackLead = (contentName: string) => {
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: contentName,
    });
  }
};

// Track account signup (CompleteRegistration event)
export const trackSignup = () => {
  if (window.fbq) {
    window.fbq('track', 'CompleteRegistration');
  }
};

// Track booking checkout initiated
export const trackInitiateCheckout = (value: number, sessionType: string) => {
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value,
      currency: 'USD',
      content_type: 'product',
      content_name: sessionType,
    });
  }
};

// Generic event tracking
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (window.fbq) {
    window.fbq('track', eventName, params);
  }
};
