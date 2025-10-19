"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import styles from "./page.module.css";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SolutionsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const container = containerRef.current;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Production Hero Animations
      const productionNumber = container.querySelector('.production-number');
      const productionMiniTitle = container.querySelector('.production-mini-title');
      const productionTitle = container.querySelector('.production-title');
      const productionDescription = container.querySelector('.production-description');
      const productionShowcase = container.querySelector('.production-showcase');

      if (productionNumber) {
        gsap.from(productionNumber, {
          opacity: 0,
          scale: 0.8,
          duration: 1.2,
          ease: 'power4.out',
        });
      }

      if (productionMiniTitle) {
        gsap.from(productionMiniTitle, {
          opacity: 0,
          x: 50,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out',
        });
      }

      if (productionTitle) {
        gsap.from(productionTitle, {
          opacity: 0,
          x: 100,
          duration: 1,
          delay: 0.4,
          ease: 'power4.out',
        });
      }

      if (productionDescription) {
        gsap.from(productionDescription, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: 0.6,
          ease: 'power3.out',
        });
      }

      if (productionShowcase) {
        gsap.from(productionShowcase, {
          opacity: 0,
          scale: 0.9,
          duration: 1.2,
          delay: 0.5,
          ease: 'power4.out',
        });
      }

      // Production section header
      const productionHeader = container.querySelector('.production-header');
    if (productionHeader) {
      gsap.from(productionHeader, {
        opacity: 0,
        y: 80,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: productionHeader,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    // Production bento grid with magnetic effect
    const productionCards = container.querySelectorAll('.production-card');
    productionCards.forEach((card, index) => {
      // Initial reveal
      gsap.from(card, {
        opacity: 0,
        y: 80,
        scale: 0.9,
        duration: 0.7,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      });

      // Parallax on scroll
      gsap.to(card, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });

    // Design section animations
    const designNumber = container.querySelector('.design-number');
    const designMiniTitle = container.querySelector('.design-mini-title');
    const designTitle = container.querySelector('.design-title');

    if (designNumber) {
      gsap.from(designNumber, {
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: designNumber,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    if (designMiniTitle) {
      gsap.from(designMiniTitle, {
        opacity: 0,
        x: -50,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: designMiniTitle,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    if (designTitle) {
      gsap.from(designTitle, {
        opacity: 0,
        x: -100,
        duration: 1,
        delay: 0.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: designTitle,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    // Design intro text
    const designIntro = container.querySelector('.design-intro');
    if (designIntro) {
      gsap.from(designIntro, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: designIntro,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    // Design cards - stagger animation
    const designCards = container.querySelectorAll('.design-card');
    designCards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 80,
        scale: 0.95,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    });

    // Design statement
    const designStatement = container.querySelector('.design-statement');
    if (designStatement) {
      gsap.from(designStatement, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: designStatement,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    // Post-production header
    const postHeader = container.querySelector('.post-header');
    if (postHeader) {
      gsap.from(postHeader, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: postHeader,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    // Post-production videos - wave effect
    const postVideos = container.querySelectorAll('.post-video-item');
    postVideos.forEach((video, index) => {
      gsap.from(video, {
        scale: 0.7,
        opacity: 0,
        y: 100,
        rotation: index === 1 ? 0 : (index === 0 ? -8 : 8),
        duration: 1,
        delay: index * 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: video,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        }
      });
    });

    // Social strategy scroll animations - vertical movement based on scroll position
    const socialSection = container.querySelector('.social-section');

    // Right column (title) - starts lower, moves down as you scroll
    const socialRightColumn = container.querySelector('.social-right-column');
    if (socialRightColumn) {
      gsap.fromTo(socialRightColumn,
        {
          y: 500,
        },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: socialSection,
            start: 'top 90%',
            end: 'bottom 10%',
            scrub: 1.5,
          }
        }
      );
    }

    // Middle column phrases - move from right to left as you scroll
    const socialLines = container.querySelectorAll('.social-line');
    socialLines.forEach((line, index) => {
      gsap.fromTo(line,
        {
          x: 600 - (index * 100),
        },
        {
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: socialSection,
            start: 'top 90%',
            end: 'bottom 10%',
            scrub: 2,
          }
        }
      );
    });

    // Left column (tagline + button) - starts higher up, moves up as you scroll
    const socialLeftColumn = container.querySelector('.social-left-column');
    if (socialLeftColumn) {
      gsap.fromTo(socialLeftColumn,
        {
          y: -500,
        },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: socialSection,
            start: 'top 90%',
            end: 'bottom 10%',
            scrub: 1.5,
          }
        }
      );
    }

    // Launch header
    const launchHeader = container.querySelector('.launch-header');
    if (launchHeader) {
      gsap.from(launchHeader, {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: launchHeader,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    // Launch & Growth - 3D card flip effect
    const launchCards = container.querySelectorAll('.launch-card');
    launchCards.forEach((card, index) => {
      const direction = index % 2 === 0 ? -150 : 150;
      gsap.from(card, {
        x: direction,
        opacity: 0,
        rotationY: index % 2 === 0 ? -45 : 45,
        rotationX: 15,
        duration: 1.2,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        }
      });
    });

    // Studio section - dramatic reveal
    const studioContent = container.querySelector('.studio-content');
    if (studioContent) {
      gsap.from(studioContent, {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: studioContent,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    // CTA section
    const ctaTitle = container.querySelector('.cta-title');
    if (ctaTitle) {
      gsap.from(ctaTitle, {
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: ctaTitle,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    const ctaButton = container.querySelector('.cta-button');
    if (ctaButton) {
      gsap.from(ctaButton, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: ctaButton,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      });
    }
    }, 100); // Close setTimeout

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);


  return (
    <div className={styles.page} ref={containerRef}>
      {/* 1. PRODUCTION - Combined Hero & Showcase */}
      <section className={styles.productionHero}>
        <div className={styles.productionHeroInner}>
          <div className={styles.productionHeroContainer}>
            {/* Left Side - Number & Title */}
            <div className={`${styles.productionHeroLeft} production-hero-left`}>
              <div className={styles.productionTitleGroup}>
                <div className={`${styles.productionNumber} production-number`}>01</div>
                <div className={styles.productionTitleWrapper}>
                  <p className={`${styles.productionMiniTitle} production-mini-title`}>WHAT WE DO</p>
                  <h2 className={`${styles.productionHeroTitle} production-title`}>PRODUCTION</h2>
                </div>
              </div>
              <p className={`${styles.productionHeroDescription} production-description`}>
                Cinema-grade video production. From concept to final cut.
              </p>
              <Link href="/media" className={styles.productionButton}>
                VIEW OUR WORK
              </Link>
            </div>

          {/* Right Side - Featured Project Video with White Border Frame */}
          <Link href="/work/dear-lover-music-video" className={styles.productionShowcaseLink}>
            <div className={`${styles.productionShowcaseWrapper} production-showcase`}>
              {/* White border frame */}
              <div className={styles.productionShowcaseFrame}></div>

              {/* Video container */}
              <div className={styles.productionShowcase}>
                {/* Video Background - Dear Lover Music Video */}
                <iframe
                  src="https://customer-w6h9o08eg118alny.cloudflarestream.com/beeb2ee6a9a30c655e79bdc1f4fb6d20/iframe?muted=true&autoplay=true&loop=true&controls=false"
                  className={styles.productionShowcaseVideo}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen={true}
                  style={{ border: 'none' }}
                />

                {/* Dark overlay */}
                <div className={styles.productionShowcaseOverlay}></div>

                {/* Content Overlay */}
                <div className={styles.productionShowcaseContent}>
                  {/* Top Row */}
                  <div className={styles.showcaseTopRow}>
                    <div className={styles.showcaseClient}>LYAZ</div>
                    <div className={styles.showcaseViewButton}>
                      <span>VIEW PROJECT</span>
                    </div>
                  </div>

                  {/* Center Title */}
                  <div className={styles.showcaseCenterTitle}>
                    <div className={styles.showcaseTitleText}>DEAR</div>
                    <div className={styles.showcaseTitleText}>LOVER</div>
                  </div>

                  {/* Bottom Subtitle */}
                  <div className={styles.showcaseBottomRow}>
                    <div className={styles.showcaseSubtitle}>MUSIC VIDEO</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          </div>
        </div>
      </section>

      {/* 02. CREATIVE & DESIGN - Platform Strategy */}
      <section className={styles.designSection}>
        <div className={styles.designContainer}>
          {/* Header with Number - Two Column Layout */}
          <div className={styles.designHeaderGrid}>
            <div className={styles.designHeaderLeft}>
              <div className={styles.designHeader}>
                <div className={`${styles.designNumber} design-number`}>02</div>
                <div className={styles.designTitleWrapper}>
                  <p className={`${styles.designMiniTitle} design-mini-title`}>PLATFORM STRATEGY</p>
                  <h2 className={`${styles.designTitle} design-title`}>CREATIVE<br />& DESIGN</h2>
                </div>
              </div>
            </div>
            <div className={styles.designHeaderRight}>
              <p className={`${styles.designLargeText} design-intro`}>
                We don't just make content. We engineer it for the platform.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.designContent}>

            {/* Strategy Cards */}
            <div className={styles.designGrid}>
              <div className={`${styles.designCard} design-card`}>
                <div className={styles.designCardIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 3v18M3 9h18M3 15h18M15 3v18"/>
                  </svg>
                </div>
                <h3 className={styles.designCardTitle}>ALGORITHM-FIRST DESIGN</h3>
                <p className={styles.designCardDescription}>
                  Every platform has a language. We speak it fluently. Content optimized for maximum reach without paid promotion.
                </p>
              </div>

              <div className={`${styles.designCard} design-card`}>
                <div className={styles.designCardIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
                    <polyline points="7.5 19.79 7.5 14.6 3 12"/>
                    <polyline points="21 12 16.5 14.6 16.5 19.79"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <h3 className={styles.designCardTitle}>CROSS-PLATFORM ADAPTATION</h3>
                <p className={styles.designCardDescription}>
                  One concept, infinite formats. We adapt your message for TikTok, Instagram, YouTube, and beyond—each version native to its home.
                </p>
              </div>

              <div className={`${styles.designCard} design-card`}>
                <div className={styles.designCardIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <h3 className={styles.designCardTitle}>ORGANIC GROWTH TACTICS</h3>
                <p className={styles.designCardDescription}>
                  Hooks that stop the scroll. Pacing that holds attention. CTAs that convert. We build content that platforms want to promote.
                </p>
              </div>

              <div className={`${styles.designCard} design-card`}>
                <div className={styles.designCardIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <h3 className={styles.designCardTitle}>TREND-AWARE EXECUTION</h3>
                <p className={styles.designCardDescription}>
                  We stay ahead of the curve. Leveraging current trends while maintaining your brand identity for maximum impact.
                </p>
              </div>
            </div>

            {/* Bottom Statement */}
            <div className={`${styles.designStatement} design-statement`}>
              <p>Platform-native content that grows your brand organically.</p>
              <Link href="/contact" className={styles.solutionButton}>
                LET'S BUILD YOUR STRATEGY
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* POST-PRODUCTION - Triple Video Showcase */}
      <section className={styles.postSection}>
        <div className={styles.postContainer}>
          <div className={`${styles.postHeader} post-header`}>
            <div className={styles.postNumber}>03</div>
            <div className={styles.postTitleWrapper}>
              <p className={styles.postMiniTitle}>EDITING & POST</p>
              <h2 className={styles.postTitle}>POST-PRODUCTION</h2>
            </div>
          </div>
          <p className={styles.postSubtitle}>
            Expert editing. Color grading. Motion graphics.<br />
            We take good footage and make it great.
          </p>
        </div>
        <div className={styles.postGrid}>
          <div className={`${styles.postVideoItem} post-video-item`}>
            <iframe
              src="https://customer-w6h9o08eg118alny.cloudflarestream.com/559702b328b08583c75a53b76a010a59/iframe?muted=true&autoplay=true&loop=true&controls=false"
              className={styles.postVideoIframe}
              allow="autoplay; encrypted-media;"
            ></iframe>
            <div className={styles.postLabel}>Editing</div>
          </div>
          <div className={`${styles.postVideoItem} post-video-item`}>
            <iframe
              src="https://customer-w6h9o08eg118alny.cloudflarestream.com/d912b8bd58831e95431db3c24791e44b/iframe?muted=true&autoplay=true&loop=true&controls=false"
              className={styles.postVideoIframe}
              allow="autoplay; encrypted-media;"
            ></iframe>
            <div className={styles.postLabel}>Color Grading</div>
          </div>
          <div className={`${styles.postVideoItem} post-video-item`}>
            <iframe
              src="https://customer-w6h9o08eg118alny.cloudflarestream.com/a507a5b8a369b70b7332c0567cbbcc4c/iframe?muted=true&autoplay=true&loop=true&controls=false"
              className={styles.postVideoIframe}
              allow="autoplay; encrypted-media;"
            ></iframe>
            <div className={styles.postLabel}>Motion Graphics</div>
          </div>
        </div>
        <div className={styles.postCta}>
          <Link href="/contact" className={styles.solutionButton}>
            ELEVATE YOUR CONTENT
          </Link>
        </div>
      </section>

      {/* 03. SOCIAL STRATEGY - Three Column Layout */}
      <section className={`${styles.socialSection} social-section`}>
        <div className={styles.socialContent}>
          <div className={styles.socialGrid}>
            {/* Left Column - Bottom Aligned CTA */}
            <div className={`${styles.socialLeftColumn} social-left-column`}>
              <div className={styles.socialBottomLeft}>
                <p className={`${styles.socialTagline} social-tagline`}>
                  We handle your social so you don't have to.
                </p>
                <div className={styles.socialCta}>
                  <Link href="/contact" className={styles.solutionButton}>
                    GROW YOUR AUDIENCE
                  </Link>
                </div>
              </div>
            </div>

            {/* Middle Column - Stair-stepped Lines */}
            <div className={`${styles.socialMiddleColumn} social-middle-column`}>
              <div className={styles.socialLines}>
                <h2 className={`${styles.socialLine} social-line`}>CONTENT CALENDARS.</h2>
                <h2 className={`${styles.socialLine} social-line`}>PLATFORM MANAGEMENT.</h2>
                <h2 className={`${styles.socialLine} social-line`}>COMMUNITY ENGAGEMENT.</h2>
                <h2 className={`${styles.socialLine} social-line`}>REAL GROWTH.</h2>
              </div>
            </div>

            {/* Right Column - Title */}
            <div className={`${styles.socialRightColumn} social-right-column`}>
              <div className={styles.socialHeader}>
                <div className={`${styles.socialNumber} social-number`}>04</div>
                <div className={styles.socialTitleWrapper}>
                  <p className={`${styles.socialMiniTitle} social-mini-title`}>DIGITAL MARKETING</p>
                  <h2 className={`${styles.socialMainTitle} social-main-title`}>SOCIAL STRATEGY</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LAUNCH & GROWTH - Diagonal Cards */}
      <section className={styles.launchSection}>
        <div className={styles.launchContainer}>
          <div className={`${styles.launchHeader} launch-header`}>
            <div className={styles.launchNumber}>05</div>
            <div className={styles.launchTitleWrapper}>
              <p className={styles.launchMiniTitle}>STRATEGY</p>
              <h2 className={styles.launchTitle}>LAUNCH & GROWTH</h2>
            </div>
          </div>
        </div>
        <div className={styles.launchGrid}>
          <div className={`${styles.launchCard} launch-card`}>
            <h3>Campaign Planning</h3>
            <p>Strategic campaigns designed to scale your brand.</p>
          </div>
          <div className={`${styles.launchCard} launch-card`}>
            <h3>Digital Marketing</h3>
            <p>Performance-driven marketing that delivers results.</p>
          </div>
          <div className={`${styles.launchCard} launch-card`}>
            <h3>Growth Strategy</h3>
            <p>Data-backed strategies built for sustainable growth.</p>
          </div>
        </div>
        <div className={styles.launchCta}>
          <Link href="/contact" className={styles.solutionButton}>
            LAUNCH WITH US
          </Link>
        </div>
      </section>

      {/* AUDIO SOLUTIONS - Header & Services (White) */}
      <section className={styles.studioSectionWhite}>
        <div className={styles.studioContainer}>
          {/* Header with Number */}
          <div className={styles.studioHeader}>
            <div className={styles.studioNumber}>06</div>
            <div className={styles.studioTitleWrapper}>
              <p className={styles.studioMiniTitle}>MUSIC PRODUCTION</p>
              <h2 className={styles.studioTitle}>AUDIO<br />SOLUTIONS</h2>
            </div>
          </div>

          {/* Bento Grid - All Services */}
          <div className={styles.studioBentoGrid}>
            {/* Large Recording Card */}
            <div className={`${styles.studioServiceCard} ${styles.studioCardLarge}`}>
              <h3>RECORDING</h3>
              <p>Professional vocal & instrument recording in our fully equipped studio</p>
            </div>

            {/* Beat Production */}
            <div className={styles.studioServiceCard}>
              <h3>BEAT PRODUCTION</h3>
              <p>Original beats crafted to match your unique style and vision</p>
            </div>

            {/* Mixing & Mastering */}
            <div className={styles.studioServiceCard}>
              <h3>MIXING & MASTERING</h3>
              <p>Industry-standard mixing and mastering for radio-ready sound</p>
            </div>

            {/* Large Video Production Card */}
            <div className={`${styles.studioServiceCard} ${styles.studioCardLarge}`}>
              <h3>VIDEO PRODUCTION</h3>
              <p>Full-service video production from concept to final delivery</p>
            </div>

            {/* Book a Session Button */}
            <a href="/music#booking" className={`${styles.studioServiceButton} ${styles.studioButtonTall}`}>
              BOOK A SESSION
            </a>

            {/* Learn More Button */}
            <Link href="/music" className={`${styles.studioServiceButton} ${styles.studioButtonTall}`}>
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>

      {/* SWEET DREAMS STUDIO - Video Showcase (Black) */}
      <section className={styles.studioSectionBlack}>
        <div className={styles.studioContainer}>
          {/* Video Showcase with White Border Frame */}
          <Link href="/work/sweet-dreams-recording-studio" className={styles.studioShowcaseLink}>
            <div className={styles.studioShowcaseWrapper}>
              {/* White border frame */}
              <div className={styles.studioShowcaseFrame}></div>

              {/* Video container */}
              <div className={styles.studioShowcase}>
                {/* Video Background */}
                <iframe
                  src="https://customer-w6h9o08eg118alny.cloudflarestream.com/d912b8bd58831e95431db3c24791e44b/iframe?muted=true&autoplay=true&loop=true&controls=false"
                  className={styles.studioShowcaseVideo}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen={true}
                  style={{ border: 'none' }}
                />

                {/* Dark overlay */}
                <div className={styles.studioShowcaseOverlay}></div>

                {/* Content Overlay */}
                <div className={styles.studioShowcaseContent}>
                  {/* Top Row - Client & Button */}
                  <div className={styles.studioShowcaseTopRow}>
                    <div className={styles.studioShowcaseClient}>SWEET DREAMS MEDIA</div>
                    <div className={styles.studioShowcaseViewButton}>
                      <span>VIEW PROJECT</span>
                    </div>
                  </div>

                  {/* Center Title */}
                  <div className={styles.studioShowcaseCenterTitle}>
                    <div className={styles.studioShowcaseTitleText}>SWEET</div>
                    <div className={styles.studioShowcaseTitleText}>DREAMS</div>
                  </div>

                  {/* Bottom Subtitle */}
                  <div className={styles.studioShowcaseBottomRow}>
                    <div className={styles.studioShowcaseSubtitle}>RECORDING STUDIO SHOWCASE</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={`${styles.ctaTitle} cta-title`}>LET'S WORK</h2>
        <Link href="/contact" className={`${styles.ctaButton} cta-button`}>
          GET IN TOUCH
        </Link>
      </section>
    </div>
  );
}
