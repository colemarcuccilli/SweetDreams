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
        <h2 className={`${styles.sectionTitle} animate-title`}>WHY CLIENTS COME BACK</h2>

        <div className={styles.whyThreeColumns}>
          <div className={`${styles.whyColumn} animate-card`}>
            <h3 className={styles.whyColumnTitle}>FAST</h3>
            <p className={styles.whyColumnText}>24hr response.</p>
            <p className={styles.whyColumnText}>On-time delivery.</p>
          </div>
          <div className={`${styles.whyColumn} animate-card`}>
            <h3 className={styles.whyColumnTitle}>FULL-SERVICE</h3>
            <p className={styles.whyColumnText}>Concept to cut.</p>
            <p className={styles.whyColumnText}>All in-house.</p>
          </div>
          <div className={`${styles.whyColumn} animate-card`}>
            <h3 className={styles.whyColumnTitle}>QUALITY</h3>
            <p className={styles.whyColumnText}>Cinema-grade.</p>
            <p className={styles.whyColumnText}>No compromises.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
