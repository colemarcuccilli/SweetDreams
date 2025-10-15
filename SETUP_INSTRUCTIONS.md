# Sweet Dreams Booking System - Setup Instructions

## ✅ What's Already Done

1. ✅ Supabase utilities created
2. ✅ Stripe secret key configured
3. ✅ Booking system fully built
4. ✅ API routes integrated with Supabase
5. ✅ Admin dashboard ready

## 🔧 Steps to Complete Setup

### Step 1: Create Supabase Bookings Table

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/fweeyjnqwxywmpmnqpts
2. Click on "SQL Editor" in the left sidebar
3. Copy the contents of `supabase/bookings-table.sql`
4. Paste it into the SQL editor
5. Click "Run" to create the table

### Step 2: Get Missing Stripe Price IDs

You need to provide:

1. **Stripe Publishable Key** - Add to `.env.local` as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Found in: Stripe Dashboard → Developers → API keys
   - Starts with `pk_test_`

2. **2Hr Remainder Price ID** - Update in `lib/booking-config.ts`
   - Product: `prod_TEzfSaaPR21bxQ`
   - Currently marked as `price_XXX`

### Step 3: Test the Booking System

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/music#booking`

3. Test booking flow:
   - Select a date (not Sunday, not in the past)
   - Select a time slot
   - Choose session duration
   - Fill in customer info
   - Click "Proceed to Payment"

4. Use Stripe test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

5. After payment, check:
   - You should be redirected to `/music/booking-success`
   - Check Supabase to see the booking created
   - Status should be `pending_deposit`

### Step 4: Test Admin Dashboard

1. Navigate to `http://localhost:3000/admin/bookings`

2. You should see the test booking you just created

3. To test remainder charge:
   - You'll need to manually update the booking status to `confirmed` in Supabase
   - Then click "Charge Remainder" button
   - Use same test card

## 🔑 Environment Variables Checklist

Your `.env.local` should have:

- [x] `NEXT_PUBLIC_SUPABASE_URL`
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] `SUPABASE_SERVICE_KEY`
- [x] `STRIPE_SECRET_KEY`
- [x] `NEXT_PUBLIC_BASE_URL`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` **← MISSING**

## ⚠️ Important Notes

1. **2Hr Remainder Price**: You need to provide the price ID for `prod_TEzfSaaPR21bxQ`

2. **Webhook (For Production)**:
   - When you go live, set up a Stripe webhook
   - Point it to: `https://yourdomain.com/api/webhooks/stripe`
   - Add the webhook secret to `.env.local`

3. **Admin Authentication**:
   - Currently there's no auth on admin routes
   - Before going live, add authentication to `/admin/*` routes

4. **Test Mode**:
   - You're using Stripe test keys
   - No real charges will be made
   - Switch to live keys when ready to accept real payments

## 🎉 Next Steps After Setup

1. Add the booking calendar to your music page
2. Style it to match your brand
3. Test thoroughly with different scenarios
4. Set up email notifications (optional)
5. Add admin authentication
6. Switch to production Stripe keys

## 🐛 Troubleshooting

**Issue**: Supabase errors when creating bookings
- **Fix**: Make sure you ran the SQL file to create the table

**Issue**: Stripe checkout not working
- **Fix**: Check that `STRIPE_SECRET_KEY` is set correctly

**Issue**: Can't see bookings in admin dashboard
- **Fix**: Make sure the table was created and bookings exist

**Issue**: "Price ID not configured" error
- **Fix**: Update all `price_XXX` placeholders in `lib/booking-config.ts`

## 📞 Need Help?

Check the browser console and terminal for detailed error messages. Most issues are related to:
- Missing environment variables
- Price IDs not configured
- Supabase table not created
