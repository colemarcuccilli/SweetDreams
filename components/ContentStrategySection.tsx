'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './ContentStrategySection.module.css';

export default function ContentStrategySection() {
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('content-strategy-section');
      const overlay = document.getElementById('black-overlay');

      if (section && overlay) {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate when section is 75% from top (25% down from top)
        const triggerPoint = windowHeight * 0.25;
        const sectionTop = rect.top;

        // Start effect when section enters viewport, complete at 75% mark
        const startPoint = windowHeight;
        const endPoint = triggerPoint;
        const scrollRange = startPoint - endPoint;
        const progress = Math.max(0, Math.min(1, (startPoint - sectionTop) / scrollRange));

        // Slide overlay from left to right (-100% to 0%)
        overlay.style.transform = `translateX(-${100 - (progress * 100)}%)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.section} id="content-strategy-section">
      <div className={styles.overlay} id="black-overlay"></div>
      <div className={styles.container}>
        <p className={styles.mainText}>
          OUR RETAINER PACKAGES DELIVER HIGH-VOLUME, ENGAGING CONTENT THAT KEEPS YOUR BRAND IN FRONT OF YOUR CUSTOMERS. MORE CONTENT MEANS MORE TOUCHPOINTS. MORE TOUCHPOINTS MEANS MORE TRUST. MORE TRUST MEANS MORE SALES.
        </p>
        <p className={styles.mainText}>
          WE GREW UP IN THIS. RAISED ON SOCIAL MEDIA, TRAINED IN TRENDS. WE KNOW WHAT WORKS IN 2025 BECAUSE WE LIVE IT EVERY DAY.
        </p>
        <p className={styles.mainText}>
          LET'S BUILD YOUR CONTENT STRATEGY
        </p>
        <Link href="/contact" className={styles.button}>
          GET STARTED
        </Link>
      </div>
    </section>
  );
}
