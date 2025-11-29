-- ============================================================================
-- CRITICAL FIXES MIGRATION
-- Date: November 29, 2025
-- Purpose: Fix booking system, profile creation, and add safeguards
-- ============================================================================

-- ============================================================================
-- PART 1: FIX PROFILES - AUTO-CREATE ON USER SIGNUP
-- ============================================================================

-- Function to auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  display_name_value TEXT;
  slug_value TEXT;
  counter INTEGER := 0;
BEGIN
  -- Get user email from auth.users
  user_email := NEW.email;

  -- Extract display name from email (part before @)
  display_name_value := split_part(user_email, '@', 1);

  -- Create initial slug from display name
  slug_value := LOWER(REGEXP_REPLACE(display_name_value, '[^a-zA-Z0-9]', '', 'g'));

  -- Ensure slug is unique by appending counter if needed
  WHILE EXISTS (SELECT 1 FROM profiles WHERE public_profile_slug = slug_value) LOOP
    counter := counter + 1;
    slug_value := LOWER(REGEXP_REPLACE(display_name_value, '[^a-zA-Z0-9]', '', 'g')) || counter::TEXT;
  END LOOP;

  -- Insert profile for new user
  INSERT INTO public.profiles (user_id, display_name, public_profile_slug)
  VALUES (NEW.id, display_name_value, slug_value);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PART 2: BACKFILL MISSING PROFILES FOR EXISTING USERS
-- ============================================================================

-- Create profiles for existing users who don't have one
INSERT INTO public.profiles (user_id, display_name, public_profile_slug)
SELECT
  au.id,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'display_name',
    split_part(au.email, '@', 1)
  ) AS display_name,
  -- Generate unique slug
  LOWER(REGEXP_REPLACE(
    COALESCE(
      au.raw_user_meta_data->>'full_name',
      au.raw_user_meta_data->>'display_name',
      split_part(au.email, '@', 1)
    ),
    '[^a-zA-Z0-9]', '', 'g'
  )) || '-' || SUBSTRING(au.id::TEXT, 1, 8) AS public_profile_slug
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.id IS NULL
AND au.deleted_at IS NULL;

-- ============================================================================
-- PART 3: ADD BOOKING SYSTEM FIELDS AND AUDIT LOG
-- ============================================================================

-- Add new fields to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS after_hours_fee_amount INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS same_day_fee_amount INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rejected_reason TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_email_sent_at TIMESTAMPTZ;

-- Add column comments
COMMENT ON COLUMN bookings.after_hours_fee_amount IS 'Calculated after-hours fee in cents (NOT added to deposit, only to remainder)';
COMMENT ON COLUMN bookings.same_day_fee_amount IS 'Calculated same-day fee in cents';
COMMENT ON COLUMN bookings.rejected_at IS 'Timestamp when booking was rejected by admin';
COMMENT ON COLUMN bookings.rejected_reason IS 'Admin-provided reason for rejection';
COMMENT ON COLUMN bookings.deleted_at IS 'Soft delete timestamp (no cancellation email sent)';
COMMENT ON COLUMN bookings.approved_at IS 'Timestamp when admin approved and payment was captured';
COMMENT ON COLUMN bookings.admin_notes IS 'Internal admin notes about this booking';
COMMENT ON COLUMN bookings.cancellation_email_sent_at IS 'Timestamp when cancellation email was sent (prevents duplicates)';

-- ============================================================================
-- PART 3B: ENABLE RLS ON BOOKINGS TABLE
-- ============================================================================

-- Enable Row Level Security on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Service role can manage all bookings" ON bookings;
DROP POLICY IF EXISTS "Anon can insert bookings" ON bookings;

-- Policy: Users can view their own bookings (by email)
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (customer_email = auth.jwt() ->> 'email');

-- Policy: Service role (backend APIs) can do anything with bookings
CREATE POLICY "Service role can manage all bookings"
  ON bookings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can create bookings (for booking flow before auth)
CREATE POLICY "Anon can insert bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ============================================================================
-- PART 4: CREATE BOOKING AUDIT LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS booking_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- created, approved, rejected, cancelled, deleted, remainder_charged, etc.
  performed_by TEXT, -- 'system', 'webhook', admin email, or user email
  details JSONB DEFAULT '{}'::jsonb, -- Additional context
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_booking_audit_log_booking_id ON booking_audit_log(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_audit_log_created_at ON booking_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_audit_log_action ON booking_audit_log(action);

-- Enable RLS
ALTER TABLE booking_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin users can view all audit logs"
  ON booking_audit_log
  FOR SELECT
  TO authenticated
  USING (
    -- Check if user email is in admin list
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
      'cole@sweetdreamsmusic.com',
      'jayvalleo@sweetdreamsmusic.com'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON booking_audit_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Table comments
COMMENT ON TABLE booking_audit_log IS 'Comprehensive audit trail for all booking actions and state changes';
COMMENT ON COLUMN booking_audit_log.action IS 'Action: created, approved, rejected, cancelled, deleted, remainder_charged, payment_captured, etc.';
COMMENT ON COLUMN booking_audit_log.performed_by IS 'Who performed the action: system, webhook, admin email, user email';
COMMENT ON COLUMN booking_audit_log.details IS 'JSON object with context: {amount, stripe_payment_intent_id, reason, error, etc.}';

-- ============================================================================
-- PART 5: CREATE HELPER FUNCTION TO LOG BOOKING ACTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION log_booking_action(
  p_booking_id UUID,
  p_action TEXT,
  p_performed_by TEXT DEFAULT 'system',
  p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO booking_audit_log (booking_id, action, performed_by, details)
  VALUES (p_booking_id, p_action, p_performed_by, COALESCE(p_details, '{}'::jsonb))
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

COMMENT ON FUNCTION log_booking_action IS 'Helper function to add audit log entries for booking actions';

-- ============================================================================
-- PART 6: MIGRATE EXISTING BOOKING DATA
-- ============================================================================

-- Set approved_at for existing confirmed/completed bookings
UPDATE bookings
SET approved_at = created_at
WHERE status IN ('confirmed', 'completed')
AND approved_at IS NULL;

-- Log migration event for existing bookings
INSERT INTO booking_audit_log (booking_id, action, performed_by, details, created_at)
SELECT
  id,
  'migrated',
  'system',
  jsonb_build_object(
    'status', status,
    'deposit_amount', deposit_amount,
    'total_amount', total_amount,
    'migration_note', 'Migrated during critical fixes - Nov 29, 2025'
  ),
  created_at
FROM bookings
WHERE NOT EXISTS (
  SELECT 1 FROM booking_audit_log WHERE booking_audit_log.booking_id = bookings.id
);

-- ============================================================================
-- PART 7: CREATE WEBHOOK FAILURE MONITOR
-- ============================================================================

-- Table to track webhook failures
CREATE TABLE IF NOT EXISTS webhook_failures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_type TEXT NOT NULL, -- 'stripe_checkout_completed', 'stripe_payment_failed', etc.
  stripe_event_id TEXT,
  stripe_session_id TEXT,
  booking_id UUID REFERENCES bookings(id),
  error_message TEXT NOT NULL,
  error_details JSONB DEFAULT '{}'::jsonb,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_webhook_failures_created ON webhook_failures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_failures_resolved ON webhook_failures(resolved) WHERE NOT resolved;
CREATE INDEX IF NOT EXISTS idx_webhook_failures_booking ON webhook_failures(booking_id);

ALTER TABLE webhook_failures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view webhook failures"
  ON webhook_failures
  FOR SELECT
  TO authenticated
  USING (
    -- Check if user email is in admin list
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
      'cole@sweetdreamsmusic.com',
      'jayvalleo@sweetdreamsmusic.com'
    )
  );

CREATE POLICY "System can insert webhook failures"
  ON webhook_failures
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE webhook_failures IS 'Logs webhook failures for monitoring and debugging';

-- ============================================================================
-- PART 8: ADD BOOKING STATUS CONSTRAINTS AND VALIDATION
-- ============================================================================

-- Add check constraint for valid status values
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS valid_booking_status;
ALTER TABLE bookings ADD CONSTRAINT valid_booking_status
  CHECK (status IN ('pending_approval', 'pending_deposit', 'approved', 'confirmed', 'completed', 'cancelled', 'rejected', 'deleted'));

-- Add constraint: can't have both approved_at and rejected_at
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS approved_or_rejected_not_both;
ALTER TABLE bookings ADD CONSTRAINT approved_or_rejected_not_both
  CHECK (
    (approved_at IS NULL OR rejected_at IS NULL)
  );

-- ============================================================================
-- PART 9: GRANT PERMISSIONS
-- ============================================================================

GRANT SELECT ON booking_audit_log TO authenticated;
GRANT SELECT ON webhook_failures TO authenticated;
GRANT ALL ON booking_audit_log TO service_role;
GRANT ALL ON webhook_failures TO service_role;
GRANT ALL ON bookings TO service_role;

-- ============================================================================
-- COMPLETED
-- ============================================================================

-- Log successful migration
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE '✅ Profiles trigger created';
  RAISE NOTICE '✅ Missing profiles backfilled';
  RAISE NOTICE '✅ Booking audit log created';
  RAISE NOTICE '✅ Webhook failure monitoring added';
  RAISE NOTICE '✅ Booking status validation added';
END $$;
