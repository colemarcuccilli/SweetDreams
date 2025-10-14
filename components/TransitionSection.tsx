'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './TransitionSection.module.css';

export default function TransitionSection() {
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('transition-section');
      const invertedLayer = document.getElementById('inverted-layer-1');

      if (section && invertedLayer) {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate scroll progress (accelerated to complete at 50%)
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const clampedProgress = Math.max(0, Math.min(1, progress));

        // Apply easing curve to reach 100% at 0.5 progress
        const easedProgress = clampedProgress * 2;
        const finalProgress = Math.min(1, easedProgress);

        // Clip from right to left (right side value goes from 100% to 0%)
        const clipPercentage = 100 - (finalProgress * 100);
        invertedLayer.style.clipPath = `inset(0 ${clipPercentage}% 0 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.section} id="transition-section">
      {/* Base layer - black background, white text */}
      <div className={styles.baseLayer}>
        <div className={styles.container}>
          <p className={styles.mainText}>
            ALL YOUR VIDEO AND AUDIO NEEDS. WE STAY AHEAD OF THE CURVE. INNOVATING WITH 2025'S LATEST TRENDS, WE DON'T GET LEFT BEHIND.
          </p>
          <Link href="/about" className={styles.button}>
            ABOUT US
          </Link>
        </div>
      </div>

      {/* Inverted layer - white background, black text */}
      <div className={styles.invertedLayer} id="inverted-layer-1">
        <div className={styles.container}>
          <p className={styles.mainText}>
            ALL YOUR VIDEO AND AUDIO NEEDS. WE STAY AHEAD OF THE CURVE. INNOVATING WITH 2025'S LATEST TRENDS, WE DON'T GET LEFT BEHIND.
          </p>
          <Link href="/about" className={styles.button}>
            ABOUT US
          </Link>
        </div>
      </div>
    </section>
  );
}
