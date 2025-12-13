-- ============================================================================
-- BOOKING DIAGNOSTIC QUERIES
-- Run these in Supabase SQL Editor to diagnose booking issues
-- ============================================================================

-- 1. CHECK MOST RECENT BOOKINGS (should show your test booking)
SELECT
  id,
  customer_email,
  first_name || ' ' || last_name AS customer_name,
  artist_name,
  status,
  start_time,
  created_at,
  stripe_session_id,
  stripe_payment_intent_id,
  deposit_amount,
  total_amount
FROM bookings
ORDER BY created_at DESC
LIMIT 10;

-- 2. CHECK IF BOOKING EXISTS BUT RLS IS BLOCKING IT
-- (Run this as service_role or disable RLS temporarily)
SET role TO service_role;
SELECT
  id,
  customer_email,
  status,
  created_at
FROM bookings
WHERE created_at > NOW() - INTERVAL '2 hours'
ORDER BY created_at DESC;

-- 3. CHECK WEBHOOK FAILURES (might show why booking failed)
SELECT
  id,
  webhook_type,
  stripe_session_id,
  booking_id,
  error_message,
  error_details,
  created_at
FROM webhook_failures
ORDER BY created_at DESC
LIMIT 10;

-- 4. CHECK BOOKING AUDIT LOG (shows all actions on bookings)
SELECT
  booking_id,
  action,
  performed_by,
  details,
  created_at
FROM booking_audit_log
ORDER BY created_at DESC
LIMIT 20;

-- 5. CHECK IF RLS POLICIES EXIST
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'bookings';

-- 6. CHECK IF USER PROFILE EXISTS (might be blocking booking insert)
SELECT
  user_id,
  display_name,
  public_profile_slug,
  created_at
FROM profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE')
LIMIT 1;

-- 7. TEST RLS POLICY FOR YOUR EMAIL
-- Replace YOUR_EMAIL_HERE with your actual email
SET role TO authenticated;
SET request.jwt.claims.email TO 'YOUR_EMAIL_HERE';

SELECT
  id,
  customer_email,
  status,
  created_at
FROM bookings
WHERE customer_email = 'YOUR_EMAIL_HERE'
ORDER BY created_at DESC;

-- 8. CHECK STRIPE SESSION IDS (look for duplicates)
SELECT
  stripe_session_id,
  COUNT(*) as count
FROM bookings
WHERE stripe_session_id IS NOT NULL
GROUP BY stripe_session_id
HAVING COUNT(*) > 1;

-- 9. FIX: If migration failed, run this to check what's missing
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'bookings'
AND column_name IN (
  'after_hours_fee_amount',
  'same_day_fee_amount',
  'approved_at',
  'rejected_at',
  'deleted_at',
  'cancellation_email_sent_at'
);
