-- =====================================================
-- PUBLIC PROFILES FEATURE - Database Schema
-- =====================================================
-- This migration creates tables for user public profiles
-- where artists can showcase their work publicly
-- =====================================================

-- =====================================================
-- TABLE: profiles
-- =====================================================
-- Stores public profile information for each user
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Public Profile Info
  display_name TEXT NOT NULL,
  public_profile_slug TEXT NOT NULL UNIQUE,
  bio TEXT,

  -- Images
  profile_picture_url TEXT,
  photo_1_url TEXT,
  photo_2_url TEXT,
  photo_3_url TEXT,

  -- Social Links (stored as JSONB for flexibility)
  social_links JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one profile per user
  CONSTRAINT unique_user_profile UNIQUE(user_id)
);

-- =====================================================
-- TABLE: profile_audio_showcase
-- =====================================================
-- Links deliverables to public profiles (makes library files public)
-- Users select which files from their library appear on public profile
-- =====================================================

-- Drop table if it exists with wrong schema
DROP TABLE IF EXISTS profile_audio_showcase CASCADE;

-- Create fresh table
CREATE TABLE profile_audio_showcase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deliverable_id UUID NOT NULL,

  -- Optional custom display info (overrides deliverable defaults)
  custom_title TEXT,
  custom_description TEXT,
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure same file isn't added twice to showcase
  CONSTRAINT unique_showcase_deliverable UNIQUE(user_id, deliverable_id)
);

-- Add foreign key to deliverables table
ALTER TABLE profile_audio_showcase
ADD CONSTRAINT fk_deliverable
FOREIGN KEY (deliverable_id) REFERENCES deliverables(id) ON DELETE CASCADE;

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON profiles(public_profile_slug);
CREATE INDEX IF NOT EXISTS idx_audio_showcase_user_id ON profile_audio_showcase(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_showcase_deliverable ON profile_audio_showcase(deliverable_id);
CREATE INDEX IF NOT EXISTS idx_audio_showcase_order ON profile_audio_showcase(display_order);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_audio_showcase ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICY: Anyone can read profiles (public data)
-- =====================================================
DROP POLICY IF EXISTS "Profiles are publicly readable" ON profiles;
CREATE POLICY "Profiles are publicly readable"
  ON profiles
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- =====================================================
-- RLS POLICY: Users can insert their own profile
-- =====================================================
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- RLS POLICY: Users can update their own profile
-- =====================================================
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- RLS POLICY: Users can delete their own profile
-- =====================================================
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
CREATE POLICY "Users can delete their own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- RLS POLICY: Anyone can read audio showcase (public)
-- =====================================================
DROP POLICY IF EXISTS "Audio showcase is publicly readable" ON profile_audio_showcase;
CREATE POLICY "Audio showcase is publicly readable"
  ON profile_audio_showcase
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- =====================================================
-- RLS POLICY: Users can insert their own tracks
-- =====================================================
DROP POLICY IF EXISTS "Users can insert their own tracks" ON profile_audio_showcase;
CREATE POLICY "Users can insert their own tracks"
  ON profile_audio_showcase
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- RLS POLICY: Users can update their own tracks
-- =====================================================
DROP POLICY IF EXISTS "Users can update their own tracks" ON profile_audio_showcase;
CREATE POLICY "Users can update their own tracks"
  ON profile_audio_showcase
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- RLS POLICY: Users can delete their own tracks
-- =====================================================
DROP POLICY IF EXISTS "Users can delete their own tracks" ON profile_audio_showcase;
CREATE POLICY "Users can delete their own tracks"
  ON profile_audio_showcase
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- TRIGGER: Auto-update updated_at on profiles
-- =====================================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER: Auto-update updated_at on showcase
-- =====================================================
DROP TRIGGER IF EXISTS update_audio_showcase_updated_at ON profile_audio_showcase;
CREATE TRIGGER update_audio_showcase_updated_at
  BEFORE UPDATE ON profile_audio_showcase
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
GRANT SELECT ON profiles TO authenticated, anon;
GRANT SELECT ON profile_audio_showcase TO authenticated, anon;
GRANT ALL ON profiles TO service_role;
GRANT ALL ON profile_audio_showcase TO service_role;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE profiles IS 'Public user profiles with display name, bio, images, and social links';
COMMENT ON TABLE profile_audio_showcase IS 'Links deliverables to public profiles - users select which library files appear publicly';
COMMENT ON COLUMN profiles.social_links IS 'JSON object with social media links: {instagram, spotify, twitter, etc}';
COMMENT ON COLUMN profile_audio_showcase.deliverable_id IS 'References file from deliverables table (My Library)';
COMMENT ON COLUMN profile_audio_showcase.custom_title IS 'Optional override for display_name from deliverable';
COMMENT ON COLUMN profile_audio_showcase.display_order IS 'Order in which tracks appear on profile (lower = first)';
