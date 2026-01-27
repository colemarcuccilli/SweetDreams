import Link from "next/link";
import styles from "./FeaturedProject.module.css";

export default function FeaturedProject() {
  return (
    <Link href="/work/nissan-warsaw-dealership" className={styles.projectLink}>
      <section className={styles.videoSection} data-cursor-hide>
        <div className={styles.videoContainer}>
          <div className={styles.videoBox}>
            {/* Cloudflare Stream Video Background */}
            <iframe
              src="https://customer-w6h9o08eg118alny.cloudflarestream.com/700297c313e97262173f0c2107f3b8db/iframe?muted=true&autoplay=true&loop=true&controls=false"
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
                  NISSAN WARSAW
                </div>

                {/* View Project Button - Top Right */}
                <div className={styles.viewButton}>
                  <span className={styles.viewButtonText}>VIEW PROJECT</span>
                </div>
              </div>

              {/* Center Title - Absolute Positioned */}
              <div className={styles.centerTitle}>
                <div>
                  <div className={styles.titleText}>NISSAN</div>
                  <div className={styles.titleText}>COMMERCIAL</div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className={styles.bottomRow}>
                {/* Subtitle - Bottom Left */}
                <div className={styles.subtitle}>
                  DEALERSHIP COMMERCIAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Link>
  );
}
