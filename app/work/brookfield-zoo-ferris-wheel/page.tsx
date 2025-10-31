import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";
import PhotoGallery from "@/components/PhotoGallery";

export default function BrookfieldZooPage() {
  const project = {
    title: 'BROOKFIELD ZOO FERRIS WHEEL COMMERCIAL',
    client_name: 'RideWorx & Brookfield Zoo',
    client_logo_url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/BrookfieldZooLogo.png',
    cloudflare_stream_id: 'b3b94bd1543e2452571b90aab0a38e9b',
    description: 'Dynamic commercial highlighting the new ferris wheel attraction at Brookfield Zoo.',
    category: 'Commercial',
    location: 'Brookfield, Illinois',
    year: 2025,
    services: ['Scripting', 'Cinematography', 'Editing', 'Color Grading'],
    full_description: 'Partnered with RideWorx and Brookfield Zoo to create a compelling commercial that showcases their new ferris wheel attraction. The project captures the excitement of families enjoying this unique zoo experience while highlighting the beautiful park setting.',
    additional_images: [
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/BrookfieldZoo/_DSC8300.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/BrookfieldZoo/_DSC8303.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/BrookfieldZoo/_DSC8322.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/BrookfieldZoo/_DSC8364.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/BrookfieldZoo/_DSC8396.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/BrookfieldZoo/_DSC8429.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/BrookfieldZoo/_DSC8445.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/BrookfieldZoo/_DSC8487.webp'
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

      {/* Image Gallery */}
      {project.additional_images && project.additional_images.length > 0 && (
        <section className={styles.gallery}>
          <h2 className={styles.sectionTitle}>PHOTO GALLERY</h2>
          <PhotoGallery images={project.additional_images} projectTitle={project.title} />
        </section>
      )}

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
