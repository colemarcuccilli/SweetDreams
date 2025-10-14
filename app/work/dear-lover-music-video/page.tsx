import Link from "next/link";
import styles from "./project.module.css";

export default function DearLoverPage() {
  const project = {
    title: 'DEAR LOVER - MUSIC VIDEO',
    client_name: 'Lyaz',
    description: 'Cinematic music video bringing artistic vision to life through compelling visuals.',
    category: 'Music Video',
    location: 'Fort Wayne, IN',
    year: 2025,
    services: ['Scripting', 'Cinematography', 'Editing'],
    full_description: 'Collaborated with artist Lyaz to create a visually stunning music video for "Dear Lover." This project combined creative scripting with dynamic cinematography to tell a compelling visual story that perfectly complements the music and artist\'s vision.',
    coming_soon: true
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
          <span className={styles.clientName}>{project.client_name}</span>
        </div>
      </header>

      {/* Coming Soon Placeholder */}
      <section className={styles.videoSection}>
        <div
          className={styles.videoWrapper}
          style={{
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
            borderRadius: '24px'
          }}
        >
          <div style={{ textAlign: 'center', color: 'white' }}>
            <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '64px', margin: '0 0 16px 0' }}>
              COMING SOON
            </h2>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '18px', opacity: 0.8 }}>
              This project is currently in production
            </p>
          </div>
        </div>
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
