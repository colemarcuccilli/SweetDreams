'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { isAdmin } from '@/lib/admin-auth';
import { formatFileSize } from '@/lib/supabase/storage';
import { format } from 'date-fns';
import styles from './client-library.module.css';

interface Client {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string | null;
  filesCount: number;
  notesCount: number;
}

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

interface Note {
  id: string;
  admin_name: string;
  note_content: string;
  created_at: string;
  category: string;
}

export default function AdminClientLibraryPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  // File upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  // Note state
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('general');
  const [addingNote, setAddingNote] = useState(false);

  // Delete state
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Form visibility state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    if (!loading && user && !isAdmin(user.email)) {
      router.push('/profile');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && isAdmin(user.email)) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/library/clients');
      const data = await response.json();

      if (data.success) {
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleSelectClient = async (client: Client) => {
    setSelectedClient(client);
    setLoadingData(true);

    try {
      // Fetch client's files
      const filesResponse = await fetch(`/api/admin/library/deliverables?userId=${client.id}`);
      const filesData = await filesResponse.json();

      // Fetch client's notes
      const notesResponse = await fetch(`/api/admin/library/notes?userId=${client.id}`);
      const notesData = await notesResponse.json();

      if (filesData.success) {
        setDeliverables(filesData.deliverables);
      }

      if (notesData.success) {
        setNotes(notesData.notes);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setDisplayName(file.name); // Default to filename
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !selectedClient) return;

    setUploading(true);

    try {
      // Upload directly to Supabase Storage (bypasses Vercel 4.5MB limit)
      const supabase = (await import('@/utils/supabase/client')).createClient();

      // Create unique filename
      const timestamp = Date.now();
      const sanitizedFileName = uploadFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${selectedClient.id}/${timestamp}_${sanitizedFileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-audio')
        .upload(filePath, uploadFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Create database record via API
      const response = await fetch('/api/admin/library/deliverables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedClient.id,
          fileName: uploadFile.name,
          displayName: displayName,
          filePath: filePath,
          fileSize: uploadFile.size,
          fileType: uploadFile.type,
          description: description
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('File uploaded successfully!');
        setUploadFile(null);
        setDisplayName('');
        setDescription('');
        setShowUploadForm(false);
        // Refresh client data
        handleSelectClient(selectedClient);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim() || !selectedClient) return;

    setAddingNote(true);

    try {
      const response = await fetch('/api/admin/library/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedClient.id,
          noteContent: noteContent.trim(),
          category: noteCategory
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Note added successfully!');
        setNoteContent('');
        setNoteCategory('general');
        setShowNoteForm(false);
        // Refresh notes
        handleSelectClient(selectedClient);
      } else {
        alert('Failed to add note: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Add note error:', error);
      alert('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"? This cannot be undone.`)) {
      return;
    }

    setDeletingFileId(fileId);

    try {
      const response = await fetch('/api/admin/library/deliverables', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliverableId: fileId })
      });

      const data = await response.json();

      if (data.success) {
        alert('File deleted successfully!');
        // Refresh client data
        if (selectedClient) {
          handleSelectClient(selectedClient);
        }
      } else {
        alert('Failed to delete file: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete file error:', error);
      alert('Failed to delete file');
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note? This cannot be undone.')) {
      return;
    }

    setDeletingNoteId(noteId);

    try {
      const response = await fetch('/api/admin/library/notes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId })
      });

      const data = await response.json();

      if (data.success) {
        alert('Note deleted successfully!');
        // Refresh client data
        if (selectedClient) {
          handleSelectClient(selectedClient);
        }
      } else {
        alert('Failed to delete note: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete note error:', error);
      alert('Failed to delete note');
    } finally {
      setDeletingNoteId(null);
    }
  };

  if (loading || loadingClients) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin(user.email)) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📚 Client Library Management</h1>
        <p className={styles.subtitle}>Upload files and manage notes for your clients</p>
      </div>

      <div className={styles.layout}>
        {/* Clients List */}
        <aside className={styles.clientsList}>
          <h2 className={styles.sidebarTitle}>Clients</h2>
          {clients.length === 0 ? (
            <p className={styles.emptyText}>No clients with bookings yet</p>
          ) : (
            <div className={styles.clientItems}>
              {clients.map((client) => (
                <button
                  key={client.id}
                  className={`${styles.clientItem} ${selectedClient?.id === client.id ? styles.clientItemActive : ''}`}
                  onClick={() => handleSelectClient(client)}
                >
                  {client.profilePhotoUrl ? (
                    <img
                      src={client.profilePhotoUrl}
                      alt={`${client.firstName} ${client.lastName}`}
                      className={styles.clientPhoto}
                    />
                  ) : (
                    <div className={styles.clientInitial}>
                      {client.firstName?.[0]}{client.lastName?.[0]}
                    </div>
                  )}
                  <div className={styles.clientInfo}>
                    <div className={styles.clientName}>
                      {client.firstName} {client.lastName}
                    </div>
                    <div className={styles.clientEmail}>{client.email}</div>
                    <div className={styles.clientCounts}>
                      {client.filesCount} files • {client.notesCount} notes
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {!selectedClient ? (
            <div className={styles.emptyState}>
              <p>Select a client to manage their library</p>
            </div>
          ) : loadingData ? (
            <div className={styles.loading}>Loading client data...</div>
          ) : (
            <>
              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className={styles.actionButton}
                >
                  📤 {showUploadForm ? 'Hide Upload Form' : 'Upload Audio File'}
                </button>
                <button
                  onClick={() => setShowNoteForm(!showNoteForm)}
                  className={styles.actionButton}
                >
                  📝 {showNoteForm ? 'Hide Note Form' : 'Add Studio Note'}
                </button>
              </div>

              {/* File Upload Section */}
              {showUploadForm && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>📤 Upload Audio File</h2>
                <div className={styles.uploadForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Choose File</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileSelect}
                      className={styles.fileInput}
                    />
                    {uploadFile && (
                      <div className={styles.filePreview}>
                        Selected: {uploadFile.name} ({formatFileSize(uploadFile.size)})
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g., Sunrise - Final Master"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Description (Optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add any notes about this file..."
                      className={styles.textarea}
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={!uploadFile || uploading}
                    className={styles.uploadButton}
                  >
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </button>
                </div>
                </section>
              )}

              {/* Add Note Section */}
              {showNoteForm && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>📝 Add Studio Note</h2>
                  <div className={styles.noteForm}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Category</label>
                      <select
                        value={noteCategory}
                        onChange={(e) => setNoteCategory(e.target.value)}
                        className={styles.categorySelect}
                      >
                        <option value="general">💬 General</option>
                        <option value="audio">🎵 Audio</option>
                        <option value="video">🎥 Video</option>
                        <option value="mixing">🎚️ Mixing</option>
                        <option value="mastering">💿 Mastering</option>
                        <option value="planning">📋 Planning</option>
                        <option value="feedback">💭 Feedback</option>
                      </select>
                    </div>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Type your message to the client here... You can include links to external video services if needed."
                      className={styles.textarea}
                      rows={5}
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={!noteContent.trim() || addingNote}
                      className={styles.addNoteButton}
                    >
                      {addingNote ? 'Adding...' : 'Add Note'}
                    </button>
                  </div>
                </section>
              )}

              {/* Uploaded Files Section */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>📁 Uploaded Files ({deliverables.length})</h2>
                {deliverables.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No files uploaded yet</p>
                  </div>
                ) : (
                  <div className={styles.filesList}>
                    {deliverables.map((file) => (
                      <div key={file.id} className={styles.fileCard}>
                        <div className={styles.fileInfo}>
                          <h3 className={styles.fileName}>{file.display_name}</h3>
                          <div className={styles.fileMetadata}>
                            <span className={styles.fileSize}>
                              {formatFileSize(file.file_size)}
                            </span>
                            <span> • </span>
                            <span>
                              {format(new Date(file.created_at), 'MMM d, yyyy')}
                            </span>
                            {file.uploaded_by_name && (
                              <>
                                <span> • </span>
                                <span>by {file.uploaded_by_name}</span>
                              </>
                            )}
                          </div>
                          {file.description && (
                            <p className={styles.fileDescription}>{file.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteFile(file.id, file.display_name)}
                          disabled={deletingFileId === file.id}
                          className={styles.deleteButton}
                          title="Delete file"
                        >
                          {deletingFileId === file.id ? '⏳' : '🗑️'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Studio Notes History */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>💬 Studio Notes ({notes.length})</h2>
                {notes.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No notes yet</p>
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span className={styles.noteAuthor}>by {note.admin_name}</span>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              disabled={deletingNoteId === note.id}
                              className={styles.deleteNoteButton}
                              title="Delete note"
                            >
                              {deletingNoteId === note.id ? '⏳' : '🗑️'}
                            </button>
                          </div>
                        </div>
                        <div className={styles.noteText}>{note.note_content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
