# SWEET DREAMS MUSIC LLC - PROJECT BRIEF

**Last Updated:** 2025-10-30
**Project Status:** Active Development → Pre-Production Testing
**Production URL:** https://sweet-dreams-phi.vercel.app (will become sweetdreamsmusic.com)

---

## PROJECT OVERVIEW

### Business Identity
**Sweet Dreams Music & Media** is a professional recording studio and media production company located in Fort Wayne, Indiana. The business offers:

- Professional recording studio services ($50/hour)
- Music production and mixing
- Media production (video, podcasts, etc.)
- Artist development services

**Physical Location:**
3943 Parnell Ave
Fort Wayne, IN 46805
Phone: (260) 420-6397
Email: jayvalleo@sweetdreamsmusic.com

**Brand Tagline:** "Develop Your Brand, Your Way"

### Project Goal
This is a **complete rebuild** of Sweet Dreams' web presence, replacing an older version of sweetdreamsmusic.com with a modern, full-featured booking and business platform called **"Dream Suite"**.

Key objectives:
1. **Replace old website** while maintaining/improving SEO rankings
2. **Enable online booking** for studio sessions with Stripe payments
3. **Automate business operations** (booking confirmations, reminders, etc.)
4. **Capture leads** through optimized contact forms and CTAs
5. **Track conversions** with comprehensive analytics
6. **Scale the business** through improved UX and automation

---

## TECHNICAL STACK

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules + IBM Plex Mono font
- **UI Patterns:** Server Components + Client Components

### Backend & Services
- **Hosting:** Vercel Pro Plan (~$20/month)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (email/password)
- **Storage:** Supabase Storage (for profile photos)
- **Payments:** Stripe (Live Mode)
- **Email:** Resend (transactional emails)
- **Video Hosting:** Cloudflare Stream

### Analytics & Tracking (In Progress)
- **Tag Manager:** Google Tag Manager (GTM-NX7KJL3N) ✅ INSTALLED
- **Analytics:** Google Analytics 4 ⏳ NEEDS ID
- **Ads Tracking:** Facebook Pixel ⏳ NEEDS ID
- **Heatmaps:** Microsoft Clarity ⏳ NEEDS ID
- **B2B Tracking:** LinkedIn Insight Tag ⏳ NEEDS ID

---

## CURRENT FEATURES (WORKING)

### 1. User Authentication & Profiles
- Email/password signup and login via Supabase
- Profile page with:
  - User info (name, email, phone)
  - Artist name/alias field
  - Profile photo upload (max 2MB, stored in Supabase Storage)
  - Booking history
  - Loading state fix (prevents incomplete renders)

**Files:**
- `app/profile/page.tsx`
- `app/profile/profile.module.css`

### 2. Studio Booking System
- Interactive calendar showing available time slots
- Real-time availability checking
- Dynamic pricing:
  - Base rate: $50/hour
  - Same-day booking fee: +$10/hour
  - After-hours fee (10pm-8am): +$10/hour
- Session durations: 1, 2, 3, or 4 hours
- Minimum deposit: $50 (remainder due at session)
- First-time user detection (shows promo code banner)

**Files:**
- `components/music/BookingCalendar.tsx`
- `components/music/BookingCalendar.module.css`

### 3. Stripe Payment Integration
- Stripe Checkout for deposit payments
- Webhook handling (`checkout.session.completed`)
- Booking status flow:
  - `pending_deposit` → `confirmed` (after payment)
- Promo code support:
  - Code: `FIRSTTIME40`
  - Discount: 40% off first session
  - One-time use per customer
  - Expires: Dec 31, 2025

**Files:**
- `app/api/webhooks/stripe/route.ts`
- `app/api/bookings/create-checkout/route.ts`

### 4. Email Notifications (via Resend)
- **Booking Confirmation (Customer):** Sent after successful payment
- **Booking Notification (Admin):** Sent to jayvalleo@sweetdreamsmusic.com
- **Contact Form Confirmation (Customer):** Sent after form submission
- **Contact Form Notification (Admin):** Sent to admin with form details

**Email Templates:**
- `lib/emails/customer-booking-confirmation.tsx`
- `lib/emails/admin-booking-notification.tsx`
- `lib/emails/contact-form-confirmation.tsx`
- `lib/emails/contact-form-notification.tsx`

**Email Configuration:**
- From: bookings@sweetdreamsmusic.com
- To: jayvalleo@sweetdreamsmusic.com
- Provider: Resend
- Domain: sweetdreamsmusic.com (verified)

### 5. Contact Form API (NEW - Ready to Deploy)
- **Endpoint:** `/api/contact/submit`
- **Purpose:** Replace Formspree with Resend-based contact forms
- **Features:**
  - Email validation
  - Message length validation (10-5000 chars)
  - Admin notification email
  - Customer confirmation email
- **Action Required:** Update existing contact forms to use new endpoint

**Files:**
- `app/api/contact/submit/route.ts`

### 6. Promo Code Display (40% Off Campaign)
Promo banners displaying "FIRSTTIME40" code on:
1. **Booking Calendar** - When first-time user books
2. **Music Page** - Gold banner at top
3. **Solutions Page** - In music production section
4. **Homepage** - Gold banner at top

**Design:** Gold gradient banners with 🎉 emoji, black text, prominent code display

**Files:**
- `app/page.tsx` (homepage)
- `app/music/page.tsx` + `music.module.css`
- `app/solutions/page.tsx` + `page.module.css`
- `components/music/MusicHeroAnimated.tsx` (pricing updated to $50/HR)

### 7. Google Tag Manager
- **Status:** INSTALLED ✅
- **ID:** GTM-NX7KJL3N
- **Location:** `app/layout.tsx`
- Installed both script and noscript versions as per Google instructions

---

## PENDING FEATURES & IMPROVEMENTS

### High Priority

#### 1. Analytics Implementation
**Status:** Tracking codes ready, need IDs from user

**Required IDs:**
- `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` (Google Analytics 4)
- `NEXT_PUBLIC_FB_PIXEL_ID=1234567890123456` (Facebook Pixel)
- `NEXT_PUBLIC_CLARITY_ID=abcdefghij` (Microsoft Clarity)
- `NEXT_PUBLIC_LINKEDIN_PARTNER_ID=1234567` (LinkedIn, optional)

**Implementation Steps:**
1. User provides tracking IDs
2. Add IDs to `.env.local`
3. Create `lib/analytics/` directory with tracking utilities
4. Install tracking scripts in `app/layout.tsx`
5. Add conversion tracking to booking flow
6. Test all tracking with browser extensions

**Reference:** See `.claude/agents/analytics-tracking-agent.md` for detailed implementation

#### 2. 1-Hour Session Reminder Emails
**Status:** Not implemented

**Requirements:**
- Send email 1 hour before session start time
- Include session details (time, location, what to bring)
- Use Vercel Cron jobs to check upcoming sessions
- Mark reminders as "sent" to avoid duplicates

**Implementation:**
1. Create `/api/cron/send-reminders` route
2. Query bookings where `start_time` is ~1 hour away
3. Filter out bookings where reminder already sent
4. Send reminder emails via Resend
5. Update booking record with `reminder_sent: true`
6. Add cron job to `vercel.json`

#### 3. Booking Cancellation Feature
**Status:** Not implemented

**Requirements:**
- Users can cancel bookings from profile page
- Cancellation allowed if booking is 24+ hours away
- If <24 hours, show "Contact us to cancel" message
- Refund handling via Stripe API
- Send cancellation confirmation emails

**Implementation:**
1. Add "Cancel Booking" button to profile bookings
2. Create `/api/bookings/cancel` endpoint
3. Check if cancellation is within policy (24hr rule)
4. Process Stripe refund if applicable
5. Update booking status to "cancelled"
6. Send cancellation emails (customer + admin)

#### 4. Supabase Storage Bucket Setup
**Status:** Code ready, bucket needs creation

**Action Required:**
1. Go to Supabase Dashboard → Storage
2. Create new bucket: `profile-photos`
3. Set bucket to **public**
4. Configure upload policies:
   - Allow authenticated users to upload
   - Allow public read access
   - Restrict file size to 2MB
   - Allow image types only (image/*)

#### 5. SEO Implementation
**Status:** Documented, not implemented

**Required Tasks:**
- Add schema.org JSON-LD structured data (Organization, LocalBusiness, Service)
- Generate XML sitemap with next-sitemap
- Create/optimize robots.txt
- Setup Google Search Console
- Verify Google Business Profile claim
- Optimize meta tags on all pages
- Add Open Graph and Twitter Card tags
- Implement breadcrumb navigation

**Reference:** See `.claude/agents/seo-migration-agent.md` and `seo-perfect-score-agent.md`

#### 6. Contact Form Integration
**Status:** API ready, forms need updating

**Action Required:**
1. Identify all contact forms on site
2. Update forms to POST to `/api/contact/submit`
3. Add loading states and success/error messages
4. Test form submission flow
5. Verify emails arrive
6. Cancel Formspree subscription

### Medium Priority

#### 7. Domain Consolidation
**Status:** Needs planning

**Action Required:**
1. List all domains owned by Sweet Dreams
2. Configure DNS to point all domains to sweetdreamsmusic.com
3. Setup 301 redirects for SEO preservation
4. Verify SSL certificates working on all domains

#### 8. Content Migration from Old Site
**Status:** Needs assessment

**Action Required:**
1. Audit old sweetdreamsmusic.com content
2. Identify valuable pages/content to migrate
3. Map old URLs to new URLs
4. Create 301 redirect rules
5. Migrate content while improving
6. Preserve meta titles/descriptions that rank well

#### 9. Conversion Rate Optimization (CRO)
**Status:** Documented strategies

**Opportunities:**
- Add trust signals (testimonials, reviews, badges)
- Optimize CTAs (clarity, placement, urgency)
- Add exit-intent popups for lead capture
- Create lead magnets (free mixing tips PDF, etc.)
- Implement social proof widgets
- Add live chat or chatbot
- Create landing pages for specific services

**Reference:** See `.claude/agents/conversion-lead-generation-agent.md`

#### 10. Performance Optimization
**Status:** Needs audit

**Target Metrics:**
- Lighthouse Score: 90+
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

**Optimization Tasks:**
- Verify all images use Next.js Image component
- Enable lazy loading for below-fold content
- Optimize bundle size (check heavy dependencies)
- Implement font preloading
- Minimize render-blocking resources
- Enable Vercel Analytics

### Low Priority

#### 11. Additional Features
- Google Calendar sync for admin
- iCal export for customers
- Email marketing integration (Mailchimp/ConvertKit)
- CRM integration (HubSpot, Pipedrive)
- Live chat widget
- Blog/content marketing section
- Customer testimonials page
- Portfolio/showcase page
- Referral program

---

## ARCHITECTURE & FILE STRUCTURE

### Key Directories

```
SweetDreams/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── bookings/
│   │   │   └── create-checkout/  # Create Stripe checkout
│   │   ├── contact/
│   │   │   └── submit/           # Contact form handler (NEW)
│   │   ├── webhooks/
│   │   │   └── stripe/           # Stripe webhook handler
│   │   └── cron/
│   │       └── send-reminders/   # TODO: Reminder emails
│   ├── (auth)/                   # Auth pages (login, signup)
│   ├── profile/                  # User profile page
│   ├── music/                    # Music/studio booking page
│   ├── solutions/                # Services page
│   ├── media/                    # Media production page
│   └── layout.tsx                # Root layout (GTM installed here)
├── components/
│   ├── music/
│   │   ├── BookingCalendar.tsx   # Main booking component
│   │   └── MusicHeroAnimated.tsx # Hero section
│   ├── Nav.tsx                   # Main navigation
│   ├── MobileNav.tsx             # Mobile navigation
│   └── Footer.tsx                # Site footer
├── lib/
│   ├── emails/                   # Email templates (React Email)
│   │   ├── resend.ts             # Resend configuration
│   │   ├── customer-booking-confirmation.tsx
│   │   ├── admin-booking-notification.tsx
│   │   ├── contact-form-confirmation.tsx (NEW)
│   │   └── contact-form-notification.tsx (NEW)
│   └── analytics/                # TODO: Analytics utilities
├── utils/
│   └── supabase/                 # Supabase clients
│       ├── client.ts             # Client-side
│       ├── server.ts             # Server-side
│       └── service-role.ts       # Admin client
├── .claude/
│   ├── agents/                   # AI agent instructions
│   │   ├── seo-migration-agent.md
│   │   ├── seo-perfect-score-agent.md
│   │   ├── analytics-tracking-agent.md
│   │   └── conversion-lead-generation-agent.md
│   ├── CLAUDE.md                 # Basic project instructions
│   ├── PROJECT-BRIEF.md          # This document
│   └── PRE-DEPLOYMENT-CHECKLIST.md
└── .env.local                    # Environment variables (NOT in git)
```

### Database Schema (Supabase)

**`bookings` table:**
```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- first_name (text)
- last_name (text)
- artist_name (text)
- customer_email (text)
- customer_phone (text)
- start_time (timestamp)
- end_time (timestamp)
- duration (integer) -- hours
- total_amount (integer) -- cents
- deposit_amount (integer) -- cents
- same_day_fee (integer) -- cents
- after_hours_fee (integer) -- cents
- status (text) -- 'pending_deposit', 'confirmed', 'cancelled'
- stripe_session_id (text)
- stripe_payment_intent_id (text)
- reminder_sent (boolean) -- TODO: add this column
- created_at (timestamp)
- updated_at (timestamp)
```

**`auth.users` table (Supabase managed):**
- Standard Supabase auth fields
- `user_metadata` JSON includes:
  - `artist_name` (string)
  - `profile_photo_url` (string)

---

## BUSINESS REQUIREMENTS

### Booking Business Rules
1. **Minimum deposit:** $50 (remainder due at session)
2. **Pricing:**
   - Base: $50/hour
   - Same-day booking: +$10/hour
   - After-hours (10pm-8am): +$10/hour
3. **Cancellation policy:** 24+ hours notice for full refund
4. **Session durations:** 1, 2, 3, or 4 hours
5. **Operating hours:** 24/7 booking available (after-hours fee applies)

### Email Communication
- **Booking confirmation:** Sent immediately after payment
- **1-hour reminder:** Sent 1 hour before session (TODO)
- **Admin notifications:** Sent for all bookings and contact forms
- **From address:** bookings@sweetdreamsmusic.com
- **Reply-to:** jayvalleo@sweetdreamsmusic.com

### Promotional Campaign
- **Current promo:** FIRSTTIME40 (40% off first session)
- **Eligibility:** First booking only, new accounts
- **Expiration:** December 31, 2025
- **Display:** Show banner to users with no booking history

---

## SEO & MARKETING STRATEGY

### Current SEO Status
- **Old site:** sweetdreamsmusic.com (same domain)
- **Goal:** Maintain or improve existing rankings
- **Strategy:** Preserve URL structure, migrate content, improve technical SEO

### Target Keywords (Based on Business)
- "recording studio Fort Wayne"
- "music production Fort Wayne Indiana"
- "professional recording studio near me"
- "music studio booking Fort Wayne"
- "audio recording services Indiana"

### Content Strategy
1. **Service pages:** Music, media, artist development
2. **Location targeting:** Fort Wayne, Indiana focus
3. **Blog/resources:** (Future) Music production tips, artist guides
4. **Portfolio:** (Future) Showcase client work
5. **Testimonials:** Social proof for conversion

### Analytics & Tracking Goals
1. **Pageviews:** Track page traffic and popular pages
2. **Conversions:**
   - Completed bookings (Purchase event)
   - Contact form submissions (Lead event)
   - Account signups (CompleteRegistration event)
3. **User behavior:** Heatmaps, session recordings (Clarity)
4. **Ad performance:** Facebook Pixel for retargeting
5. **Attribution:** UTM parameters for campaign tracking

### Marketing Channels
- **Organic Search (SEO):** Primary traffic source
- **Facebook/Instagram Ads:** Retargeting, local awareness
- **Google Ads:** (Future) Search ads for high-intent keywords
- **Email Marketing:** (Future) Newsletter, promotions
- **Social Media:** Instagram, TikTok (behind-the-scenes content)
- **Google Business Profile:** Local SEO, reviews

---

## ENVIRONMENT VARIABLES

### Currently Configured (in `.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fweeyjnqwxywmpmnqpts.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<redacted>
SUPABASE_SERVICE_ROLE_KEY=<redacted>

# Stripe (LIVE KEYS)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_<redacted>
STRIPE_SECRET_KEY=sk_live_<redacted>
STRIPE_WEBHOOK_SECRET=whsec_V8gLU8pDsHHBhEBr0TSS74Q7KMdQhLrc

# Resend
RESEND_API_KEY=re_V7JFKxYp_FEvvonpMuJDNvDsMxbE1WnhH

# Site URLs
NEXT_PUBLIC_BASE_URL=https://sweet-dreams-phi.vercel.app
NEXT_PUBLIC_SITE_URL=https://sweet-dreams-phi.vercel.app

# Cron
CRON_SECRET=sweetdreams_secure_cron_key_2025_prod

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=<redacted>
CLOUDFLARE_STREAM_API_TOKEN=<redacted>
```

### Needs to be Added

```env
# Analytics (waiting for user to provide IDs)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=1234567890123456
NEXT_PUBLIC_CLARITY_ID=abcdefghij
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=1234567
```

---

## GIT & DEPLOYMENT

### Current Status
- **Branch:** main
- **Remote:** GitHub
- **Hosting:** Vercel Pro
- **Auto-deploy:** Enabled on push to main
- **Domain:** sweet-dreams-phi.vercel.app (temporary, will switch to sweetdreamsmusic.com)

### Recent Commits
```
e8b86fd Add 40% off promo code across all pages and update pricing
59d754f Add profile photo upload and artist name field with loading state fix
20195aa Fix TypeScript error in MobileNav ref callback
ac940a9 Add email fixes, webhook logging, booking features, and profile updates
3d71250 Fix navigation oval to center on links instead of click position
```

### Deployment Process
1. Push to GitHub main branch
2. Vercel automatically deploys
3. Check Vercel deployment logs
4. Test live site
5. Monitor Stripe webhooks in dashboard

### Important Notes
- **DO NOT push .env.local to git** (already in .gitignore)
- **Test Stripe webhooks** after each deployment
- **Clear Vercel cache** if assets don't update

---

## KNOWN ISSUES & BUGS

### Recently Fixed ✅
1. ~~Profile page loading incomplete (required refresh)~~ - Fixed with `dataLoaded` state
2. ~~TypeScript error in MobileNav ref callback~~ - Fixed with proper function syntax
3. ~~Booking emails using wrong domain~~ - Fixed: now using sweetdreamsmusic.com
4. ~~Booking status stuck at pending_deposit~~ - Fixed with proper webhook handling
5. ~~Promo code showing 20% instead of 40%~~ - Fixed across all pages

### Currently Known Issues
- None reported

### Areas Needing Testing
- Profile photo upload (bucket needs creation)
- Contact form API (ready but not integrated)
- Booking cancellation (not yet implemented)
- Session reminders (not yet implemented)
- Mobile responsiveness on all pages

---

## QUESTIONS FOR USER / NEEDS CLARIFICATION

1. **Analytics IDs:** Need GA4, Facebook Pixel, Clarity IDs
2. **Domain migration timeline:** When to switch from sweet-dreams-phi.vercel.app to sweetdreamsmusic.com?
3. **Old site content:** Which pages/content to migrate? URL mapping?
4. **Formspree cancellation:** After contact form testing, OK to cancel?
5. **Email marketing:** Want to setup newsletter/email campaigns? Which platform?
6. **CRM integration:** Need CRM for lead management? Which platform?
7. **Blog/content:** Want to add blog section for content marketing?
8. **Social media:** Link to existing social profiles? Need social sharing features?

---

## SUCCESS CRITERIA

### Phase 1: Core Features (COMPLETE ✅)
- [x] User authentication working
- [x] Booking system functional
- [x] Stripe payments processing
- [x] Email confirmations sending
- [x] Profile page with photo upload
- [x] Promo code campaign live

### Phase 2: Analytics & Tracking (IN PROGRESS)
- [x] Google Tag Manager installed
- [ ] Google Analytics 4 configured
- [ ] Facebook Pixel installed
- [ ] Microsoft Clarity installed
- [ ] Conversion tracking implemented
- [ ] Contact form migrated from Formspree

### Phase 3: SEO & Performance (PENDING)
- [ ] Schema.org structured data added
- [ ] XML sitemap generated and submitted
- [ ] Google Search Console configured
- [ ] Lighthouse score 90+
- [ ] Core Web Vitals passing
- [ ] Google Business Profile optimized

### Phase 4: Business Operations (PENDING)
- [ ] 1-hour reminder emails working
- [ ] Booking cancellation feature live
- [ ] Email marketing platform integrated
- [ ] CRM integration complete
- [ ] All domains pointing to sweetdreamsmusic.com

### Phase 5: Launch (PENDING)
- [ ] All items in PRE-DEPLOYMENT-CHECKLIST.md complete
- [ ] Old site content migrated
- [ ] 301 redirects configured
- [ ] Live site thoroughly tested
- [ ] Public launch announced

---

## AGENT INSTRUCTIONS

When working on this project, Claude Code agents should:

1. **Preserve Working Features:** Never break booking, payments, or email systems
2. **Follow Existing Patterns:** Match coding style, use CSS Modules, TypeScript types
3. **Test Thoroughly:** Especially booking flow, payments, and emails
4. **Update Documentation:** Keep this brief and checklist updated
5. **Ask Before Major Changes:** Confirm with user before architectural changes
6. **Reference Agent Guides:** Use specialized agents in `.claude/agents/` for their domains
7. **Track Progress:** Use TodoWrite tool for multi-step tasks
8. **Security First:** Never expose API keys, validate all user inputs
9. **Mobile First:** Ensure all features work on mobile devices
10. **SEO Conscious:** Consider SEO impact of all content/structure changes

---

## RESOURCES & REFERENCES

### Documentation
- **Next.js 15:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Stripe:** https://stripe.com/docs
- **Resend:** https://resend.com/docs
- **React Email:** https://react.email/docs

### Agent Guides (in `.claude/agents/`)
- `seo-migration-agent.md` - SEO preservation during migration
- `seo-perfect-score-agent.md` - Achieving 12/10 SEO scores
- `analytics-tracking-agent.md` - Multi-platform tracking implementation
- `conversion-lead-generation-agent.md` - CRO and lead generation strategies

### Checklists
- `PRE-DEPLOYMENT-CHECKLIST.md` - Comprehensive pre-launch checklist

### External Tools
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Google Search Console:** https://search.google.com/search-console
- **Google Tag Manager:** https://tagmanager.google.com
- **Facebook Events Manager:** https://business.facebook.com/events_manager

---

## CONTACT & SUPPORT

**Project Owner:** Jay Valleo
**Email:** jayvalleo@sweetdreamsmusic.com
**Phone:** (260) 420-6397

**Technical Support:**
- Vercel: https://vercel.com/support
- Stripe: https://support.stripe.com
- Supabase: https://supabase.com/support

---

**END OF PROJECT BRIEF**

This document should be updated as the project evolves. Last updated: 2025-10-30
