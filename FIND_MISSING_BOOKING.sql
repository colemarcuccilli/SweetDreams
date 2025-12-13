-- Find booking for cole@sweetdreamsmusic.com
SELECT
  id,
  customer_email,
  first_name,
  last_name,
  artist_name,
  status,
  start_time,
  created_at,
  stripe_session_id,
  stripe_payment_intent_id
FROM bookings
WHERE customer_email = 'cole@sweetdreamsmusic.com'
ORDER BY created_at DESC;

-- Check if ANY booking was created in last 30 minutes
SELECT
  id,
  customer_email,
  first_name,
  last_name,
  status,
  created_at
FROM bookings
WHERE created_at > NOW() - INTERVAL '30 minutes'
ORDER BY created_at DESC;

-- Check Stripe checkout sessions that might have been created but not saved
SELECT
  id,
  customer_email,
  stripe_session_id,
  created_at
FROM bookings
WHERE stripe_session_id IS NOT NULL
  AND created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
