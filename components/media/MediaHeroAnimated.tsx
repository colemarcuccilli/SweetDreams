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
    const button = container.querySelector(`.${styles.ctaButton}`);
    const miniTitle = container.querySelector(`.${styles.miniTitle}`);

    if (!videoBox || !titleLines.length || !description || !button || !miniTitle) return;

    // Kill any existing animations
    gsap.killTweensOf([videoBox, contentOverlay, titleLines, description, button, miniTitle]);

    // Set initial visibility for all elements to ensure they show
    gsap.set([videoBox, miniTitle, titleLines, description, button], { clearProps: 'all' });

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

    // Step 3: Title lines slide in from sides with rotation
    mainTimeline.from(titleLines[0], {
      x: '-100vw',
      rotation: -25,
      opacity: 0,
      duration: 1.2,
      ease: "customEase",
    }, 0.7);

    mainTimeline.from(titleLines[1], {
      x: '100vw',
      rotation: 25,
      opacity: 0,
      duration: 1.2,
      ease: "customEase",
    }, 0.85);

    // Step 4: Settle and scale down text
    mainTimeline.to(titleLines, {
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: "power3.inOut",
      stagger: 0.1,
      onComplete: () => {
        gsap.set(titleLines, { scale: 1, rotation: 0 });
      }
    }, '+=0.3');

    // Step 5: Description and button fade in
    mainTimeline.from(description, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out"
    }, '-=0.3');

    mainTimeline.from(button, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out"
    }, '-=0.4');

    return () => {
      // mainTimeline.kill(); // Commented out so animation state persists
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.hero}>
      {/* Video Box with rounded corners */}
      <div className={styles.videoBox}>
        <iframe
          src="https://customer-w6h9o08eg118alny.cloudflarestream.com/a507a5b8a369b70b7332c0567cbbcc4c/iframe?muted=true&autoplay=true&loop=true&controls=false"
          className={styles.videoElement}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen={true}
          style={{ border: 'none' }}
        />

        {/* Dark overlay for text readability */}
        <div className={styles.videoOverlay}></div>

        {/* Content Overlay */}
        <div className={styles.contentOverlay}>
          {/* Mini Title */}
          <p className={styles.miniTitle}>SWEET DREAMS MEDIA</p>

          {/* Main Title */}
          <div className={styles.titleContainer}>
            <div className={`${styles.titleLine} title-line`}>YOUR VISION,</div>
            <div className={`${styles.titleLine} title-line`}>AMPLIFIED</div>
          </div>

          {/* Description */}
          <p className={styles.description}>
            Professional video production and content creation<br />
            that brings your brand to life
          </p>

          {/* CTA Button */}
          <a href="/work/fort-wayne-hyperlapse-showcase" className={styles.ctaButton}>
            VIEW PROJECT
          </a>
        </div>
      </div>
    </div>
  );
}
