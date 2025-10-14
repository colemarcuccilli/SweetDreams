import Link from "next/link";
import styles from "./project.module.css";

export default function VintageFestPage() {
  const project = {
    title: 'VINTAGE FEST FORT WAYNE',
    client_name: 'Vintage Fest',
    client_logo_url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SummitCityVintageLogo.jpg',
    description: 'Festival recap capturing the unique atmosphere of Fort Wayne\'s vintage celebration.',
    category: 'Commercial',
    location: 'Fort Wayne, IN',
    year: 2025,
    services: ['Cinematography', 'Editing', 'Color Grading'],
    full_description: 'Documented the unique atmosphere and community spirit of Fort Wayne\'s Vintage Fest. This freelance project captures the nostalgia, music, and vintage culture that makes this annual celebration special for attendees and vendors alike.',
    additional_images: [
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DJI_20250817131856_0026_D.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DJI_20250817131904_0029_D.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DJI_20250817133118_0038_D.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DSC07195.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DSC07198.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DSC07208.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DSC07212.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DSC07218.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DSC07223.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DSC07224.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DSC07227.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DSC07228.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DSC07231.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DSC07243.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DSC07244.jpg'
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

      {/* Hero Image */}
      <section className={styles.videoSection}>
        <div className={styles.videoWrapper} style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: '24px' }}>
          <img
            src={project.additional_images[0]}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

      {/* Photo Gallery */}
      {project.additional_images && project.additional_images.length > 0 && (
        <section className={styles.gallery}>
          <h2 className={styles.sectionTitle}>PROJECT GALLERY</h2>
          <div className={styles.photoGalleryGrid}>
            {project.additional_images.slice(1).map((image, index) => (
              <div key={index} className={styles.galleryImageItem}>
                <img
                  src={image}
                  alt={`Project image ${index + 2}`}
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
