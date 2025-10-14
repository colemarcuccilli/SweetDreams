import styles from "./Header.module.css";

export default function VideoHero() {
  return (
    <section className={styles.videoSection}>
      <div className={styles.videoContainer}>
        {/* Video Box - Rounded Rectangle */}
        <div className={styles.videoBox}>

          {/* Cloudflare Stream Video Background */}
          <iframe
            src="https://customer-w6h9o08eg118alny.cloudflarestream.com/e80443ae9084ffea8f28180125ed3e15/iframe?muted=true&autoplay=true&loop=true&controls=false"
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
                SWEET DREAMS MUSIC
              </div>

              {/* View Project Button - Top Right */}
              <button className={styles.viewButton}>
                <span className={styles.viewButtonText}>VIEW PROJECT</span>
              </button>
            </div>

            {/* Center Title - Absolute Positioned */}
            <div className={styles.centerTitle}>
              <div>
                <div className={styles.titleText}>YOUR VISION,</div>
                <div className={styles.titleText}>AMPLIFIED</div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className={styles.bottomRow}>
              {/* Subtitle - Bottom Left */}
              <div className={styles.subtitle}>
                GET NOTICED THE RIGHT WAY
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
