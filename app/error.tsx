"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./error.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.errorCode}>500</div>
        <h1 className={styles.title}>Something Went Wrong</h1>
        <p className={styles.description}>
          We're sorry, but something unexpected happened. Our team has been notified and we're working to fix it.
        </p>

        <div className={styles.actions}>
          <button onClick={reset} className={styles.primaryButton}>
            Try Again
          </button>
          <Link href="/" className={styles.secondaryButton}>
            Go Home
          </Link>
        </div>

        <div className={styles.helpText}>
          <p>Need immediate assistance?</p>
          <div className={styles.contactInfo}>
            <a href="tel:+12604206397">(260) 420-6397</a>
            <a href="mailto:jayvalleo@sweetdreamsmusic.com">Email Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
