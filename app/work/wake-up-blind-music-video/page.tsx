import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export default function WakeUpBlindPage() {
  const project = {
    title: 'WAKE UP BLIND MUSIC VIDEO',
    client_name: 'Jay Val Leo',
    client_logo_url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/sign/media/logos/sweetDreamsMusiclogo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzYzNTA0Yi05ZmEzLTQxNjAtYWRiZC05OTcyOWUwYTk0YTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9sb2dvcy9zd2VldERyZWFtc011c2ljbG9nby5wbmciLCJpYXQiOjE3NTcyNzg4OTAsImV4cCI6MTc4ODgxNDg5MH0.SogeQrBgMCfd_XhnmlwI3cNxKc1b9mJv5fUU__FMJwA',
    cloudflare_stream_id: '9db7601df93c3b1634ac41ad715aa9c6',
    description: 'Official music video for Wake Up Blind featuring cinematic storytelling and performance footage.',
    category: 'Music Video',
    location: 'Indiana',
    year: 2024,
    services: ['Music Video Production', 'Cinematography', 'Post-Production', 'Creative Direction'],
    full_description: 'Full music video production showcasing the artist\'s vision through professional cinematography, lighting, and post-production techniques that enhance the song\'s emotional impact.',
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
        <Link href="/contact" className={styles.ctaButton}>
          GET IN TOUCH
        </Link>
      </section>
    </div>
  );
}
