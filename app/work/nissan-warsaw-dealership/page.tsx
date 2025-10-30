import Link from "next/link";
import styles from "./project.module.css";

export default function NissanWarsawPage() {
  const project = {
    title: 'NISSAN WARSAW DEALERSHIP COMMERCIAL',
    client_name: 'Nissan Warsaw Dealer',
    client_logo_url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/nissanredlogo.png',
    description: 'Professional dealership commercial showcasing Nissan vehicles and customer experience.',
    category: 'Commercial',
    location: 'Warsaw, IN',
    year: 2025,
    services: ['Cinematography', 'Editing', 'Color Grading'],
    full_description: 'Created a polished commercial for Nissan\'s Warsaw dealership that highlights their vehicle selection and customer service excellence. The project showcases the dealership experience and the quality that customers can expect.',
    cloudflare_video_uid: '700297c313e97262173f0c2107f3b8db',
    coming_soon: false
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

      {/* Video Section */}
      <section className={styles.videoSection}>
        <div className={styles.videoWrapper} style={{ aspectRatio: '16/9' }}>
          <iframe
            src={`https://customer-w6h9o08eg118alny.cloudflarestream.com/${project.cloudflare_video_uid}/iframe?preload=true&poster=https%3A%2F%2Fcustomer-w6h9o08eg118alny.cloudflarestream.com%2F${project.cloudflare_video_uid}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D2s%26height%3D600`}
            style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
          />
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
