/**
 * Supabase Storage Helper Functions
 * THESE ARE SERVER-SIDE ONLY - Use in API routes, not client components
 */

import { SupabaseClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'client-audio-files';

/**
 * Upload an audio file to Supabase Storage
 * SERVER-SIDE ONLY - Call from API routes
 */
export async function uploadAudioFile(
  supabase: SupabaseClient,
  file: File,
  userId: string
): Promise<string> {
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${userId}/${timestamp}_${sanitizedFileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  return filePath;
}

/**
 * Get a signed URL for downloading a file
 * SERVER-SIDE ONLY - Call from API routes
 */
export async function getDownloadUrl(
  supabase: SupabaseClient,
  filePath: string,
  fileName?: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 86400, {
      download: fileName || true // Force download with optional custom filename
    });

  if (error) {
    console.error('Signed URL error:', error);
    throw new Error(`Failed to generate download URL: ${error.message}`);
  }

  if (!data?.signedUrl) {
    throw new Error('No signed URL returned from Supabase');
  }

  return data.signedUrl;
}

/**
 * Delete a file from Supabase Storage
 * SERVER-SIDE ONLY - Call from API routes
 */
export async function deleteAudioFile(
  supabase: SupabaseClient,
  filePath: string
): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Get file metadata from storage
 * SERVER-SIDE ONLY - Call from API routes
 */
export async function getFileMetadata(
  supabase: SupabaseClient,
  filePath: string
) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(filePath.split('/')[0], {
      search: filePath.split('/')[1]
    });

  if (error) {
    console.error('Metadata error:', error);
    throw new Error(`Failed to get file metadata: ${error.message}`);
  }

  return data?.[0];
}

/**
 * Format file size for display (bytes to MB/GB)
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "45.2 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 *
 * @param filename - The filename
 * @returns Extension without dot (e.g., "wav")
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Validate audio file type
 *
 * @param file - The file to validate
 * @returns true if valid audio file
 */
export function isValidAudioFile(file: File): boolean {
  const validTypes = [
    'audio/mpeg',      // .mp3
    'audio/wav',       // .wav
    'audio/x-wav',     // .wav (alternative)
    'audio/flac',      // .flac
    'audio/x-flac',    // .flac (alternative)
    'audio/aiff',      // .aiff
    'audio/x-aiff',    // .aiff (alternative)
    'audio/mp4',       // .m4a
    'audio/aac'        // .aac
  ];

  return validTypes.includes(file.type);
}

/**
 * Validate file size (max 5GB)
 *
 * @param file - The file to validate
 * @returns true if within size limit
 */
export function isValidFileSize(file: File): boolean {
  const maxSize = 5 * 1024 * 1024 * 1024; // 5GB in bytes
  return file.size <= maxSize;
}
