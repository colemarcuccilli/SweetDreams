# OLD SITE SEO AUDIT PROMPT

Use this prompt with Claude or another AI assistant to audit your old sweetdreamsmusic.com site and extract all SEO data needed for migration.

---

## PROMPT TO USE:

```
I need to perform a comprehensive SEO audit of my existing website (sweetdreamsmusic.com) before migrating to a new Next.js version on the same domain. I need to preserve all SEO rankings, backlinks, and search visibility.

Please help me create a complete audit covering:

## 1. URL STRUCTURE AUDIT
- List all pages on the current site
- Document the full URL structure
- Identify which URLs will change in the new site
- Create a 301 redirect mapping spreadsheet (old URL → new URL)
- Note any URL parameters or query strings in use

## 2. ON-PAGE SEO ELEMENTS
For each important page, extract:
- Title tags (all <title> elements)
- Meta descriptions (all meta description tags)
- H1, H2, H3 heading structure
- Alt text for all images
- Internal linking structure
- Schema.org structured data (if any)
- Open Graph tags (for social sharing)
- Canonical URLs

## 3. CONTENT INVENTORY
- List all unique content pages
- Identify cornerstone/pillar content
- Document blog posts or articles (if any)
- Note any downloadable resources
- List service pages and their content
- Document any FAQs or knowledge base content

## 4. TECHNICAL SEO AUDIT
- Current robots.txt content
- Current sitemap.xml structure
- Page load speeds (use PageSpeed Insights)
- Mobile-friendliness check
- HTTPS/SSL status
- Core Web Vitals scores (LCP, FID, CLS)
- Any existing Google Search Console errors or warnings

## 5. BACKLINK ANALYSIS
Using free tools like:
- Ahrefs Backlink Checker (free version)
- Moz Link Explorer (free version)
- Google Search Console → Links report

Document:
- Top referring domains
- Total number of backlinks
- Most valuable backlinks (high authority sites)
- Anchor text distribution
- Any broken backlinks to fix

## 6. KEYWORD RANKINGS
Using Google Search Console:
- Top 20 keywords currently ranking
- Current positions for each keyword
- Average CTR for top keywords
- Pages that rank for each keyword
- Search query trends (last 3 months)

## 7. COMPETITOR ANALYSIS
Analyze 3-5 competing recording studios in Fort Wayne area:
- Their URL structure
- Their title tags and meta descriptions
- Keywords they're targeting
- Their Google Business Profile optimization
- Their content strategy

## 8. LOCAL SEO AUDIT
- Google Business Profile status (verified?)
- Current reviews and ratings
- NAP consistency (Name, Address, Phone) across web
- Local citations (Yelp, Yellow Pages, etc.)
- Local keywords currently ranking

## 9. ANALYTICS DATA (if available)
From current Google Analytics:
- Top 10 landing pages (last 90 days)
- Top 10 exit pages
- Bounce rate per page
- Average session duration per page
- Conversion rate per page
- Traffic sources breakdown

## 10. SOCIAL SIGNALS
- Social media profiles linked from site
- Social sharing buttons present?
- Open Graph and Twitter Card implementation
- Social media follower counts

---

## OUTPUT FORMAT:

Please provide the audit in the following formats:

1. **Executive Summary** (1-2 pages)
   - Current SEO health score
   - Key findings
   - Critical items that MUST be preserved
   - High-risk items that could lose rankings

2. **Detailed Spreadsheet Structure:**
   - URL Mapping Sheet (Old URL | New URL | 301 Status | Priority)
   - Meta Data Sheet (URL | Title | Meta Description | H1 | Notes)
   - Keyword Rankings Sheet (Keyword | URL | Position | Search Volume)
   - Backlinks Sheet (Source URL | Target URL | Authority | Status)

3. **Actionable Recommendations:**
   - What to preserve exactly as-is
   - What to improve during migration
   - What to add that's currently missing
   - Priority order for implementation

4. **Technical Migration Checklist:**
   - Pre-launch tasks
   - Launch day tasks
   - Post-launch monitoring tasks
   - Timeline estimates

---

## TOOLS TO USE:

**FREE Tools:**
- Google Search Console (must have access)
- Google Analytics (if available)
- Google PageSpeed Insights
- Ahrefs Backlink Checker (free version)
- Moz Link Explorer (free version)
- Screaming Frog SEO Spider (free up to 500 URLs)
- Chrome DevTools (for on-page elements)

**Crawl the site with:**
```bash
# Using wget to crawl and save site structure
wget --spider --recursive --no-verbose --output-file=crawl.log https://sweetdreamsmusic.com

# Or use curl to check headers
curl -I https://sweetdreamsmusic.com
```

---

## PRIORITY FOCUS AREAS:

Given this is a recording studio in Fort Wayne, pay special attention to:
- Local SEO keywords: "recording studio Fort Wayne", "music production Fort Wayne Indiana"
- Service pages: Studio recording, mixing, mastering, production
- Location-based content: Fort Wayne, Indiana references
- Google Business Profile optimization
- Review schema and testimonials

---

## SITE CONTEXT:

**Business:** Sweet Dreams Music & Media
**Location:** 3943 Parnell Ave, Fort Wayne, IN 46805
**Services:** Recording studio, music production, media production
**Target Audience:** Local musicians, artists, podcasters
**Current Domain:** sweetdreamsmusic.com
**New Site:** Next.js rebuild on same domain

---

## DELIVERABLES NEEDED:

1. Complete URL mapping spreadsheet
2. Meta data export (titles, descriptions for all pages)
3. Top 20 keyword rankings with positions
4. List of all backlinks worth preserving
5. Content inventory with priorities
6. Technical issues to fix
7. 301 redirect rules ready to implement

Please provide actionable data I can use to ensure zero SEO loss during migration.
```

---

## HOW TO USE THIS PROMPT:

### Option 1: Manual Audit (if old site is still live)
1. Visit your old sweetdreamsmusic.com site
2. Use the tools listed above to gather data
3. Copy relevant sections of the prompt for specific tasks
4. Document findings in spreadsheets

### Option 2: AI-Assisted Audit
1. Copy the entire prompt above
2. Paste into Claude Code or Claude.ai
3. Provide access to Google Search Console data
4. Let AI help extract and organize data
5. Review and verify findings

### Option 3: Professional SEO Tool
1. Use Screaming Frog SEO Spider
2. Crawl old site: https://sweetdreamsmusic.com
3. Export all data to CSV
4. Use prompt to guide what data to prioritize

---

## CRITICAL DATA TO PRESERVE:

### MUST HAVE:
- ✅ All current URLs (for 301 redirect mapping)
- ✅ Title tags and meta descriptions (for pages that rank)
- ✅ Top 10-20 keywords with current positions
- ✅ Google Business Profile info
- ✅ All backlinks (to ensure they still work)

### NICE TO HAVE:
- Schema.org structured data (if exists)
- Historical analytics data
- Social media metadata
- Image alt texts
- Internal linking structure

### CAN IMPROVE:
- Outdated content
- Poor page speed
- Missing schema markup
- Incomplete meta descriptions

---

## NEXT STEPS AFTER AUDIT:

1. **Create 301 Redirect File**
   - Map every old URL to new URL
   - Implement in Next.js middleware or vercel.json

2. **Preserve Meta Data**
   - Copy all title tags exactly (if they rank well)
   - Copy all meta descriptions
   - Improve where possible, but keep keywords

3. **Implement Structured Data**
   - Add Organization schema
   - Add LocalBusiness schema
   - Add Service schema

4. **Submit to Search Console**
   - Verify new site ownership
   - Submit new sitemap
   - Monitor for crawl errors

5. **Monitor Rankings**
   - Check rankings weekly for first month
   - Watch for any drops
   - Fix issues immediately

---

## EXPECTED TIMELINE:

- **Audit:** 4-6 hours
- **Data Organization:** 2-3 hours
- **Implementation:** 6-8 hours
- **Testing:** 2-3 hours
- **Total:** 14-20 hours

---

## SUCCESS CRITERIA:

After migration, you should see:
- ✅ Zero 404 errors in Search Console
- ✅ All important pages indexed within 1 week
- ✅ Rankings maintained or improved within 2 weeks
- ✅ Traffic levels maintained or increased
- ✅ No drop in conversions

---

**Last Updated:** 2025-10-30
**Status:** Ready to use for old site audit
