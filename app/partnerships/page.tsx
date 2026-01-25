import Link from "next/link";
import styles from "./partnerships.module.css";

export default function PartnershipsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>EXCLUSIVE OFFER</span>
          <h1 className={styles.title}>PARTNERSHIPS</h1>
          <p className={styles.subtitle}>
            Our Grand Slam Partnership is an exclusive, comprehensive media solution designed for businesses ready to dominate their market.
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>WHAT YOU GET</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Complete Brand Identity</h3>
              <p>Logo, brand guidelines, visual system, and messaging framework tailored to your market position.</p>
            </div>
            <div className={styles.card}>
              <h3>Professional Website</h3>
              <p>Custom-designed, high-converting website with SEO optimization and analytics tracking.</p>
            </div>
            <div className={styles.card}>
              <h3>Video Production</h3>
              <p>Brand films, commercials, social content, and ongoing video assets to fuel your marketing.</p>
            </div>
            <div className={styles.card}>
              <h3>Content Strategy</h3>
              <p>12-month content calendar, social media management, and performance optimization.</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>IS THIS RIGHT FOR YOU?</h2>
          <p className={styles.ctaText}>
            Our partnership program is selective. We work with businesses that are serious about growth and ready to invest in their brand.
          </p>
          <Link href="/book" className={styles.ctaButton}>
            APPLY FOR PARTNERSHIP
          </Link>
        </section>
      </div>
    </div>
  );
}
