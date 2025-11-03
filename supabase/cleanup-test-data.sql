-- ========================================
-- CLEANUP SCRIPT FOR TEST DATA
-- ========================================
-- Use this to clean up all test bookings and start fresh
-- Run this in Supabase SQL Editor

-- WARNING: This will delete data! Make sure you want to do this.

-- Step 1: Show all current bookings (review before deleting)
SELECT
  id,
  customer_email,
  first_name,
  last_name,
  artist_name,
  start_time,
  status,
  deposit_amount,
  total_amount,
  created_at
FROM bookings
ORDER BY created_at DESC;

-- Step 2: Delete all pending_deposit bookings (failed/abandoned)
-- Uncomment to execute:
-- DELETE FROM bookings WHERE status = 'pending_deposit';

-- Step 3: Delete ALL bookings (complete reset)
-- Uncomment to execute:
-- DELETE FROM bookings;

-- Step 4: Delete all blocked availability slots
-- Uncomment to execute:
-- DELETE FROM blocked_availability;

-- Step 5: Verify tables are empty
-- Uncomment to execute:
-- SELECT COUNT(*) as booking_count FROM bookings;
-- SELECT COUNT(*) as blocked_count FROM blocked_availability;

-- ========================================
-- USEFUL QUERIES FOR DEBUGGING
-- ========================================

-- Find bookings by email
-- SELECT * FROM bookings WHERE customer_email = 'your@email.com';

-- Find bookings by status
-- SELECT * FROM bookings WHERE status = 'pending_deposit';

-- Find recent bookings
-- SELECT * FROM bookings WHERE created_at > NOW() - INTERVAL '1 day';

-- Find bookings with no stripe_session_id (webhook failed)
-- SELECT * FROM bookings WHERE stripe_session_id IS NULL;

-- Update a pending booking to confirmed manually
-- UPDATE bookings
-- SET status = 'confirmed'
-- WHERE id = 'your-booking-id-here';
