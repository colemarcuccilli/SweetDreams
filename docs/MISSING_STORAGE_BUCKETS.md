# Missing Supabase Storage Buckets

## Issue
Profile picture and song uploads are failing with "Bucket not found" errors.

## Required Buckets

Your code expects these storage buckets to exist in Supabase:

1. **`profile-pictures`** - For user profile photos (public profile page)
   - Used by: `/api/profile/upload-image/route.ts`
   - Public access: Yes
   - File types: Images (JPEG, PNG, WebP)
   - Max size: 5MB

2. **`client-audio-files`** - For admin song uploads to client libraries
   - Used by: `/api/admin/library/upload/route.ts`
   - Public access: No (signed URLs only)
   - File types: Audio files (MP3, WAV, FLAC, AIFF, M4A, AAC)
   - Max size: 5GB

## How to Create Buckets

### Option 1: Via Supabase Dashboard (Easiest)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **"New bucket"** button

**For `profile-pictures` bucket:**
- Name: `profile-pictures`
- Public bucket: ✅ **Yes** (allow public access)
- File size limit: 5MB
- Allowed MIME types: `image/*`

**For `client-audio-files` bucket:**
- Name: `client-audio-files`
- Public bucket: ❌ **No** (private, use signed URLs)
- File size limit: 5GB
- Allowed MIME types: `audio/*`

### Option 2: Via SQL (Advanced)

Run this SQL in Supabase SQL Editor:

```sql
-- Create profile-pictures bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Create client-audio-files bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'client-audio-files',
  'client-audio-files',
  false,
  5368709120, -- 5GB in bytes
  ARRAY['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/flac', 'audio/x-flac', 'audio/aiff', 'audio/x-aiff', 'audio/mp4', 'audio/aac']
);
```

## Storage Policies Needed

After creating buckets, set up Row Level Security (RLS) policies:

### For `profile-pictures` (Public bucket)

```sql
-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload own profile pictures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update own photos
CREATE POLICY "Users can update own profile pictures"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access (it's a public bucket)
CREATE POLICY "Public can view profile pictures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');
```

### For `client-audio-files` (Private bucket)

```sql
-- Allow admins to upload audio files for any user
CREATE POLICY "Admins can upload audio files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'client-audio-files' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow users to read their own audio files
CREATE POLICY "Users can access own audio files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'client-audio-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow admins to delete audio files
CREATE POLICY "Admins can delete audio files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'client-audio-files' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

## Code Fix Applied

Also fixed bucket name mismatch in `/app/profile/page.tsx`:
- Changed from `'profile-photos'` ❌ to `'profile-pictures'` ✅

## Next Steps

1. Create both buckets in Supabase Dashboard
2. Apply the storage policies above
3. Test profile picture upload on main profile page
4. Test song upload in admin client library

Both features should work once buckets are created!
