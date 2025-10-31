import Link from "next/link";
import styles from "./error.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Go Home
          </Link>
          <Link href="/music" className={styles.secondaryButton}>
            Book a Session
          </Link>
        </div>

        <div className={styles.helpText}>
          <p>Looking for something specific?</p>
          <div className={styles.links}>
            <Link href="/music">Music Production</Link>
            <Link href="/media">Media Services</Link>
            <Link href="/solutions">All Services</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
