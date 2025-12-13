-- Fix booking time and amounts for Noticemi Mi
-- Change to Sunday Nov 16 at noon Eastern (17:00 UTC)
-- Update amounts to reflect correct pricing without after-hours fee
-- Customer already paid $195 due to bug (should have been $135)
-- New total: $270 (no after-hours fee for Sunday noon session)
-- Remainder: $270 - $195 = $75

UPDATE bookings
SET
  start_time = '2025-11-16 17:00:00+00',
  end_time = '2025-11-16 23:00:00+00',
  deposit_amount = 13500, -- $135 (correct 6hr deposit)
  total_amount = 27000, -- $270 (6hr session, no fees)
  remainder_amount = 7500, -- $75 ($270 total - $195 already paid)
  actual_deposit_paid = 19500, -- $195 (what customer actually paid due to bug)
  after_hours_fee = false, -- No after-hours fee for Sunday noon
  updated_at = NOW()
WHERE id = '36f498c1-ec71-42eb-80c5-418558a5bb5c';

-- Verify the update
SELECT
  id,
  first_name,
  last_name,
  artist_name,
  start_time AT TIME ZONE 'America/New_York' as start_time_eastern,
  end_time AT TIME ZONE 'America/New_York' as end_time_eastern,
  duration,
  deposit_amount / 100.0 as deposit_dollars,
  actual_deposit_paid / 100.0 as actually_paid_dollars,
  total_amount / 100.0 as total_dollars,
  remainder_amount / 100.0 as remainder_dollars,
  after_hours_fee,
  same_day_fee,
  status
FROM bookings
WHERE id = '36f498c1-ec71-42eb-80c5-418558a5bb5c';
