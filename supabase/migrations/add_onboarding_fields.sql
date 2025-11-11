-- Add onboarding fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS connected_platforms TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS posting_streak INTEGER DEFAULT 0;

-- Reset cole@sweetdreamsmusic.com account for testing (using auth.users to find the profile)
UPDATE profiles
SET
  connected_platforms = '{}',
  onboarding_completed = FALSE,
  onboarding_completed_at = NULL,
  xp = 0,
  level = 0,
  posting_streak = 0
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE email = 'cole@sweetdreamsmusic.com'
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON profiles(onboarding_completed);
