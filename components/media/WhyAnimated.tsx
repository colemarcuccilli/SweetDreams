'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../../app/media/media.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WhyAnimated() {
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

    // Animate cards
    const cards = containerRef.current.querySelectorAll('.animate-card');
    gsap.set(cards, { x: -100, opacity: 0 });
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
    <section className={styles.why} ref={containerRef}>
      <div className={styles.container}>
        <p className={`${styles.miniTitle} animate-title`}>WHY SWEET DREAMS</p>
        <h2 className={`${styles.sectionTitle} animate-title`}>WHAT SETS US APART</h2>

        <div className={styles.whyGrid}>
          <div className={`${styles.whyCard} animate-card`}>
            <h3 className={styles.whyTitle}>FAST TURNAROUND</h3>
            <p className={styles.whyDescription}>
              We respond to all inquiries within 24 hours and deliver projects on time, every time. No endless waiting.
            </p>
          </div>
          <div className={`${styles.whyCard} animate-card`}>
            <h3 className={styles.whyTitle}>FULL-SERVICE PRODUCTION</h3>
            <p className={styles.whyDescription}>
              From concept to final edit, we handle everything. Music, videography, editing, color grading—all in-house.
            </p>
          </div>
          <div className={`${styles.whyCard} animate-card`}>
            <h3 className={styles.whyTitle}>CLIENT-FOCUSED APPROACH</h3>
            <p className={styles.whyDescription}>
              Your vision matters. We work closely with you at every step to ensure the final product exceeds expectations.
            </p>
          </div>
          <div className={`${styles.whyCard} animate-card`}>
            <h3 className={styles.whyTitle}>PROFESSIONAL QUALITY</h3>
            <p className={styles.whyDescription}>
              Cinema-grade cameras, professional audio, expert color grading. We don't compromise on quality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
