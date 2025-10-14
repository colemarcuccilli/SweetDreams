import Link from "next/link";
import styles from "./FeaturedProject.module.css";

export default function FeaturedProject() {
  return (
    <Link href="/work/knoxville-carnival" className={styles.projectLink}>
      <section className={styles.videoSection}>
        <div className={styles.videoContainer}>
          <div className={styles.videoBox}>
            {/* Cloudflare Stream Video Background */}
            <iframe
              src="https://customer-w6h9o08eg118alny.cloudflarestream.com/3fc86dceda74ba01653ac421e0211b4c/iframe?muted=true&autoplay=true&loop=true&controls=false"
              className={styles.videoElement}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={true}
              style={{ border: 'none' }}
            />

            {/* Dark overlay for text readability */}
            <div className={styles.videoOverlay}></div>

            {/* Content Overlay */}
            <div className={styles.videoContent}>
              {/* Top Row */}
              <div className={styles.topRow}>
                {/* Client Name - Top Left */}
                <div className={styles.clientName}>
                  KISSEL ENTERTAINMENT
                </div>

                {/* View Project Button - Top Right */}
                <div className={styles.viewButton}>
                  <span className={styles.viewButtonText}>VIEW PROJECT</span>
                </div>
              </div>

              {/* Center Title - Absolute Positioned */}
              <div className={styles.centerTitle}>
                <div>
                  <div className={styles.titleText}>KNOXVILLE</div>
                  <div className={styles.titleText}>CARNIVAL</div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className={styles.bottomRow}>
                {/* Subtitle - Bottom Left */}
                <div className={styles.subtitle}>
                  EXCITING CARNIVAL HIGHLIGHTS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Link>
  );
}
