# Setup Guide for Sweet Dreams Booking System

All code changes are complete! Here's what you need to do to get the booking system and emails working:

## 1. Update Supabase Database

Run the updated SQL file to add the new columns to your bookings table:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the file: `supabase/bookings-table.sql`

This will add the new fields:
- `first_name` (required)
- `last_name` (required)
- `artist_name` (required)

## 2. Set Up Resend for Emails

### Sign up for Resend:
1. Go to https://resend.com
2. Create a free account
3. Get your API key from the dashboard

### Verify Your Domain (Important!):
1. In Resend dashboard, go to "Domains"
2. Add your domain: `sweetdreamsprod.com`
3. Follow their instructions to add DNS records
4. Wait for verification (usually a few minutes)

### Alternative (for testing):
If you want to test immediately before domain verification:
- Resend allows you to use `onboarding@resend.dev` as the "from" email for testing
- Update `lib/emails/resend.ts` to use this temporarily
- But you MUST verify your domain before going live

## 3. Add Environment Variables

Add this to your `.env.local` file:

```env
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

Also add it to your Vercel deployment environment variables.

## 4. Update the "From" Email Address

Once your domain is verified in Resend:

1. Open `lib/emails/resend.ts`
2. Update the `FROM_EMAIL` constant (already set to):
   ```typescript
   export const FROM_EMAIL = 'Sweet Dreams Music <bookings@sweetdreamsprod.com>';
   ```
3. Make sure `bookings@sweetdreamsprod.com` matches what you verified in Resend

## 5. Test the Booking System

1. Start your dev server: `npm run dev`
2. Go to http://localhost:3000/music#booking
3. Fill out the form with:
   - First Name
   - Last Name
   - Artist Name
   - Email (use your own for testing)
   - Select a date, time, and duration
4. Submit the booking
5. Complete the Stripe checkout (use test card: 4242 4242 4242 4242)
6. Check your email for the confirmation
7. Check jayvalleo@sweetdreamsmusic.com for the admin notification

## 6. What's Included

### Booking Form Fields:
- ✅ First Name (required)
- ✅ Last Name (required)
- ✅ Artist Name (required)
- ✅ Email (required)
- ✅ Phone Number (optional)

### Email Notifications:
- ✅ Admin notification to jayvalleo@sweetdreamsmusic.com with all booking details
- ✅ Customer confirmation email with:
  - Booking details
  - Payment summary
  - Studio location
  - Important information
  - Contact details

### Database Updates:
- ✅ Schema updated with new fields
- ✅ API route updated to save all new fields
- ✅ Validation updated for required fields

## 7. Booking Hours Configured:
- Start times: 9 AM - 11 PM
- Sessions can run until 3:00 AM
- Session durations: 1-6 hours
- After-hours fee ($10/hr) applies at 9 PM or later
- Same-day booking fee: $10

## Notes

- Emails will NOT be sent if the RESEND_API_KEY is not set
- The booking will still be created even if emails fail (check console for errors)
- Make sure to verify your domain in Resend before going live
- Test thoroughly with Stripe test mode before switching to live mode

## Missing Items Still Needed:

1. ❌ 2Hr Remainder Price ID (still marked as `price_XXX` in booking-config.ts)
   - Product ID: `prod_TEzfSaaPR21bxQ`
   - Need the actual price ID from Stripe

Once you complete steps 1-4, the booking system will be fully functional with email notifications!
