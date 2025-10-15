# Vercel Environment Variables - Corrections Needed

## ❌ Remove These (Old Email System - Not Needed)
```
EMAIL_USER=jayvalleo@sweetdreamsmusic.com  ❌ DELETE
EMAIL_PASS=yxrt acci xhay sxtp  ❌ DELETE
```
**Why:** We're using Resend for emails now, not Gmail SMTP

## ⚠️ Update These Values

### Change for Production:
```
NEXT_PUBLIC_BASE_URL=https://sweetdreamsprod.com
```
**Currently:** http://localhost:3000 ❌
**Should be:** https://sweetdreamsprod.com ✅

```
NEXT_PUBLIC_SITE_URL=https://sweetdreamsprod.com
```
**Currently:** http://localhost:3000 ❌
**Should be:** https://sweetdreamsprod.com ✅

### Add Value (Currently Empty):
```
STRIPE_WEBHOOK_SECRET=(leave empty for now - you'll get this after setting up webhooks)
```
**Note:** This can stay empty for now. You'll add it later when you set up Stripe webhooks.

## 🚨 MISSING - Add These Critical Variables

### Required for Booking System to Work:

```
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
```
**Critical** - Without this, the booking API cannot write to Supabase
(Get this from your Supabase project settings)

```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```
**Critical** - Without this, Stripe checkout cannot be created

```
RESEND_API_KEY=(you need to get this from Resend.com)
```
**Critical** - Without this, confirmation emails won't be sent

## ✅ These Are Correct (Keep As-Is)
```
NEXT_PUBLIC_SUPABASE_URL=https://fweeyjnqwxywmpmnqpts.supabase.co ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ✅
ADMIN_PASSWORD_HASH=$2b$12$rfoN8h9GsZ3oWnbd9J/yeeY0GKeaT38p9Xgk... ✅
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RnMqC4M2L4m9dAL... ✅
CLOUDFLARE_ACCOUNT_ID=930f31024174032bfcbbb01ca4e88215 ✅
CLOUDFLARE_STREAM_API_TOKEN=CVZM0_55KzdK6EwuLM_gz7C-Yd2jTlZqBRQwvSJQ ✅
NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE=customer-930f31024174032bfcbbb01ca4e88215 ✅
NEXT_PUBLIC_CLOUDFLARE_HEADER_VIDEO_ID=e80443ae9084ffea8f28180125ed3e15 ✅
```

## 📋 Complete List of Variables for Production

Copy/paste this into Vercel (after getting RESEND_API_KEY):

```env
# Supabase - Public (safe for browser)
NEXT_PUBLIC_SUPABASE_URL=https://fweeyjnqwxywmpmnqpts.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZWV5am5xd3h5d21wbW5xcHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzU2OTQsImV4cCI6MjA3MTc1MTY5NH0.-vLqNDwbpA3zpJh45VFB5Oo2ehnBdLaLlNMDi1o75m4

# Supabase - Secret (server-side only)
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# Stripe - Public (safe for browser)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Stripe - Secret (server-side only)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=

# Site URLs
NEXT_PUBLIC_BASE_URL=https://sweetdreamsprod.com
NEXT_PUBLIC_SITE_URL=https://sweetdreamsprod.com

# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID=930f31024174032bfcbbb01ca4e88215
CLOUDFLARE_STREAM_API_TOKEN=CVZM0_55KzdK6EwuLM_gz7C-Yd2jTlZqBRQwvSJQ
NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE=customer-930f31024174032bfcbbb01ca4e88215
NEXT_PUBLIC_CLOUDFLARE_HEADER_VIDEO_ID=e80443ae9084ffea8f28180125ed3e15

# Admin Auth
ADMIN_PASSWORD_HASH=$2b$12$rfoN8h9GsZ3oWnbd9J/yeeY0GKeaT38p9Xgk.KpuHE2Vmjw2TEGVG

# Resend Email (get from Resend.com)
RESEND_API_KEY=re_your_api_key_here
```

## 🎯 Action Items:

1. **Delete from Vercel:**
   - EMAIL_USER
   - EMAIL_PASS

2. **Add to Vercel:**
   - SUPABASE_SERVICE_KEY
   - STRIPE_SECRET_KEY
   - RESEND_API_KEY (get from Resend first)

3. **Update in Vercel:**
   - NEXT_PUBLIC_BASE_URL → https://sweetdreamsprod.com
   - NEXT_PUBLIC_SITE_URL → https://sweetdreamsprod.com

4. **Get RESEND_API_KEY:**
   - Go to https://resend.com
   - Sign up / Log in
   - Get your API key from dashboard

## Why This Will Fix Your Deployment:

Your deployment is probably failing because:
- Missing STRIPE_SECRET_KEY (can't create checkout sessions)
- Missing SUPABASE_SERVICE_KEY (can't save bookings to database)
- localhost URLs instead of production URLs

Once you add these, redeploy and it should work!
