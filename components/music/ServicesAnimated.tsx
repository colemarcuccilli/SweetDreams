'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import styles from '../../app/music/music.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [hoveringCard, setHoveringCard] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

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
    <section className={styles.services} ref={containerRef}>
      <div className={styles.container}>
        <p className={`${styles.miniTitle} animate-line`}>SERVICES</p>
        <h2 className={`${styles.sectionTitle} animate-line`}>WHAT WE OFFER</h2>

        <div className={styles.servicesGrid}>
          <div
            className={styles.serviceCard}
            onClick={() => setOpenCard(openCard === 1 ? null : 1)}
            onMouseMove={(e) => handleMouseMove(e, 1)}
            onMouseEnter={() => setHoveringCard(1)}
            onMouseLeave={() => setHoveringCard(null)}
          >
            <h3 className={`${styles.serviceTitle} animate-line`}>BEATS</h3>
            <p className={`${styles.serviceDescription} animate-line`}>Original beats for any genre to elevate your sound.</p>
            {hoveringCard === 1 && !openCard && (
              <div className={styles.clickMeCursor} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
                click me
              </div>
            )}
          </div>
          <div
            className={styles.serviceCard}
            onClick={() => setOpenCard(openCard === 2 ? null : 2)}
            onMouseMove={(e) => handleMouseMove(e, 2)}
            onMouseEnter={() => setHoveringCard(2)}
            onMouseLeave={() => setHoveringCard(null)}
          >
            <h3 className={`${styles.serviceTitle} animate-line`}>VIDEOGRAPHY</h3>
            <p className={`${styles.serviceDescription} animate-line`}>Professional music videos, social media content, and more.</p>
            {hoveringCard === 2 && !openCard && (
              <div className={styles.clickMeCursor} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
                click me
              </div>
            )}
          </div>
          <div
            className={styles.serviceCard}
            onClick={() => setOpenCard(openCard === 3 ? null : 3)}
            onMouseMove={(e) => handleMouseMove(e, 3)}
            onMouseEnter={() => setHoveringCard(3)}
            onMouseLeave={() => setHoveringCard(null)}
          >
            <h3 className={`${styles.serviceTitle} animate-line`}>RECORDING</h3>
            <p className={`${styles.serviceDescription} animate-line`}>High-quality recording sessions to capture your best sound.</p>
            {hoveringCard === 3 && !openCard && (
              <div className={styles.clickMeCursor} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
                click me
              </div>
            )}
          </div>
          <div
            className={styles.serviceCard}
            onClick={() => setOpenCard(openCard === 4 ? null : 4)}
            onMouseMove={(e) => handleMouseMove(e, 4)}
            onMouseEnter={() => setHoveringCard(4)}
            onMouseLeave={() => setHoveringCard(null)}
          >
            <h3 className={`${styles.serviceTitle} animate-line`}>MIXING & MASTERING</h3>
            <p className={`${styles.serviceDescription} animate-line`}>Get a polished, professional sound with our expert mastering.</p>
            {hoveringCard === 4 && !openCard && (
              <div className={styles.clickMeCursor} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
                click me
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {openCard !== null && (
        <>
          <div
            className={styles.serviceBlurOverlay}
            onClick={() => setOpenCard(null)}
          />

          {/* Beats Modal */}
          {openCard === 1 && (
            <div className={styles.serviceCardExpanded}>
              <button
                className={styles.serviceCardClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCard(null);
                }}
              >
                ✕
              </button>
              <h3>Original Beats</h3>
              <h4>Custom Production For Your Sound</h4>
              <p>
                Whether you need a hard-hitting trap beat, a smooth R&B groove, or something completely unique, we create custom instrumentals tailored to your style and vision.
              </p>
              <ul>
                <li>Custom beats made from scratch for your project</li>
                <li>Unlimited revisions until you're 100% satisfied</li>
                <li>Full commercial rights included (you own the beat)</li>
                <li>Professional mixing and mastering on all beats</li>
                <li>Stems provided for maximum flexibility in post-production</li>
              </ul>
              <p className={styles.serviceCardEmphasis}>
                Stop settling for generic type beats. Get a custom sound that's uniquely yours.
              </p>
              <span
                className={`${styles.serviceCardButton} ${styles.comingSoonButton}`}
                onClick={() => setOpenCard(null)}
              >
                COMING SOON
              </span>
            </div>
          )}

          {/* Videography Modal */}
          {openCard === 2 && (
            <div className={styles.serviceCardExpanded}>
              <button
                className={styles.serviceCardClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCard(null);
                }}
              >
                ✕
              </button>
              <h3>Music Videography</h3>
              <h4>Bring Your Music To Life</h4>
              <p>
                A great song deserves a great video. We handle everything from concept development to final delivery—shooting, editing, color grading, and effects. Your music video will stand out.
              </p>
              <ul>
                <li>Full music video production from concept to final cut</li>
                <li>Professional 4K cameras and cinema-grade equipment</li>
                <li>Creative direction and storyboarding included</li>
                <li>Advanced color grading for that cinematic look</li>
                <li>Social media cuts optimized for Instagram, TikTok, and YouTube</li>
              </ul>
              <p className={styles.serviceCardEmphasis}>
                Your music is fire. Let's make a video that matches the energy.
              </p>
              <Link
                href="/media#contact"
                className={styles.serviceCardButton}
                onClick={() => setOpenCard(null)}
              >
                START YOUR VIDEO
              </Link>
            </div>
          )}

          {/* Recording Modal */}
          {openCard === 3 && (
            <div className={styles.serviceCardExpanded}>
              <button
                className={styles.serviceCardClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCard(null);
                }}
              >
                ✕
              </button>
              <h3>Recording Sessions</h3>
              <h4>Capture Your Best Performance</h4>
              <p>
                Our studio is equipped with industry-standard gear to capture every detail of your performance. Whether you're recording vocals, instruments, or full band sessions, we've got you covered.
              </p>
              <ul>
                <li>Professional recording studio with top-tier microphones and preamps</li>
                <li>Experienced engineers who know how to get the best take</li>
                <li>Comfortable environment designed for creativity</li>
                <li>Vocal tuning and comping included in every session</li>
                <li>Flexible scheduling including after-hours and weekend availability</li>
              </ul>
              <p className={styles.serviceCardEmphasis}>
                Great music starts with a great recording. Book your session today.
              </p>
              <Link
                href="/music#booking"
                className={styles.serviceCardButton}
                onClick={() => setOpenCard(null)}
              >
                BOOK A SESSION
              </Link>
            </div>
          )}

          {/* Mixing & Mastering Modal */}
          {openCard === 4 && (
            <div className={styles.serviceCardExpanded}>
              <button
                className={styles.serviceCardClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCard(null);
                }}
              >
                ✕
              </button>
              <h3>Mixing & Mastering</h3>
              <h4>Make It Sound Professional</h4>
              <p>
                You worked hard on your music. Don't let a bad mix ruin it. We take your raw tracks and turn them into polished, radio-ready songs that compete with the best in the industry.
              </p>
              <ul>
                <li>Professional mixing with industry-standard plugins and processors</li>
                <li>Mastering for streaming platforms (Spotify, Apple Music, etc.)</li>
                <li>Unlimited revisions until it sounds exactly how you want</li>
                <li>Stem mastering available for maximum control</li>
                <li>Fast turnaround times without sacrificing quality</li>
              </ul>
              <p className={styles.serviceCardEmphasis}>
                Your music deserves to sound as good as the pros. Let's make it happen.
              </p>
              <Link
                href="/music#contact"
                className={styles.serviceCardButton}
                onClick={() => setOpenCard(null)}
              >
                GET IT MIXED
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
