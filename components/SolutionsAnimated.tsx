'use client';

import Link from "next/link";
import styles from "./Solutions.module.css";

export default function SolutionsAnimated() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.mainText}>READY TO START?</h2>

        <div className={styles.twoColumns}>
          {/* Left Column - One-Time Projects */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>ONE-TIME PROJECTS</h3>
            <div className={styles.columnDivider}></div>
            <p className={styles.columnText}>Commercial. Event.</p>
            <p className={styles.columnText}>Brand video.</p>
            <p className={styles.columnTextMuted}>&nbsp;</p>
            <p className={styles.columnTextHighlight}>Let's make something great.</p>
            <Link href="/solutions" className={styles.columnButton}>
              VIEW SERVICES
            </Link>
          </div>

          {/* Right Column - Growth Partnerships */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>GROWTH PARTNERSHIPS</h3>
            <div className={styles.columnDivider}></div>
            <p className={styles.columnText}>We're selective about partnerships</p>
            <p className={styles.columnText}>because results take commitment.</p>
            <p className={styles.columnTextMuted}>&nbsp;</p>
            <p className={styles.columnTextHighlight}>Limited slots available.</p>
            <p className={styles.columnNote}>Application required</p>
            <Link href="/partnerships" className={styles.columnButton}>
              APPLY NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
