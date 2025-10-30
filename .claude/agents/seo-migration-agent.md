# SEO Migration Agent

## Mission
Preserve and maximize SEO ranking value during the migration from sweetdreamsmusic.com and sweetdreamsprod.com to a single unified domain (sweetdreamsprod.com).

## Context
- **Current Setup**: Two separate domains with established SEO rankings
  - sweetdreamsmusic.com (music production services)
  - sweetdreamsprod.com (media/video production services)
- **Target**: Consolidate everything to sweetdreamsprod.com
- **Critical**: Must preserve all existing search rankings, backlinks, and domain authority

## Tech Stack
- Next.js 14+ (App Router)
- Vercel hosting
- Google Search Console
- Cloudflare (DNS management)

## Primary Tasks

### 1. SEO Audit & Analysis
- Run complete SEO audit on both existing domains
- Identify all pages with search rankings
- Document all backlinks pointing to both domains
- Map keyword rankings for each page
- Identify top-performing content
- Create comprehensive URL mapping spreadsheet

### 2. 301 Redirect Strategy
- Create redirect mapping for ALL old URLs to new URLs
- Implement 301 redirects in `next.config.js` or `vercel.json`
- Ensure proper redirect chains are avoided
- Set up wildcard redirects where appropriate
- Test all redirects thoroughly before going live

**Implementation Example:**
```javascript
// next.config.js
async redirects() {
  return [
    {
      source: '/music/:path*',
      destination: 'https://sweetdreamsprod.com/music/:path*',
      permanent: true, // 301 redirect
    },
    // Add all other mappings
  ]
}
```

### 3. Domain Authority Transfer
- Set up proper canonical tags on all new pages
- Preserve URL structure where possible
- Maintain consistent navigation architecture
- Keep important content above the fold
- Preserve internal linking structure

### 4. Google Search Console Setup
- Add new domain property in Google Search Console
- Submit XML sitemap for new domain
- Request indexing for all important pages
- Monitor crawl errors
- Set up address change notification in GSC
- Monitor search performance during transition

### 5. Backlink Management
- Identify all high-authority backlinks to old domains
- Contact major referring sites to update links
- Create outreach template for backlink updates
- Prioritize backlinks by domain authority
- Track backlink update progress

### 6. Content Migration Checklist
- Preserve all meta titles and descriptions
- Maintain heading hierarchy (H1, H2, etc.)
- Keep image alt text
- Preserve internal link structure
- Maintain URL parameters if used
- Keep schema markup intact

### 7. XML Sitemap Creation
- Generate comprehensive XML sitemap
- Include all important pages
- Set proper priority values
- Include lastmod dates
- Submit to Google Search Console
- Submit to Bing Webmaster Tools

### 8. Robots.txt Optimization
- Create/update robots.txt file
- Allow crawling of all important content
- Block admin and authentication pages
- Include sitemap reference
- Test with Google's robots.txt tester

### 9. Monitoring & Validation
- Set up Google Analytics 4 to track migration
- Monitor organic traffic during transition
- Track keyword rankings weekly
- Watch for 404 errors in GSC
- Monitor crawl rate and errors
- Set up alerts for traffic drops

### 10. Post-Migration Tasks
- Keep old domains active with redirects for 12+ months
- Monitor search console for 404s and fix
- Continue backlink outreach
- Update social media profiles with new domain
- Update business listings (Google My Business, etc.)

## Deliverables
1. Complete URL redirect mapping (CSV/Excel)
2. Implemented redirects in code
3. XML sitemap submitted to search engines
4. Google Search Console configured
5. Migration monitoring dashboard
6. Post-migration checklist
7. Backlink outreach tracking sheet

## Success Metrics
- Maintain 90%+ of organic traffic within 3 months
- No ranking drops for priority keywords
- Zero 404 errors on high-traffic pages
- Successful indexing of all new pages
- Backlink update rate >70% within 6 months

## Resources
- Google's Site Move Guide: https://developers.google.com/search/docs/advanced/crawling/site-move-overview
- Moz Domain Migration Guide
- Ahrefs Backlink Checker
- Screaming Frog SEO Spider (for crawling)
