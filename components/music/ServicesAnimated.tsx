'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../../app/music/music.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const lines = containerRef.current.querySelectorAll('.animate-line');

    gsap.set(lines, { y: 30, opacity: 0 });

    gsap.to(lines, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      }
    });
  }, []);

  return (
    <section className={styles.services} ref={containerRef}>
      <div className={styles.container}>
        <p className={`${styles.miniTitle} animate-line`}>SERVICES</p>
        <h2 className={`${styles.sectionTitle} animate-line`}>WHAT WE OFFER</h2>

        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <h3 className={`${styles.serviceTitle} animate-line`}>BEATS</h3>
            <p className={`${styles.serviceDescription} animate-line`}>Original beats for any genre to elevate your sound.</p>
          </div>
          <div className={styles.serviceCard}>
            <h3 className={`${styles.serviceTitle} animate-line`}>VIDEOGRAPHY</h3>
            <p className={`${styles.serviceDescription} animate-line`}>Professional music videos, social media content, and more.</p>
          </div>
          <div className={styles.serviceCard}>
            <h3 className={`${styles.serviceTitle} animate-line`}>RECORDING</h3>
            <p className={`${styles.serviceDescription} animate-line`}>High-quality recording sessions to capture your best sound.</p>
          </div>
          <div className={styles.serviceCard}>
            <h3 className={`${styles.serviceTitle} animate-line`}>MIXING & MASTERING</h3>
            <p className={`${styles.serviceDescription} animate-line`}>Get a polished, professional sound with our expert mastering.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
