import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { formatFileSize } from '@/lib/supabase/storage';
import { Instagram, Music2, Twitter, Youtube, Cloud, Globe, Music, Apple, Package, Waves } from 'lucide-react';
import styles from './public-profile.module.css';

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  public_profile_slug: string;
  bio: string | null;
  profile_picture_url: string | null;
  photo_1_url: string | null;
  photo_2_url: string | null;
  photo_3_url: string | null;
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

interface ShowcaseItem {
  id: string;
  custom_title: string | null;
  custom_description: string | null;
  display_order: number;
  deliverable_id: string;
  deliverables: {
    id: string;
    display_name: string;
    file_name: string;
    file_type: string;
    file_size: number;
    description: string | null;
  }[];
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

async function getProfileBySlug(slug: string) {
  const supabase = await createClient();

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('public_profile_slug', slug)
    .single();

  if (profileError || !profile) {
    return null;
  }

  // Fetch showcase items
  const { data: showcaseItems } = await supabase
    .from('profile_audio_showcase')
    .select(`
      id,
      custom_title,
      custom_description,
      display_order,
      deliverable_id,
      deliverables (
        id,
        display_name,
        file_name,
        file_type,
        file_size,
        description
      )
    `)
    .eq('user_id', profile.user_id)
    .eq('is_public', true)
    .order('display_order', { ascending: true });

  // Fetch projects
  const { data: projects } = await supabase
    .from('profile_projects')
    .select('*')
    .eq('user_id', profile.user_id)
    .eq('is_public', true)
    .order('display_order', { ascending: true });

  return {
    profile: profile as Profile,
    showcase: (showcaseItems || []) as ShowcaseItem[],
    projects: (projects || [])
  };
}

export default async function PublicProfilePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const data = await getProfileBySlug(slug);

  if (!data) {
    notFound();
  }

  const { profile, showcase, projects } = data;

  // Separate photo types for different sections
  const galleryPhotos = [
    profile.gallery_photo_1_url,
    profile.gallery_photo_2_url,
    profile.gallery_photo_3_url
  ].filter((url): url is string => Boolean(url));

  const socialLinks = profile.social_links || {};
  const hasSocialLinks = Object.values(socialLinks).some(link => link);

  return (
    <div className={styles.container}>
      {/* BANNER PHOTO */}
      {profile.cover_photo_url && (
        <div className={styles.bannerPhoto}>
          <img
            src={profile.cover_photo_url}
            alt={`${profile.display_name} banner`}
            className={styles.bannerImage}
          />
        </div>
      )}

      {/* HEADER SECTION */}
      <header className={styles.header}>
        {profile.profile_picture_url && (
          <img
            src={profile.profile_picture_url}
            alt={profile.display_name}
            className={styles.profilePicture}
          />
        )}

        <div className={styles.headerInfo}>
          <h1 className={styles.displayName}>{profile.display_name}</h1>

          {profile.bio && (
            <p className={styles.bio}>{profile.bio}</p>
          )}

          {hasSocialLinks && (
            <div className={styles.socialLinks}>
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  title="Instagram"
                >
                  <Instagram size={18} />
                  <span>Instagram</span>
                </a>
              )}
              {socialLinks.spotify && (
                <a
                  href={socialLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  title="Spotify"
                >
                  <Music2 size={18} />
                  <span>Spotify</span>
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  title="Twitter"
                >
                  <Twitter size={18} />
                  <span>Twitter</span>
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  title="YouTube"
                >
                  <Youtube size={18} />
                  <span>YouTube</span>
                </a>
              )}
              {socialLinks.soundcloud && (
                <a
                  href={socialLinks.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  title="SoundCloud"
                >
                  <Cloud size={18} />
                  <span>SoundCloud</span>
                </a>
              )}
              {socialLinks.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  title="Website"
                >
                  <Globe size={18} />
                  <span>Website</span>
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {/* FEATURED TALL PHOTO */}
      {profile.tall_photo_url && (
        <section className={styles.featuredTallSection}>
          <h2 className={styles.sectionTitle}>Featured</h2>
          <div className={styles.tallPhotoContainer}>
            <img
              src={profile.tall_photo_url}
              alt={`${profile.display_name} featured`}
              className={styles.tallPhoto}
            />
          </div>
        </section>
      )}

      {/* FEATURED SQUARE PHOTO */}
      {profile.square_photo_url && (
        <section className={styles.featuredSquareSection}>
          <h2 className={styles.sectionTitle}>Spotlight</h2>
          <div className={styles.squarePhotoContainer}>
            <img
              src={profile.square_photo_url}
              alt={`${profile.display_name} spotlight`}
              className={styles.squarePhoto}
            />
          </div>
        </section>
      )}

      {/* PHOTO GALLERY */}
      {galleryPhotos.length > 0 && (
        <section className={styles.photoGallery}>
          <h2 className={styles.sectionTitle}>Gallery</h2>
          <div className={styles.photoGrid}>
            {galleryPhotos.map((photoUrl, index) => (
              <img
                key={index}
                src={photoUrl}
                alt={`${profile.display_name} - Photo ${index + 1}`}
                className={styles.galleryPhoto}
              />
            ))}
          </div>
        </section>
      )}

      {/* AUDIO SHOWCASE */}
      {showcase.length > 0 && (
        <section className={styles.audioShowcase}>
          <h2 className={styles.sectionTitle}>Audio Showcase</h2>
          <div className={styles.audioList}>
            {showcase.map((item) => {
              const deliverable = item.deliverables?.[0];
              if (!deliverable) return null;

              const title = item.custom_title || deliverable.display_name;
              const description = item.custom_description || deliverable.description;

              return (
                <div key={item.id} className={styles.audioItem}>
                  <div className={styles.audioInfo}>
                    <h3 className={styles.audioTitle}>{title}</h3>
                    {description && (
                      <p className={styles.audioDescription}>{description}</p>
                    )}
                    <div className={styles.audioMeta}>
                      {deliverable.file_type} • {formatFileSize(deliverable.file_size)}
                    </div>
                  </div>

                  <div className={styles.audioPlayerPlaceholder}>
                    🎧 Audio player coming soon
                    <div className={styles.audioFileName}>
                      {deliverable.file_name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className={styles.audioShowcase} style={{ margin: '0 2rem 4rem 2rem' }}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <div className={styles.audioList}>
            {projects.map((project) => {
              const platformLinks = [
                { name: 'Spotify', url: project.spotify_link, Icon: Music2 },
                { name: 'Apple Music', url: project.apple_music_link, Icon: Apple },
                { name: 'YouTube', url: project.youtube_link, Icon: Youtube },
                { name: 'SoundCloud', url: project.soundcloud_link, Icon: Cloud },
                { name: 'Bandcamp', url: project.bandcamp_link, Icon: Music },
                { name: 'Tidal', url: project.tidal_link, Icon: Waves },
                { name: 'Amazon Music', url: project.amazon_music_link, Icon: Package },
                { name: 'Deezer', url: project.deezer_link, Icon: Music }
              ].filter(link => link.url);

              return (
                <div key={project.id} className={styles.audioItem}>
                  <div className={styles.audioInfo}>
                    <h3 className={styles.audioTitle}>
                      {project.project_name}
                      {project.project_type && (
                        <span style={{
                          marginLeft: '1rem',
                          fontSize: '0.8em',
                          fontWeight: 500,
                          color: '#666',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          {project.project_type}
                        </span>
                      )}
                    </h3>
                    {project.description && (
                      <p className={styles.audioDescription}>{project.description}</p>
                    )}
                    {project.release_date && (
                      <div className={styles.audioMeta}>
                        Released: {new Date(project.release_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                  </div>

                  {platformLinks.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      marginTop: '1.5rem'
                    }}>
                      {platformLinks.map((link) => {
                        const IconComponent = link.Icon;
                        return (
                          <a
                            key={link.name}
                            href={link.url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            title={link.name}
                            style={{ fontSize: '0.95rem', padding: '0.6rem 1.2rem' }}
                          >
                            <IconComponent size={16} />
                            <span>{link.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {showcase.length === 0 && galleryPhotos.length === 0 && !profile.bio && (
        <div className={styles.emptyState}>
          <p>This profile is still being set up. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
