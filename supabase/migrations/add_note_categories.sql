-- =====================================================
-- ADD CATEGORIES TO LIBRARY NOTES
-- =====================================================
-- This migration adds a category system to library notes
-- for better organization (Audio, Video, Planning, etc.)
-- =====================================================

-- Add category column with default value
ALTER TABLE library_notes
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- Drop existing constraint if it exists, then recreate it
-- This makes the migration idempotent
ALTER TABLE library_notes
DROP CONSTRAINT IF EXISTS valid_note_category;

ALTER TABLE library_notes
ADD CONSTRAINT valid_note_category
CHECK (category IN ('audio', 'video', 'planning', 'mixing', 'mastering', 'feedback', 'general'));

-- Add index for filtering by category
CREATE INDEX IF NOT EXISTS idx_library_notes_category ON library_notes(category);

-- Add comment for documentation
COMMENT ON COLUMN library_notes.category IS 'Category for organizing notes: audio, video, planning, mixing, mastering, feedback, general';
