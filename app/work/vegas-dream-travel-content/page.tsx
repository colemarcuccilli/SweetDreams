import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export default function VegasDreamPage() {
  const project = {
    title: 'VEGAS DREAM - TRAVEL CONTENT',
    client_name: 'Sweet Dreams Media',
    client_logo_url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/sweetDreamsProdlogo.png',
    cloudflare_stream_id: 'd4d46f1d90853aa20d9719646ddea539',
    description: 'Cinematic travel content showcasing the vibrant energy and luxury of Las Vegas',
    category: 'Commercial',
    location: 'Las Vegas, Nevada',
    year: 2024,
    services: ['Video Production', 'Travel Content', 'Cinematic'],
    full_description: 'A stunning visual journey through Las Vegas, capturing the city\'s iconic landmarks, luxurious hotels, and electric atmosphere. This travel content piece showcases our ability to create compelling destination marketing materials.',
    additional_videos: [
      { id: 'a3cd0eb92f95b9b5bef859c197a91465', title: 'Vegas Old Style - Vertical Format' }
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
                <div className={styles.verticalVideoWrapper}>
                  <VideoPlayer videoId={video.id} className={styles.verticalVideoWrapper} playTextSize="small" />
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
