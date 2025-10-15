# Booking System Testing Guide

**Testing URL:** https://sweet-dreams-phi.vercel.app

---

## ✅ Pre-Testing Setup

### Step 1: Create the Supabase Bookings Table

**CRITICAL:** You must do this first or bookings will fail!

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `fweeyjnqwxywmpmnqpts`
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the ENTIRE contents of: `supabase/bookings-table.sql`
6. Click "Run" or press Ctrl+Enter
7. You should see: "Success. No rows returned"

**Verify the table was created:**
- Click "Table Editor" in left sidebar
- You should see a table named "bookings"
- It should have columns: id, first_name, last_name, artist_name, customer_email, etc.

---

## 🧪 Testing Checklist

### Test 1: Navigate to Booking Section

1. Go to: https://sweet-dreams-phi.vercel.app/music
2. Scroll down to the "Book Your Session" section
3. You should see:
   - Calendar on the left
   - Booking details form on the right

**✅ Pass if:** Calendar and form load correctly
**❌ Fail if:** Calendar doesn't appear or shows errors

---

### Test 2: Select Date and Time

1. **Select a Date:**
   - Click on any future date on the calendar
   - Sundays should be disabled (greyed out)
   - Today and past dates should be disabled

2. **Select Duration:**
   - You should see buttons: 1 Hour, 2 Hours, 3 Hours, 4 Hours, 5 Hours, 6 Hours
   - Click "2 Hours"

3. **Select Time:**
   - Time slots should appear (9 AM - 11 PM)
   - Slots after 9 PM should show "+$10/hr" badge
   - Click a time slot (try "2:00 PM" for no extra fees)

**✅ Pass if:**
- Calendar selection works
- Duration buttons appear
- Time slots appear after selecting date
- Late time slots show the "+$10/hr" badge

**❌ Fail if:** Any of the above don't work

---

### Test 3: Fill Out Customer Information

After selecting date/time/duration, form fields should appear:

1. **First Name:** Enter "Test"
2. **Last Name:** Enter "User"
3. **Artist Name:** Enter "Test Artist"
4. **Email:** Enter YOUR real email (so you can verify confirmation email)
5. **Phone:** Enter "(555) 123-4567" (optional)

**Check the Booking Summary:**
- Should show session cost (e.g., "2 hours" at $50/hr = $100)
- Deposit amount should show (e.g., $50.00)
- Total session cost should show (e.g., $100.00)
- If you selected same day, should show "+$10.00 Same Day Fee"
- If you selected after 9 PM, should show "+$10.00 After Hours Fee"

**✅ Pass if:**
- All form fields appear
- Pricing calculates correctly
- "Proceed to Payment" button is enabled

**❌ Fail if:** Form doesn't appear or pricing is wrong

---

### Test 4: Submit Booking (Stripe Checkout)

1. Click **"Proceed to Payment"** button
2. You should be redirected to Stripe Checkout page
3. It should show:
   - Sweet Dreams Music Studio
   - Email pre-filled with your email
   - Deposit amount to pay

**Use Stripe Test Card:**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

4. Fill out the Stripe form and click "Pay"

**✅ Pass if:**
- Redirects to Stripe Checkout
- Shows correct deposit amount
- Test card payment succeeds
- Redirects back to success page

**❌ Fail if:**
- Error message appears
- Payment fails
- Doesn't redirect to Stripe

**Common Error Messages:**

| Error | Cause | Fix |
|-------|-------|-----|
| "Missing required fields" | Form validation failed | Make sure all required fields are filled |
| "This time slot is already booked" | Conflict in database | Choose a different time |
| "Invalid booking time" | Session would exceed 3 AM | Choose earlier time or shorter duration |
| "Failed to create booking" | Server error | Check Vercel function logs |

---

### Test 5: Verify Booking Success Page

After successful payment, you should see:
- URL: `https://sweet-dreams-phi.vercel.app/music/booking-success?session_id=...`
- Success message confirming your booking
- Booking details displayed

**✅ Pass if:** Success page shows with booking details
**❌ Fail if:** Error page or redirect fails

---

### Test 6: Check Database Entry

1. Go to Supabase Dashboard → Table Editor → bookings table
2. You should see your test booking with:
   - ✅ first_name: "Test"
   - ✅ last_name: "User"
   - ✅ artist_name: "Test Artist"
   - ✅ customer_email: your email
   - ✅ start_time: the date/time you selected
   - ✅ duration: 2 (or whatever you chose)
   - ✅ status: "pending_deposit"
   - ✅ deposit_amount: correct amount in cents
   - ✅ total_amount: correct total in cents
   - ✅ stripe_customer_id: starts with "cus_"
   - ✅ stripe_payment_intent_id: starts with "pi_"

**✅ Pass if:** Booking appears with all correct data
**❌ Fail if:** No booking or incorrect data

---

### Test 7: Verify Admin Notification Email

1. Check **jayvalleo@sweetdreamsmusic.com** inbox
2. You should receive an email with:
   - Subject: "New Booking: Test Artist - [Date]"
   - From: "Sweet Dreams Music <onboarding@resend.dev>"
   - Body contains:
     - Customer name (Test User)
     - Artist name (Test Artist)
     - Email and phone
     - Date, time, duration
     - Payment summary

**✅ Pass if:** Email received with correct details
**❌ Fail if:** No email or wrong information

**If email doesn't arrive:**
- Check spam folder
- Go to Resend dashboard → Logs → Check for errors
- Verify RESEND_API_KEY is set in Vercel

---

### Test 8: Verify Customer Confirmation Email

1. Check YOUR email inbox (the one you entered in the form)
2. You should receive an email with:
   - Subject: "Your Sweet Dreams Music Studio Booking - [Date]"
   - From: "Sweet Dreams Music <onboarding@resend.dev>"
   - Body contains:
     - Personalized greeting with your first name
     - Booking details (artist name, date, time, duration)
     - Payment summary (deposit paid, total cost, remainder)
     - Studio location and address
     - Important reminders

**✅ Pass if:** Email received with professional formatting
**❌ Fail if:** No email or looks broken

---

### Test 9: Check Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/payments
2. You should see:
   - A payment for your deposit amount
   - Status: "Succeeded"
   - Customer: "Test User" (your email)
   - Description: includes booking details in metadata

3. Click on the payment to see details:
   - Metadata should include:
     - booking_date
     - booking_start_time
     - booking_duration
     - customer_name
     - artist_name

**✅ Pass if:** Payment appears with all metadata
**❌ Fail if:** Payment missing or no metadata

---

### Test 10: Test Admin Dashboard (Optional for now)

1. Go to: https://sweet-dreams-phi.vercel.app/admin/bookings
2. If you haven't set up admin auth yet, this might not work
3. You should see a list of all bookings
4. Your test booking should appear

**Note:** Admin functionality can be tested later if authentication isn't set up yet.

---

## 🎯 Success Criteria

All of these must work for the booking system to be considered ready:

- [x] Calendar date selection works
- [x] Duration and time selection works
- [x] Pricing calculates correctly (including fees)
- [x] Form validation works
- [x] Stripe checkout redirects and accepts payment
- [x] Booking saves to Supabase database
- [x] Admin notification email sends
- [x] Customer confirmation email sends
- [x] Success page displays after payment
- [x] Stripe payment appears in dashboard

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to Supabase"
**Solution:**
- Verify NEXT_PUBLIC_SUPABASE_URL is correct in Vercel
- Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Check Vercel deployment logs for errors

### Problem: Emails not sending
**Solution:**
- Check RESEND_API_KEY is set in Vercel
- Check Resend dashboard → Logs for errors
- Verify FROM_EMAIL is using `onboarding@resend.dev`
- Check email isn't in spam folder

### Problem: "Failed to create booking"
**Solution:**
- Check Vercel function logs: Vercel Dashboard → Functions → Logs
- Make sure bookings table exists in Supabase
- Verify SUPABASE_SERVICE_KEY is set in Vercel

### Problem: Stripe payment fails
**Solution:**
- Verify STRIPE_SECRET_KEY is set in Vercel
- Make sure you're using test card: 4242 4242 4242 4242
- Check Stripe dashboard for error messages

### Problem: Booking doesn't appear in database
**Solution:**
- Check that bookings table was created (run SQL file)
- Check Vercel function logs for database errors
- Verify SUPABASE_SERVICE_KEY has proper permissions

---

## 📊 Test Scenarios to Try

After basic testing works, try these edge cases:

1. **Same-Day Booking:**
   - Select today's date
   - Verify +$10 same-day fee is added
   - Complete booking and check total

2. **After-Hours Booking:**
   - Select time at 9 PM or later
   - Verify "+$10/hr" badge appears
   - Complete booking and check total

3. **Late Night Session:**
   - Select 11 PM start time
   - Try 6-hour duration (should be disabled - would go past 3 AM)
   - Select 4-hour duration (should work - ends at 3 AM)

4. **1-Hour Session:**
   - Select 1-hour duration
   - Verify no "remainder" messaging (1-hour is full payment upfront)
   - Check pricing summary

5. **6-Hour Session:**
   - Select 9 AM start time
   - Choose 6-hour duration
   - Verify correct pricing ($135 deposit, $270 total)

6. **Different Browsers:**
   - Test on Chrome, Firefox, Safari
   - Test on mobile device

7. **Invalid Scenarios:**
   - Try submitting without filling out required fields
   - Try selecting past dates (should be disabled)
   - Try selecting Sunday (should be disabled)

---

## 📝 Notes Section

**Test Results:**
- Date tested: ___________
- Tester: ___________
- Issues found: ___________

**Known Issues:**
- (Add any bugs or issues you discover)

**Questions:**
- (Add any questions that come up during testing)
