-- =====================================================
-- CLEANUP SCRIPT - Run this first to reset
-- =====================================================

-- Drop all policies
DROP POLICY IF EXISTS "Users can read their own deliverables" ON deliverables;
DROP POLICY IF EXISTS "Admins can read all deliverables" ON deliverables;
DROP POLICY IF EXISTS "Admins can insert deliverables" ON deliverables;
DROP POLICY IF EXISTS "Admins can update deliverables" ON deliverables;
DROP POLICY IF EXISTS "Admins can delete deliverables" ON deliverables;

DROP POLICY IF EXISTS "Users can read their own library notes" ON library_notes;
DROP POLICY IF EXISTS "Admins can read all library notes" ON library_notes;
DROP POLICY IF EXISTS "Admins can insert library notes" ON library_notes;
DROP POLICY IF EXISTS "Admins can update library notes" ON library_notes;
DROP POLICY IF EXISTS "Admins can delete library notes" ON library_notes;

-- Drop tables (this will cascade and remove everything)
DROP TABLE IF EXISTS library_notes CASCADE;
DROP TABLE IF EXISTS deliverables CASCADE;
