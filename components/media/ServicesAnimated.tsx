'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../../app/media/media.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesAnimated() {
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
    <section className={styles.services} ref={containerRef}>
      <div className={styles.container}>
        <p className={`${styles.miniTitle} animate-title`}>SERVICES</p>
        <h2 className={`${styles.sectionTitle} animate-title`}>OUR SOLUTIONS</h2>

        <div className={styles.servicesGrid}>
          <div className={`${styles.serviceCard} animate-card`}>
            <h3 className={styles.serviceTitle}>BRAND FILMS</h3>
            <p className={styles.serviceDescription}>
              Cinematic storytelling that captures your brand's essence and connects with your audience.
            </p>
          </div>
          <div className={`${styles.serviceCard} animate-card`}>
            <h3 className={styles.serviceTitle}>COMMERCIALS</h3>
            <p className={styles.serviceDescription}>
              High-impact commercials designed to convert viewers into customers.
            </p>
          </div>
          <div className={`${styles.serviceCard} animate-card`}>
            <h3 className={styles.serviceTitle}>EVENT COVERAGE</h3>
            <p className={styles.serviceDescription}>
              Professional event documentation that preserves your most important moments.
            </p>
          </div>
          <div className={`${styles.serviceCard} animate-card`}>
            <h3 className={styles.serviceTitle}>CORPORATE CONTENT</h3>
            <p className={styles.serviceDescription}>
              From training videos to internal communications, we help your business communicate effectively.
            </p>
          </div>
        </div>

        <div className={styles.learnMoreButtonContainer}>
          <Link href="/solutions" className={`${styles.learnMoreButton} animate-title`}>
            LEARN MORE
          </Link>
        </div>
      </div>
    </section>
  );
}
