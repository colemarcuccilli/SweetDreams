# Go-Live Checklist for Sweet Dreams

This document tracks everything that needs to be changed from testing/development setup to production when you're ready to go live with sweetdreamsprod.com.

---

## 🧪 CURRENT STATE (Testing/Development)

### Environment Variables (Vercel):
```
NEXT_PUBLIC_BASE_URL=https://sweet-dreams-phi.vercel.app
NEXT_PUBLIC_SITE_URL=https://sweet-dreams-phi.vercel.app
```

### Email Configuration:
- **File:** `lib/emails/resend.ts`
- **Current FROM_EMAIL:** `onboarding@resend.dev` (Resend test email)
- **Domain Verified in Resend:** None (using test email)

### Stripe:
- **Mode:** Test Mode
- **Keys:** Test keys (pk_test_... and sk_test_...)

### Domain:
- **Current Live Site:** sweetdreamsprod.com (old portfolio site - still live)
- **Testing URL:** Vercel preview URL

---

## 🚀 TO-DO FOR GO-LIVE

### [ ] 1. Update Environment Variables in Vercel

Change these in Vercel project settings → Environment Variables:

#### Update URLs:
```
NEXT_PUBLIC_BASE_URL=https://sweetdreamsprod.com
NEXT_PUBLIC_SITE_URL=https://sweetdreamsprod.com
```

#### Switch Stripe to Live Mode:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXXXX (get from Stripe dashboard)
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXXXXX (get from Stripe dashboard)
```

**How to get Stripe Live keys:**
1. Go to Stripe Dashboard
2. Toggle from "Test Mode" to "Live Mode" (top right)
3. Go to Developers → API Keys
4. Copy Publishable key and Secret key
5. Replace in Vercel

---

### [ ] 2. Verify Domain in Resend

**Steps:**
1. Go to https://resend.com dashboard
2. Navigate to "Domains"
3. Click "Add Domain"
4. Enter: `sweetdreamsprod.com`
5. Resend will show DNS records to add
6. Add these DNS records to your domain registrar:
   - SPF record (TXT)
   - DKIM record (TXT)
   - DMARC record (TXT) - optional but recommended
7. Wait for verification (usually 5-15 minutes)
8. Status will show "Verified" when ready

---

### [ ] 3. Update Email FROM Address

**File to edit:** `lib/emails/resend.ts`

**Change from:**
```typescript
export const FROM_EMAIL = 'Sweet Dreams Music <noreply@sweetdreamsprod.com>';
```

**Change to:**
```typescript
export const FROM_EMAIL = 'Sweet Dreams Music <noreply@sweetdreamsprod.com>';
```

**✅ Already Updated!** (Currently uses noreply@sweetdreamsprod.com)

**Commit this change and push to GitHub**

---

### [ ] 3.5. Update Email Template Logo URLs

**⚠️ CRITICAL:** Email templates currently use testing domain for logo images

**Files to update:**
1. `supabaseemails.md` - Update all logo URLs
2. Then copy updated templates to Supabase Dashboard → Authentication → Email Templates

**Change from:**
```html
<img src="https://sweet-dreams-phi.vercel.app/sweet-dreams-logo.jpg" ...>
```

**Change to:**
```html
<img src="https://sweetdreamsprod.com/sweet-dreams-logo.jpg" ...>
```

**Steps:**
1. Open `supabaseemails.md`
2. Find/Replace all instances of `sweet-dreams-phi.vercel.app` with `sweetdreamsprod.com`
3. Save file and commit to GitHub
4. Copy each updated HTML template from the file
5. Paste into corresponding Supabase email template
6. Test by signing up with a test account

**Templates to update in Supabase:**
- Confirm Signup
- Invite User
- Magic Link
- Change Email Address
- Reset Password
- Reauthentication

---

### [ ] 4. Set Up Stripe Webhooks (For Payment Confirmations)

**Why:** Currently bookings are marked as "pending_deposit" - webhooks will auto-update to "confirmed" when payment succeeds.

**Steps:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add Endpoint"
3. Enter URL: `https://sweetdreamsprod.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Add to Vercel environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXX
   ```

**Note:** Webhook endpoint already exists in the code at `app/api/webhooks/stripe/route.ts`

---

### [ ] 5. Point Domain to Vercel

**Steps:**
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter: `sweetdreamsprod.com`
4. Vercel will show you DNS records to add
5. Go to your domain registrar (where you bought sweetdreamsprod.com)
6. Update DNS records as Vercel instructs (usually A record or CNAME)
7. Wait for DNS propagation (can take up to 48 hours, usually much faster)
8. Vercel will automatically issue SSL certificate

---

### [ ] 6. Set Up 301 Redirect from sweetdreamsmusic.com

**Why:** Preserve SEO value from sweetdreamsmusic.com

**Steps:**
1. In Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter: `sweetdreamsmusic.com`
4. In the domain settings, set it to "Redirect to sweetdreamsprod.com"
5. Make sure redirect type is "Permanent (301)"

**Alternative (if you prefer DNS-level redirect):**
- Set up redirect at your DNS provider for sweetdreamsmusic.com
- Point to sweetdreamsprod.com with 301 redirect

---

### [ ] 7. Update Google Search Console

**Steps:**
1. Add `sweetdreamsprod.com` to Google Search Console
2. Verify ownership (Vercel makes this easy - follow their guide)
3. If sweetdreamsmusic.com is already in Search Console:
   - Use "Change of Address" tool
   - Select: Old site = sweetdreamsmusic.com, New site = sweetdreamsprod.com
4. Submit new sitemap for sweetdreamsprod.com

---

### [ ] 8. Update Business Listings

Update your website URL in:
- [ ] Google Business Profile
- [ ] Facebook/Instagram business pages
- [ ] LinkedIn company page
- [ ] Any music industry directories
- [ ] Email signature
- [ ] Business cards (for next print run)

---

### [ ] 9. Run Final Tests on Production

Before announcing the new site:

**Test Booking Flow:**
- [ ] Select date/time/duration
- [ ] Fill out form (use real email to test)
- [ ] Complete Stripe checkout with real card
- [ ] Verify booking saved to Supabase
- [ ] Verify admin email received at jayvalleo@sweetdreamsmusic.com
- [ ] Verify customer confirmation email received
- [ ] Check that FROM email shows `bookings@sweetdreamsprod.com`

**Test Other Features:**
- [ ] All pages load correctly
- [ ] Videos play (Cloudflare Stream)
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Forms submit correctly

---

### [ ] 10. Monitor After Launch

**First 24 Hours:**
- [ ] Check Vercel Analytics for traffic
- [ ] Monitor Stripe dashboard for payments
- [ ] Check Supabase for booking entries
- [ ] Monitor email delivery (Resend dashboard)
- [ ] Watch for any error logs in Vercel Functions

**First Week:**
- [ ] Monitor Google Search Console for any crawl errors
- [ ] Check that sweetdreamsmusic.com redirect is working
- [ ] Verify SEO rankings are transferring

---

## 📋 Quick Reference: What Changes When Going Live

| Item | Development | Production |
|------|-------------|------------|
| Base URL | Vercel preview URL | https://sweetdreamsprod.com |
| Email FROM | onboarding@resend.dev | bookings@sweetdreamsprod.com |
| Stripe Keys | Test keys (pk_test_, sk_test_) | Live keys (pk_live_, sk_live_) |
| Stripe Mode | Test Mode | Live Mode |
| Resend Domain | None (using test email) | sweetdreamsprod.com verified |
| Webhooks | Not set up | Configured with signing secret |

---

## 🚨 Critical Reminders

1. **DO NOT** delete the test environment variables until production is verified working
2. **DO NOT** switch to Stripe Live mode until you're ready to accept real payments
3. **KEEP** sweetdreamsmusic.com redirect active permanently (for SEO)
4. **TEST** everything with Stripe test mode first, then switch to live mode
5. **BACKUP** your Supabase database before go-live (just in case)

---

## 💡 Optional Enhancements (Post-Launch)

- [ ] Set up Google Analytics
- [ ] Set up Facebook Pixel (if using ads)
- [ ] Configure Vercel Analytics (included free)
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Create custom 404 page
- [ ] Add sitemap.xml and robots.txt

---

## 📞 Support Contacts

- **Vercel Support:** https://vercel.com/support
- **Stripe Support:** https://support.stripe.com
- **Resend Support:** https://resend.com/support
- **Supabase Support:** https://supabase.com/support

---

**Last Updated:** Initial setup - [Add date when going live]

**Notes:**
[Add any specific notes or gotchas you discover during testing]
