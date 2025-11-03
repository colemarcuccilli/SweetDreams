-- Create blocked_availability table for admin calendar management
-- This table stores dates and times that are blocked from booking

CREATE TABLE IF NOT EXISTS blocked_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date DATE NOT NULL,
  start_time INTEGER, -- Hour (0-23), NULL if blocking entire day
  end_time INTEGER, -- Hour (0-23), NULL if blocking entire day
  reason TEXT, -- Optional reason for blocking
  block_entire_day BOOLEAN DEFAULT FALSE,
  created_by TEXT NOT NULL, -- Email of admin who created the block
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_blocked_availability_date
  ON blocked_availability(blocked_date);

CREATE INDEX IF NOT EXISTS idx_blocked_availability_date_time
  ON blocked_availability(blocked_date, start_time, end_time);

-- Add RLS (Row Level Security) policies
ALTER TABLE blocked_availability ENABLE ROW LEVEL SECURITY;

-- Allow admins to read all blocked slots
CREATE POLICY "Allow authenticated users to read blocked availability"
  ON blocked_availability
  FOR SELECT
  TO authenticated
  USING (true);

-- Only allow admins to insert/update/delete
-- Note: In production, you'd want to add a proper admin role check
CREATE POLICY "Allow authenticated users to manage blocked availability"
  ON blocked_availability
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blocked_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_blocked_availability_updated_at_trigger
  BEFORE UPDATE ON blocked_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_blocked_availability_updated_at();

-- Add comment to table
COMMENT ON TABLE blocked_availability IS 'Stores dates and time slots blocked from booking by studio admins';
