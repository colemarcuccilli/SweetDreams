'use client';

import { useState, useEffect } from 'react';
import { formatFileSize } from '@/lib/supabase/storage';
import { format } from 'date-fns';
import styles from './library.module.css';

interface Deliverable {
  id: string;
  file_name: string;
  display_name: string;
  file_size: number;
  file_type: string;
  uploaded_by_name: string;
  description: string | null;
  created_at: string;
}

interface LibraryNote {
  id: string;
  admin_name: string;
  note_content: string;
  created_at: string;
  category: string;
}

export default function MyLibraryPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [notes, setNotes] = useState<LibraryNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const response = await fetch('/api/library/my-files');
      const data = await response.json();

      if (data.success) {
        setDeliverables(data.deliverables);
        setNotes(data.notes);
      } else {
        alert('Failed to load library: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching library:', error);
      alert('Failed to load library');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (deliverable: Deliverable) => {
    setDownloadingId(deliverable.id);

    try {
      // Step 1: Get the signed URL from our API
      const response = await fetch(`/api/library/download/${deliverable.id}`);
      const data = await response.json();

      if (!data.success || !data.signedUrl) {
        alert('Failed to download file: ' + (data.error || 'Unknown error'));
        return;
      }

      // Step 2: Fetch the actual file as a blob
      const fileResponse = await fetch(data.signedUrl);
      if (!fileResponse.ok) {
        throw new Error('Failed to fetch file');
      }

      const blob = await fileResponse.blob();

      // Step 3: Create a blob URL and force download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = data.displayName || data.fileName || deliverable.file_name;
      document.body.appendChild(link);
      link.click();

      // Step 4: Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    } finally {
      setDownloadingId(null);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('wav')) return '🎵';
    if (fileType.includes('mp3') || fileType.includes('mpeg')) return '🎶';
    if (fileType.includes('flac')) return '💿';
    if (fileType.includes('aiff')) return '🎼';
    return '🎧';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading your library...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎵 My Library</h1>
        <p className={styles.subtitle}>Your audio files and studio updates</p>
      </div>

      {/* PROJECT FILES SECTION */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📁 Project Files</h2>

        {deliverables.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No files yet. Your audio files will appear here once uploaded by the studio.</p>
          </div>
        ) : (
          <div className={styles.filesList}>
            {deliverables.map((file) => (
              <div key={file.id} className={styles.fileCard}>
                <div className={styles.fileIcon}>
                  {getFileIcon(file.file_type)}
                </div>
                <div className={styles.fileInfo}>
                  <h3 className={styles.fileName}>{file.display_name}</h3>
                  <div className={styles.fileMetadata}>
                    <span className={styles.fileSize}>
                      {formatFileSize(file.file_size)}
                    </span>
                    <span className={styles.fileDivider}>•</span>
                    <span className={styles.fileDate}>
                      Uploaded {format(new Date(file.created_at), 'MMM d, yyyy')}
                    </span>
                    {file.uploaded_by_name && (
                      <>
                        <span className={styles.fileDivider}>•</span>
                        <span className={styles.fileUploader}>
                          by {file.uploaded_by_name}
                        </span>
                      </>
                    )}
                  </div>
                  {file.description && (
                    <p className={styles.fileDescription}>{file.description}</p>
                  )}
                </div>
                <button
                  className={styles.downloadButton}
                  onClick={() => handleDownload(file)}
                  disabled={downloadingId === file.id}
                >
                  {downloadingId === file.id ? (
                    <>⏳ Generating...</>
                  ) : (
                    <>⬇️ Download</>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* STUDIO NOTES SECTION */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📝 Studio Notes & Updates</h2>

        {notes.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No studio notes yet. Messages from the studio will appear here.</p>
          </div>
        ) : (
          <div className={styles.notesList}>
            {notes.map((note) => (
              <div key={note.id} className={`${styles.noteCard} ${styles[note.category || 'general']}`}>
                <div className={styles.noteHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span className={styles.noteDate}>
                      {format(new Date(note.created_at), 'MMM d, yyyy - h:mm a')}
                    </span>
                    <span className={`${styles.categoryBadge} ${styles[note.category || 'general']}`}>
                      {note.category || 'general'}
                    </span>
                  </div>
                  <span className={styles.noteAuthor}>
                    from {note.admin_name}
                  </span>
                </div>
                <div className={styles.noteContent}>
                  {note.note_content}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
