/**
 * Centralized Constants for Sweet Dreams
 * Single source of truth for domain, branding, and configuration
 */

// ==================== DOMAIN CONFIGURATION ====================

/**
 * Primary domain - sweetdreams.us
 * Legacy domains (sweetdreamsmusic.com, sweetdreamsvideo.com, sweetdreamsprod.com) redirect here
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sweetdreams.us';

/**
 * Legacy domains that redirect to sweetdreams.us
 */
export const LEGACY_DOMAINS = [
  'sweetdreamsmusic.com',
  'sweetdreamsvideo.com',
  'sweetdreamsprod.com',
] as const;

// ==================== BRAND IDENTITY ====================

export const BRAND = {
  name: 'Sweet Dreams',
  legalName: 'Sweet Dreams Music LLC',
  tagline: 'Creative Media Agency',
  description: 'Fort Wayne creative media agency specializing in music production, videography, web development, and social media growth.',
} as const;

// ==================== CONTACT INFORMATION ====================

export const CONTACT = {
  phone: '+1-260-450-7739',
  phoneDisplay: '(260) 450-7739',
  email: 'jayvalleo@sweetdreams.us',
  emailSupport: 'support@sweetdreams.us',
  emailNoreply: 'noreply@sweetdreams.us',
} as const;

// ==================== BUSINESS ADDRESS ====================

export const ADDRESS = {
  street: '3943 Parnell Ave',
  city: 'Fort Wayne',
  state: 'IN',
  stateFullName: 'Indiana',
  zip: '46805',
  country: 'US',
  countryFullName: 'United States',
  formatted: '3943 Parnell Ave, Fort Wayne, IN 46805',
} as const;

// ==================== GEOLOCATION ====================

export const GEO = {
  latitude: 41.093842,
  longitude: -85.139236,
  region: 'US-IN',
  placeName: 'Fort Wayne',
  position: '41.0793;-85.1394',
  icbm: '41.0793, -85.1394',
} as const;

// ==================== SOCIAL MEDIA ====================

export const SOCIAL = {
  instagram: 'https://www.instagram.com/sweetdreamsstudiosss/',
  tiktok: 'https://www.tiktok.com/@sweetdreamsstudios',
  twitter: '@jayvalleo',
  facebook: '', // Add if available
  youtube: '', // Add if available
  linkedin: '', // Add if available
} as const;

// ==================== BUSINESS HOURS ====================

export const BUSINESS_HOURS = {
  monday: { open: '09:00', close: '21:00', isOpen: true },
  tuesday: { open: '09:00', close: '21:00', isOpen: true },
  wednesday: { open: '09:00', close: '21:00', isOpen: true },
  thursday: { open: '09:00', close: '21:00', isOpen: true },
  friday: { open: '09:00', close: '21:00', isOpen: true },
  saturday: { open: '10:00', close: '18:00', isOpen: true },
  sunday: { open: null, close: null, isOpen: false },
} as const;

// ==================== SERVICE CONFIGURATION ====================

export const SERVICES = {
  recording: {
    name: 'Music Production & Recording',
    slug: 'music',
    price: 50,
    currency: 'USD',
    unit: 'per hour',
    description: 'Professional recording studio services, mixing, mastering, and beat production',
  },
  video: {
    name: 'Videography & Media Production',
    slug: 'media',
    description: 'Music videos, commercial production, event coverage, and video editing',
  },
  web: {
    name: 'Web Development',
    slug: 'solutions',
    description: 'Custom website design and development for businesses and artists',
  },
  social: {
    name: 'Social Media Growth',
    slug: 'solutions',
    description: 'Social media strategy, content creation, and audience growth management',
  },
} as const;

// ==================== SEO CONFIGURATION ====================

export const SEO = {
  defaultTitle: 'Sweet Dreams | Fort Wayne Creative Media Agency',
  titleTemplate: '%s | Sweet Dreams',
  defaultDescription: 'Fort Wayne creative media agency specializing in music production, videography, web development, and social media growth. Professional services for artists and businesses.',
  keywords: [
    // Location-based
    'Fort Wayne media agency',
    'Fort Wayne videographer',
    'Fort Wayne web development',
    'Fort Wayne recording studio',
    'Northeast Indiana media production',
    'Indiana creative agency',

    // Service-specific
    'music video production',
    'commercial videography',
    'professional recording studio',
    'custom website development',
    'social media marketing',
    'social media growth agency',
    'content creation services',

    // Combined services
    'full-service creative agency',
    'media production company',
    'digital marketing agency Fort Wayne',
    'video and web development',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Sweet Dreams',
    imageUrl: `${SITE_URL}/og-image.png`, // You'll need to create this
    imageAlt: 'Sweet Dreams Creative Media Agency',
    imageWidth: 1200,
    imageHeight: 630,
  },
} as const;

// ==================== ANALYTICS ====================

export const ANALYTICS = {
  googleAnalytics: 'G-JVM25Y7PGY',
  googleTagManager: 'GTM-NX7KJL3N',
  facebookPixel: '3631251467167744',
  microsoftClarity: 'tyjolmx04i',
} as const;

// ==================== STRIPE CONFIGURATION ====================

export const STRIPE = {
  successUrl: `${SITE_URL}/music/booking-success`,
  cancelUrl: `${SITE_URL}/music`,
} as const;
