import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export default function SnoBizPage() {
  const project = {
    title: 'SNOB\'IZ SNOWCONE TRUCK COMMERCIAL',
    client_name: 'SnoB\'iz',
    client_logo_url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/logo-snobiz-footer-ret.png',
    cloudflare_stream_id: 'c2edacb37740868677353b6e519e8f53',
    description: 'Fun, energetic commercial for local snowcone truck business.',
    category: 'Commercial',
    location: 'New Haven, IN',
    year: 2025,
    services: ['Cinematography', 'Editing', 'Color Grading'],
    full_description: 'Created a vibrant, fun commercial for SnoB\'iz snowcone truck that captures the joy and refreshment they bring to the community. The project showcases their colorful treats and family-friendly atmosphere.',
    additional_images: [
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/SnoBizSnoCone/_DSC4925.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/SnoBizSnoCone/_DSC4935.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/SnoBizSnoCone/_DSC4956.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/SnoBizSnoCone/_DSC4960.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/SnoBizSnoCone/_DSC4973.jpg'
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

      {/* Photo Gallery */}
      {project.additional_images && project.additional_images.length > 0 && (
        <section className={styles.gallery}>
          <h2 className={styles.sectionTitle}>PROJECT GALLERY</h2>
          <div className={styles.photoGalleryGrid}>
            {project.additional_images.map((image, index) => (
              <div key={index} className={styles.galleryImageItem}>
                <img
                  src={image}
                  alt={`Project image ${index + 1}`}
                  className={styles.galleryImage}
                />
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
