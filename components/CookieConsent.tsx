"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./CookieConsent.module.css";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
    // Note: In a full implementation, you would disable analytics tracking here
  };

  if (!showBanner) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.text}>
          <p className={styles.message}>
            We use cookies and tracking technologies to improve your experience, analyze site traffic, and personalize content.
            This includes Google Analytics, Facebook Pixel, and Microsoft Clarity.
          </p>
          <p className={styles.links}>
            <Link href="/privacy" className={styles.link}>
              Privacy Policy
            </Link>
            {" • "}
            <Link href="/terms" className={styles.link}>
              Terms of Service
            </Link>
          </p>
        </div>

        <div className={styles.buttons}>
          <button onClick={handleAccept} className={styles.acceptButton}>
            Accept All
          </button>
          <button onClick={handleDecline} className={styles.declineButton}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
