/**
 * Supabase Storage Helper Functions
 * Handles file uploads, downloads, and deletions for the My Library feature
 */

import { createClient } from '@/utils/supabase/server';

const BUCKET_NAME = 'client-audio-files';

/**
 * Upload an audio file to Supabase Storage
 * Files are stored in user-specific folders: {userId}/{timestamp}_{filename}
 *
 * @param file - The file to upload
 * @param userId - The user ID this file belongs to
 * @returns The file path in storage
 */
export async function uploadAudioFile(
  file: File,
  userId: string
): Promise<string> {
  const supabase = await createClient();

  // Create unique file path: userId/timestamp_filename
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
 * URL expires after 24 hours for security
 *
 * @param filePath - The path to the file in storage
 * @returns Signed download URL (valid for 24 hours)
 */
export async function getDownloadUrl(filePath: string): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 86400); // 24 hours in seconds

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
 *
 * @param filePath - The path to the file in storage
 */
export async function deleteAudioFile(filePath: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Get file metadata from storage (size, MIME type, etc.)
 *
 * @param filePath - The path to the file in storage
 * @returns File metadata
 */
export async function getFileMetadata(filePath: string) {
  const supabase = await createClient();

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
