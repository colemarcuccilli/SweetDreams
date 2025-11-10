-- =====================================================
-- CREATE PROFILE PROJECTS TABLE
-- =====================================================
-- Table to store user projects (albums, singles, EPs, etc.)
-- with platform-specific streaming links

CREATE TABLE IF NOT EXISTS profile_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Project Info
  project_name TEXT NOT NULL,
  project_type TEXT, -- 'album', 'single', 'ep', 'mixtape', 'compilation', etc.
  description TEXT,
  cover_image_url TEXT,
  release_date DATE,

  -- Display & Visibility
  display_order INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,

  -- Platform Links
  spotify_link TEXT,
  apple_music_link TEXT,
  youtube_link TEXT,
  soundcloud_link TEXT,
  bandcamp_link TEXT,
  tidal_link TEXT,
  amazon_music_link TEXT,
  deezer_link TEXT,
  custom_links JSONB DEFAULT '{}'::jsonb,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profile_projects_user_id ON profile_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_projects_display_order ON profile_projects(display_order);
CREATE INDEX IF NOT EXISTS idx_profile_projects_is_public ON profile_projects(is_public);

-- Enable Row Level Security
ALTER TABLE profile_projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own projects" ON profile_projects;
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON profile_projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON profile_projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON profile_projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON profile_projects;

-- RLS Policies
CREATE POLICY "Users can view their own projects"
  ON profile_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public projects are viewable by everyone"
  ON profile_projects FOR SELECT
  TO authenticated, anon
  USING (is_public = true);

CREATE POLICY "Users can insert their own projects"
  ON profile_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON profile_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON profile_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_profile_projects_updated_at ON profile_projects;

CREATE TRIGGER update_profile_projects_updated_at
  BEFORE UPDATE ON profile_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE profile_projects IS 'Stores user projects (albums, singles, EPs) with platform-specific streaming links';
COMMENT ON COLUMN profile_projects.project_type IS 'Type of project: album, single, ep, mixtape, compilation, etc.';
COMMENT ON COLUMN profile_projects.is_public IS 'Whether this project is visible on the public profile';
COMMENT ON COLUMN profile_projects.custom_links IS 'Additional custom platform links as JSON';
