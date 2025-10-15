# Vercel Environment Variables Setup

## Add These to Vercel Project Settings → Environment Variables

### ✅ Safe for Browser (with NEXT_PUBLIC_ prefix)
```
NEXT_PUBLIC_SUPABASE_URL=https://fweeyjnqwxywmpmnqpts.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZWV5am5xd3h5d21wbW5xcHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNDQwNDksImV4cCI6MjA1MjYyMDA0OX0.MIYJYWxOtlJoRAzMMOTqr_C2SkRpBN69kPfuB4ZX8l4
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RnMqC4M2L4m9dALlmbxURwL8Hx6FqucK4mjyTgdGEr5f45Tb1S4xn0wX577xeQlUxgLuy2JKuUmJwe9UyHmYheY00k3RCeIww
NEXT_PUBLIC_BASE_URL=https://sweetdreamsprod.com
```

### ❌ Keep Secret (NO NEXT_PUBLIC_ prefix - server-side only)
```
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
RESEND_API_KEY=your_resend_api_key_here
```
*Note: Get these from your respective dashboards - do not commit actual keys to Git*

## Important Notes:

1. **Vercel's Warnings are Normal**
   - Those warnings appear for ALL NEXT_PUBLIC_ variables
   - This is intentional - they're meant to be public
   - Vercel is just making sure you know they'll be visible in the browser
   - Click "Continue" or "Ignore" on those warnings

2. **Why These Are Safe:**
   - Supabase ANON key: Protected by Row Level Security
   - Stripe PUBLISHABLE key: Can't charge money, only SECRET key can
   - Base URL: Everyone can see your website URL anyway

3. **Environment Scopes:**
   - Select: Production, Preview, and Development
   - This ensures variables work in all environments

4. **After Adding Variables:**
   - Vercel will automatically redeploy
   - If not, trigger a new deployment manually

## For Production Domain:

Once sweetdreamsprod.com is connected to Vercel, update:
```
NEXT_PUBLIC_BASE_URL=https://sweetdreamsprod.com
```

## Deployment Checklist:

- [ ] Add all environment variables to Vercel
- [ ] Ignore Vercel's warnings about NEXT_PUBLIC_ variables (they're supposed to be public)
- [ ] Connect sweetdreamsprod.com domain in Vercel
- [ ] Run the Supabase SQL file to create tables
- [ ] Set up Resend and get API key
- [ ] Verify sweetdreamsprod.com domain in Resend
- [ ] Test a booking!

## Common Deployment Errors:

**Error: "STRIPE_SECRET_KEY is not defined"**
- Make sure it's added WITHOUT the NEXT_PUBLIC_ prefix

**Error: "Cannot connect to Supabase"**
- Check that NEXT_PUBLIC_SUPABASE_URL is correct
- Check that NEXT_PUBLIC_SUPABASE_ANON_KEY is correct

**Build succeeds but emails don't send:**
- Check RESEND_API_KEY is added to Vercel
- Verify domain in Resend dashboard
- Check Vercel Function Logs for email errors
