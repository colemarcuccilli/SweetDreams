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
    services: ['Offer Restructure', 'Website Development', 'Pre Production Planning', 'Content Management', 'Cinematography', 'Editing', 'Color Grading', 'Sound Design'],
    full_description: 'MC Sim Racing brings professional-grade racing simulation to Fort Wayne. This brand video captures the excitement and immersion of their state-of-the-art sim racing facility, showcasing the thrill of competitive racing in a controlled environment.',
  };

  const baseUrl = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/MCSimRacing/';

  const photos = [
    { src: 'MCRacingSignBest.webp', orientation: 'horizontal' },
    { src: 'SimRacer.webp', orientation: 'vertical' },
    { src: 'FocusedDadRacing.webp', orientation: 'vertical' },
    { src: 'WideTwoRacingBays.webp', orientation: 'horizontal' },
    { src: 'CloseUpSteeringWheelRacerHands.webp', orientation: 'horizontal' },
    { src: 'FocusedKidRacing.webp', orientation: 'vertical' },
    { src: 'GroupParty.webp', orientation: 'horizontal' },
    { src: 'CloseUpOnGearGauge.webp', orientation: 'horizontal' },
    { src: 'FocusedYoungAdultRacing.webp', orientation: 'vertical' },
    { src: 'FullRCTrackWide.webp', orientation: 'horizontal' },
    { src: 'BigRCCarsLinedUp.webp', orientation: 'horizontal' },
    { src: 'KidRacing.webp', orientation: 'vertical' },
    { src: 'CloseUpRacerYoke.webp', orientation: 'horizontal' },
    { src: 'MarkFocusedRacing.webp', orientation: 'vertical' },
    { src: 'RedLitEmptySimStation.webp', orientation: 'horizontal' },
    { src: 'RacerusingSimZoomedOut.webp', orientation: 'horizontal' },
    { src: 'CloseUpYokewithRacer.webp', orientation: 'vertical' },
    { src: 'MCRacingLogoOnMasterDesk.webp', orientation: 'horizontal' },
    { src: 'SideAngleBigRCCars.webp', orientation: 'horizontal' },
    { src: 'BackofAlpineRacingChair.webp', orientation: 'vertical' },
    { src: 'FocusedOverShoulderRacer.webp', orientation: 'horizontal' },
    { src: 'OverShoulderWheelandGearGauge.webp', orientation: 'horizontal' },
    { src: 'RCCarsSmallLinedUp.webp', orientation: 'horizontal' },
  ];

  const verticalVideos = [
    { id: 'b5b461c1a3791279f69b426b39558e1f', title: 'Car Intense Edit' },
    { id: '776063bc562625a47dbd5f3f7764fd2f', title: "Dad's Excitement" },
    { id: '85ca4a25e0d4f4ab71294112ce8f3413', title: 'RC Stack Race' },
    { id: '10e5d054472cd5299baf26c0fe8817c2', title: 'Finally Indy 500' },
    { id: '0d3d36ac3df0c739d425feebb833dc30', title: 'Hit The Gap' },
  ];

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

      {/* Vertical Videos Section */}
      <section className={styles.gallery}>
        <h2 className={styles.sectionTitle}>SHORT FORM CONTENT</h2>
        <div className={styles.verticalVideosRow}>
          {verticalVideos.map((video, index) => (
            <div key={index} className={styles.verticalVideoItem}>
              <VideoPlayer
                videoId={video.id}
                className={styles.verticalVideoWrapper}
                playTextSize="small"
              />
              <span className={styles.videoTitle}>{video.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Gallery */}
      <section className={styles.gallery}>
        <h2 className={styles.sectionTitle}>PHOTO GALLERY</h2>
        <div className={styles.masonryGrid}>
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`${styles.masonryItem} ${photo.orientation === 'vertical' ? styles.masonryVertical : styles.masonryHorizontal}`}
            >
              <img
                src={`${baseUrl}${photo.src}`}
                alt={photo.src.replace('.webp', '').replace(/([A-Z])/g, ' $1').trim()}
                className={styles.masonryImage}
              />
            </div>
          ))}
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
