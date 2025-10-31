import Link from "next/link";
import styles from "./blog.module.css";

export default function BlogPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>INSIGHTS & TIPS</p>
          <h1 className={styles.title}>Sweet Dreams Blog</h1>
          <p className={styles.subtitle}>
            Music production tips, recording techniques, and industry insights from Fort Wayne's premier recording studio.
          </p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.comingSoon}>
            <h2>Coming Soon</h2>
            <p>
              We're currently building our blog with exclusive content about music production,
              recording techniques, and behind-the-scenes studio insights.
            </p>
            <p>
              In the meantime, check out our services or book a session!
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/solutions" className={styles.primaryButton}>
                View Services
              </Link>
              <Link href="/music" className={styles.secondaryButton}>
                Book a Session
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
