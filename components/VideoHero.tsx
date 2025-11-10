'use client';

import { useEffect, useRef } from 'react';
import Link from "next/link";
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/all';
import styles from "./Header.module.css";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
}

export default function VideoHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    CustomEase.create("customEase", "0.86, 0, 0.07, 1");

    const container = containerRef.current;
    const videoBox = container.querySelector(`.${styles.videoBox}`);
    const clientName = container.querySelector(`.${styles.clientName}`);
    const viewButton = container.querySelector(`.${styles.viewButton}`);
    const titleLines = container.querySelectorAll('.title-line');
    const subtitle = container.querySelector(`.${styles.subtitle}`);

    if (!videoBox || !titleLines.length || !clientName || !viewButton || !subtitle) return;

    // Kill any existing animations
    gsap.killTweensOf([videoBox, clientName, viewButton, titleLines, subtitle]);

    // Set initial visibility - ensure button is visible
    gsap.set([videoBox, clientName, titleLines, subtitle], { clearProps: 'all' });
    gsap.set(viewButton, { opacity: 1, scale: 1 }); // Explicitly set button to visible

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

    // Step 2: Client name and button fade in
    mainTimeline.from(clientName, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power2.out"
    }, 0.5);

    mainTimeline.fromTo(viewButton,
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
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

    // Step 5: Subtitle fades in
    mainTimeline.from(subtitle, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out"
    }, '-=0.3');

    return () => {
      // Timeline persists
    };
  }, []);

  return (
    <section className={styles.videoSection} ref={containerRef}>
      <div className={styles.videoContainer}>
        {/* Video Box - Rounded Rectangle */}
        <div className={styles.videoBox}>

          {/* Cloudflare Stream Video Background */}
          <iframe
            src="https://customer-w6h9o08eg118alny.cloudflarestream.com/d8c34ebf7e9bb7a150feaa29cd60a9a6/iframe?muted=true&autoplay=true&loop=true&controls=false"
            className={styles.videoElement}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
            style={{ border: 'none' }}
          />

          {/* Dark overlay for text readability */}
          <div className={styles.videoOverlay}></div>

          {/* Content Overlay */}
          <div className={styles.videoContent}>

            {/* Top Row */}
            <div className={styles.topRow}>
              {/* Client Name - Top Left */}
              <div className={styles.clientName}>
                SWEET DREAMS MEDIA
              </div>

              {/* View Project Button - Top Right */}
              <Link href="/work/heaven-in-fort-wayne" className={styles.viewButton}>
                <span className={styles.viewButtonText}>VIEW PROJECT</span>
              </Link>
            </div>

            {/* Center Title - Absolute Positioned */}
            <div className={styles.centerTitle}>
              <h1>
                <div className={`${styles.titleText} title-line`}>YOUR VISION,</div>
                <div className={`${styles.titleText} title-line`}>AMPLIFIED</div>
              </h1>
            </div>

            {/* Bottom Row */}
            <div className={styles.bottomRow}>
              {/* Subtitle - Bottom Left */}
              <div className={styles.subtitle}>
                PROFESSIONAL VIDEO PRODUCTION
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
