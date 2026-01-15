import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export default function TheColemanPrimeStoryPage() {
  const project = {
    title: 'THE COLEMAN PRIME STORY',
    client_name: 'Coleman Prime',
    client_logos: [
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/ColemanLogo.png',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/PrimeLogo.png'
    ],
    cloudflare_stream_id: 'b8e9c3a7d4f2e1a0c5b6d7e8f9a0b1c2',
    description: 'A cinematic brand story capturing the essence of Coleman Prime.',
    category: 'Brand Trailer',
    location: 'Spirit Lake, Iowa',
    year: 2025,
    services: ['Brand Strategy', 'Cinematography', 'Editing', 'Color Grading'],
    full_description: 'The Coleman Prime Story is a compelling brand trailer that showcases the partnership and vision behind Coleman Prime. Through cinematic storytelling, we captured the essence of the brand and its commitment to excellence.',
    mainVideo: 'd08682649901944d9bbec1dcfb8bde88',
    additionalVideos: [
      { id: 'c46eb869bbbeda7428508ee7dc053479', title: 'The Investor Advantage' },
      { id: '51d9ae67e3bc5fd3fefd3a0729331064', title: '90 Day Playbook' }
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
          <div className={styles.clientLogos}>
            {project.client_logos.map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt={project.client_name}
                className={styles.clientLogo}
              />
            ))}
          </div>
          <span className={styles.clientName}>{project.client_name}</span>
        </div>
      </header>

      {/* Main Video */}
      <section className={styles.videoSection}>
        <VideoPlayer videoId={project.mainVideo} className={styles.videoWrapper} playTextSize="large" thumbnailTime="89s" />
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
      {project.additionalVideos.length > 0 && (
        <section className={styles.gallery}>
          <h2 className={styles.sectionTitle}>MORE VIDEOS</h2>
          <div className={styles.galleryGrid}>
            {project.additionalVideos.map((video, index) => (
              <div key={index} className={styles.galleryItem}>
                <VideoPlayer
                  videoId={video.id}
                  className={styles.additionalVideoWrapper}
                  playTextSize="small"
                />
                <span className={styles.videoTitle}>{video.title}</span>
              </div>
            ))}
          </div>
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
