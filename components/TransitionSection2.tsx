'use client';

import { useEffect, useRef } from 'react';
import styles from './TransitionSection2.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TransitionSection2() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const line3Ref = useRef<HTMLParagraphElement>(null);
  const line4Ref = useRef<HTMLParagraphElement>(null);
  const line5Ref = useRef<HTMLParagraphElement>(null);
  const line6Ref = useRef<HTMLParagraphElement>(null);
  const line7Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const elements = [
        { ref: line1Ref.current, delay: 0 },
        { ref: line2Ref.current, delay: 0.15 },
        { ref: line3Ref.current, delay: 0.3 },
        { ref: line4Ref.current, delay: 0.45 },
        { ref: line5Ref.current, delay: 0.6 },
        { ref: line6Ref.current, delay: 0.75 },
        { ref: line7Ref.current, delay: 0.9 }
      ];

      elements.forEach(({ ref, delay }) => {
        if (!ref) return;

        // Set initial state
        gsap.set(ref, {
          y: 50,
          opacity: 0
        });

        // Create ScrollTrigger animation
        gsap.to(ref, {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <p className={styles.largeText} ref={line1Ref}>
          OUR RETAINER PACKAGES DELIVER HIGH-VOLUME, ENGAGING CONTENT THAT KEEPS YOUR BRAND IN FRONT OF YOUR CUSTOMERS.
        </p>
        <p className={styles.largeText} ref={line2Ref}>
          MORE CONTENT MEANS MORE TOUCHPOINTS.
        </p>
        <p className={styles.largeText} ref={line3Ref}>
          MORE TOUCHPOINTS MEANS MORE TRUST.
        </p>
        <p className={styles.largeText} ref={line4Ref}>
          MORE TRUST MEANS MORE SALES.
        </p>
        <p className={styles.mediumText} ref={line5Ref}>
          WE GREW UP IN THIS. RAISED ON SOCIAL MEDIA, TRAINED IN TRENDS.
        </p>
        <p className={styles.mediumText} ref={line6Ref}>
          WE KNOW WHAT WORKS IN 2025 BECAUSE WE LIVE IT EVERY DAY.
        </p>
        <p className={styles.smallText} ref={line7Ref}>
          LET'S BUILD YOUR CONTENT STRATEGY
        </p>
      </div>
    </section>
  );
}
