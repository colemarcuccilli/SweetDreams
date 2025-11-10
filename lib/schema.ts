/**
 * Schema.org Structured Data for Sweet Dreams Music Studio
 * CRITICAL for local SEO and search result rich snippets
 */

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Sweet Dreams Music Studio",
  "alternateName": "Sweet Dreams Studio",
  "description": "Sweet Dreams Studio is Fort Wayne's premier music recording and production facility offering professional recording, mixing, mastering, beat production, and video services.",
  "url": "https://sweetdreamsmusic.com",
  "logo": "https://sweetdreamsmusic.com/logo.png",
  "image": "https://sweetdreamsmusic.com/studio-photo.jpg",

  // Contact Information
  "telephone": "+1-260-450-7739",
  "email": "jayvalleo@sweetdreamsmusic.com",

  // Physical Address
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "3943 Parnell Ave",
    "addressLocality": "Fort Wayne",
    "addressRegion": "IN",
    "postalCode": "46805",
    "addressCountry": "US"
  },

  // Geographic Coordinates (for map results)
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.093842,
    "longitude": -85.139236
  },

  // Business Hours (Regular + After Hours)
  "openingHoursSpecification": [
    // Monday - Thursday (Regular Hours)
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "09:00",
      "closes": "20:59"
    },
    // Monday - Friday (After Hours)
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "21:00",
      "closes": "02:00"
    },
    // Saturday (After Hours Only)
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "11:00",
      "closes": "03:00"
    },
    // Sunday (After Hours Only)
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "11:00",
      "closes": "03:00"
    }
  ],

  // Price Range
  "priceRange": "$$",

  // Social Media
  "sameAs": [
    "https://www.instagram.com/sweetdreamsstudiosss/",
    "https://www.tiktok.com/@sweetdreamsstudios"
  ],

  // Service Offered
  "makesOffer": {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": "Recording Studio Services",
      "description": "Professional music recording, mixing, mastering, and music production services"
    },
    "price": "50",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "50.00",
      "priceCurrency": "USD",
      "unitText": "per hour"
    }
  },

  // Service Area
  "areaServed": {
    "@type": "City",
    "name": "Fort Wayne",
    "@id": "https://en.wikipedia.org/wiki/Fort_Wayne,_Indiana"
  }
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sweet Dreams Music LLC",
  "legalName": "Sweet Dreams Music LLC",
  "url": "https://sweetdreamsmusic.com",
  "logo": "https://sweetdreamsmusic.com/logo.png",
  "foundingDate": "2020",
  "founders": [
    {
      "@type": "Person",
      "name": "Jay Val Leo"
    }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-260-450-7739",
    "contactType": "customer service",
    "email": "jayvalleo@sweetdreamsmusic.com",
    "areaServed": "US",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://www.instagram.com/sweetdreamsstudiosss/",
    "https://www.tiktok.com/@sweetdreamsstudios"
  ]
};

export const recordingServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Recording Studio Services",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Sweet Dreams Music Studio",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "3943 Parnell Ave",
      "addressLocality": "Fort Wayne",
      "addressRegion": "IN",
      "postalCode": "46805"
    }
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
    }
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
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Music Video Production",
          "description": "Professional music video filming and editing"
        }
      }
    ]
  }
};

// WebSite schema for search box in Google results
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://sweetdreamsmusic.com/#website",
  "url": "https://sweetdreamsmusic.com",
  "name": "Sweet Dreams Studio",
  "publisher": {
    "@type": "Organization",
    "name": "Sweet Dreams Studio",
    "logo": {
      "@type": "ImageObject",
      "url": "https://sweetdreamsmusic.com/logo.png"
    }
  }
};

// Consolidated schema using @graph (reduces HTTP requests)
export const consolidatedSchema = {
  "@context": "https://schema.org",
  "@graph": [
    localBusinessSchema,
    organizationSchema,
    websiteSchema
  ]
};

// Helper function to generate VideoObject schema for portfolio projects
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
    "name": "Sweet Dreams Media",
    "logo": {
      "@type": "ImageObject",
      "url": "https://sweetdreamsmusic.com/logo.png"
    }
  },
  "creator": {
    "@type": "Organization",
    "name": "Sweet Dreams Media"
  }
});

// BreadcrumbList schema for better navigation in search results
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
