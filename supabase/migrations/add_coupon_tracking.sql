-- Add coupon tracking columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_amount INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS actual_deposit_paid INTEGER;

-- Add index for querying bookings with coupons
CREATE INDEX IF NOT EXISTS idx_bookings_coupon_code ON bookings(coupon_code) WHERE coupon_code IS NOT NULL;
