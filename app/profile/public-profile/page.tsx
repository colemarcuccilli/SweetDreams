'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import styles from './profile-editor.module.css';

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  public_profile_slug: string;
  bio: string | null;
  profile_picture_url: string | null;
  cover_photo_url: string | null;
  square_photo_url: string | null;
  tall_photo_url: string | null;
  gallery_photo_1_url: string | null;
  gallery_photo_2_url: string | null;
  gallery_photo_3_url: string | null;
  social_links: {
    instagram?: string;
    spotify?: string;
    twitter?: string;
    youtube?: string;
    soundcloud?: string;
    website?: string;
  };
}

interface Deliverable {
  id: string;
  display_name: string;
  file_name: string;
  file_type: string;
  file_size: number;
  description: string | null;
}

interface ShowcaseItem {
  id: string;
  deliverable_id: string;
  custom_title: string | null;
  custom_description: string | null;
  display_order: number;
  is_public: boolean;
  is_released: boolean;
  release_date: string | null;
  spotify_link: string | null;
  apple_music_link: string | null;
  youtube_link: string | null;
  soundcloud_link: string | null;
  deliverables: Deliverable;
}

interface Project {
  id: string;
  user_id: string;
  project_name: string;
  project_type: string | null;
  description: string | null;
  cover_image_url: string | null;
  release_date: string | null;
  display_order: number;
  is_public: boolean;
  spotify_link: string | null;
  apple_music_link: string | null;
  youtube_link: string | null;
  soundcloud_link: string | null;
  bandcamp_link: string | null;
  tidal_link: string | null;
  amazon_music_link: string | null;
  deezer_link: string | null;
  custom_links: any;
}

export default function ProfileEditorPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    spotify: '',
    twitter: '',
    youtube: '',
    soundcloud: '',
    website: ''
  });

  // Image URLs
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [squarePhotoUrl, setSquarePhotoUrl] = useState('');
  const [tallPhotoUrl, setTallPhotoUrl] = useState('');
  const [gallery1Url, setGallery1Url] = useState('');
  const [gallery2Url, setGallery2Url] = useState('');
  const [gallery3Url, setGallery3Url] = useState('');

  // Upload states
  const [uploading, setUploading] = useState<string | null>(null);

  // Audio showcase
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [availableDeliverables, setAvailableDeliverables] = useState<Deliverable[]>([]);
  const [editingTrack, setEditingTrack] = useState<string | null>(null);

  // Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [addingNewProject, setAddingNewProject] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchShowcase();
      fetchDeliverables();
      fetchProjects();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile/me');
      const data = await response.json();

      if (data.success && data.profile) {
        const p = data.profile;
        setProfile(p);
        setDisplayName(p.display_name || '');
        setBio(p.bio || '');
        setCoverPhotoUrl(p.cover_photo_url || '');
        setProfilePictureUrl(p.profile_picture_url || '');
        setSquarePhotoUrl(p.square_photo_url || '');
        setTallPhotoUrl(p.tall_photo_url || '');
        setGallery1Url(p.gallery_photo_1_url || '');
        setGallery2Url(p.gallery_photo_2_url || '');
        setGallery3Url(p.gallery_photo_3_url || '');
        setSocialLinks(p.social_links || {});
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShowcase = async () => {
    try {
      const response = await fetch('/api/profile/showcase');
      const data = await response.json();

      if (data.success) {
        setShowcaseItems(data.showcase || []);
      }
    } catch (error) {
      console.error('Error fetching showcase:', error);
    }
  };

  const fetchDeliverables = async () => {
    try {
      const response = await fetch('/api/library/my-files');
      const data = await response.json();

      if (data.success) {
        setAvailableDeliverables(data.deliverables || []);
      }
    } catch (error) {
      console.error('Error fetching deliverables:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/profile/projects');
      const data = await response.json();

      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
      const response = await fetch('/api/profile/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();

      if (data.project) {
        setProjects([...projects, data.project]);
        setAddingNewProject(false);
        alert('✅ Project created successfully!');
      } else {
        alert('❌ Failed to create project: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('❌ Failed to create project');
    }
  };

  const handleUpdateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const response = await fetch('/api/profile/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, ...updates })
      });

      const data = await response.json();

      if (data.project) {
        setProjects(projects.map(p => p.id === projectId ? data.project : p));
        setEditingProject(null);
        alert('✅ Project updated successfully!');
      } else {
        alert('❌ Failed to update project: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('❌ Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`/api/profile/projects?project_id=${projectId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setProjects(projects.filter(p => p.id !== projectId));
        alert('✅ Project deleted successfully!');
      } else {
        alert('❌ Failed to delete project: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('❌ Failed to delete project');
    }
  };

  const handleImageUpload = async (file: File, imageType: string, setUrlFunc: (url: string) => void) => {
    setUploading(imageType);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('imageType', imageType);

      const response = await fetch('/api/profile/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success && data.url) {
        setUrlFunc(data.url);
        alert('✅ Image uploaded successfully!');
      } else {
        const errorMsg = data.details || data.error || 'Unknown error';
        if (errorMsg.includes('mime type') || errorMsg.includes('not supported')) {
          alert('❌ Image format not supported. Please use JPG, JPEG, or WEBP format.');
        } else {
          alert('❌ Failed to upload image: ' + errorMsg);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('❌ Failed to upload image. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
  };

  const handleSaveProfile = async () => {
    if (!displayName) {
      alert('Display name is required');
      return;
    }

    const slug = generateSlug(displayName);

    if (!slug) {
      alert('Display name must contain at least one letter or number');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/profile/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          public_profile_slug: slug,
          bio,
          cover_photo_url: coverPhotoUrl,
          profile_picture_url: profilePictureUrl,
          square_photo_url: squarePhotoUrl,
          tall_photo_url: tallPhotoUrl,
          gallery_photo_1_url: gallery1Url,
          gallery_photo_2_url: gallery2Url,
          gallery_photo_3_url: gallery3Url,
          social_links: socialLinks
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Profile saved successfully!');
        setProfile(data.profile);
      } else {
        alert('Failed to save profile: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddToShowcase = async (deliverableId: string) => {
    try {
      const response = await fetch('/api/profile/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliverable_id: deliverableId,
          display_order: showcaseItems.length
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchShowcase();
      } else {
        alert('Failed to add to showcase: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding to showcase:', error);
      alert('Failed to add to showcase');
    }
  };

  const handleUpdateShowcaseItem = async (
    showcaseId: string,
    updates: {
      custom_title?: string;
      custom_description?: string;
      is_public?: boolean;
      is_released?: boolean;
      release_date?: string;
      spotify_link?: string;
      apple_music_link?: string;
      youtube_link?: string;
      soundcloud_link?: string;
    }
  ) => {
    try {
      const response = await fetch('/api/profile/showcase', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showcase_id: showcaseId, ...updates })
      });

      const data = await response.json();

      if (data.success) {
        fetchShowcase();
        alert('Track updated successfully!');
      } else {
        alert('Failed to update track: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating showcase item:', error);
      alert('Failed to update track');
    }
  };

  const handleRemoveFromShowcase = async (showcaseId: string) => {
    if (!confirm('Remove this track from your public profile?')) return;

    try {
      const response = await fetch('/api/profile/showcase', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showcase_id: showcaseId })
      });

      const data = await response.json();

      if (data.success) {
        fetchShowcase();
      } else {
        alert('Failed to remove from showcase: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error removing from showcase:', error);
      alert('Failed to remove from showcase');
    }
  };

  if (authLoading || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading your profile...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const generatedSlug = displayName ? generateSlug(displayName) : '';
  const publicUrl = generatedSlug
    ? `sweetdreams.us/profiles/${generatedSlug}`
    : 'Enter your artist name above to generate your profile URL';

  const showcaseDeliverableIds = showcaseItems.map(item => item.deliverable_id);
  const deliverablesNotInShowcase = availableDeliverables.filter(
    d => !showcaseDeliverableIds.includes(d.id)
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Your Public Profile</h1>
        <p className={styles.subtitle}>Create your artist profile to share with the world</p>
      </div>

      {/* PUBLIC URL PREVIEW */}
      <div className={styles.urlPreview}>
        <span className={styles.urlLabel}>Your Public URL:</span>
        {generatedSlug ? (
          <a
            href={`/profiles/${generatedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.urlLink}
          >
            {publicUrl}
          </a>
        ) : (
          <span className={styles.urlPlaceholder}>{publicUrl}</span>
        )}
      </div>

      {/* MAIN PROFILE INFO */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile Information</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Artist Name *</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g., Jay Valleo"
            className={styles.input}
          />
          <p className={styles.hint}>
            Your profile URL will be auto-generated from your artist name (spaces removed)
          </p>
          {generatedSlug && (
            <p className={styles.slugPreview}>
              URL slug: <strong>{generatedSlug}</strong>
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself..."
            className={styles.textarea}
            rows={5}
          />
        </div>
      </section>

      {/* IMAGES SECTION */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile Images</h2>

        {/* Cover Photo */}
        <div className={styles.imageUploadGroup}>
          <label className={styles.label}>Cover Photo (Wide Banner)</label>
          <p className={styles.imageHint}>Recommended: 1920x400px</p>
          {coverPhotoUrl && (
            <img src={coverPhotoUrl} alt="Cover preview" className={styles.imagePreview} />
          )}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file, 'cover', setCoverPhotoUrl);
            }}
            disabled={uploading === 'cover'}
            className={styles.fileInput}
          />
          {uploading === 'cover' && <p className={styles.uploading}>Uploading...</p>}
        </div>

        {/* Profile Picture */}
        <div className={styles.imageUploadGroup}>
          <label className={styles.label}>Profile Picture (Round)</label>
          <p className={styles.imageHint}>Recommended: Square aspect ratio, 500x500px</p>
          {profilePictureUrl && (
            <img src={profilePictureUrl} alt="Profile preview" className={styles.imagePreviewRound} />
          )}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file, 'profile', setProfilePictureUrl);
            }}
            disabled={uploading === 'profile'}
            className={styles.fileInput}
          />
          {uploading === 'profile' && <p className={styles.uploading}>Uploading...</p>}
        </div>

        {/* Square Photo */}
        <div className={styles.imageUploadGroup}>
          <label className={styles.label}>Square Photo</label>
          <p className={styles.imageHint}>For social media sharing - 1200x1200px (JPG, JPEG, or WEBP only)</p>
          {squarePhotoUrl && (
            <img src={squarePhotoUrl} alt="Square preview" className={styles.imagePreviewSquare} />
          )}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file, 'square', setSquarePhotoUrl);
            }}
            disabled={uploading === 'square'}
            className={styles.fileInput}
          />
          {uploading === 'square' && <p className={styles.uploading}>Uploading...</p>}
        </div>

        {/* Tall Photo */}
        <div className={styles.imageUploadGroup}>
          <label className={styles.label}>Tall Photo (Portrait)</label>
          <p className={styles.imageHint}>Vertical format - 800x1200px (JPG, JPEG, or WEBP only)</p>
          {tallPhotoUrl && (
            <img src={tallPhotoUrl} alt="Tall preview" className={styles.imagePreviewTall} />
          )}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file, 'tall', setTallPhotoUrl);
            }}
            disabled={uploading === 'tall'}
            className={styles.fileInput}
          />
          {uploading === 'tall' && <p className={styles.uploading}>Uploading...</p>}
        </div>
      </section>

      {/* SOCIAL LINKS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Social Links</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Instagram</label>
          <input
            type="url"
            value={socialLinks.instagram || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
            placeholder="https://instagram.com/yourhandle"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Spotify</label>
          <input
            type="url"
            value={socialLinks.spotify || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, spotify: e.target.value })}
            placeholder="https://open.spotify.com/artist/..."
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Twitter</label>
          <input
            type="url"
            value={socialLinks.twitter || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
            placeholder="https://twitter.com/yourhandle"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>YouTube</label>
          <input
            type="url"
            value={socialLinks.youtube || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
            placeholder="https://youtube.com/@yourhandle"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>SoundCloud</label>
          <input
            type="url"
            value={socialLinks.soundcloud || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, soundcloud: e.target.value })}
            placeholder="https://soundcloud.com/yourhandle"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Website</label>
          <input
            type="url"
            value={socialLinks.website || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
            placeholder="https://yourwebsite.com"
            className={styles.input}
          />
        </div>
      </section>

      {/* AUDIO SHOWCASE */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Public Audio Showcase</h2>
        <p className={styles.sectionDescription}>
          Select which files from your library appear on your public profile and manage their metadata
        </p>

        {showcaseItems.length > 0 && (
          <div className={styles.showcaseList}>
            <h3 className={styles.subsectionTitle}>Currently on your profile:</h3>
            {showcaseItems.map((item) => (
              <div key={item.id} className={styles.showcaseCard}>
                <div className={styles.showcaseHeader}>
                  <div>
                    <div className={styles.showcaseName}>
                      {item.custom_title || item.deliverables.display_name}
                    </div>
                    <div className={styles.showcaseStatus}>
                      {item.is_public ? (
                        <span className={styles.statusPublic}>✅ Public</span>
                      ) : (
                        <span className={styles.statusPrivate}>🔒 Private</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingTrack(editingTrack === item.id ? null : item.id)}
                    className={styles.editButton}
                  >
                    {editingTrack === item.id ? 'Close' : 'Edit Details'}
                  </button>
                </div>

                {editingTrack === item.id && (
                  <TrackMetadataEditor
                    item={item}
                    onUpdate={(updates) => handleUpdateShowcaseItem(item.id, updates)}
                  />
                )}

                <div className={styles.showcaseActions}>
                  <button
                    onClick={() => handleRemoveFromShowcase(item.id)}
                    className={styles.removeButton}
                  >
                    Remove from Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deliverablesNotInShowcase.length > 0 && (
          <div className={styles.availableList}>
            <h3 className={styles.subsectionTitle}>Add from your library:</h3>
            {deliverablesNotInShowcase.map((deliverable) => (
              <div key={deliverable.id} className={styles.availableItem}>
                <div className={styles.availableInfo}>
                  <div className={styles.availableName}>{deliverable.display_name}</div>
                  <div className={styles.availableMeta}>{deliverable.file_name}</div>
                </div>
                <button
                  onClick={() => handleAddToShowcase(deliverable.id)}
                  className={styles.addButton}
                >
                  Add to Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {availableDeliverables.length === 0 && (
          <p className={styles.emptyText}>
            No audio files in your library yet. Files uploaded by the studio will appear here.
          </p>
        )}
      </section>

      {/* PROJECTS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Projects</h2>
        <p className={styles.sectionDescription}>
          Showcase your albums, singles, EPs, and other projects with links to streaming platforms
        </p>

        {projects.length > 0 && (
          <div className={styles.showcaseList}>
            {projects.map((project) => (
              <div key={project.id} className={styles.showcaseCard}>
                <div className={styles.showcaseHeader}>
                  <div>
                    <div className={styles.showcaseName}>{project.project_name}</div>
                    {project.project_type && (
                      <div className={styles.showcaseMeta}>{project.project_type.toUpperCase()}</div>
                    )}
                    <div className={styles.showcaseStatus}>
                      {project.is_public ? (
                        <span className={styles.statusPublic}>✅ Public</span>
                      ) : (
                        <span className={styles.statusPrivate}>🔒 Private</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingProject(editingProject === project.id ? null : project.id)}
                    className={styles.editButton}
                  >
                    {editingProject === project.id ? 'Close' : 'Edit Project'}
                  </button>
                </div>

                {editingProject === project.id && (
                  <ProjectEditor
                    project={project}
                    onUpdate={(updates) => handleUpdateProject(project.id, updates)}
                    onDelete={() => handleDeleteProject(project.id)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {!addingNewProject ? (
          <button
            onClick={() => setAddingNewProject(true)}
            className={styles.addButton}
            style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
          >
            + Add New Project
          </button>
        ) : (
          <NewProjectForm
            onSave={handleCreateProject}
            onCancel={() => setAddingNewProject(false)}
          />
        )}

        {projects.length === 0 && !addingNewProject && (
          <p className={styles.emptyText}>
            No projects yet. Click "Add New Project" to showcase your albums, singles, or EPs.
          </p>
        )}
      </section>

      {/* SAVE BUTTON */}
      <div className={styles.saveContainer}>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className={styles.saveButton}
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}

// Track Metadata Editor Component
function TrackMetadataEditor({
  item,
  onUpdate
}: {
  item: ShowcaseItem;
  onUpdate: (updates: any) => void;
}) {
  const [customTitle, setCustomTitle] = useState(item.custom_title || '');
  const [customDescription, setCustomDescription] = useState(item.custom_description || '');
  const [isPublic, setIsPublic] = useState(item.is_public ?? true);
  const [isReleased, setIsReleased] = useState(item.is_released || false);
  const [releaseDate, setReleaseDate] = useState(item.release_date || '');
  const [spotifyLink, setSpotifyLink] = useState(item.spotify_link || '');
  const [appleMusicLink, setAppleMusicLink] = useState(item.apple_music_link || '');
  const [youtubeLink, setYoutubeLink] = useState(item.youtube_link || '');
  const [soundcloudLink, setSoundcloudLink] = useState(item.soundcloud_link || '');

  const handleSave = () => {
    onUpdate({
      custom_title: customTitle,
      custom_description: customDescription,
      is_public: isPublic,
      is_released: isReleased,
      release_date: releaseDate || null,
      spotify_link: spotifyLink,
      apple_music_link: appleMusicLink,
      youtube_link: youtubeLink,
      soundcloud_link: soundcloudLink
    });
  };

  return (
    <div className={styles.metadataEditor}>
      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <span style={{ fontWeight: 700, color: isPublic ? '#4CAF50' : '#ff4444' }}>
            {isPublic ? '✅ Public - Visible on your profile' : '🔒 Private - Hidden from profile'}
          </span>
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Custom Track Title</label>
        <input
          type="text"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder={item.deliverables.display_name}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Custom Description</label>
        <textarea
          value={customDescription}
          onChange={(e) => setCustomDescription(e.target.value)}
          placeholder="Add a description for this track..."
          className={styles.textarea}
          rows={3}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isReleased}
            onChange={(e) => setIsReleased(e.target.checked)}
          />
          <span>This track is publicly released on streaming platforms</span>
        </label>
      </div>

      {isReleased && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Release Date</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className={styles.input}
          />
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label}>Spotify Link</label>
        <input
          type="url"
          value={spotifyLink}
          onChange={(e) => setSpotifyLink(e.target.value)}
          placeholder="https://open.spotify.com/track/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Apple Music Link</label>
        <input
          type="url"
          value={appleMusicLink}
          onChange={(e) => setAppleMusicLink(e.target.value)}
          placeholder="https://music.apple.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>YouTube Link</label>
        <input
          type="url"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>SoundCloud Link</label>
        <input
          type="url"
          value={soundcloudLink}
          onChange={(e) => setSoundcloudLink(e.target.value)}
          placeholder="https://soundcloud.com/..."
          className={styles.input}
        />
      </div>

      <button onClick={handleSave} className={styles.saveMetadataButton}>
        Save Track Details
      </button>
    </div>
  );
}

// Project Editor Component
function ProjectEditor({
  project,
  onUpdate,
  onDelete
}: {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
  onDelete: () => void;
}) {
  const [projectName, setProjectName] = useState(project.project_name);
  const [projectType, setProjectType] = useState(project.project_type || '');
  const [description, setDescription] = useState(project.description || '');
  const [isPublic, setIsPublic] = useState(project.is_public);
  const [releaseDate, setReleaseDate] = useState(project.release_date || '');
  const [spotifyLink, setSpotifyLink] = useState(project.spotify_link || '');
  const [appleMusicLink, setAppleMusicLink] = useState(project.apple_music_link || '');
  const [youtubeLink, setYoutubeLink] = useState(project.youtube_link || '');
  const [soundcloudLink, setSoundcloudLink] = useState(project.soundcloud_link || '');
  const [bandcampLink, setBandcampLink] = useState(project.bandcamp_link || '');
  const [tidalLink, setTidalLink] = useState(project.tidal_link || '');
  const [amazonMusicLink, setAmazonMusicLink] = useState(project.amazon_music_link || '');
  const [deezerLink, setDeezerLink] = useState(project.deezer_link || '');

  const handleSave = () => {
    onUpdate({
      project_name: projectName,
      project_type: projectType,
      description,
      is_public: isPublic,
      release_date: releaseDate || null,
      spotify_link: spotifyLink,
      apple_music_link: appleMusicLink,
      youtube_link: youtubeLink,
      soundcloud_link: soundcloudLink,
      bandcamp_link: bandcampLink,
      tidal_link: tidalLink,
      amazon_music_link: amazonMusicLink,
      deezer_link: deezerLink
    });
  };

  return (
    <div className={styles.metadataEditor}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Album/Single/EP name"
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Project Type</label>
        <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className={styles.input}>
          <option value="">Select type...</option>
          <option value="album">Album</option>
          <option value="single">Single</option>
          <option value="ep">EP</option>
          <option value="mixtape">Mixtape</option>
          <option value="compilation">Compilation</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this project..."
          className={styles.textarea}
          rows={3}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <span style={{ fontWeight: 700, color: isPublic ? '#4CAF50' : '#ff4444' }}>
            {isPublic ? '✅ Public - Visible on your profile' : '🔒 Private - Hidden from profile'}
          </span>
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Release Date</label>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          className={styles.input}
        />
      </div>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>
        Streaming Platform Links
      </h4>

      <div className={styles.formGroup}>
        <label className={styles.label}>🎵 Spotify</label>
        <input
          type="url"
          value={spotifyLink}
          onChange={(e) => setSpotifyLink(e.target.value)}
          placeholder="https://open.spotify.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>🍎 Apple Music</label>
        <input
          type="url"
          value={appleMusicLink}
          onChange={(e) => setAppleMusicLink(e.target.value)}
          placeholder="https://music.apple.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>▶️ YouTube</label>
        <input
          type="url"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder="https://youtube.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>☁️ SoundCloud</label>
        <input
          type="url"
          value={soundcloudLink}
          onChange={(e) => setSoundcloudLink(e.target.value)}
          placeholder="https://soundcloud.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>🎸 Bandcamp</label>
        <input
          type="url"
          value={bandcampLink}
          onChange={(e) => setBandcampLink(e.target.value)}
          placeholder="https://yourname.bandcamp.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>🌊 Tidal</label>
        <input
          type="url"
          value={tidalLink}
          onChange={(e) => setTidalLink(e.target.value)}
          placeholder="https://tidal.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>📦 Amazon Music</label>
        <input
          type="url"
          value={amazonMusicLink}
          onChange={(e) => setAmazonMusicLink(e.target.value)}
          placeholder="https://music.amazon.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>🎶 Deezer</label>
        <input
          type="url"
          value={deezerLink}
          onChange={(e) => setDeezerLink(e.target.value)}
          placeholder="https://deezer.com/..."
          className={styles.input}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={handleSave} className={styles.saveMetadataButton} style={{ flex: 1 }}>
          Save Project
        </button>
        <button
          onClick={onDelete}
          className={styles.removeButton}
          style={{ flex: 1, padding: '1rem 2rem' }}
        >
          Delete Project
        </button>
      </div>
    </div>
  );
}

// New Project Form Component
function NewProjectForm({
  onSave,
  onCancel
}: {
  onSave: (projectData: Partial<Project>) => void;
  onCancel: () => void;
}) {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [releaseDate, setReleaseDate] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const [appleMusicLink, setAppleMusicLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [soundcloudLink, setSoundcloudLink] = useState('');
  const [bandcampLink, setBandcampLink] = useState('');
  const [tidalLink, setTidalLink] = useState('');
  const [amazonMusicLink, setAmazonMusicLink] = useState('');
  const [deezerLink, setDeezerLink] = useState('');

  const handleSubmit = () => {
    if (!projectName) {
      alert('Project name is required');
      return;
    }

    onSave({
      project_name: projectName,
      project_type: projectType,
      description,
      is_public: isPublic,
      release_date: releaseDate || null,
      spotify_link: spotifyLink,
      apple_music_link: appleMusicLink,
      youtube_link: youtubeLink,
      soundcloud_link: soundcloudLink,
      bandcamp_link: bandcampLink,
      tidal_link: tidalLink,
      amazon_music_link: amazonMusicLink,
      deezer_link: deezerLink
    });
  };

  return (
    <div className={styles.metadataEditor} style={{ marginTop: '1rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 700 }}>Add New Project</h3>

      <div className={styles.formGroup}>
        <label className={styles.label}>Project Name *</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Album/Single/EP name"
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Project Type</label>
        <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className={styles.input}>
          <option value="">Select type...</option>
          <option value="album">Album</option>
          <option value="single">Single</option>
          <option value="ep">EP</option>
          <option value="mixtape">Mixtape</option>
          <option value="compilation">Compilation</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this project..."
          className={styles.textarea}
          rows={3}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <span style={{ fontWeight: 700, color: isPublic ? '#4CAF50' : '#ff4444' }}>
            {isPublic ? '✅ Public - Visible on your profile' : '🔒 Private - Hidden from profile'}
          </span>
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Release Date</label>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          className={styles.input}
        />
      </div>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>
        Streaming Platform Links
      </h4>

      <div className={styles.formGroup}>
        <label className={styles.label}>🎵 Spotify</label>
        <input
          type="url"
          value={spotifyLink}
          onChange={(e) => setSpotifyLink(e.target.value)}
          placeholder="https://open.spotify.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>🍎 Apple Music</label>
        <input
          type="url"
          value={appleMusicLink}
          onChange={(e) => setAppleMusicLink(e.target.value)}
          placeholder="https://music.apple.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>▶️ YouTube</label>
        <input
          type="url"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder="https://youtube.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>☁️ SoundCloud</label>
        <input
          type="url"
          value={soundcloudLink}
          onChange={(e) => setSoundcloudLink(e.target.value)}
          placeholder="https://soundcloud.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>🎸 Bandcamp</label>
        <input
          type="url"
          value={bandcampLink}
          onChange={(e) => setBandcampLink(e.target.value)}
          placeholder="https://yourname.bandcamp.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>🌊 Tidal</label>
        <input
          type="url"
          value={tidalLink}
          onChange={(e) => setTidalLink(e.target.value)}
          placeholder="https://tidal.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>📦 Amazon Music</label>
        <input
          type="url"
          value={amazonMusicLink}
          onChange={(e) => setAmazonMusicLink(e.target.value)}
          placeholder="https://music.amazon.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>🎶 Deezer</label>
        <input
          type="url"
          value={deezerLink}
          onChange={(e) => setDeezerLink(e.target.value)}
          placeholder="https://deezer.com/..."
          className={styles.input}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={handleSubmit} className={styles.saveMetadataButton} style={{ flex: 1 }}>
          Create Project
        </button>
        <button
          onClick={onCancel}
          className={styles.removeButton}
          style={{ flex: 1, padding: '1rem 2rem', background: '#999' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
