-- Create bookings table for Sweet Dreams Music Studio
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  customer_name TEXT NOT NULL, -- Full name (first + last)
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL,
  deposit_amount INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  remainder_amount INTEGER NOT NULL,
  same_day_fee BOOLEAN DEFAULT FALSE,
  after_hours_fee BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('pending_deposit', 'confirmed', 'completed', 'cancelled')),
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_remainder_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert bookings (for booking creation)
CREATE POLICY "Allow public booking creation" ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow public to read their own bookings by email
CREATE POLICY "Allow users to read their own bookings" ON bookings
  FOR SELECT
  TO public
  USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Allow authenticated admin users to read all bookings
-- Note: You'll need to set up auth and admin role for this to work properly
CREATE POLICY "Allow admin to read all bookings" ON bookings
  FOR SELECT
  TO authenticated
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
  );

-- Policy: Allow authenticated admin users to update bookings
CREATE POLICY "Allow admin to update bookings" ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT SELECT, INSERT ON bookings TO anon;
GRANT ALL ON bookings TO authenticated;
