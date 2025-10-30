# SEO & Meta Optimization Agent

## Mission
Implement comprehensive SEO optimization throughout the entire Sweet Dreams website, including meta tags, structured data, Open Graph tags, and technical SEO best practices.

## Context
- **Website**: Sweet Dreams (Music & Media Production)
- **Target Domain**: sweetdreamsprod.com
- **Primary Services**: Music production, video production, recording studio, media services
- **Target Locations**: Fort Wayne, Indiana (primary), Indianapolis, Chicago (secondary)
- **Target Audience**: Musicians, artists, businesses needing video/media content

## Tech Stack
- Next.js 14+ (App Router with Metadata API)
- TypeScript
- Vercel hosting
- Supabase (dynamic content)
- Cloudflare Stream (videos)

## Primary Tasks

### 1. Meta Tags Implementation

Implement on every page using Next.js Metadata API:

```typescript
// Example: app/music/page.tsx
export const metadata: Metadata = {
  title: 'Professional Music Production Studio | Sweet Dreams Music - Fort Wayne, IN',
  description: 'Recording studio in Fort Wayne offering beats, mixing & mastering, recording sessions, and music video production. Book your session today.',
  keywords: 'music production fort wayne, recording studio fort wayne, mixing and mastering, music videos, beat production',
  openGraph: {
    title: 'Sweet Dreams Music Production Studio',
    description: 'Professional recording, mixing, and music production in Fort Wayne, Indiana',
    url: 'https://sweetdreamsprod.com/music',
    siteName: 'Sweet Dreams',
    images: [
      {
        url: 'https://sweetdreamsprod.com/og-music.jpg',
        width: 1200,
        height: 630,
        alt: 'Sweet Dreams Music Studio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sweet Dreams Music Production',
    description: 'Recording studio in Fort Wayne, IN',
    images: ['https://sweetdreamsprod.com/og-music.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

**Pages requiring meta tags:**
- Homepage (/)
- Music page (/music)
- Media page (/media)
- Solutions page (/solutions)
- All project pages (/work/*)
- Booking pages

### 2. Structured Data (JSON-LD)

Implement schema.org structured data for:

**LocalBusiness Schema:**
```typescript
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://sweetdreamsprod.com/#organization',
  name: 'Sweet Dreams Music & Media',
  image: 'https://sweetdreamsprod.com/logo.png',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3943 Parnell Ave',
    addressLocality: 'Fort Wayne',
    addressRegion: 'IN',
    postalCode: '46805',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 'YOUR_LAT',
    longitude: 'YOUR_LONG',
  },
  url: 'https://sweetdreamsprod.com',
  telephone: 'YOUR_PHONE',
  priceRange: '$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '02:00',
    },
  ],
  sameAs: [
    'https://instagram.com/sweetdreams',
    'https://facebook.com/sweetdreams',
    // Add all social media
  ],
}
```

**Service Schema (for each service):**
```typescript
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Music Production',
  provider: {
    '@id': 'https://sweetdreamsprod.com/#organization',
  },
  areaServed: {
    '@type': 'City',
    name: 'Fort Wayne',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Music Production Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Recording Studio Session',
        },
      },
      // Add all services
    ],
  },
}
```

**VideoObject Schema (for portfolio items):**
```typescript
const videoSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Project Title',
  description: 'Project description',
  thumbnailUrl: 'thumbnail_url',
  uploadDate: '2025-01-01',
  contentUrl: 'video_url',
  embedUrl: 'embed_url',
}
```

**BreadcrumbList Schema:**
```typescript
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://sweetdreamsprod.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Music',
      item: 'https://sweetdreamsprod.com/music',
    },
  ],
}
```

### 3. Canonical URLs
- Add canonical tags to every page
- Prevent duplicate content issues
- Use absolute URLs

```typescript
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://sweetdreamsprod.com/music',
  },
}
```

### 4. sitemap.xml Generation
Create dynamic sitemap at `app/sitemap.ts`:

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic routes from Supabase
  const projects = await getProjects();

  const staticRoutes = [
    {
      url: 'https://sweetdreamsprod.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://sweetdreamsprod.com/music',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // All static pages
  ];

  const dynamicRoutes = projects.map(project => ({
    url: `https://sweetdreamsprod.com/work/${project.slug}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
```

### 5. robots.txt Creation
Create `app/robots.ts`:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/login', '/signup'],
    },
    sitemap: 'https://sweetdreamsprod.com/sitemap.xml',
  }
}
```

### 6. Performance Optimization for SEO
- Implement next/image for all images
- Add width/height to prevent CLS
- Optimize Cloudflare Stream embeds
- Lazy load below-the-fold content
- Minimize JavaScript bundle size
- Implement proper caching headers

### 7. Internal Linking Strategy
- Add contextual internal links throughout content
- Create "Related Projects" sections
- Link service pages to booking
- Add breadcrumbs navigation
- Ensure all important pages are within 3 clicks of homepage

### 8. Image SEO
- Add descriptive alt text to ALL images
- Use descriptive file names
- Implement responsive images
- Optimize image file sizes (WebP format)
- Add image schema for portfolio items

### 9. URL Structure Optimization
Already good with `/music`, `/media`, `/work/project-name`
Ensure:
- Lowercase only
- Hyphens for spaces
- Descriptive slugs
- No unnecessary parameters

### 10. Mobile SEO
- Ensure mobile-first design
- Test with Google Mobile-Friendly Test
- Optimize tap targets (48x48px minimum)
- Ensure readable font sizes
- No horizontal scrolling

### 11. Page Speed Optimization
- Achieve 90+ on Google PageSpeed Insights
- Optimize Core Web Vitals:
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

### 12. Local SEO
- Claim Google Business Profile
- Add location keywords naturally
- Create location-specific content
- Get listed in local directories
- Encourage client reviews

## Implementation Checklist

### Homepage
- [ ] Title tag (60 chars)
- [ ] Meta description (155 chars)
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] LocalBusiness schema
- [ ] Organization schema
- [ ] Canonical URL
- [ ] Proper heading hierarchy
- [ ] Alt text on all images

### Service Pages (/music, /media, /solutions)
- [ ] Unique title tags
- [ ] Unique meta descriptions
- [ ] Service schema
- [ ] Open Graph tags
- [ ] Breadcrumb schema
- [ ] Internal links to related pages
- [ ] FAQ schema (if applicable)

### Project Pages (/work/*)
- [ ] Dynamic title from project name
- [ ] Dynamic description from project
- [ ] VideoObject schema
- [ ] Breadcrumb schema
- [ ] Related projects links
- [ ] Image optimization

## Tools for Testing
- Google Search Console
- PageSpeed Insights
- Lighthouse (Chrome DevTools)
- Schema Markup Validator
- Mobile-Friendly Test
- Screaming Frog SEO Spider

## Keyword Strategy

### Primary Keywords
- "recording studio fort wayne"
- "music production fort wayne"
- "video production fort wayne"
- "music video production"
- "mixing and mastering services"

### Long-tail Keywords
- "affordable recording studio fort wayne indiana"
- "professional music video production near me"
- "corporate video production fort wayne"
- "event videography fort wayne"

## Success Metrics
- All pages have unique, optimized meta tags
- Schema validation passes on all pages
- PageSpeed score >90 on all pages
- Mobile-friendly test passes
- All images have alt text
- Sitemap successfully submitted
- Zero schema errors in Search Console

## File Structure
```
app/
├── sitemap.ts          # Dynamic sitemap
├── robots.ts           # Robots.txt
├── layout.tsx          # Root metadata
├── page.tsx            # Homepage metadata
├── music/
│   └── page.tsx        # Music page metadata
├── media/
│   └── page.tsx        # Media page metadata
└── work/
    └── [slug]/
        └── page.tsx    # Dynamic project metadata
```
