-- =====================================================
-- MY LIBRARY FEATURE - Database Schema
-- =====================================================
-- This migration creates tables for the "My Library" feature
-- where clients can download their audio files and view studio notes
-- =====================================================

-- =====================================================
-- TABLE: deliverables
-- =====================================================
-- Tracks audio files uploaded by engineers for clients
-- Files are stored in Supabase Storage, this table has metadata
-- =====================================================
CREATE TABLE IF NOT EXISTS deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL, -- Original filename (e.g., "Song_Final_Mix.wav")
  display_name TEXT, -- Optional friendly name (e.g., "Sunrise - Final Master")
  file_path TEXT NOT NULL, -- Path in Supabase Storage bucket (e.g., "audio/user123/song.wav")
  file_size BIGINT NOT NULL, -- File size in bytes
  file_type TEXT NOT NULL, -- MIME type (e.g., "audio/wav", "audio/mpeg")
  uploaded_by UUID REFERENCES auth.users(id), -- Admin/engineer who uploaded
  uploaded_by_name TEXT, -- Name of uploader (e.g., "Jay Val Leo")
  description TEXT, -- Optional description
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: library_notes
-- =====================================================
-- Communication log between engineers and clients
-- Timestamped messages from admin to client
-- Can include text updates, links to external video services, etc.
-- =====================================================
CREATE TABLE IF NOT EXISTS library_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id), -- Admin who wrote the note
  admin_name TEXT NOT NULL, -- Name displayed to client (e.g., "Jay Val Leo")
  note_content TEXT NOT NULL, -- The actual message/note
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_deliverables_user_id ON deliverables(user_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_created_at ON deliverables(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_library_notes_user_id ON library_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_library_notes_created_at ON library_notes(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on both tables
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_notes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICY: Clients can read their own deliverables
-- =====================================================
CREATE POLICY "Users can read their own deliverables"
  ON deliverables
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- RLS POLICY: Admins can read all deliverables
-- =====================================================
CREATE POLICY "Admins can read all deliverables"
  ON deliverables
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'cole@sweetdreamsmusic.com',
      'jayvalleo@sweetdreamsmusic.com',
      'cole@marcuccilli.com'
    )
  );

-- =====================================================
-- RLS POLICY: Admins can insert deliverables
-- =====================================================
CREATE POLICY "Admins can insert deliverables"
  ON deliverables
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'cole@sweetdreamsmusic.com',
      'jayvalleo@sweetdreamsmusic.com',
      'cole@marcuccilli.com'
    )
  );

-- =====================================================
-- RLS POLICY: Admins can update deliverables
-- =====================================================
CREATE POLICY "Admins can update deliverables"
  ON deliverables
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'cole@sweetdreamsmusic.com',
      'jayvalleo@sweetdreamsmusic.com',
      'cole@marcuccilli.com'
    )
  );

-- =====================================================
-- RLS POLICY: Admins can delete deliverables
-- =====================================================
CREATE POLICY "Admins can delete deliverables"
  ON deliverables
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'cole@sweetdreamsmusic.com',
      'jayvalleo@sweetdreamsmusic.com',
      'cole@marcuccilli.com'
    )
  );

-- =====================================================
-- RLS POLICY: Clients can read their own notes
-- =====================================================
CREATE POLICY "Users can read their own library notes"
  ON library_notes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- RLS POLICY: Admins can read all notes
-- =====================================================
CREATE POLICY "Admins can read all library notes"
  ON library_notes
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'cole@sweetdreamsmusic.com',
      'jayvalleo@sweetdreamsmusic.com',
      'cole@marcuccilli.com'
    )
  );

-- =====================================================
-- RLS POLICY: Admins can insert notes
-- =====================================================
CREATE POLICY "Admins can insert library notes"
  ON library_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'cole@sweetdreamsmusic.com',
      'jayvalleo@sweetdreamsmusic.com',
      'cole@marcuccilli.com'
    )
  );

-- =====================================================
-- RLS POLICY: Admins can update notes
-- =====================================================
CREATE POLICY "Admins can update library notes"
  ON library_notes
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'cole@sweetdreamsmusic.com',
      'jayvalleo@sweetdreamsmusic.com',
      'cole@marcuccilli.com'
    )
  );

-- =====================================================
-- RLS POLICY: Admins can delete notes
-- =====================================================
CREATE POLICY "Admins can delete library notes"
  ON library_notes
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'cole@sweetdreamsmusic.com',
      'jayvalleo@sweetdreamsmusic.com',
      'cole@marcuccilli.com'
    )
  );

-- =====================================================
-- TRIGGER: Auto-update updated_at on deliverables
-- =====================================================
CREATE TRIGGER update_deliverables_updated_at
  BEFORE UPDATE ON deliverables
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
GRANT SELECT ON deliverables TO authenticated;
GRANT SELECT ON library_notes TO authenticated;
GRANT ALL ON deliverables TO service_role;
GRANT ALL ON library_notes TO service_role;
