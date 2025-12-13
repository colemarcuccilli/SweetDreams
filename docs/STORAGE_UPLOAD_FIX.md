# Storage Upload Fix - November 2025

## Issue
Audio file uploads were failing on production (live site) but working on localhost.

**Root Cause:** Vercel Serverless Functions have a **4.5MB request body size limit** on the Hobby plan. Files larger than 4.5MB could not be uploaded through the API route.

## Solution
Implemented **direct client-to-Supabase upload** to bypass Vercel's payload limit entirely.

### How It Works

**Before (Failed on Production):**
```
Browser → Vercel API Route (4.5MB limit) → Supabase Storage ❌
```

**After (Works on Production):**
```
Browser → Supabase Storage (Direct upload) ✅
Browser → Vercel API Route (Only small JSON) → Database record ✅
```

### Technical Implementation

**File:** `app/profile/admin/client-library/page.tsx`
- Upload file directly to Supabase Storage from browser
- Create database record via API (tiny JSON payload)
- No file data passes through Vercel

**API Endpoint:** `app/api/admin/library/deliverables/route.ts`
- Added POST method to create database records
- Only receives metadata (file path, size, name)
- No file upload handling needed

### Storage Buckets

**`profile-audio` (Public Bucket)**
- All audio files stored here
- Max file size: **15MB** (Supabase free tier limit)
- Public URLs for released music
- Privacy controlled by `is_public` flag in database

**`client-audio-files` (Deprecated)**
- No longer used
- Can be deleted

**`profile-pictures` (Public Bucket)**
- Profile photos
- Max file size: **10MB**
- Allowed types: JPEG, JPG, PNG, WEBP, GIF

### Required RLS Policies

**`profile-audio` bucket:**
```sql
-- Admin upload access
CREATE POLICY "Admins can insert profile-audio"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profile-audio' AND
  auth.jwt() ->> 'email' IN ('cole@sweetdreamsmusic.com', 'jayvalleo@sweetdreamsmusic.com')
);

-- Public read access
CREATE POLICY "Public can view audio files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-audio');
```

## Testing

**✅ Verified Working:**
- 4.69 MB audio file uploaded successfully on production
- File stored in `profile-audio` bucket
- Database record created correctly
- Admin can see uploaded file in client library

## Related Changes

**Profile Photo Upload:**
- Removed from Account Info page (`/profile`)
- Only editable on Public Profile page (`/profile/public-profile`)
- Profile photos sync between both locations via API

## Files Modified

1. `app/profile/admin/client-library/page.tsx` - Direct upload implementation
2. `app/api/admin/library/deliverables/route.ts` - POST endpoint for metadata
3. `vercel.json` - Function timeout config (not needed for direct upload)
4. `lib/supabase/storage.ts` - Changed bucket from `client-audio-files` to `profile-audio`
5. `app/profile/page.tsx` - Removed profile photo upload section

## Notes

- **Max upload size:** 15MB (Supabase bucket limit)
- **Upload location:** `profile-audio` bucket
- **Vercel limit bypassed:** Files never touch Vercel infrastructure
- **Works on:** Production and localhost identically

---

**Fixed:** November 15, 2025
**Issue Duration:** Multiple attempts across session
**Final Solution:** Direct client-to-Supabase upload
