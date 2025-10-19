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
      </div>
    </section>
  );
}
