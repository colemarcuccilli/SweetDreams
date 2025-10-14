import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export default function CumberlandFallsPage() {
  const project = {
    title: 'CUMBERLAND FALLS, KY NATURE SHOWCASE',
    client_name: 'Personal Project',
    client_logo_url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/sweetDreamsProdlogo.png',
    cloudflare_stream_id: '62314c34c826a3b298815ee506ad875f',
    description: 'Cinematic showcase of the magnificent Cumberland Falls waterfall in Kentucky',
    category: 'Commercial',
    location: 'Cumberland Falls, Kentucky',
    year: 2025,
    services: ['Cinematography', 'Editing', 'Color Grading'],
    full_description: 'A breathtaking cinematic journey showcasing the natural beauty and power of Cumberland Falls, known as the "Niagara of the South." This collection captures the falls from multiple perspectives including slow-motion footage, sunrise cinematography, and unique under-bridge angles.',
    additional_videos: [
      { id: '00bab95ad8ca84e9f4dffa1c30536818', title: 'Cumberland Falls - Alternative View' }
    ]
  };

  return (
    <div className={styles.container}>
      {/* Header with title and client info */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.description}>{project.description}</p>
        </div>
        <div className={styles.clientInfo}>
          {project.client_logo_url && (
            <img
              src={project.client_logo_url}
              alt={project.client_name}
              className={styles.clientLogo}
            />
          )}
          <span className={styles.clientName}>{project.client_name}</span>
        </div>
      </header>

      {/* Main Video */}
      <section className={styles.videoSection}>
        <VideoPlayer videoId={project.cloudflare_stream_id} className={styles.videoWrapper} playTextSize="large" />
      </section>

      {/* Project Metadata */}
      <section className={styles.metadata}>
        <div className={styles.metadataGrid}>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>CATEGORY</span>
            <span className={styles.metadataValue}>{project.category}</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>LOCATION</span>
            <span className={styles.metadataValue}>{project.location}</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>YEAR</span>
            <span className={styles.metadataValue}>{project.year}</span>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className={styles.overview}>
        <h2 className={styles.sectionTitle}>PROJECT OVERVIEW</h2>
        <p className={styles.overviewText}>{project.full_description}</p>

        <div className={styles.servicesSection}>
          <h3 className={styles.servicesTitle}>SERVICES PROVIDED</h3>
          <div className={styles.servicesList}>
            {project.services.map((service, index) => (
              <span key={index} className={styles.serviceTag}>{service}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Videos */}
      {project.additional_videos && project.additional_videos.length > 0 && (
        <section className={styles.gallery}>
          <h2 className={styles.sectionTitle}>ADDITIONAL CONTENT</h2>
          <div className={styles.galleryGrid}>
            {project.additional_videos.map((video, index) => (
              <div key={index} className={styles.galleryItem}>
                <div className={styles.additionalVideoWrapper}>
                  <VideoPlayer videoId={video.id} className={styles.additionalVideoWrapper} playTextSize="small" />
                </div>
                <p className={styles.videoTitle}>{video.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>READY TO CREATE SOMETHING AMAZING?</h2>
        <Link href="/contact" className={styles.ctaButton}>
          GET IN TOUCH
        </Link>
      </section>
    </div>
  );
}
