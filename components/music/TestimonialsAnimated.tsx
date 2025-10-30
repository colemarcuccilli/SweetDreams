'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../../app/music/music.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TestimonialsAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Check if mobile for earlier trigger
    const isMobile = window.innerWidth <= 768;
    const triggerStart = isMobile ? 'top 90%' : 'top 70%';

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
        start: triggerStart,
        toggleActions: 'play none none reverse',
      }
    });
  }, []);

  return (
    <section className={styles.testimonials} ref={containerRef}>
      <div className={styles.container}>
        <p className={`${styles.miniTitle} animate-line`}>TESTIMONIALS</p>
        <h2 className={`${styles.sectionTitle} animate-line`}>WHAT CLIENTS SAY</h2>

        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <p className={`${styles.testimonialText} animate-line`}>
              "Jay is the complete producer. His musical knowledge is vast, and his versatility with beats and instruments makes him the right choice for any project. You'll get a producer who truly cares about the music."
            </p>
            <p className={`${styles.testimonialAuthor} animate-line`}>— anonymous, Artist</p>
          </div>

          <div className={styles.testimonialCard}>
            <p className={`${styles.testimonialText} animate-line`}>
              "I call Jay the 'Delay King'—his mix and mastering skills are next level. He'll have you sounding right and get your file to you fast, always open to your input and adjustments to match your style."
            </p>
            <p className={`${styles.testimonialAuthor} animate-line`}>— Chicago, Producer</p>
          </div>

          <div className={styles.testimonialCard}>
            <p className={`${styles.testimonialText} animate-line`}>
              "Working with Jay and Sweet Dreams is an incredible experience. He's part of a talented community and brings positive energy to every session, making sure you leave better than you came in."
            </p>
            <p className={`${styles.testimonialAuthor} animate-line`}>— anonymous, Musician</p>
          </div>
        </div>

        <div className={styles.reviewButtonContainer}>
          <a
            href="https://www.google.com/search?sca_esv=17b6ad23b7736742&rlz=1C1VDKB_enUS1132US1135&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E_Fbb1JIa0A3upfybv9EfT83mKQl6G41C1mfhObi8Wi1d080OEpwnMPI1MYEfjM2EutCo5nraIRRNMiRvKK1cvXpvEHFPNlONVNodpkb5pfpWTK0lw%3D%3D&q=Sweet+Dreams+Music+Reviews&sa=X&ved=2ahUKEwjFvITDoceQAxVZmokEHRgREa8Q0bkNegQIIBAE&biw=2560&bih=1271&dpr=1#lrd=0x8815e5d841363d9d:0x690321e5456380c5,3,,,,"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.reviewButton} animate-line`}
          >
            LEAVE A REVIEW
          </a>
        </div>
      </div>
    </section>
  );
}
