import Link from "next/link";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>ABOUT US</h1>
          <p className={styles.subtitle}>
            Sweet Dreams Music & Media is a creative agency based in Fort Wayne, Indiana,
            dedicated to helping brands and artists tell their stories through powerful visual content.
          </p>
        </div>

        <section className={styles.section}>
          <div className={styles.twoColumn}>
            <div>
              <h2 className={styles.sectionTitle}>OUR STORY</h2>
              <p className={styles.text}>
                Founded with a passion for storytelling and a commitment to quality, Sweet Dreams has grown
                from a small recording studio to a full-service creative agency serving clients across the Midwest and beyond.
              </p>
              <p className={styles.text}>
                We believe every brand has a story worth telling. Our job is to help you tell it in a way
                that resonates with your audience and drives real results.
              </p>
            </div>
            <div className={styles.imageBlock}>
              <img
                src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png"
                alt="Sweet Dreams Logo"
                className={styles.logo}
              />
            </div>
          </div>
        </section>

        <section className={styles.valuesSection}>
          <h2 className={styles.sectionTitle}>WHAT WE BELIEVE</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h3>Quality Over Quantity</h3>
              <p>We'd rather create one piece of content that truly moves people than a hundred that get scrolled past.</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Story First</h3>
              <p>Every project starts with understanding your "why." The technical stuff comes after we nail the narrative.</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Partnership Mindset</h3>
              <p>We're not just vendors. We're invested in your success and treat every project like it's our own.</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>LET'S CREATE SOMETHING</h2>
          <Link href="/book" className={styles.ctaButton}>
            BOOK A CALL
          </Link>
        </section>
      </div>
    </div>
  );
}
