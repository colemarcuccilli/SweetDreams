import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export default function MCSimRacingPage() {
  const project = {
    title: 'MC SIM RACING',
    client_name: 'MC Sim Racing',
    client_logo_url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/logoMCSimRacing.png',
    cloudflare_stream_id: 'a279eed7ef4ceef1b3b257b0fb4dfc67',
    description: 'A dynamic brand video showcasing the immersive sim racing experience.',
    category: 'Brand Video',
    location: 'Fort Wayne, IN',
    year: 2025,
    services: ['Cinematography', 'Editing', 'Color Grading', 'Sound Design'],
    full_description: 'MC Sim Racing brings professional-grade racing simulation to Fort Wayne. This brand video captures the excitement and immersion of their state-of-the-art sim racing facility, showcasing the thrill of competitive racing in a controlled environment.',
    additional_images: []
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

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>READY TO CREATE SOMETHING AMAZING?</h2>
        <Link href="/media#contact" className={styles.ctaButton}>
          GET IN TOUCH
        </Link>
      </section>
    </div>
  );
}
