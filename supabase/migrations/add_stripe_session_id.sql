-- Add missing stripe_session_id column to bookings table
-- This column is critical for webhook processing after Stripe checkout
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Create index for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session_id ON bookings(stripe_session_id);

-- Add comment for documentation
COMMENT ON COLUMN bookings.stripe_session_id IS 'Stripe Checkout Session ID - used to match webhook events to bookings';
