# Domain & SEO Strategy for Sweet Dreams

## Current Situation
- **sweetdreamsmusic.com** - Established with good SEO rankings
- **sweetdreamsprod.com** - New site, lower SEO score, will be taken down for this new site

## Recommended Strategy (Best for SEO)

### ✅ Option 1: Consolidate Everything on sweetdreamsprod.com (RECOMMENDED)

**Primary Domain:** sweetdreamsprod.com

**Setup:**
1. Launch the new Sweet Dreams site (Music + Media) on **sweetdreamsprod.com**
2. Set up a **301 Permanent Redirect** from sweetdreamsmusic.com → sweetdreamsprod.com

**Why This is Best:**
- ✅ Preserves 90-99% of SEO value from sweetdreamsmusic.com
- ✅ All link equity transfers to the new domain
- ✅ Search engines understand this is a permanent move
- ✅ Stronger domain authority on ONE site vs splitting it
- ✅ Easier to manage (one site, one analytics, one codebase)
- ✅ Better for building future SEO on the unified brand

**How 301 Redirects Work:**
- Google and other search engines pass almost all "link juice" through 301 redirects
- Your existing backlinks to sweetdreamsmusic.com will benefit sweetdreamsprod.com
- Rankings will transfer over (may take 2-4 weeks to fully migrate)
- Users typing sweetdreamsmusic.com automatically go to sweetdreamsprod.com

### ❌ Option 2: Keep Separate Domains (NOT Recommended)

Using sweetdreamsmusic.com for /music and sweetdreamsprod.com for /media:
- ❌ Splits SEO authority between two domains
- ❌ Duplicate content issues if not handled carefully
- ❌ More complex setup and maintenance
- ❌ Harder to build unified brand authority
- ❌ More expensive (hosting, SSL, DNS for both)

## Implementation Steps

### Phase 1: Launch on sweetdreamsprod.com
1. Deploy this Next.js site to Vercel
2. Configure domain: **sweetdreamsprod.com**
3. Set up SSL certificate (Vercel handles automatically)
4. Verify domain in Resend for emails

### Phase 2: Preserve SEO from sweetdreamsmusic.com
1. Keep sweetdreamsmusic.com registered (don't let it expire!)
2. Set up 301 redirect:
   - If using Vercel: Add sweetdreamsmusic.com as a domain, set it to redirect
   - If using DNS: Set up redirect at your DNS provider
   - If using old host: Keep minimal hosting just for redirect

### Phase 3: Submit to Google
1. Add both domains to Google Search Console
2. Use "Change of Address" tool in Search Console
   - Old site: sweetdreamsmusic.com
   - New site: sweetdreamsprod.com
3. Update your Google Business Profile with new domain
4. Update any directories/listings with new URL

### Phase 4: Update Backlinks (if possible)
1. Reach out to sites linking to sweetdreamsmusic.com
2. Ask them to update to sweetdreamsprod.com
3. Priority: High-value backlinks (music blogs, press, industry sites)

## Setting Up 301 Redirect on Vercel

### Option A: Add as Additional Domain
1. In Vercel, go to your project settings
2. Add `sweetdreamsmusic.com` as a domain
3. In domain settings, choose "Redirect to sweetdreamsprod.com"
4. Vercel automatically creates 301 redirects

### Option B: DNS Level Redirect
If you prefer to redirect at DNS level:
1. Keep sweetdreamsmusic.com with your DNS provider
2. Use their redirect/forwarding feature
3. Set up 301 redirect to sweetdreamsprod.com

## Long-term Benefits

**Year 1:**
- Unified SEO efforts on sweetdreamsprod.com
- All new content, backlinks, and authority build on one domain
- Easier to rank for "Sweet Dreams" + service keywords

**Year 2+:**
- sweetdreamsprod.com becomes the authoritative domain
- Can let sweetdreamsmusic.com redirect indefinitely (recommended)
- Or can let it expire after SEO fully transferred (not recommended - keep as redirect)

## Additional SEO Considerations

### Preserve Important Pages
If sweetdreamsmusic.com had specific pages with good rankings:
- `/services` → Redirect to `sweetdreamsprod.com/music`
- `/booking` → Redirect to `sweetdreamsprod.com/music#booking`
- `/about` → Redirect to `sweetdreamsprod.com/music`

This can be done with Vercel's redirect rules.

### Update Structured Data
Make sure to update:
- Google Business Profile
- Social media profiles
- Email signatures
- Business cards
- Any marketing materials

## Summary

**DO THIS:**
1. ✅ Launch on sweetdreamsprod.com
2. ✅ 301 redirect sweetdreamsmusic.com → sweetdreamsprod.com
3. ✅ Keep redirect active permanently
4. ✅ Use Google Search Console "Change of Address" tool
5. ✅ Update business listings with new domain

**DON'T DO THIS:**
1. ❌ Split content across two domains
2. ❌ Let sweetdreamsmusic.com expire
3. ❌ Use 302 temporary redirects (must be 301 permanent)
4. ❌ Forward to different pages (keep URL structure similar)

This strategy will preserve your SEO investment while building a stronger, unified brand presence!
