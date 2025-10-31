# SEO MIGRATION IMPLEMENTATION GUIDE

**Purpose:** Step-by-step guide to implement SEO preservation during site migration
**Prerequisites:** Complete OLD-SITE-AUDIT-PROMPT.md first

---

## PHASE 1: PRE-LAUNCH (Before New Site Goes Live)

### 1.1 Create 301 Redirect Rules

**If URLs are staying the same:**
- ✅ No redirects needed!
- Just ensure all old content exists at same URLs

**If URLs are changing:**

Create `middleware.ts` in your project root:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 301 Redirect Map
  const redirects: Record<string, string> = {
    '/old-services': '/solutions',
    '/old-music-page': '/music',
    '/old-contact': '/contact',
    // Add all your old → new URL mappings here
  }

  if (redirects[pathname]) {
    return NextResponse.redirect(
      new URL(redirects[pathname], request.url),
      { status: 301 } // Permanent redirect
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### 1.2 Preserve Meta Tags on All Pages

For each page, ensure title and description are SEO-optimized.

**Example - app/music/page.tsx:**

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recording Studio Fort Wayne | Sweet Dreams Music - $50/HR',
  description: 'Professional recording studio in Fort Wayne, IN. Music production, mixing, and mastering services starting at $50/hour. Book your session today!',
  keywords: 'recording studio Fort Wayne, music production Fort Wayne Indiana, studio recording near me',
  openGraph: {
    title: 'Recording Studio Fort Wayne | Sweet Dreams Music',
    description: 'Professional recording studio in Fort Wayne, IN',
    url: 'https://sweetdreamsmusic.com/music',
    siteName: 'Sweet Dreams Music',
    images: ['/og-image.jpg'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recording Studio Fort Wayne | Sweet Dreams Music',
    description: 'Professional recording studio in Fort Wayne, IN',
    images: ['/twitter-image.jpg'],
  },
}
```

### 1.3 Add Structured Data (Schema.org)

Create `lib/schema.ts`:

```typescript
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "MusicVenue"],
  "name": "Sweet Dreams Music & Media",
  "alternateName": "Sweet Dreams Music",
  "description": "Professional recording studio and media production services in Fort Wayne, Indiana",
  "url": "https://sweetdreamsmusic.com",
  "logo": "https://sweetdreamsmusic.com/logo.png",
  "image": "https://sweetdreamsmusic.com/studio.jpg",
  "telephone": "+1-260-420-6397",
  "email": "jayvalleo@sweetdreamsmusic.com",
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
    "latitude": "41.0793574",
    "longitude": "-85.1394081"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "22:00"
    }
  ],
  "priceRange": "$$",
  "sameAs": [
    "https://www.facebook.com/sweetdreamsmusic",
    "https://www.instagram.com/sweetdreamsmusic",
    // Add all social profiles
  ],
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "41.0793574",
      "longitude": "-85.1394081"
    },
    "geoRadius": "50000" // 50km radius
  }
}

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Recording Studio Services",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Sweet Dreams Music & Media"
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
  "areaServed": {
    "@type": "City",
    "name": "Fort Wayne",
    "@id": "https://en.wikipedia.org/wiki/Fort_Wayne,_Indiana"
  }
}
```

Add to your `app/layout.tsx`:

```typescript
import { organizationSchema } from '@/lib/schema'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Existing head content */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 1.4 Generate XML Sitemap

Install next-sitemap:

```bash
npm install next-sitemap
```

Create `next-sitemap.config.js`:

```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://sweetdreamsmusic.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/profile',
    '/profile/*',
    '/api/*',
    '/(auth)/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/profile', '/api', '/(auth)'],
      },
    ],
    additionalSitemaps: [
      'https://sweetdreamsmusic.com/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom priority for different pages
    const priorities = {
      '/': 1.0,
      '/music': 0.9,
      '/solutions': 0.8,
      '/media': 0.8,
    }

    return {
      loc: path,
      changefreq: path === '/' ? 'daily' : 'weekly',
      priority: priorities[path] || 0.5,
      lastmod: new Date().toISOString(),
    }
  },
}
```

Add to `package.json`:

```json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

---

## PHASE 2: LAUNCH DAY

### 2.1 Deploy New Site

```bash
git add .
git commit -m "Launch: SEO-optimized site with redirects and structured data"
git push origin main
```

### 2.2 Verify Deployment

- ✅ Check all pages load correctly
- ✅ Test 301 redirects (if any)
- ✅ Verify robots.txt: https://sweetdreamsmusic.com/robots.txt
- ✅ Verify sitemap: https://sweetdreamsmusic.com/sitemap.xml
- ✅ Verify structured data with Google Rich Results Test

### 2.3 Update Google Search Console

1. Go to https://search.google.com/search-console
2. **Add property:** sweetdreamsmusic.com
3. **Verify ownership** (multiple methods):
   - DNS verification (recommended)
   - HTML file upload
   - HTML tag in head
   - Google Analytics
4. **Submit new sitemap:**
   - Go to Sitemaps section
   - Add: `https://sweetdreamsmusic.com/sitemap.xml`
   - Click Submit

### 2.4 Request Re-indexing

For important pages:
1. Go to Google Search Console
2. Use URL Inspection tool
3. Enter URL (e.g., https://sweetdreamsmusic.com/music)
4. Click "Request Indexing"

Priority pages to request:
- Homepage: /
- Music page: /music
- Solutions: /solutions
- Media: /media
- Any page that ranks for top keywords

---

## PHASE 3: POST-LAUNCH (First 30 Days)

### Week 1: Intensive Monitoring

**Daily Tasks:**
- [ ] Check Google Search Console for crawl errors
- [ ] Monitor 404 errors (should be zero)
- [ ] Check indexing status (Coverage report)
- [ ] Monitor rankings for top 10 keywords
- [ ] Check Google Analytics traffic levels

**Fix immediately if you see:**
- 404 errors → Add to redirect map
- Crawl errors → Fix technical issues
- Dropped rankings → Verify content preserved
- Traffic drop → Check redirects working

### Week 2-4: Continued Monitoring

**Every 3 days:**
- [ ] Check Search Console Performance report
- [ ] Compare rankings to pre-launch baseline
- [ ] Monitor Core Web Vitals
- [ ] Check backlinks still working
- [ ] Review GA4 traffic trends

### Month 2-3: Optimization

**Weekly tasks:**
- [ ] Analyze which pages gained/lost rankings
- [ ] Optimize underperforming pages
- [ ] Build new content based on keyword gaps
- [ ] Reach out to broken backlinks
- [ ] Improve page speed where needed

---

## MONITORING CHECKLIST

### Google Search Console Checks

**Coverage Report:**
- ✅ All important pages indexed
- ✅ No "Excluded" pages that should be indexed
- ✅ No "Error" status pages

**Performance Report:**
- ✅ Total clicks trending up or stable
- ✅ Total impressions trending up
- ✅ Average position stable or improving
- ✅ CTR maintained or improved

**Core Web Vitals:**
- ✅ LCP < 2.5s (green)
- ✅ FID < 100ms (green)
- ✅ CLS < 0.1 (green)

### Google Analytics Checks

**Traffic:**
- ✅ Organic traffic maintained or increased
- ✅ Direct traffic stable
- ✅ Referral traffic maintained
- ✅ No sudden drops

**Behavior:**
- ✅ Bounce rate similar to old site
- ✅ Pages per session maintained
- ✅ Average session duration stable
- ✅ Conversion rate maintained or improved

### Ranking Checks

Use free tools:
- Google Search Console (Performance report)
- Google Business Profile Insights
- Ahrefs Free Backlink Checker

**Track weekly:**
- Top 5 keyword positions
- New keywords ranking
- Lost keywords
- Featured snippet opportunities

---

## EMERGENCY FIXES

### If rankings drop suddenly:

1. **Check Google Search Console:**
   - Any manual actions?
   - Crawl errors?
   - Indexing issues?

2. **Verify redirects working:**
   ```bash
   curl -I https://sweetdreamsmusic.com/old-url
   # Should show: HTTP/1.1 301 Moved Permanently
   # Location: https://sweetdreamsmusic.com/new-url
   ```

3. **Check content preserved:**
   - Title tags still optimized?
   - Meta descriptions present?
   - Content length maintained?
   - Keywords still present?

4. **Verify structured data:**
   - Test with Google Rich Results Test
   - Check for errors or warnings

5. **Page speed check:**
   - Run PageSpeed Insights
   - Ensure Core Web Vitals passing

### If 404 errors appear:

1. Find the broken URL in Search Console
2. Identify correct new URL
3. Add to redirect map in middleware.ts
4. Deploy fix
5. Request re-indexing in Search Console

---

## SUCCESS METRICS

### Week 1 Goals:
- ✅ Zero 404 errors
- ✅ Sitemap submitted and processing
- ✅ All important pages in "Valid" status
- ✅ No drop in traffic

### Month 1 Goals:
- ✅ All pages indexed
- ✅ Rankings maintained (±2 positions)
- ✅ Traffic maintained or increased
- ✅ Core Web Vitals in green

### Month 3 Goals:
- ✅ Rankings improved for target keywords
- ✅ Traffic increased 10-20%
- ✅ New keywords ranking
- ✅ Conversions maintained or improved

---

## TOOLS & RESOURCES

### Free SEO Tools:
- Google Search Console (essential)
- Google Analytics 4 (essential)
- Google PageSpeed Insights
- Google Rich Results Test
- Google Business Profile Insights
- Ahrefs Free Backlink Checker
- Moz Link Explorer (free)

### Chrome Extensions:
- Lighthouse (built-in)
- META SEO Inspector
- Redirect Path (check 301s)
- SEO Meta in 1 Click

### Monitoring:
- Set up Google Search Console weekly email reports
- Set up GA4 alerts for traffic drops
- Track rankings manually in spreadsheet

---

**Last Updated:** 2025-10-30
**Status:** Ready to implement after audit complete
