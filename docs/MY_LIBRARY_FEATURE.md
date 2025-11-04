# 📚 My Library Feature - Complete Implementation Guide

## 🎯 Feature Overview

**Purpose:** Give clients a secure portal to download their audio files and view timestamped communication logs from the studio.

**Benefits:**
- Increases user engagement (better SEO)
- Professional client experience
- Centralized file delivery
- Timestamped communication history
- Secure, logged-in access only

---

## 🏗️ Architecture

### **Storage Solution: Supabase Storage**
- **Bucket Name:** `client-audio-files`
- **File Types:** `.wav`, `.mp3`, `.flac`, `.aiff`
- **Max File Size:** 5GB per file (Supabase limit)
- **Security:** Row Level Security (RLS) + Signed URLs

### **Database Tables**

#### **1. `deliverables` Table**
Tracks metadata for audio files uploaded to Supabase Storage.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to `auth.users` |
| `file_name` | TEXT | Original filename |
| `display_name` | TEXT | Friendly name shown to client |
| `file_path` | TEXT | Path in Storage bucket |
| `file_size` | BIGINT | Size in bytes |
| `file_type` | TEXT | MIME type |
| `uploaded_by` | UUID | Admin who uploaded |
| `uploaded_by_name` | TEXT | Admin's display name |
| `description` | TEXT | Optional notes |
| `created_at` | TIMESTAMPTZ | Upload timestamp |
| `updated_at` | TIMESTAMPTZ | Last modified |

#### **2. `library_notes` Table**
Communication log between engineers and clients.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to `auth.users` |
| `admin_id` | UUID | Admin who wrote note |
| `admin_name` | TEXT | Admin's display name |
| `note_content` | TEXT | The message/note |
| `created_at` | TIMESTAMPTZ | When note was added |

---

## 🔒 Security (Row Level Security)

### **Deliverables RLS Policies**
1. ✅ Clients can **read** their own files
2. ✅ Admins can **read** all files
3. ✅ Admins can **insert** new files
4. ✅ Admins can **update** file metadata
5. ✅ Admins can **delete** files

### **Library Notes RLS Policies**
1. ✅ Clients can **read** their own notes
2. ✅ Admins can **read** all notes
3. ✅ Admins can **insert** new notes
4. ✅ Admins can **update** notes
5. ✅ Admins can **delete** notes

### **Supabase Storage RLS**
- Users can only download files they own
- Admins can upload/manage all files
- Signed URLs with expiration (24 hours)

---

## 🚀 Implementation Steps

### **Step 1: Database Setup**

1. **Run Migration in Supabase Dashboard**
   - Go to: SQL Editor
   - Run: `supabase/migrations/create_my_library_tables.sql`
   - Verify tables created: `deliverables`, `library_notes`

2. **Create Storage Bucket**
   - Go to: Storage → Create Bucket
   - **Name:** `client-audio-files`
   - **Public:** OFF (Private bucket)
   - **File Size Limit:** 5GB
   - **Allowed MIME types:**
     - `audio/wav`
     - `audio/mpeg`
     - `audio/flac`
     - `audio/x-aiff`

3. **Set Storage RLS Policies**

```sql
-- Allow authenticated users to read their own files
CREATE POLICY "Users can read their own audio files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'client-audio-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to insert files
CREATE POLICY "Admins can upload audio files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'client-audio-files' AND
  auth.jwt() ->> 'email' IN (
    'cole@sweetdreamsmusic.com',
    'jayvalleo@sweetdreamsmusic.com',
    'cole@marcuccilli.com'
  )
);

-- Allow admins to delete files
CREATE POLICY "Admins can delete audio files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'client-audio-files' AND
  auth.jwt() ->> 'email' IN (
    'cole@sweetdreamsmusic.com',
    'jayvalleo@sweetdreamsmusic.com',
    'cole@marcuccilli.com'
  )
);
```

---

### **Step 2: API Routes**

#### **Admin Upload API** - `/api/admin/library/upload`
```typescript
POST /api/admin/library/upload
Content-Type: multipart/form-data

Body:
  - file: File
  - userId: UUID
  - displayName: string (optional)
  - description: string (optional)

Response:
  { success: true, deliverable: {...} }
```

#### **Admin Notes API** - `/api/admin/library/notes`
```typescript
POST /api/admin/library/notes
Body:
  {
    userId: UUID,
    noteContent: string
  }

Response:
  { success: true, note: {...} }

GET /api/admin/library/notes?userId=xxx
Response:
  { notes: [...] }
```

#### **Client Library API** - `/api/library/my-files`
```typescript
GET /api/library/my-files
Response:
  {
    deliverables: [...],
    notes: [...]
  }
```

#### **Client Download API** - `/api/library/download/[fileId]`
```typescript
GET /api/library/download/[fileId]
Response:
  { signedUrl: "https://..." } // 24-hour expiration
```

---

### **Step 3: UI Components**

#### **Admin Panel** - `/profile/admin/clients`

**File Upload Section:**
```
┌─────────────────────────────────┐
│ Upload Audio File               │
├─────────────────────────────────┤
│ Client: [Dropdown]              │
│ File: [Choose File]             │
│ Display Name: [Input]           │
│ Description: [Textarea]         │
│ [Upload File]                   │
└─────────────────────────────────┘
```

**Notes Section:**
```
┌─────────────────────────────────┐
│ Studio Notes                    │
├─────────────────────────────────┤
│ Nov 4, 2025 - 11:50 AM (Jay)   │
│ "Hey, uploaded final master..." │
├─────────────────────────────────┤
│ Oct 28, 2025 - 3:15 PM (Jay)   │
│ "Here is the first mix..."      │
├─────────────────────────────────┤
│ Add New Note:                   │
│ [Textarea]                      │
│ [Add Note]                      │
└─────────────────────────────────┘
```

#### **Client Portal** - `/profile/library`

```
┌─────────────────────────────────────────┐
│ 🎵 My Library                           │
├─────────────────────────────────────────┤
│                                         │
│ 📁 Project Files                        │
│ ┌─────────────────────────────────────┐ │
│ │ 🎵 Sunrise - Final Master.wav      │ │
│ │    Uploaded: Nov 4, 2025           │ │
│ │    Size: 45.2 MB                   │ │
│ │    [⬇ Download]                    │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 🎵 Sunrise - Instrumental.wav      │ │
│ │    Uploaded: Nov 4, 2025           │ │
│ │    Size: 43.8 MB                   │ │
│ │    [⬇ Download]                    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 📝 Studio Notes & Updates               │
│ ┌─────────────────────────────────────┐ │
│ │ Nov 4, 2025 - 11:50 AM             │ │
│ │ From: Jay Val Leo                  │ │
│ │                                     │ │
│ │ "Hey, just uploaded the final      │ │
│ │  master for 'Sunrise.' The 4K      │ │
│ │  music video files are too big     │ │
│ │  for the library, so here is the   │ │
│ │  secure link: [link]"              │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Oct 28, 2025 - 3:15 PM             │ │
│ │ From: Jay Val Leo                  │ │
│ │                                     │ │
│ │ "Here is the first mix for         │ │
│ │  'Sunrise.' Let me know your       │ │
│ │  thoughts!"                         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 📁 File Structure

```
app/
├── api/
│   ├── admin/
│   │   └── library/
│   │       ├── upload/route.ts          # File upload
│   │       ├── notes/route.ts           # CRUD notes
│   │       └── deliverables/route.ts    # Manage files
│   └── library/
│       ├── my-files/route.ts            # Client's files + notes
│       └── download/[fileId]/route.ts   # Generate signed URL
├── profile/
│   ├── library/                         # Client portal
│   │   └── page.tsx
│   └── admin/
│       └── clients/
│           └── [userId]/                # Admin per-client view
│               └── page.tsx
└── components/
    └── library/
        ├── FileUploader.tsx             # Admin upload component
        ├── NotesList.tsx                # Display notes
        ├── NotesForm.tsx                # Add new note
        └── FileList.tsx                 # Display files

lib/
└── supabase/
    └── storage.ts                       # Storage helper functions

supabase/
└── migrations/
    └── create_my_library_tables.sql     # Database schema
```

---

## 🔧 Helper Functions

### **Storage Helpers** - `lib/supabase/storage.ts`

```typescript
// Upload file to Supabase Storage
export async function uploadAudioFile(
  file: File,
  userId: string
): Promise<string> {
  const supabase = createClient();
  const filePath = `${userId}/${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from('client-audio-files')
    .upload(filePath, file);

  if (error) throw error;
  return filePath;
}

// Get signed URL for download (24 hour expiration)
export async function getDownloadUrl(
  filePath: string
): Promise<string> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from('client-audio-files')
    .createSignedUrl(filePath, 86400); // 24 hours

  if (error) throw error;
  return data.signedUrl;
}

// Delete file from storage
export async function deleteAudioFile(
  filePath: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from('client-audio-files')
    .remove([filePath]);

  if (error) throw error;
}
```

---

## 🧪 Testing Checklist

### **Admin Tests**
- [ ] Admin can upload .wav file
- [ ] Admin can upload .mp3 file
- [ ] Admin can see all clients' files
- [ ] Admin can add note for client
- [ ] Admin can edit note
- [ ] Admin can delete file
- [ ] Admin can delete note

### **Client Tests**
- [ ] Client can see only their own files
- [ ] Client can download file (signed URL works)
- [ ] Client can see only their own notes
- [ ] Client CANNOT see other clients' files
- [ ] Client CANNOT see other clients' notes
- [ ] Client CANNOT upload files (no access)

### **Security Tests**
- [ ] Non-admin cannot access upload API
- [ ] Client cannot access other user's files via URL manipulation
- [ ] Signed URLs expire after 24 hours
- [ ] RLS policies block unauthorized access

---

## 📊 SEO Benefits

### **How This Improves SEO**

1. **User Engagement:**
   - Clients visit site repeatedly to check for new files
   - Increased page views, longer session duration
   - Lower bounce rate

2. **Authentic Traffic:**
   - Real users logging in regularly
   - Google recognizes this as valuable content

3. **Content Freshness:**
   - Regular uploads = regularly updated content
   - Google favors sites with fresh content

4. **User Signals:**
   - High return visitor rate
   - Multiple pages per session
   - Strong user engagement metrics

---

## 🚨 Important Notes

### **File Size Considerations**
- **Supabase Free Tier:** 1GB total storage
- **Pro Tier ($25/mo):** 100GB storage, then $0.021/GB
- **Large 4K Videos:** Use external services (WeTransfer, Frame.io, Google Drive)
  - Add links to these in studio notes instead

### **File Naming Convention**
```
Storage Path: {userId}/{timestamp}_{original_filename}
Example: 550e8400-e29b-41d4-a716-446655440000/1699123456789_Sunrise_Final.wav
```

### **Security Best Practices**
- ✅ Always use signed URLs (not public URLs)
- ✅ Set expiration on signed URLs (24 hours)
- ✅ Verify user ownership before generating URLs
- ✅ Use RLS policies on both database and storage
- ✅ Log all admin actions (who uploaded what, when)

---

## 🎨 Design Guidelines

### **Colors**
- **Primary:** Gold (#FFD700) - For download buttons
- **Background:** Dark (#000000)
- **Text:** White (#FFFFFF)
- **Cards:** Dark gray (#1A1A1A)
- **Borders:** Subtle gray (#333333)

### **Typography**
- **Headers:** Bold, uppercase
- **File names:** Monospace font
- **Notes:** Regular, readable font
- **Timestamps:** Small, muted gray

---

This feature transforms your website into a client portal, dramatically increasing engagement and SEO value! 🚀
