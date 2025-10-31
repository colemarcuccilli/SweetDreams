import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";
import PhotoGallery from "@/components/PhotoGallery";

export default function KnoxvilleCarnivalPage() {
  const project = {
    title: 'KNOXVILLE CARNIVAL',
    client_name: 'Kissel Entertainment',
    client_logo_url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/KisselLogo.png',
    cloudflare_stream_id: 'd554360a479b1380f96df7a4ef8f03a3',
    description: 'A vibrant showcase of the Knoxville Carnival featuring exciting rides, games, and community atmosphere.',
    category: 'Event Coverage',
    location: 'Knoxville, Indiana',
    year: 2024,
    services: ['Videography', 'Editing', 'Drone Footage', 'Interviews'],
    full_description: 'Sweet Dreams captured the energy and excitement of the annual Knoxville Carnival, showcasing the vibrant community event with dynamic shots of carnival rides, attendees enjoying the festivities, and the overall atmosphere of this beloved local tradition.',
    additional_videos: [
      { id: '7b576d365a6ccc9dc9c1be3e8b39ae82', title: 'Cinematic Trailer 2', aspectRatio: '16/9' },
      { id: 'b4fea9b4bb925313d6c2ad0cbdb08d19', title: 'Sunset Video', aspectRatio: '16/9' },
      { id: '2951979a7710b955fa15770099aef52a', title: 'Day Night', aspectRatio: '16/9' },
      { id: 'f4854323836cd38c28e00d3f7aa260e9', title: 'Ride Showcase (Horizontal)', aspectRatio: '16/9' },
      { id: '6b9afe5c623a2e18edbe977a800e976e', title: 'Ride Showcase (Vertical)', aspectRatio: '9/16' },
      { id: '851821b5ba9d7b4ca9abc3f80660016d', title: 'Carnival Template Video', aspectRatio: '16/9' }
    ],
    additional_images: [
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/KnoxvilleCarnival/_DSC8487.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/KnoxvilleCarnival/_DSC8871.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/KnoxvilleCarnival/_DSC8883.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/KnoxvilleCarnival/_DSC8923.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/KnoxvilleCarnival/_DSC8943.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/KnoxvilleCarnival/_DSC8976.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/KnoxvilleCarnival/_DSC9078.webp',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/KnoxvilleCarnival/_DSC9083.webp'
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

      {/* Additional Videos Gallery */}
      {project.additional_videos && project.additional_videos.length > 0 && (
        <section className={styles.gallery}>
          <h2 className={styles.sectionTitle}>MORE VIDEOS</h2>
          <div className={styles.galleryGrid}>
            {project.additional_videos.map((video, index) => (
              <div key={index} className={styles.galleryItem}>
                <VideoPlayer
                  videoId={video.id}
                  className={video.aspectRatio === '9/16' ? styles.verticalVideoWrapper : styles.additionalVideoWrapper}
                  playTextSize="small"
                />
                <p className={styles.videoTitle}>{video.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

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
