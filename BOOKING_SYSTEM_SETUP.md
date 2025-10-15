# Sweet Dreams Music - Booking System Setup Guide

## Overview
The booking system is now built and ready for configuration. Here's what you need to do to make it live.

## ✅ What's Already Done

1. **Booking Calendar Component** (`components/music/BookingCalendar.tsx`)
   - Date selection with calendar
   - Time slot selection (8 AM - 9 PM)
   - Duration selection (1-5 hours)
   - Customer information form
   - Price calculation with fees
   - Integration with Stripe Checkout

2. **API Routes**
   - `/api/music/create-booking` - Creates booking and Stripe checkout session
   - `/api/admin/charge-remainder` - Charges remainder after session

3. **Admin Interface** (`/admin/bookings`)
   - View all bookings
   - Charge remainder with one click
   - Status tracking

4. **Success Page** (`/music/booking-success`)
   - Confirmation message after payment
   - Next steps information

## 🔧 Required Setup Steps

### Step 1: Get Stripe Price IDs

You need to get the Price IDs for each of your products. Run this command to list your prices:

```bash
# In Stripe dashboard, go to Products → click each product → copy the Price ID
```

Or use the Stripe CLI:
```bash
stripe prices list --limit 20
```

Update `lib/booking-config.ts` and replace all `priceId: 'price_XXX'` with your actual price IDs.

**Mapping your products:**
- 1hr Studio Session → `prod_TEzb5OMjrFBOjM`
- 2Hr Session (Deposit) → `prod_TEzeKBNnoi76Vu`
- 2Hr Session (Remainder) → `prod_TEzfSaaPR21bxQ`
- 3Hr Session (Deposit) → `prod_TEzfhzC8rn6Fwr`
- 3Hr Session (Remainder) → `prod_TEzg6YASO5foca`
- 4Hr Session (Deposit) → `prod_TEzgNKlplkf429`
- 5Hr Session (Deposit) → `prod_TEzjbDHWZfmKYX`
- 5Hr Session (Remainder) → `prod_TEzjfRPxmCQvDL`
- Same Day Fee → `prod_TEzhlSDpodZ8wC`
- After Hours Fee → `prod_TEzhs37LD24Wdt`

### Step 2: Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Keys (from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...

# Your website URL
NEXT_PUBLIC_BASE_URL=https://sweetdreamsmusic.com
# For local testing: http://localhost:3000

# Supabase (if using for database)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 3: Set Up Supabase Database (Optional but Recommended)

Create a `bookings` table in Supabase:

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL,
  deposit_amount INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  remainder_amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending_deposit', 'confirmed', 'completed', 'cancelled')),
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_remainder_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);
```

### Step 4: Uncomment Database Code

In the following files, uncomment the Supabase database code:

1. **`app/api/music/create-booking/route.ts`**
   - Uncomment booking conflict check
   - Uncomment booking insertion

2. **`app/api/admin/charge-remainder/route.ts`**
   - Uncomment booking fetch and validation
   - Uncomment booking status update

3. **`app/admin/bookings/page.tsx`**
   - Replace mock data with actual Supabase query

### Step 5: Install Stripe Package

```bash
npm install stripe
```

### Step 6: Add Booking Calendar to Music Page

Update `app/music/page.tsx` to include the booking calendar:

```tsx
import BookingCalendar from "@/components/music/BookingCalendar";

// Add this section where you want the booking form
<section id="booking" className={styles.bookingSection}>
  <h2>Book Your Session</h2>
  <BookingCalendar />
</section>
```

### Step 7: Configure Stripe Webhook (For Production)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://sweetdreamsmusic.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy the webhook secret and add to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

Create webhook handler at `app/api/webhooks/stripe/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // TODO: Update booking status to 'confirmed' in Supabase
      // using session.metadata.booking_id
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
```

### Step 8: Test the System

1. Start development server: `npm run dev`
2. Navigate to `/music#booking`
3. Try booking a session
4. Use Stripe test card: `4242 4242 4242 4242`
5. Check `/admin/bookings` to see the booking
6. Test charging remainder

## 🎨 Styling Notes

The booking system matches your site's design:
- IBM Plex Mono for body text
- Anton for headings
- Dark theme with glassmorphism effects
- Responsive design for mobile

## 📝 Testing Cards

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Requires Auth: `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC works.

## 🚀 Next Steps

1. Get your Stripe Price IDs and update `lib/booking-config.ts`
2. Add environment variables
3. Set up Supabase database (optional)
4. Add booking calendar to music page
5. Test thoroughly before going live
6. Switch to live Stripe keys when ready

## 📞 Support

If you run into any issues:
1. Check browser console for errors
2. Check API route logs in terminal
3. Verify all environment variables are set
4. Ensure Stripe webhook is configured (for production)

## 🔒 Security Notes

- Never commit `.env.local` to git (it's in .gitignore)
- Use test mode until everything is working
- Add authentication to admin routes before going live
- Consider adding rate limiting to booking API
