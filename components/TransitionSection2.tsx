'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
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
  const line7Ref = useRef<HTMLAnchorElement>(null);
  const contentWordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let oldX = 0;
    let oldY = 0;
    let deltaX = 0;
    let deltaY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      deltaX = e.clientX - oldX;
      deltaY = e.clientY - oldY;
      oldX = e.clientX;
      oldY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

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

        gsap.set(ref, {
          y: 50,
          opacity: 0
        });

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

      // Reactive animation for CONTENT word
      if (contentWordRef.current) {
        contentWordRef.current.addEventListener('mouseenter', () => {
          const tl = gsap.timeline({
            onComplete: () => {
              tl.kill();
            }
          });

          tl.timeScale(1.2);

          const velocityX = deltaX * 30;
          const velocityY = deltaY * 30;

          tl.to(contentWordRef.current, {
            x: velocityX / 10,
            y: velocityY / 10,
            duration: 0.6,
            ease: 'power2.out',
          });

          tl.to(contentWordRef.current, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
          });

          tl.fromTo(contentWordRef.current, {
            rotate: 0
          }, {
            duration: 0.4,
            rotate: (Math.random() - 0.5) * 30,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
          }, '<');
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* Section header above both columns */}
      <div className={styles.headerContainer}>
        <p className={styles.miniTitle}>THE STRATEGY</p>
        <h2 className={styles.sectionTitle}>OUR PACKAGES DELIVER</h2>
      </div>

      <div className={styles.container}>
        {/* Left column - Formula, credibility, and CTA */}
        <div className={styles.leftColumn}>
          {/* The formula with red accents */}
          <div className={styles.formulaSection}>
            <p className={styles.formulaLine} ref={line2Ref}>
              <span className={styles.redText}>MORE CONTENT</span> MEANS MORE TOUCHPOINTS.
            </p>
            <p className={styles.formulaLine} ref={line3Ref}>
              <span className={styles.redText}>MORE TOUCHPOINTS</span> MEANS MORE TRUST.
            </p>
            <p className={styles.formulaLine} ref={line4Ref}>
              <span className={styles.redText}>MORE TRUST</span> MEANS MORE SALES.
            </p>
          </div>

          {/* Credibility statements */}
          <div className={styles.credibilitySection}>
            <p className={styles.credText} ref={line5Ref}>
              We grew up in this. Raised on social media, trained in trends.
            </p>
            <p className={styles.credText} ref={line6Ref}>
              We know what works in 2025 because we live it every day.
            </p>
          </div>

          {/* CTA */}
          <Link href="/media#contact" className={styles.ctaButton} ref={line7Ref}>
            SHARE YOUR STORY
          </Link>
        </div>

        {/* Right column - Main headline */}
        <h2 className={styles.headline} ref={line1Ref}>
          <span className={styles.headlineLarge}>HIGH VOLUME</span>
          <span className={styles.headlineMedium}>ENGAGING <span ref={contentWordRef} className={styles.contentWord}>CONTENT</span></span>
          <span className={styles.headlineNormal}>THAT KEEPS YOUR</span>
          <span className={styles.headlineNormal}>BRAND IN FRONT</span>
          <span className={styles.headlineSmall}>OF YOUR CUSTOMERS</span>
        </h2>
      </div>
    </section>
  );
}
