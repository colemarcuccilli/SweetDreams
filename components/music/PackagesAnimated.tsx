'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../../app/music/music.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PackagesAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Check if mobile for earlier trigger
    const isMobile = window.innerWidth <= 768;
    const triggerStart = isMobile ? 'top 90%' : 'top 70%';

    // Animate title elements
    const titleElements = containerRef.current.querySelectorAll('.animate-title');
    gsap.set(titleElements, { y: 30, opacity: 0 });
    gsap.to(titleElements, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: triggerStart,
        toggleActions: 'play none none reverse',
      }
    });

    // Animate package cards
    const cards = containerRef.current.querySelectorAll('.animate-card');
    gsap.set(cards, { x: 100, opacity: 0 });
    gsap.to(cards, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: triggerStart,
        toggleActions: 'play none none reverse',
      }
    });
  }, []);

  return (
    <div ref={containerRef} className={styles.packagesAnimatedContainer}>
      <p className={`${styles.miniTitle} animate-title`}>PACKAGES</p>
      <h2 className={`${styles.sectionTitle} animate-title`}>SERVICE PACKAGES</h2>
      <p className={`${styles.sectionSubtitle} animate-title`}>Choose the perfect package to fit your music production needs</p>

      <div className={styles.packagesGrid}>
          {/* Basic Package */}
          <div className={`${styles.packageCard} animate-card`}>
            <h3 className={styles.packageTitle}>BASIC PACKAGE</h3>
            <ul className={styles.packageFeatures}>
              <li>3 Hour Session</li>
              <li>Full Mix & Masters</li>
              <li>1 Short Form Video</li>
              <li>Stream Platform Guidance</li>
            </ul>
            <div className={styles.packageAddons}>
              <h4>Available Add-ons</h4>
              <p>Music Videos • Web Development • Long/Short Form Videos • Photoshoots</p>
            </div>
          </div>

          {/* Standard Package */}
          <div className={`${styles.packageCard} ${styles.packagePopular} animate-card`}>
            <div className={styles.popularBadge}>MOST POPULAR</div>
            <h3 className={styles.packageTitle}>STANDARD PACKAGE</h3>
            <ul className={styles.packageFeatures}>
              <li>10 Studio Hours</li>
              <li>Full Mix & Masters</li>
              <li>3 Short Form Videos</li>
              <li>Photoshoot (60 mins)</li>
              <li>Social Content Plan</li>
              <li>Spotify Canvas</li>
            </ul>
            <div className={styles.packageAddons}>
              <h4>Discounted Add-ons</h4>
              <p>Music Videos • Web Development 25% OFF • Short Form Videos 15% OFF • Studio Hours 25% OFF • Photoshoots 25% OFF</p>
            </div>
          </div>

          {/* Premium Package */}
          <div className={`${styles.packageCard} animate-card`}>
            <h3 className={styles.packageTitle}>PREMIUM PACKAGE</h3>
            <ul className={styles.packageFeatures}>
              <li>20 Studio Hours</li>
              <li>Full Mix & Masters</li>
              <li>5 Short Form Videos</li>
              <li>2 Photoshoots (60 mins)</li>
              <li>Social Content Plan</li>
              <li>Basic Website Package</li>
            </ul>
            <div className={styles.packageAddons}>
              <h4>Discounted Add-ons</h4>
              <p>Instrumentals 50% OFF • Music Videos 12% OFF • Web Development 30% OFF • Short Form Videos 25% OFF • Studio Hours 30% OFF • Photoshoots 30% OFF</p>
            </div>
          </div>
      </div>

      <p className={`${styles.disclaimer} animate-title`}>*Additional charges may apply. All packages subject to availability.</p>

      <div className={styles.buttonContainer}>
        <a href="#contact" className={`${styles.packageButton} animate-title`}>
          REACH OUT ABOUT PACKAGES
        </a>
      </div>
    </div>
  );
}
