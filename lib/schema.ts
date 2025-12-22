/**
 * Schema.org Structured Data for Sweet Dreams Creative Media Agency
 * CRITICAL for local SEO and search result rich snippets
 *
 * Supports multi-service business model:
 * - Music Production & Recording
 * - Videography & Media Production
 * - Web Development
 * - Social Media Growth Services
 */

import { SITE_URL, CONTACT, ADDRESS, GEO, SOCIAL, BRAND } from './constants';

// ==================== LOCAL BUSINESS SCHEMA ====================
// Primary schema - positions Sweet Dreams as a creative media agency

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  "name": BRAND.name,
  "alternateName": "Sweet Dreams Studio",
  "legalName": BRAND.legalName,
  "description": "Fort Wayne's premier creative media agency specializing in music production, professional videography, custom web development, and social media growth. Serving artists, businesses, and brands throughout Northeast Indiana.",
  "url": SITE_URL,
  "logo": `${SITE_URL}/logo.png`,
  "image": `${SITE_URL}/studio-photo.jpg`,

  // Contact Information
  "telephone": CONTACT.phone,
  "email": CONTACT.email,

  // Physical Address
  "address": {
    "@type": "PostalAddress",
    "streetAddress": ADDRESS.street,
    "addressLocality": ADDRESS.city,
    "addressRegion": ADDRESS.state,
    "postalCode": ADDRESS.zip,
    "addressCountry": ADDRESS.country
  },

  // Geographic Coordinates (for map results)
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": GEO.latitude,
    "longitude": GEO.longitude
  },

  // Business Hours
  "openingHoursSpecification": [
    // Monday - Friday (Regular Hours)
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "21:00"
    },
    // Saturday (Limited Hours)
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "18:00"
    }
  ],

  // Price Range
  "priceRange": "$$",

  // Social Media
  "sameAs": [
    SOCIAL.instagram,
    SOCIAL.tiktok
  ],

  // Service Area - Fort Wayne and surrounding areas
  "areaServed": [
    {
      "@type": "City",
      "name": "Fort Wayne",
      "@id": "https://en.wikipedia.org/wiki/Fort_Wayne,_Indiana"
    },
    {
      "@type": "State",
      "name": "Indiana"
    }
  ],

  // Primary Categories (helps Google understand our business type)
  "additionalType": [
    "https://schema.org/VideoProductionService",
    "https://schema.org/WebDesigner",
    "https://schema.org/AdvertisingAgency",
    "https://schema.org/RecordingStudio"
  ]
};

// ==================== ORGANIZATION SCHEMA ====================
// Company-level information

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  "name": BRAND.legalName,
  "legalName": BRAND.legalName,
  "url": SITE_URL,
  "logo": `${SITE_URL}/logo.png`,
  "foundingDate": "2020",
  "founders": [
    {
      "@type": "Person",
      "name": "Jay Val Leo"
    }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": CONTACT.phone,
    "contactType": "customer service",
    "email": CONTACT.email,
    "areaServed": "US",
    "availableLanguage": "English"
  },
  "sameAs": [
    SOCIAL.instagram,
    SOCIAL.tiktok
  ]
};

// ==================== RECORDING STUDIO SERVICE SCHEMA ====================

export const recordingServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/music#service`,
  "serviceType": "Music Production & Recording",
  "name": "Recording Studio Services",
  "description": "Professional music recording, mixing, mastering, and beat production in Fort Wayne. State-of-the-art equipment, experienced engineers, and a creative environment for artists.",
  "provider": {
    "@type": "LocalBusiness",
    "name": BRAND.name,
    "@id": `${SITE_URL}/#organization`
  },
  "areaServed": {
    "@type": "City",
    "name": "Fort Wayne",
    "@id": "https://en.wikipedia.org/wiki/Fort_Wayne,_Indiana"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "50.00",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "50.00",
      "priceCurrency": "USD",
      "unitText": "per hour"
    },
    "availability": "https://schema.org/InStock",
    "url": `${SITE_URL}/music`
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Music Production Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Recording",
          "description": "Professional studio recording with state-of-the-art equipment"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Mixing & Mastering",
          "description": "Professional audio mixing and mastering services"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Beat Production",
          "description": "Custom beat production and instrumental creation"
        }
      }
    ]
  }
};

// ==================== VIDEO PRODUCTION SERVICE SCHEMA ====================

export const videoProductionServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/media#service`,
  "serviceType": "Video Production",
  "name": "Professional Videography & Media Production",
  "description": "High-quality video production services including music videos, commercial filming, event coverage, and professional video editing for businesses and artists in Fort Wayne.",
  "provider": {
    "@type": "LocalBusiness",
    "name": BRAND.name,
    "@id": `${SITE_URL}/#organization`
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Fort Wayne"
    },
    {
      "@type": "State",
      "name": "Indiana"
    }
  ],
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "url": `${SITE_URL}/media`
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Video Production Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Music Video Production",
          "description": "Professional music video filming, direction, and editing"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Commercial Video Production",
          "description": "Business commercials, promotional videos, and brand content"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Event Videography",
          "description": "Professional event coverage and highlight reels"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Video Editing",
          "description": "Professional post-production and video editing services"
        }
      }
    ]
  },
  "additionalType": "https://schema.org/VideoProductionService"
};

// ==================== WEB DEVELOPMENT SERVICE SCHEMA ====================

export const webDevelopmentServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/solutions#webdev`,
  "serviceType": "Web Development",
  "name": "Custom Website Development",
  "description": "Professional website design and development for businesses, artists, and brands. Custom solutions built with modern technologies for optimal performance and user experience.",
  "provider": {
    "@type": "LocalBusiness",
    "name": BRAND.name,
    "@id": `${SITE_URL}/#organization`
  },
  "areaServed": "US",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "url": `${SITE_URL}/solutions`
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Web Development Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Custom Website Design",
          "description": "Bespoke website design tailored to your brand"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "E-Commerce Development",
          "description": "Online stores and e-commerce platforms"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Artist Portfolio Websites",
          "description": "Professional portfolio sites for musicians and creatives"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Website Maintenance",
          "description": "Ongoing website updates and technical support"
        }
      }
    ]
  },
  "additionalType": "https://schema.org/WebDesigner"
};

// ==================== SOCIAL MEDIA MARKETING SERVICE SCHEMA ====================

export const socialMediaServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/solutions#socialmedia`,
  "serviceType": "Social Media Marketing",
  "name": "Social Media Growth & Management",
  "description": "Strategic social media management, content creation, and audience growth services for businesses and artists. Data-driven strategies to increase engagement and build your brand.",
  "provider": {
    "@type": "LocalBusiness",
    "name": BRAND.name,
    "@id": `${SITE_URL}/#organization`
  },
  "areaServed": "US",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "url": `${SITE_URL}/solutions`
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Social Media Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Social Media Strategy",
          "description": "Custom social media strategy and planning"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Content Creation",
          "description": "Professional content creation for social platforms"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Audience Growth",
          "description": "Organic audience growth and engagement strategies"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Social Media Management",
          "description": "Full-service social media account management"
        }
      }
    ]
  },
  "additionalType": "https://schema.org/AdvertisingAgency"
};

// ==================== WEBSITE SCHEMA ====================
// For search box in Google results

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  "url": SITE_URL,
  "name": BRAND.name,
  "description": BRAND.description,
  "publisher": {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SITE_URL}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

// ==================== CONSOLIDATED SCHEMA ====================
// Uses @graph to combine all schemas (reduces HTTP requests and improves indexing)

export const consolidatedSchema = {
  "@context": "https://schema.org",
  "@graph": [
    localBusinessSchema,
    organizationSchema,
    recordingServiceSchema,
    videoProductionServiceSchema,
    webDevelopmentServiceSchema,
    socialMediaServiceSchema,
    websiteSchema
  ]
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate VideoObject schema for portfolio projects
 * Use on /work/* pages for individual video projects
 */
export const createVideoSchema = (params: {
  name: string;
  description: string;
  uploadDate: string;
  thumbnailUrl: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string; // ISO 8601 format (e.g., "PT1M30S" for 1 min 30 sec)
}) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": params.name,
  "description": params.description,
  "uploadDate": params.uploadDate,
  "thumbnailUrl": params.thumbnailUrl,
  "contentUrl": params.contentUrl,
  "embedUrl": params.embedUrl,
  "duration": params.duration,
  "publisher": {
    "@type": "Organization",
    "name": BRAND.name,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/logo.png`
    }
  },
  "creator": {
    "@type": "Organization",
    "name": BRAND.name,
    "@id": `${SITE_URL}/#organization`
  }
});

/**
 * Generate BreadcrumbList schema for better navigation in search results
 * Use on all non-homepage pages
 */
export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

/**
 * Generate FAQPage schema for service pages
 * Improves appearance in search results with rich snippets
 */
export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
