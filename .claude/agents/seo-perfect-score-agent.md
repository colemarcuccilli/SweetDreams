# SEO Perfect Score Agent (12/10 Optimization)

## Mission
Achieve and maintain a 12/10 SEO score across all major SEO metrics, ranking tools, and search engines for sweetdreamsmusic.com.

## Target Metrics
- **Google PageSpeed Insights**: 95+ (mobile), 98+ (desktop)
- **GTmetrix**: A grade (95%+)
- **Lighthouse SEO Score**: 100/100
- **Core Web Vitals**: All green
- **Ahrefs SEO Score**: 90+
- **Moz Domain Authority**: 40+ (growing)
- **Google Search Console**: Zero errors, high CTR

## Phase 1: Technical SEO Foundation

### 1.1 Site Speed & Performance (Critical)
**Target: <2s load time, 95+ PageSpeed**

#### Image Optimization
```typescript
// Use Next.js Image component everywhere
import Image from 'next/image'

<Image
  src="/studio.jpg"
  alt="Sweet Dreams recording studio in Fort Wayne"
  width={1200}
  height={800}
  quality={85}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

#### Font Optimization
- Use `next/font` for optimal font loading
- Preload critical fonts
- Subset fonts to include only needed characters
- Use `font-display: swap` to prevent FOIT

```typescript
// app/layout.tsx
import { IBM_Plex_Mono, Anton } from 'next/font/google'

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})
```

#### Code Splitting & Lazy Loading
- Dynamic imports for heavy components
- Lazy load below-the-fold content
- Defer non-critical JavaScript
- Use React.lazy() for client components

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic'

const BookingCalendar = dynamic(() => import('@/components/music/BookingCalendar'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Only load on client
})
```

#### Caching Strategy
```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  headers: async () => {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

### 1.2 Core Web Vitals Optimization

#### Largest Contentful Paint (LCP) - Target: <2.5s
- Optimize hero images
- Preload critical resources
- Use priority hints
- Minimize server response time

```typescript
// Preload hero image
<link
  rel="preload"
  as="image"
  href="/hero-image.jpg"
  fetchpriority="high"
/>

// Priority image
<Image
  src="/hero.jpg"
  priority={true}
  quality={90}
/>
```

#### First Input Delay (FID) - Target: <100ms
- Minimize JavaScript execution time
- Break up long tasks
- Use web workers for heavy computations
- Defer third-party scripts

#### Cumulative Layout Shift (CLS) - Target: <0.1
- Set explicit width/height on all images
- Reserve space for ads/embeds
- Avoid injecting content above existing content
- Use CSS aspect ratio boxes

```css
/* Reserve space for images */
.image-container {
  aspect-ratio: 16 / 9;
  background: #f0f0f0;
}
```

### 1.3 Mobile-First Optimization
**Target: Perfect mobile experience**

- Responsive breakpoints: 320px, 768px, 1024px, 1440px
- Touch targets minimum 48x48px
- No horizontal scrolling
- Mobile-optimized navigation
- Fast mobile load times (<3s on 4G)

```typescript
// Mobile-first media queries
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
}
```

### 1.4 Structured Data Implementation
**Implement ALL relevant schema types:**

#### Organization Schema
```typescript
{
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "MusicGroup"],
  "name": "Sweet Dreams Music & Media",
  "alternateName": "Dream Suite",
  "url": "https://sweetdreamsmusic.com",
  "logo": "https://sweetdreamsmusic.com/logo.png",
  "image": "https://sweetdreamsmusic.com/og-image.jpg",
  "description": "Professional music recording studio and video production company in Fort Wayne, Indiana.",
  "telephone": "+1-XXX-XXX-XXXX",
  "email": "contact@sweetdreamsmusic.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "3943 Parnell Ave",
    "addressLocality": "Fort Wayne",
    "addressRegion": "IN",
    "postalCode": "46805",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.0739,
    "longitude": -85.1394
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "23:00"
    }
  ],
  "priceRange": "$$",
  "sameAs": [
    "https://facebook.com/sweetdreams",
    "https://instagram.com/sweetdreams",
    "https://youtube.com/@sweetdreams",
    "https://twitter.com/sweetdreams"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Music Production Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Recording Studio Session",
          "description": "Professional recording studio session"
        }
      }
    ]
  }
}
```

#### Service Schema (for each service)
```typescript
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Recording Studio",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Sweet Dreams Music"
  },
  "areaServed": {
    "@type": "City",
    "name": "Fort Wayne",
    "state": "Indiana"
  },
  "offers": {
    "@type": "Offer",
    "price": "50.00",
    "priceCurrency": "USD",
    "priceValidUntil": "2025-12-31",
    "url": "https://sweetdreamsmusic.com/music#booking"
  }
}
```

#### Review Schema (for testimonials)
```typescript
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "LocalBusiness",
    "name": "Sweet Dreams Music"
  },
  "author": {
    "@type": "Person",
    "name": "Customer Name"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "reviewBody": "Amazing studio experience..."
}
```

#### VideoObject Schema (for portfolio)
```typescript
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Video Title",
  "description": "Video description",
  "thumbnailUrl": "https://...",
  "uploadDate": "2025-01-01",
  "duration": "PT2M30S",
  "contentUrl": "https://...",
  "embedUrl": "https://..."
}
```

#### BreadcrumbList Schema
```typescript
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://sweetdreamsmusic.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Music Production",
      "item": "https://sweetdreamsmusic.com/music"
    }
  ]
}
```

## Phase 2: On-Page SEO Excellence

### 2.1 Meta Tag Optimization
**Every page must have perfect meta tags:**

```typescript
// app/music/page.tsx
export const metadata: Metadata = {
  title: 'Music Recording Studio Fort Wayne | Sweet Dreams Music',
  description: 'Professional music recording studio in Fort Wayne, IN. Book your recording session today. Expert mixing, mastering, and beat production. Starting at $50/hr.',
  keywords: 'recording studio fort wayne, music production fort wayne, recording studio indiana, beat production, mixing mastering',
  authors: [{ name: 'Sweet Dreams Music' }],
  creator: 'Sweet Dreams Music & Media',
  publisher: 'Sweet Dreams Music & Media',
  openGraph: {
    title: 'Music Recording Studio Fort Wayne | Sweet Dreams Music',
    description: 'Professional music recording studio in Fort Wayne, IN. Book your session today.',
    url: 'https://sweetdreamsmusic.com/music',
    siteName: 'Sweet Dreams Music & Media',
    images: [
      {
        url: 'https://sweetdreamsmusic.com/og-music.jpg',
        width: 1200,
        height: 630,
        alt: 'Sweet Dreams Music Recording Studio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music Recording Studio Fort Wayne | Sweet Dreams Music',
    description: 'Professional music recording studio in Fort Wayne, IN.',
    images: ['https://sweetdreamsmusic.com/twitter-music.jpg'],
    creator: '@sweetdreams',
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
  alternates: {
    canonical: 'https://sweetdreamsmusic.com/music',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    bing: 'your-bing-verification-code',
  },
}
```

### 2.2 Content Optimization

#### Keyword Research
**Primary Keywords:**
- Recording studio Fort Wayne
- Music production Fort Wayne
- Video production Fort Wayne
- Beat production
- Mixing and mastering
- Studio rental Fort Wayne

**Long-tail Keywords:**
- Best recording studio in Fort Wayne Indiana
- Affordable music production Fort Wayne
- Professional video production company Fort Wayne
- Where to record music in Fort Wayne
- Music studio with engineer Fort Wayne

#### Content Guidelines
- H1: One per page, include primary keyword
- H2-H6: Logical hierarchy, include secondary keywords
- Keyword density: 1-2% (natural, not stuffed)
- Content length: 500+ words for service pages
- Internal linking: 3-5 links per page
- External links: 2-3 to authoritative sources
- Alt text: Descriptive, include keywords naturally

### 2.3 URL Structure
**SEO-friendly URL patterns:**
```
✅ Good:
/music
/media
/work/video-title
/solutions
/music#booking

❌ Bad:
/page?id=123
/services.php
/portfolio_2024_final_v2
```

## Phase 3: Content Strategy

### 3.1 Blog Strategy
**Create high-value content targeting keywords:**

**Blog Post Topics:**
1. "How to Prepare for Your First Recording Studio Session"
2. "The Complete Guide to Music Production in Fort Wayne"
3. "5 Mistakes Artists Make in the Recording Studio"
4. "How to Choose the Right Recording Studio for Your Music"
5. "Behind the Scenes: A Day at Sweet Dreams Music"
6. "The Ultimate Fort Wayne Music Scene Guide"
7. "Video Production Tips for Musicians"
8. "How Much Does It Cost to Record a Song?"

**Blog SEO Checklist:**
- [ ] Keyword research complete
- [ ] Title includes primary keyword
- [ ] Meta description compelling + keyword
- [ ] H2 subheadings with keywords
- [ ] 1000+ words
- [ ] 3+ internal links
- [ ] 2+ external authoritative links
- [ ] Featured image optimized (alt text)
- [ ] Schema markup (Article schema)
- [ ] Social share buttons
- [ ] CTA to book session

### 3.2 Video SEO
**Optimize all portfolio videos:**

- Upload to YouTube (additional traffic source)
- Video title with keywords
- Detailed description (200+ words)
- Relevant tags
- Custom thumbnail
- Transcript/captions
- End screen with CTA
- Link back to website

### 3.3 Local Content
**Fort Wayne-specific content:**

- "Recording Studios in Fort Wayne: A Comprehensive Guide"
- "Fort Wayne Music Scene Spotlight"
- Partner with local venues
- Feature local artists
- Attend Fort Wayne events
- Sponsor local music competitions

## Phase 4: Off-Page SEO

### 4.1 Backlink Strategy
**Target: 50+ high-quality backlinks in 6 months**

**Link Building Tactics:**
1. **Guest Posting** - Music blogs, Fort Wayne blogs
2. **Local Directories** - Chamber of Commerce, Fort Wayne business directories
3. **Industry Directories** - Music production directories, studio listings
4. **PR & Press Releases** - New services, milestones, events
5. **Partnerships** - Equipment manufacturers, local businesses
6. **Resource Pages** - "Best studios in Indiana" lists
7. **Broken Link Building** - Find broken links to competitors, offer replacement
8. **Testimonials** - Provide testimonials to vendors (with link back)

**Priority Backlink Targets:**
- Local news sites (Fort Wayne Journal Gazette)
- Music industry blogs
- Fort Wayne Chamber of Commerce
- Indiana business directories
- Music equipment manufacturer sites
- YouTube (video embeds)
- Social media profiles

### 4.2 Social Signals
**Active social media presence:**

- Post 3-5x per week on Instagram
- Share client success stories
- Behind-the-scenes content
- Studio tour videos
- Equipment showcases
- Engage with local Fort Wayne accounts
- Use location tags
- Use relevant hashtags (#FortWayneMusic, #RecordingStudio)

## Phase 5: Technical SEO Checklist

### 5.1 Essential Files

#### robots.txt
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /profile/
Disallow: /_next/static/
Disallow: /checkout/

# Crawl-delay for aggressive bots
User-agent: AhrefsBot
Crawl-delay: 10

Sitemap: https://sweetdreamsmusic.com/sitemap.xml
```

#### sitemap.xml (Dynamic)
```typescript
// app/sitemap.ts
import { createClient } from '@/utils/supabase/server'

export default async function sitemap() {
  const supabase = createClient()

  // Get all portfolio items
  const { data: portfolioItems } = await supabase
    .from('media_portfolio')
    .select('slug, updated_at')
    .eq('is_featured', true)

  const portfolioUrls = portfolioItems?.map((item) => ({
    url: `https://sweetdreamsmusic.com/work/${item.slug}`,
    lastModified: item.updated_at,
    changeFrequency: 'monthly',
    priority: 0.7,
  })) || []

  return [
    {
      url: 'https://sweetdreamsmusic.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://sweetdreamsmusic.com/music',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://sweetdreamsmusic.com/media',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://sweetdreamsmusic.com/solutions',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...portfolioUrls,
  ]
}
```

### 5.2 Security & Trust
- HTTPS everywhere (SSL certificate)
- Security headers (CSP, X-Frame-Options)
- Privacy policy page
- Terms of service page
- Cookie consent banner (GDPR compliance)
- Contact information visible
- Physical address listed
- Phone number clickable on mobile

### 5.3 Accessibility (SEO + UX)
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators visible
- Color contrast ratio 4.5:1 minimum
- Alt text on all images
- Semantic HTML5 elements
- Skip to main content link

## Phase 6: Monitoring & Maintenance

### 6.1 Tools Setup
1. **Google Search Console** - Track rankings, errors, indexing
2. **Google Analytics 4** - Track traffic, conversions, behavior
3. **Google Tag Manager** - Manage tracking tags
4. **Ahrefs/SEMrush** - Monitor backlinks, competitors, keywords
5. **Hotjar/Microsoft Clarity** - Heatmaps, session recordings
6. **PageSpeed Insights** - Monitor performance

### 6.2 Weekly Tasks
- Check Google Search Console for errors
- Monitor keyword rankings
- Review organic traffic trends
- Check backlink profile
- Respond to reviews
- Post social media content
- Update Google My Business

### 6.3 Monthly Tasks
- Comprehensive SEO audit
- Competitor analysis
- Content gap analysis
- Update old content
- Publish new blog post
- Backlink outreach campaign
- Review and optimize underperforming pages

## Success Metrics Dashboard

### Key Performance Indicators (KPIs)
- **Organic Traffic**: 1000+ visitors/month (Month 3)
- **Keyword Rankings**: Top 3 for 10+ primary keywords
- **Domain Authority**: 40+ (6 months)
- **Page Speed**: 95+ mobile, 98+ desktop
- **Core Web Vitals**: 100% pass rate
- **Backlinks**: 50+ high-quality links
- **Conversion Rate**: 5%+ (booking form submissions)
- **Average Session Duration**: 3+ minutes
- **Bounce Rate**: <50%

## Resources
- [Google Search Central](https://developers.google.com/search)
- [Moz SEO Learning Center](https://moz.com/learn/seo)
- [Ahrefs Blog](https://ahrefs.com/blog/)
- [Search Engine Journal](https://www.searchenginejournal.com/)
- [Schema.org](https://schema.org/)
