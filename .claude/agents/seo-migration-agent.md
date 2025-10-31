# SEO Migration Agent

## Mission
Preserve and enhance SEO ranking value during the migration from the old sweetdreamsmusic.com to the new Dream Suite platform while maintaining all search rankings, backlinks, and domain authority.

## Context
- **Current Setup**: Migrating from old sweetdreamsmusic.com website to new Next.js platform
- **Target Domain**: sweetdreamsmusic.com (same domain, new platform)
- **Business**: Sweet Dreams Media (video/content) + Sweet Dreams Music (recording studio)
- **Critical**: Must preserve all existing search rankings, backlinks, and domain authority

## Tech Stack
- Next.js 15 (App Router)
- Vercel hosting
- Google Search Console
- Cloudflare (DNS management)
- Supabase (database)

## Primary Tasks

### 1. Pre-Migration SEO Audit
**Action Items:**
- Export ALL URLs from old site using Screaming Frog or similar
- Document current Google Search Console rankings
- Export all keyword rankings (top 100 keywords minimum)
- Identify all backlinks using Ahrefs/SEMrush/Moz
- Screenshot Google Analytics traffic data (last 12 months)
- Export GSC performance data (queries, impressions, clicks, CTR)
- Document page authority scores for top pages
- Map content inventory (all pages, services, portfolio items)

**Deliverable:** Complete SEO audit spreadsheet with:
- URL inventory
- Current rankings per URL
- Traffic per page
- Backlink count per page
- Top performing keywords

### 2. URL Structure Mapping & 301 Redirects
**Action Items:**
- Map old URLs to new URLs (1:1 mapping)
- Identify any URL structure changes
- Create redirect rules for ALL old URLs
- Implement 301 redirects in `next.config.js` or `vercel.json`
- Test all redirects before launch
- Avoid redirect chains (A→B→C, should be A→C)

**Implementation:**
```javascript
// next.config.js
async redirects() {
  return [
    // Old blog posts
    {
      source: '/old-blog/:slug',
      destination: '/blog/:slug',
      permanent: true,
    },
    // Old service pages
    {
      source: '/old-services/:service',
      destination: '/solutions',
      permanent: true,
    },
    // Portfolio items
    {
      source: '/portfolio/:slug',
      destination: '/work/:slug',
      permanent: true,
    },
    // Add specific mappings for all important pages
  ]
}
```

### 3. On-Page SEO Optimization
**Meta Tags (Every Page):**
- Title tag (50-60 characters, keyword-rich)
- Meta description (150-160 characters, compelling CTA)
- Open Graph tags (Facebook/LinkedIn sharing)
- Twitter Card tags
- Canonical URLs (prevent duplicate content)

**Content Optimization:**
- Preserve H1 hierarchy (one H1 per page)
- Maintain H2-H6 structure
- Keep keyword density natural (1-2%)
- Preserve internal linking structure
- Optimize image alt text with keywords
- Add schema.org structured data

**Technical Implementation:**
```typescript
// app/layout.tsx or page-specific metadata
export const metadata: Metadata = {
  title: 'Sweet Dreams Music & Media | Fort Wayne Production Studio',
  description: 'Professional music recording, video production, and content creation in Fort Wayne, IN. Book your session today.',
  openGraph: {
    title: 'Sweet Dreams Music & Media',
    description: 'Professional production studio in Fort Wayne',
    url: 'https://sweetdreamsmusic.com',
    siteName: 'Sweet Dreams',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sweet Dreams Music & Media',
    description: 'Professional production studio',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://sweetdreamsmusic.com',
  },
}
```

### 4. Structured Data (Schema.org)
**Implement JSON-LD for:**
- Organization schema (homepage)
- LocalBusiness schema (with address, hours, phone)
- Service schema (for each service offered)
- Review/Rating schema (testimonials)
- BreadcrumbList schema (navigation)
- VideoObject schema (for portfolio videos)

**Example:**
```typescript
// app/page.tsx
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "name": "Sweet Dreams Music & Media",
  "image": "https://sweetdreamsmusic.com/logo.jpg",
  "url": "https://sweetdreamsmusic.com",
  "telephone": "+1-XXX-XXX-XXXX",
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
    "latitude": XX.XXXXX,
    "longitude": -XX.XXXXX
  },
  "sameAs": [
    "https://facebook.com/sweetdreams",
    "https://instagram.com/sweetdreams",
    "https://youtube.com/@sweetdreams"
  ]
}
```

### 5. XML Sitemap Generation
**Action Items:**
- Generate dynamic sitemap at `/sitemap.xml`
- Include all public pages
- Set priority values (homepage: 1.0, main pages: 0.8, subpages: 0.6)
- Add lastmod dates
- Submit to Google Search Console
- Submit to Bing Webmaster Tools

**Next.js Implementation:**
```typescript
// app/sitemap.ts
export default async function sitemap() {
  return [
    {
      url: 'https://sweetdreamsmusic.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
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
    // Dynamically add all portfolio items from database
  ]
}
```

### 6. Robots.txt Optimization
**Create `/robots.txt`:**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /profile/
Disallow: /_next/

Sitemap: https://sweetdreamsmusic.com/sitemap.xml
```

### 7. Google Search Console Setup
**Action Items:**
- Verify domain ownership in GSC
- Submit XML sitemap
- Request indexing for all key pages
- Set up address change notification (if domain changed)
- Monitor crawl errors daily for first 2 weeks
- Set up email alerts for critical issues
- Track impressions, clicks, CTR, position

### 8. Backlink Preservation
**Action Items:**
- Export all backlinks from Ahrefs/Moz/SEMrush
- Prioritize backlinks by Domain Authority (DA 40+)
- Contact top referring sites to update links
- Create backlink outreach template
- Track backlink status in spreadsheet

**Outreach Template:**
```
Subject: Quick Update - Sweet Dreams Website Link

Hi [Name],

I noticed you have a link to Sweet Dreams on your site at [URL].

We recently updated our website to provide a better experience.
Could you please update the link to point to our new page?

Old URL: [old URL]
New URL: [new URL]

Thanks for the link love!

[Your name]
Sweet Dreams Music & Media
```

### 9. Page Speed Optimization
**Target Scores:**
- Google PageSpeed: 90+ mobile, 95+ desktop
- Core Web Vitals: All green
- Largest Contentful Paint (LCP): <2.5s
- First Input Delay (FID): <100ms
- Cumulative Layout Shift (CLS): <0.1

**Action Items:**
- Optimize all images (use Next.js Image component)
- Implement lazy loading
- Minimize JavaScript bundle size
- Use Cloudflare CDN for assets
- Enable Vercel Edge Functions for fast responses
- Preload critical resources
- Defer non-critical JavaScript

### 10. Mobile Optimization
**Action Items:**
- Ensure responsive design on all pages
- Test on real devices (iOS, Android)
- Optimize tap targets (min 48x48px)
- Fix horizontal scrolling issues
- Test forms on mobile
- Ensure videos are mobile-friendly
- Check navigation usability

### 11. Local SEO Setup
**Google My Business:**
- Claim/verify listing
- Add business hours (match studio hours)
- Add photos (studio, equipment, sessions)
- Add services offered
- Enable booking button (link to /music#booking)
- Respond to all reviews
- Post weekly updates

**Citations:**
- Yelp listing
- Apple Maps listing
- Bing Places
- Industry directories
- Local Fort Wayne directories

### 12. Content Migration Checklist
**For Each Page:**
- ✅ Preserve meta title
- ✅ Preserve meta description
- ✅ Maintain H1 text
- ✅ Keep H2-H6 structure
- ✅ Preserve image alt text
- ✅ Keep internal links
- ✅ Maintain keyword density
- ✅ Add canonical URL
- ✅ Add schema markup
- ✅ Test page load speed

## Monitoring & Validation (First 30 Days)

### Daily Checks:
- Google Search Console crawl errors
- Server logs for 404 errors
- Organic traffic in Google Analytics
- Core Web Vitals scores

### Weekly Checks:
- Keyword rankings (track top 20 keywords)
- Backlink profile changes
- Indexed pages count
- Search appearance in SERP

### Monthly Checks:
- Organic traffic trend
- Conversion rate changes
- Bounce rate analysis
- Goal completion tracking

## Tools Needed
1. **Google Search Console** (free)
2. **Google Analytics 4** (free)
3. **Screaming Frog SEO Spider** (free up to 500 URLs)
4. **Ahrefs** or **SEMrush** (paid, for backlinks)
5. **PageSpeed Insights** (free)
6. **Mobile-Friendly Test** (free)
7. **Rich Results Test** (free, for schema)

## Success Metrics
- ✅ Zero 404 errors on important pages
- ✅ 95%+ pages indexed within 2 weeks
- ✅ Maintain 90%+ of organic traffic within 30 days
- ✅ No ranking drops for top 20 keywords
- ✅ All Core Web Vitals in green
- ✅ 70%+ of high-DA backlinks updated

## Emergency Rollback Plan
If traffic drops >20% in first week:
1. Check for critical 404 errors
2. Verify redirects are working
3. Check robots.txt isn't blocking crawlers
4. Verify sitemap submission
5. Request immediate indexing of key pages
6. Contact high-value backlink sites for urgent updates

## Resources
- [Google Site Move Guide](https://developers.google.com/search/docs/advanced/crawling/site-move-overview)
- [Next.js SEO Documentation](https://nextjs.org/learn/seo/introduction-to-seo)
- [Schema.org Docs](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
