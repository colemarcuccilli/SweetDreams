import Link from "next/link";
import styles from "./CTASection.module.css";

export default function CTASection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.verticalImageSection}>
          <img
            src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/team/IMPVertphoto.jpg"
            alt="Sweet Dreams Team"
            className={styles.verticalImage}
          />
        </div>
        <div className={styles.contentSection}>
          <h2 className={styles.title}>
            LET'S CREATE<br />
            SOMETHING<br />
            THAT REALLY<br />
            <span className={styles.standsOut}>STANDS OUT</span>
          </h2>
          <Link href="/media#contact" className={styles.button}>
            GET IN TOUCH
          </Link>
        </div>
      </div>
    </section>
  );
}
