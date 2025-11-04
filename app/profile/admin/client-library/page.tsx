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
  created_at: string;
}

interface Note {
  id: string;
  admin_name: string;
  note_content: string;
  created_at: string;
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
  const [addingNote, setAddingNote] = useState(false);

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
      const filesResponse = await fetch(`/api/admin/library/notes?userId=${client.id}`);
      const filesData = await filesResponse.json();

      // Fetch client's notes
      const notesResponse = await fetch(`/api/admin/library/notes?userId=${client.id}`);
      const notesData = await notesResponse.json();

      if (filesData.success) {
        // TODO: Need to create an API to fetch deliverables by userId
        setDeliverables([]);
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
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('userId', selectedClient.id);
      formData.append('displayName', displayName);
      formData.append('description', description);

      const response = await fetch('/api/admin/library/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert('File uploaded successfully!');
        setUploadFile(null);
        setDisplayName('');
        setDescription('');
        // Refresh client data
        handleSelectClient(selectedClient);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
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
          noteContent: noteContent.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Note added successfully!');
        setNoteContent('');
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
                  <div className={styles.clientInitial}>
                    {client.firstName?.[0]}{client.lastName?.[0]}
                  </div>
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
              {/* File Upload Section */}
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

              {/* Add Note Section */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>📝 Add Studio Note</h2>
                <div className={styles.noteForm}>
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

                {/* Notes History */}
                {notes.length > 0 && (
                  <div className={styles.notesHistory}>
                    <h3 className={styles.historyTitle}>Recent Notes</h3>
                    {notes.map((note) => (
                      <div key={note.id} className={styles.noteCard}>
                        <div className={styles.noteHeader}>
                          <span className={styles.noteDate}>
                            {format(new Date(note.created_at), 'MMM d, yyyy - h:mm a')}
                          </span>
                          <span className={styles.noteAuthor}>by {note.admin_name}</span>
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
