# PRE-DEPLOYMENT CHECKLIST

This document tracks all configurations, tracking IDs, and setup tasks required before deploying Sweet Dreams Music LLC to production.

**Last Updated:** 2025-10-30

---

## TRACKING & ANALYTICS

### ✅ Google Tag Manager
- **Status:** CONFIGURED
- **ID:** GTM-NX7KJL3N
- **Location:** `app/layout.tsx`
- **Notes:** Installed in head and body as per Google instructions

### ⏳ Google Analytics 4 (GA4)
- **Status:** PENDING - NEEDS ID
- **ID:** `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
- **Location:** Will configure via GTM or directly in layout
- **Setup Steps:**
  1. Create GA4 property in Google Analytics
  2. Get measurement ID (G-XXXXXXXXXX)
  3. Add to `.env.local` as `NEXT_PUBLIC_GA_ID`
  4. Install GA4 script or configure via GTM
  5. Verify tracking in GA4 real-time reports

### ⏳ Facebook Pixel
- **Status:** PENDING - NEEDS ID
- **ID:** `NEXT_PUBLIC_FB_PIXEL_ID=1234567890123456`
- **Location:** Will add to `lib/analytics/facebook-pixel.ts`
- **Setup Steps:**
  1. Create Facebook Pixel in Meta Events Manager
  2. Get Pixel ID (16-digit number)
  3. Add to `.env.local` as `NEXT_PUBLIC_FB_PIXEL_ID`
  4. Install pixel script in layout
  5. Configure standard events (PageView, Purchase, Lead, CompleteRegistration)
  6. Verify with Facebook Pixel Helper Chrome extension

### ⏳ Microsoft Clarity
- **Status:** PENDING - NEEDS ID
- **ID:** `NEXT_PUBLIC_CLARITY_ID=abcdefghij`
- **Location:** Will add to layout
- **Setup Steps:**
  1. Create project at https://clarity.microsoft.com
  2. Get project ID
  3. Add to `.env.local` as `NEXT_PUBLIC_CLARITY_ID`
  4. Install Clarity script
  5. Verify recordings are capturing

### ⏳ LinkedIn Insight Tag
- **Status:** PENDING - NEEDS ID (if targeting B2B)
- **ID:** `NEXT_PUBLIC_LINKEDIN_PARTNER_ID=1234567`
- **Location:** Will add to layout
- **Setup Steps:**
  1. Create LinkedIn Campaign Manager account
  2. Get Partner ID from Insight Tag
  3. Add to `.env.local`
  4. Install tracking code
  5. Verify with LinkedIn helper tool

---

## EMAIL & COMMUNICATION

### ✅ Resend Email Service
- **Status:** CONFIGURED & WORKING
- **API Key:** Configured in `.env.local`
- **Domain:** sweetdreamsmusic.com (verified)
- **Email From:** bookings@sweetdreamsmusic.com
- **Email To (Admin):** jayvalleo@sweetdreamsmusic.com
- **Templates Created:**
  - ✅ Booking confirmation (customer)
  - ✅ Booking notification (admin)
  - ✅ Contact form notification (admin)
  - ✅ Contact form confirmation (customer)
- **Features:**
  - ✅ Booking confirmation emails
  - ✅ Contact form submissions
  - ⏳ 1-hour reminder emails (need to implement cron)

### ⏳ Contact Form Migration
- **Status:** READY TO DEPLOY
- **Old Service:** Formspree (needs cancellation)
- **New Service:** Resend (implemented)
- **API Endpoint:** `/api/contact/submit`
- **Action Required:**
  - Update contact forms to POST to new endpoint
  - Test form submission flow
  - Cancel Formspree subscription after verification

---

## PAYMENT & BOOKING

### ✅ Stripe (Live Mode)
- **Status:** CONFIGURED & WORKING
- **Environment:** LIVE
- **Webhook:** Configured and verified
- **Coupon Code:** FIRSTTIME40 (40% off, one-time use)
- **Features:**
  - ✅ Studio booking payments
  - ✅ Deposit collection ($50 minimum)
  - ✅ Webhook handling
  - ✅ Email confirmations after payment

### ✅ Supabase
- **Status:** CONFIGURED & WORKING
- **Database:** Bookings, user profiles working
- **Auth:** Email/password authentication working
- **Storage:** Profile photos bucket
- **Action Required:**
  - ⏳ Create `profile-photos` bucket (if not exists)
  - ⏳ Set bucket to public
  - ⏳ Configure upload policies

---

## SEO & STRUCTURED DATA

### ⏳ Schema.org Structured Data
- **Status:** PENDING IMPLEMENTATION
- **Required Types:**
  - Organization schema (business info)
  - LocalBusiness schema (location, hours)
  - Service schema (studio services)
  - Review schema (testimonials)
  - Product schema (service offerings)
- **Implementation:** Add JSON-LD scripts to relevant pages

### ⏳ XML Sitemap
- **Status:** PENDING GENERATION
- **Tool:** Can use next-sitemap package
- **Action Required:**
  1. Install `next-sitemap`
  2. Configure sitemap generation
  3. Submit to Google Search Console
  4. Add sitemap URL to robots.txt

### ⏳ robots.txt
- **Status:** NEEDS CREATION
- **Location:** `public/robots.txt`
- **Required Content:**
  - Allow all crawlers
  - Link to sitemap
  - Block admin/api routes if needed

### ⏳ Google Search Console
- **Status:** PENDING SETUP
- **Action Required:**
  1. Verify domain ownership
  2. Submit sitemap
  3. Monitor indexing status
  4. Check for crawl errors

### ⏳ Google Business Profile
- **Status:** UNKNOWN - NEED TO VERIFY
- **Business:** Sweet Dreams Music & Media
- **Address:** 3943 Parnell Ave, Fort Wayne, IN 46805
- **Phone:** (260) 420-6397
- **Action Required:**
  1. Claim/verify listing
  2. Add photos
  3. Set business hours
  4. Link to website
  5. Encourage reviews

---

## DOMAIN & DNS

### ⏳ Domain Consolidation
- **Primary Domain:** sweetdreamsmusic.com
- **Current Status:** Need to verify all owned domains
- **Action Required:**
  1. List all owned domains
  2. Point all domains to sweetdreamsmusic.com
  3. Setup 301 redirects
  4. Verify DNS propagation

### ⏳ SSL Certificate
- **Status:** AUTO (Vercel handles this)
- **Verify:** Ensure HTTPS working on all pages

---

## PERFORMANCE & OPTIMIZATION

### ⏳ Core Web Vitals
- **Status:** NEEDS TESTING
- **Tools:**
  - Google PageSpeed Insights
  - Lighthouse
  - WebPageTest
- **Target Scores:**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
  - PageSpeed Score: 90+

### ⏳ Image Optimization
- **Status:** REVIEW NEEDED
- **Action Required:**
  - Verify all images use Next.js Image component
  - Check image sizes and compression
  - Add lazy loading where appropriate
  - Optimize hero images

### ⏳ Cloudflare Integration
- **Status:** PARTIAL (Stream configured)
- **Cloudflare Stream:** Configured for video hosting
- **Action Required:**
  - Verify Cloudflare Stream working
  - Consider adding Cloudflare CDN for static assets

---

## SECURITY & COMPLIANCE

### ✅ Environment Variables
- **Status:** CONFIGURED
- **Location:** `.env.local` (not in git)
- **Secured Keys:**
  - Supabase keys
  - Stripe keys
  - Resend API key
  - Cron secret

### ⏳ Privacy Policy
- **Status:** NEEDS REVIEW/UPDATE
- **Required Disclosures:**
  - Cookie usage (GTM, GA4, Facebook Pixel)
  - Data collection practices
  - Third-party services
  - User rights (GDPR, CCPA)

### ⏳ Terms of Service
- **Status:** NEEDS REVIEW
- **Required Content:**
  - Booking cancellation policy (24hr rule)
  - Payment terms
  - Studio rules
  - Liability disclaimers

### ⏳ Cookie Consent Banner
- **Status:** PENDING (required for EU/GDPR)
- **Action Required:**
  - Install cookie consent library
  - List all cookies used
  - Allow opt-in/opt-out
  - Respect user preferences

---

## BACKUP & MIGRATION

### ⏳ Old Site SEO Data Export
- **Status:** PENDING
- **Old Domain:** sweetdreamsmusic.com (same domain, new build)
- **Action Required:**
  1. Export all URL structure from old site
  2. Map old URLs to new URLs
  3. Create 301 redirect rules
  4. Export meta titles/descriptions
  5. Export all content
  6. Document backlink sources

### ⏳ Content Migration
- **Status:** REVIEW NEEDED
- **Action Required:**
  - Review all old site pages
  - Identify missing content
  - Migrate important pages
  - Preserve URL structure or redirect

---

## BUSINESS TOOLS

### ⏳ CRM Integration
- **Status:** NOT CONFIGURED
- **Options:** HubSpot, Salesforce, Pipedrive
- **Action Required:**
  - Decide on CRM platform
  - Setup integration
  - Connect contact forms
  - Setup lead tracking

### ⏳ Email Marketing
- **Status:** NOT CONFIGURED
- **Options:** Mailchimp, ConvertKit, Klaviyo
- **Action Required:**
  - Choose platform
  - Create welcome sequence
  - Setup newsletter signup
  - Import existing contacts

### ⏳ Calendar Integration
- **Status:** CUSTOM BUILT (good!)
- **Current:** Custom booking calendar with Supabase
- **Enhancement Ideas:**
  - Google Calendar sync
  - iCal export for customers
  - Automated reminders

---

## TESTING CHECKLIST

Before deploying to production, test ALL of the following:

### Booking Flow
- [ ] User can create account
- [ ] User can login/logout
- [ ] User can select date/time
- [ ] User can see available slots
- [ ] Same-day fee applies correctly
- [ ] After-hours fee applies correctly
- [ ] Promo code FIRSTTIME40 applies (40% off)
- [ ] Stripe checkout loads
- [ ] Payment processes successfully
- [ ] Booking status updates to "confirmed"
- [ ] Customer receives confirmation email
- [ ] Admin receives notification email
- [ ] Booking appears in profile

### Contact Forms
- [ ] Contact form validates inputs
- [ ] Form submits successfully
- [ ] Customer receives confirmation email
- [ ] Admin receives notification email
- [ ] Error messages display properly

### Profile Features
- [ ] Profile loads without refresh issues
- [ ] Profile photo upload works
- [ ] Artist name saves correctly
- [ ] Email displays correctly
- [ ] Bookings list shows all bookings

### Tracking & Analytics
- [ ] GTM fires correctly (verify in GTM preview)
- [ ] GA4 pageviews tracking (when configured)
- [ ] Facebook Pixel fires (when configured)
- [ ] Conversion events trigger properly
- [ ] Clarity recordings capture (when configured)

### Mobile Responsiveness
- [ ] All pages work on mobile
- [ ] Navigation works on mobile
- [ ] Forms work on mobile
- [ ] Booking calendar works on mobile
- [ ] Payment flow works on mobile

### Performance
- [ ] Run Lighthouse audit (target 90+)
- [ ] Check Core Web Vitals
- [ ] Test on slow 3G network
- [ ] Verify images lazy load
- [ ] Check bundle size

---

## DEPLOYMENT STEPS

When ready to deploy:

1. **Pre-deployment:**
   - [ ] Review this entire checklist
   - [ ] Complete all ✅ items
   - [ ] Address critical ⏳ items
   - [ ] Run all tests above

2. **Deploy:**
   - [ ] Push to GitHub main branch
   - [ ] Verify Vercel deployment succeeds
   - [ ] Check Vercel logs for errors

3. **Post-deployment:**
   - [ ] Test live site thoroughly
   - [ ] Verify all tracking is firing
   - [ ] Monitor error logs
   - [ ] Check email delivery
   - [ ] Test booking flow end-to-end

4. **Announce:**
   - [ ] Update DNS if needed
   - [ ] Announce new site to customers
   - [ ] Monitor for issues

---

## COST ANALYSIS

Current monthly costs:

### Active Services
- **Vercel Pro:** ~$20/month (confirmed)
- **Supabase:** Free tier (monitor usage)
- **Resend:** Free tier (monitor usage, may need paid plan)
- **Stripe:** Transaction fees only (2.9% + 30¢)

### To Cancel
- **Formspree:** Cancel after contact form migration complete

### Free Services
- **Google Analytics 4:** Free
- **Google Tag Manager:** Free
- **Google Search Console:** Free
- **Microsoft Clarity:** Free
- **Cloudflare Stream:** (need to verify billing)

### Potential Additions
- **Facebook Ads:** Budget TBD
- **Google Ads:** Budget TBD
- **Email Marketing Platform:** $0-50/month
- **CRM:** $0-100/month

---

## NOTES

- Keep this checklist updated as items are completed
- Mark ✅ when fully configured and tested
- Mark ⏳ for pending items
- Add new sections as needed
- This is a living document - update frequently
