'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/all';
import styles from './MediaHeroAnimated.module.css';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
}

export default function MediaHeroAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    CustomEase.create("customEase", "0.86, 0, 0.07, 1");

    const container = containerRef.current;
    const videoBox = container.querySelector(`.${styles.videoBox}`);
    const contentOverlay = container.querySelector(`.${styles.contentOverlay}`);
    const titleLines = container.querySelectorAll('.title-line');
    const description = container.querySelector(`.${styles.description}`);
    const miniTitle = container.querySelector(`.${styles.miniTitle}`);

    if (!videoBox || !titleLines.length || !description || !miniTitle) return;

    // Kill any existing animations
    gsap.killTweensOf([videoBox, contentOverlay, titleLines, description, miniTitle]);

    // Set initial visibility for all elements to ensure they show
    gsap.set([videoBox, miniTitle, titleLines, description], { clearProps: 'all' });

    // Main animation timeline
    const mainTimeline = gsap.timeline({
      delay: 0.1,
    });

    // Step 1: Video box scales in
    mainTimeline.from(videoBox, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, 0);

    // Step 2: Mini title fades in
    mainTimeline.from(miniTitle, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power2.out"
    }, 0.5);

    // Step 3: Title lines slide in from top and bottom to close position
    mainTimeline.fromTo(titleLines[0], {
      y: '-100vh',
      opacity: 0,
    }, {
      y: 40,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
    }, 0.7);

    mainTimeline.fromTo(titleLines[1], {
      y: '100vh',
      opacity: 0,
    }, {
      y: -40,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
    }, 0.85);

    // Step 4: Push away from each other to final position
    mainTimeline.to(titleLines[0], {
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.6)",
    }, '+=0.1');

    mainTimeline.to(titleLines[1], {
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.6)",
    }, '-=0.8');

    // Step 6: Description fade in
    mainTimeline.from(description, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out"
    }, '-=0.3');

    return () => {
      // mainTimeline.kill(); // Commented out so animation state persists
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.hero} data-cursor-hide>
      {/* Video Box with rounded corners */}
      <div className={styles.videoBox}>
        <iframe
          src="https://customer-w6h9o08eg118alny.cloudflarestream.com/a279eed7ef4ceef1b3b257b0fb4dfc67/iframe?muted=true&autoplay=true&loop=true&controls=false"
          className={styles.videoElement}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen={true}
          style={{ border: 'none' }}
        />

        {/* Dark overlay for text readability */}
        <div className={styles.videoOverlay}></div>

        {/* Content Overlay */}
        <div className={styles.contentOverlay}>
          {/* Main Title - Centered */}
          <div className={styles.titleContainer}>
            <div className={`${styles.titleLine} ${styles.titleLineSmaller} title-line`}>STORIES THAT MOVE.</div>
            <div className={`${styles.titleLine} title-line`}>CONTENT THAT CONVERTS.</div>
          </div>

          {/* CTA Button - Centered */}
          <a href="/work/mc-sim-racing" className={styles.ctaButton}>
            VIEW PROJECT
          </a>

          {/* Description - Bottom Left */}
          <p className={styles.description}>
            Limited availability. Book your project today.
          </p>

          {/* Mini Title - Bottom Right */}
          <p className={styles.miniTitle}>SWEET DREAMS MEDIA</p>
        </div>
      </div>
    </div>
  );
}
