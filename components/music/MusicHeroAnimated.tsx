'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/all';
import styles from './MusicHeroAnimated.module.css';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
}

export default function MusicHeroAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    CustomEase.create("customEase", "0.86, 0, 0.07, 1");

    const container = containerRef.current;
    const textRows = container.querySelectorAll<HTMLDivElement>('.text-row');
    const slicedContainer = container.querySelector(`.${styles.slicedContainer}`);

    // Main animation timeline
    const mainTimeline = gsap.timeline();

    // Step 1: Slide each line in from bottom (center aligned)
    textRows.forEach((row, index) => {
      mainTimeline.from(row, {
        y: '100vh',
        opacity: 0,
        duration: 1,
        ease: "customEase",
      }, index * 0.15);
    });

    // Step 2: Wait a moment, then grow from center and translate to left simultaneously
    mainTimeline.to({}, { duration: 0.3 }, '+=0.3'); // Small pause

    // Step 3: Grow and translate each text element
    textRows.forEach((row, index) => {
      const textContent = row.querySelector(`.${styles.textContent}`);
      mainTimeline.to(textContent, {
        scaleX: 1.3,
        x: '-30vw', // Move to the left
        transformOrigin: 'center center',
        duration: 0.8,
        ease: "customEase",
      }, '<' + (index * 0.05));
    });

    // Step 4: Fade in right side content
    const rightContent = container.querySelector(`.${styles.rightContent}`);
    mainTimeline.from(rightContent, {
      opacity: 0,
      x: 100,
      duration: 0.8,
      ease: "customEase",
    }, '-=0.3');

    // Kinetic type animation
    const kineticType = container.querySelector<HTMLDivElement>('#kinetic-type');
    if (kineticType) {
      const typeLines = kineticType.querySelectorAll<HTMLDivElement>('.type-line');

      typeLines.forEach((line, index) => {
        const isOdd = index % 2 === 0;
        gsap.to(line, {
          x: isOdd ? '-50%' : '50%',
          duration: 20,
          ease: 'none',
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % 100)
          }
        });
      });
    }

  }, []);

  return (
    <div className={styles.heroContainer} ref={containerRef}>
      <div className={styles.gradientBackground}></div>

      <div className={styles.mainContent}>
        <div className={styles.slicedContainer}>
          <div className="text-row">
            <div className={styles.textContent}>RECORD</div>
          </div>

          <div className="text-row">
            <div className={styles.textContent}>CREATE</div>
          </div>

          <div className="text-row">
            <div className={styles.textContent}>RELEASE</div>
          </div>
        </div>

        <div className={styles.rightContent}>
          <div className={styles.infoCard}>
            <div className={styles.label}>STUDIO LOCATION</div>
            <div className={styles.value}>Fort Wayne, IN</div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.label}>STUDIO HOURS</div>
            <div className={styles.value}>Mon-Sat<br/>10AM - 10PM</div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.label}>STARTING AT</div>
            <div className={styles.value}>$40/HR</div>
          </div>

          <button className={styles.ctaButton}>
            BOOK A SESSION
          </button>
        </div>
      </div>

      <div className={styles.type} id="kinetic-type" aria-hidden="true">
        <div className="type-line odd">record record record</div>
        <div className="type-line even">create create create</div>
        <div className="type-line odd">release release release</div>
        <div className="type-line even">record record record</div>
        <div className="type-line odd">create create create</div>
        <div className="type-line even">record record record</div>
        <div className="type-line odd">record record record</div>
        <div className="type-line even">create create create</div>
        <div className="type-line odd">release release release</div>
        <div className="type-line even">record record record</div>
        <div className="type-line odd">create create create</div>
        <div className="type-line even">record record record</div>
      </div>
    </div>
  );
}
