-- =====================================================
-- UPDATE PROFILES - Add more photo types and song metadata
-- =====================================================

-- Add new photo fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS cover_photo_url TEXT,
ADD COLUMN IF NOT EXISTS square_photo_url TEXT,
ADD COLUMN IF NOT EXISTS tall_photo_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_photo_1_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_photo_2_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_photo_3_url TEXT;

-- Add song metadata fields to profile_audio_showcase
ALTER TABLE profile_audio_showcase
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_released BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS release_date DATE,
ADD COLUMN IF NOT EXISTS spotify_link TEXT,
ADD COLUMN IF NOT EXISTS apple_music_link TEXT,
ADD COLUMN IF NOT EXISTS youtube_link TEXT,
ADD COLUMN IF NOT EXISTS soundcloud_link TEXT,
ADD COLUMN IF NOT EXISTS custom_links JSONB DEFAULT '{}'::jsonb;

-- Add comments for new fields
COMMENT ON COLUMN profiles.cover_photo_url IS 'Wide cover/banner photo for profile header';
COMMENT ON COLUMN profiles.square_photo_url IS 'Square photo for social media sharing';
COMMENT ON COLUMN profiles.tall_photo_url IS 'Tall/portrait photo for specific layouts';
COMMENT ON COLUMN profile_audio_showcase.is_public IS 'Whether this track is visible on the public profile (true) or private (false)';
COMMENT ON COLUMN profile_audio_showcase.is_released IS 'Whether this track is publicly released on streaming platforms';
COMMENT ON COLUMN profile_audio_showcase.release_date IS 'Official release date of the track';
COMMENT ON COLUMN profile_audio_showcase.custom_links IS 'Additional custom links for this track as JSON';
