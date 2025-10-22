'use client';

import { useEffect, useRef } from 'react';
import styles from './WhoAreWe.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WhoAreWeAnimated() {
  const sectionRef = useRef<HTMLElement>(null);
  const mainTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mainTextRef.current) return;

    const textElement = mainTextRef.current;

    const ctx = gsap.context(() => {
      if (!textElement) return;

      // Get all the text lines
      const lines = textElement.querySelectorAll(`.${styles.textLine}`);

      // Set initial state - lines slide in from the right
      gsap.set(lines, {
        x: 100,
        opacity: 0
      });

      // Animate lines sliding in
      gsap.to(lines, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: textElement,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          WHO ARE WE
        </h2>

        <div className={styles.mainText} ref={mainTextRef}>
          <div className={styles.textLine}>WE SPECIALIZE IN BRAND DEVELOPMENT,</div>
          <div className={styles.textLine}>
            <span className="creativeStorytellingWord">CREATIVE STORYTELLING</span>, AND MULTIMEDIA
          </div>
          <div className={styles.textLine}>SOLUTIONS THAT HELP BUSINESSES STAND OUT</div>
          <div className={styles.textLine}>AND CONNECT WITH THEIR AUDIENCE.</div>
        </div>
      </div>
    </section>
  );
}
