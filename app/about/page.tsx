'use client';

import { useEffect, useRef } from 'react';
import Link from "next/link";
import styles from "./about.module.css";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Hero text animation
      const heroLines = heroRef.current?.querySelectorAll(`.${styles.heroLine}`);
      if (heroLines) {
        gsap.set(heroLines, { y: 80, opacity: 0 });
        gsap.to(heroLines, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.3
        });
      }

      // Big statement parallax and reveal
      if (statementRef.current) {
        const words = statementRef.current.querySelectorAll(`.${styles.statementWord}`);
        gsap.set(words, { y: 100, opacity: 0 });
        gsap.to(words, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statementRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      // Mission statement dramatic reveal
      if (missionRef.current) {
        const missionText = missionRef.current.querySelector(`.${styles.missionText}`);
        if (missionText) {
          gsap.set(missionText, { scale: 0.8, opacity: 0 });
          gsap.to(missionText, {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: missionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      }

      // Story cards stagger in with GSAP hover animations
      const storyCards = document.querySelectorAll(`.${styles.storyCard}`);
      storyCards.forEach((card, i) => {
        gsap.set(card, { y: 60, opacity: 0 });
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          delay: i * 0.1
        });

        // Get border glow element for GSAP animation
        const borderGlow = card.querySelector(`.${styles.borderGlow}`) as HTMLElement;
        const cornerTL = card.querySelector(`.${styles.cornerTL}`) as HTMLElement;
        const cornerBR = card.querySelector(`.${styles.cornerBR}`) as HTMLElement;

        if (borderGlow && cornerTL && cornerBR) {
          // Set up rotating gradient animation
          let gradientAngle = 135;
          let hoverTween: gsap.core.Tween | null = null;

          card.addEventListener('mouseenter', () => {
            // Animate corners fading out
            gsap.to([cornerTL, cornerBR], {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.out'
            });

            // Fade in the border glow
            gsap.to(borderGlow, {
              opacity: 1,
              duration: 0.3,
              ease: 'power2.out'
            });

            // Animate the gradient rotation
            hoverTween = gsap.to({ angle: gradientAngle }, {
              angle: gradientAngle + 360,
              duration: 3,
              repeat: -1,
              ease: 'none',
              onUpdate: function() {
                const currentAngle = this.targets()[0].angle;
                borderGlow.style.background = `linear-gradient(black, black) padding-box, linear-gradient(${currentAngle}deg, #4A90E2, #e63636, #f5a623, #4A90E2) border-box`;
              }
            });
          });

          card.addEventListener('mouseleave', () => {
            // Kill the rotating animation
            if (hoverTween) {
              hoverTween.kill();
            }

            // Animate corners fading back in
            gsap.to([cornerTL, cornerBR], {
              opacity: 1,
              duration: 0.3,
              ease: 'power2.out'
            });

            // Fade out the border glow
            gsap.to(borderGlow, {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.out'
            });
          });
        }
      });

    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className={styles.page} ref={pageRef}>
      {/* Hero Section with Video Background */}
      <section className={styles.hero} ref={heroRef} data-cursor-hide>
        {/* Video Background */}
        <div className={styles.videoBackground}>
          <iframe
            src="https://customer-w6h9o08eg118alny.cloudflarestream.com/f96fe903c9ced99889766c7a975eead2/iframe?muted=true&autoplay=true&loop=true&controls=false"
            className={styles.videoElement}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            style={{ border: 'none' }}
          />
          <div className={styles.videoOverlay}></div>
        </div>

        {/* Hero Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine}>ABOUT</span>
          </h1>
          <div className={styles.heroTagline}>
            <div className={styles.heroLine}>
              <span className={styles.taglineBold}>WE GREW UP IN THIS.</span>
            </div>
            <div className={styles.heroLine}>
              RAISED ON SOCIAL MEDIA. TRAINED IN TRENDS.
            </div>
            <div className={styles.heroLine}>
              WE KNOW WHAT WORKS BECAUSE WE LIVE IT EVERY DAY.
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollLine}></div>
        </div>
      </section>

      {/* Big Statement Section */}
      <section className={styles.statementSection} ref={statementRef}>
        <div className={styles.statementContainer}>
          <p className={styles.statement}>
            <span className={styles.statementWord}>THE</span>{' '}
            <span className={styles.statementWord}>BEST</span>{' '}
            <span className={styles.statementWord}>PRODUCT</span>{' '}
            <span className={styles.statementWord}>DOESN'T</span>{' '}
            <span className={styles.statementWord}>ALWAYS</span>{' '}
            <span className={styles.statementWord}>WIN.</span>
          </p>
          <p className={styles.statementHighlight}>
            <span className={styles.statementWord}>THE</span>{' '}
            <span className={styles.statementWord}>BEST</span>{' '}
            <span className={`${styles.statementWord} ${styles.highlighted}`}>MARKETED</span>{' '}
            <span className={styles.statementWord}>PRODUCT</span>{' '}
            <span className={styles.statementWord}>DOES.</span>
          </p>
        </div>
      </section>

      {/* Story Section - Visual Cards */}
      <section className={styles.storySection}>
        <div className={styles.storyGrid}>
          {/* Card 1 - Origin */}
          <div className={styles.storyCard}>
            <div className={styles.cornerFrames}>
              <div className={styles.cornerTL}></div>
              <div className={styles.cornerBR}></div>
              <div className={styles.borderGlow}></div>
            </div>
            <div className={styles.cardNumber}>01</div>
            <h3 className={styles.cardTitle}>THE ORIGIN</h3>
            <p className={styles.cardText}>
              Sweet Dreams started in a recording studio. Artists would make great music, then ask: "How do I get people to actually hear this?"
            </p>
          </div>

          {/* Card 2 - Evolution */}
          <div className={styles.storyCard}>
            <div className={styles.cornerFrames}>
              <div className={styles.cornerTL}></div>
              <div className={styles.cornerBR}></div>
              <div className={styles.borderGlow}></div>
            </div>
            <div className={styles.cardNumber}>02</div>
            <h3 className={styles.cardTitle}>THE EVOLUTION</h3>
            <p className={styles.cardText}>
              Videos became content. Content became campaigns. We realized music and local business had the same problem: great work nobody sees.
            </p>
          </div>

          {/* Card 3 - Today */}
          <div className={styles.storyCard}>
            <div className={styles.cornerFrames}>
              <div className={styles.cornerTL}></div>
              <div className={styles.cornerBR}></div>
              <div className={styles.borderGlow}></div>
            </div>
            <div className={styles.cardNumber}>03</div>
            <h3 className={styles.cardTitle}>TODAY</h3>
            <p className={styles.cardText}>
              Now we work with businesses across the country who refuse to blend in with their competitors.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement - Full Width Impact */}
      <section className={styles.missionSection} ref={missionRef} data-cursor-hide>
        <div className={styles.missionContainer}>
          <div className={styles.missionTextContent}>
            <p className={styles.missionLabel}>OUR MISSION</p>
            <h2 className={styles.missionText}>
              MAKE GREAT WORK<br />
              <span className={styles.missionHighlight}>IMPOSSIBLE TO IGNORE</span>
            </h2>
          </div>

          {/* Team Photos Stack */}
          <div className={styles.teamPhotoStack}>
            <div className={`${styles.teamPhoto} ${styles.teamPhoto1}`}>
              <img
                src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/team/DSC06480.jpg"
                alt="Sweet Dreams Team"
              />
            </div>
            <div className={`${styles.teamPhoto} ${styles.teamPhoto2}`}>
              <img
                src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/team/DSC06491.jpg"
                alt="Sweet Dreams Team"
              />
            </div>
            <div className={`${styles.teamPhoto} ${styles.teamPhoto3}`}>
              <img
                src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/team/DSC06513.jpg"
                alt="Sweet Dreams Team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta} data-cursor-hide>
        <h2 className={styles.ctaTitle}>LET'S CREATE SOMETHING</h2>
        <Link href="/book" className={styles.ctaButton}>
          BOOK A CALL
        </Link>
      </section>
    </div>
  );
}
