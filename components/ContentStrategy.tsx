import styles from "./ContentStrategy.module.css";
import Link from "next/link";

export default function ContentStrategy() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.miniTitle}>OUR APPROACH</p>
        <h2 className={styles.title}>CONTENT THAT KEEPS THEM WATCHING</h2>

        <p className={styles.intro}>
          WE DON'T JUST CREATE ONE VIDEO AND CALL IT A DAY. WE BUILD TRUST THROUGH ENTERTAINMENT. IN 2025, YOUR AUDIENCE CONSUMES CONTENT CONSTANTLY—THEY'RE NOT READING NEWSPAPER ADS ANYMORE.
        </p>

        <div className={styles.giveGrid}>
          <div className={styles.giveCard}>
            <h3 className={styles.giveNumber}>GIVE</h3>
            <p className={`${styles.giveLabel} ${styles.redText}`}>Entertainment First</p>
          </div>
          <div className={styles.giveCard}>
            <h3 className={styles.giveNumber}>GIVE</h3>
            <p className={`${styles.giveLabel} ${styles.blueText}`}>Value Through Volume</p>
          </div>
          <div className={styles.giveCard}>
            <h3 className={styles.giveNumber}>GIVE</h3>
            <p className={`${styles.giveLabel} ${styles.yellowText}`}>Trust Through Consistency</p>
          </div>
        </div>
      </div>
    </section>
  );
}
