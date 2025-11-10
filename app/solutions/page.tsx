"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import MusicContactForm from "@/components/music/MusicContactForm";
import styles from "./page.module.css";

function LaunchSection() {
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveringCard, setHoveringCard] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
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
      {/* Radial Expanding Circle Design - Completely Unique */}
      <div className={styles.launchRadialContainer}>
        <div className={styles.launchRadialGrid}>
          {/* Top Left - Campaign Planning */}
          <div
            className={`${styles.launchRadialCard} ${styles.launchRadial1} ${styles.launchCardWithVideo} ${openCard === 1 ? styles.launchRadialActive : ''} launch-card`}
            onClick={() => setOpenCard(openCard === 1 ? null : 1)}
            onMouseMove={(e) => handleMouseMove(e, 1)}
            onMouseEnter={() => setHoveringCard(1)}
            onMouseLeave={() => setHoveringCard(null)}
          >
            <div className={styles.launchVideoWrapper}>
              <iframe
                src="https://customer-w6h9o08eg118alny.cloudflarestream.com/7439dc9c431f2bada649098c541cf88b/iframe?muted=true&autoplay=true&loop=true&controls=false"
                className={styles.launchVideoIframe}
                allow="autoplay; encrypted-media;"
              ></iframe>
            </div>
            <div className={styles.launchRadialLabel}>01</div>
            <h3>Campaign<br/>Planning</h3>
            {hoveringCard === 1 && !openCard && (
              <div className={styles.clickMeCursor} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
                click me
              </div>
            )}
          </div>

          {/* Top Right - Digital Marketing with Video */}
          <div
            className={`${styles.launchRadialCard} ${styles.launchRadial2} ${styles.launchCardWithVideo} ${openCard === 2 ? styles.launchRadialActive : ''} launch-card`}
            onClick={() => setOpenCard(openCard === 2 ? null : 2)}
            onMouseMove={(e) => handleMouseMove(e, 2)}
            onMouseEnter={() => setHoveringCard(2)}
            onMouseLeave={() => setHoveringCard(null)}
          >
            <div className={styles.launchVideoWrapper}>
              <iframe
                src="https://customer-w6h9o08eg118alny.cloudflarestream.com/559702b328b08583c75a53b76a010a59/iframe?muted=true&autoplay=true&loop=true&controls=false"
                className={styles.launchVideoIframe}
                allow="autoplay; encrypted-media;"
              ></iframe>
            </div>
            <div className={styles.launchRadialLabel}>02</div>
            <h3>Digital<br/>Marketing</h3>
            {hoveringCard === 2 && !openCard && (
              <div className={styles.clickMeCursor} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
                click me
              </div>
            )}
          </div>

          {/* Bottom Left - Growth Strategy */}
          <div
            className={`${styles.launchRadialCard} ${styles.launchRadial3} ${styles.launchCardWithVideo} ${openCard === 3 ? styles.launchRadialActive : ''} launch-card`}
            onClick={() => setOpenCard(openCard === 3 ? null : 3)}
            onMouseMove={(e) => handleMouseMove(e, 3)}
            onMouseEnter={() => setHoveringCard(3)}
            onMouseLeave={() => setHoveringCard(null)}
          >
            <div className={styles.launchVideoWrapper}>
              <iframe
                src="https://customer-w6h9o08eg118alny.cloudflarestream.com/2e07fc70e6c22f62e48bc51a8987d058/iframe?muted=true&autoplay=true&loop=true&controls=false"
                className={styles.launchVideoIframe}
                allow="autoplay; encrypted-media;"
              ></iframe>
            </div>
            <div className={styles.launchRadialLabel}>03</div>
            <h3>Growth<br/>Strategy</h3>
            {hoveringCard === 3 && !openCard && (
              <div className={styles.clickMeCursor} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
                click me
              </div>
            )}
          </div>

          {/* Bottom Right - Web Development */}
          <div
            className={`${styles.launchRadialCard} ${styles.launchRadial4} ${styles.launchCardWithVideo} ${openCard === 4 ? styles.launchRadialActive : ''} launch-card`}
            onClick={() => setOpenCard(openCard === 4 ? null : 4)}
            onMouseMove={(e) => handleMouseMove(e, 4)}
            onMouseEnter={() => setHoveringCard(4)}
            onMouseLeave={() => setHoveringCard(null)}
          >
            <div className={styles.launchVideoWrapper}>
              <iframe
                src="https://customer-w6h9o08eg118alny.cloudflarestream.com/9323d8b49961b64e93d4bdc100368d0f/iframe?muted=true&autoplay=true&loop=true&controls=false"
                className={styles.launchVideoIframe}
                allow="autoplay; encrypted-media;"
              ></iframe>
            </div>
            <div className={styles.launchRadialLabel}>04</div>
            <h3>Web<br/>Development</h3>
            {hoveringCard === 4 && !openCard && (
              <div className={styles.clickMeCursor} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
                click me
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.launchCta}>
        <Link href="/contact" className={styles.solutionButton}>
          LAUNCH WITH US
        </Link>
      </div>

      {/* Blur Overlay and Modals */}
      {openCard !== null && (
        <>
          <div
            className={styles.launchBlurOverlay}
            onClick={() => setOpenCard(null)}
          />

          {/* Campaign Planning Modal */}
          {openCard === 1 && (
            <div className={styles.launchCardExpanded}>
              <button
                className={styles.launchCardClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCard(null);
                }}
              >
                ✕
              </button>
              <h3>Campaign Planning</h3>
              <h4>Campaigns That Convert. Not Just Look Cool.</h4>
              <p>
                Anyone can throw together a campaign. We architect them. Every touchpoint is mapped. Every piece of content has a purpose. Every metric is tracked.
              </p>
              <ul>
                <li>Full-funnel campaign architecture</li>
                <li>Multi-channel content calendars</li>
                <li>A/B testing & optimization frameworks</li>
                <li>Real-time performance tracking</li>
                <li>ROI-focused strategy development</li>
              </ul>
              <p className={styles.launchCardEmphasis}>
                Stop guessing. Start growing. Every campaign we build is designed to scale.
              </p>
              <Link href="/contact" className={styles.launchCardButton}>
                PLAN YOUR CAMPAIGN
              </Link>
            </div>
          )}

          {/* Digital Marketing Modal */}
          {openCard === 2 && (
            <div className={styles.launchCardExpanded}>
              <button
                className={styles.launchCardClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCard(null);
                }}
              >
                ✕
              </button>
              <h3>Digital Marketing</h3>
              <h4>Performance-Driven. Data-Backed. Results-Focused.</h4>
              <p>
                We don't do vanity metrics. Every dollar spent is tracked. Every strategy is tested. Every decision is backed by data.
              </p>
              <ul>
                <li>Paid social media advertising (Meta, TikTok, LinkedIn)</li>
                <li>Google Ads & search engine marketing</li>
                <li>Conversion rate optimization</li>
                <li>Email marketing & automation</li>
                <li>Analytics & performance reporting</li>
              </ul>
              <p className={styles.launchCardEmphasis}>
                Marketing that actually moves the needle. No fluff. Just measurable growth.
              </p>
              <Link href="/contact" className={styles.launchCardButton}>
                GROW YOUR BRAND
              </Link>
            </div>
          )}

          {/* Growth Strategy Modal */}
          {openCard === 3 && (
            <div className={styles.launchCardExpanded}>
              <button
                className={styles.launchCardClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCard(null);
                }}
              >
                ✕
              </button>
              <h3>Growth Strategy</h3>
              <h4>Built For Scale. Designed To Last.</h4>
              <p>
                Growth isn't an accident. It's engineered. We build systems that compound. Strategies that scale. Frameworks that work long-term.
              </p>
              <ul>
                <li>Market research & competitive analysis</li>
                <li>Audience segmentation & targeting</li>
                <li>Scalable content production systems</li>
                <li>Community building & engagement strategies</li>
                <li>Long-term brand positioning</li>
              </ul>
              <p className={styles.launchCardEmphasis}>
                One-off wins are cool. Sustainable growth is better. Let's build a system that lasts.
              </p>
              <Link href="/contact" className={styles.launchCardButton}>
                BUILD YOUR STRATEGY
              </Link>
            </div>
          )}

          {/* Web Development Modal */}
          {openCard === 4 && (
            <div className={styles.launchCardExpanded}>
              <button
                className={styles.launchCardClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCard(null);
                }}
              >
                ✕
              </button>
              <h3>Web Development</h3>
              <h4>Real Code. Real Results.</h4>
              <p>
                We don't use templates. We don't drag-and-drop. We write clean, custom code that's built specifically for your business.
              </p>
              <ul>
                <li>Custom Next.js & React applications</li>
                <li>High-performance, SEO-optimized sites</li>
                <li>Database integration & backend development</li>
                <li>Responsive design that works everywhere</li>
                <li>Ongoing support & maintenance</li>
              </ul>
              <p className={styles.launchCardEmphasis}>
                Your competitors are using cookie-cutter templates. Stand out with a site that's uniquely yours.
              </p>
              <Link href="/contact" className={styles.launchCardButton}>
                BUILD NOW
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function DesignSection() {
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveringCard, setHoveringCard] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
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
            <div
              className={`${styles.designCard} design-card`}
              onClick={() => setOpenCard(openCard === 1 ? null : 1)}
              onMouseMove={(e) => handleMouseMove(e, 1)}
              onMouseEnter={() => setHoveringCard(1)}
              onMouseLeave={() => setHoveringCard(null)}
            >
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
              {hoveringCard === 1 && !openCard && (
                <div className={styles.clickMeCursor} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
                  click me
                </div>
              )}
            </div>

            <div
              className={`${styles.designCard} design-card`}
              onClick={() => setOpenCard(openCard === 2 ? null : 2)}
              onMouseMove={(e) => handleMouseMove(e, 2)}
              onMouseEnter={() => setHoveringCard(2)}
              onMouseLeave={() => setHoveringCard(null)}
            >
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
              {hoveringCard === 2 && !openCard && (
                <div className={styles.clickMeCursor} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
                  click me
                </div>
              )}
            </div>

            <div
              className={`${styles.designCard} design-card`}
              onClick={() => setOpenCard(openCard === 3 ? null : 3)}
              onMouseMove={(e) => handleMouseMove(e, 3)}
              onMouseEnter={() => setHoveringCard(3)}
              onMouseLeave={() => setHoveringCard(null)}
            >
              <div className={styles.designCardIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3 className={styles.designCardTitle}>ORGANIC GROWTH TACTICS</h3>
              <p className={styles.designCardDescription}>
                Hooks that stop the scroll. Pacing that holds attention. CTAs that convert. We build content that platforms want to promote.
              </p>
              {hoveringCard === 3 && !openCard && (
                <div className={styles.clickMeCursor} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
                  click me
                </div>
              )}
            </div>

            <div
              className={`${styles.designCard} design-card`}
              onClick={() => setOpenCard(openCard === 4 ? null : 4)}
              onMouseMove={(e) => handleMouseMove(e, 4)}
              onMouseEnter={() => setHoveringCard(4)}
              onMouseLeave={() => setHoveringCard(null)}
            >
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
              {hoveringCard === 4 && !openCard && (
                <div className={styles.clickMeCursor} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
                  click me
                </div>
              )}
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

      {/* Blur Overlay and Modals */}
      {openCard !== null && (
        <>
          <div
            className={styles.designBlurOverlay}
            onClick={() => setOpenCard(null)}
          />

          {/* Algorithm-First Design Modal */}
          {openCard === 1 && (
            <div className={styles.designCardExpanded}>
              <button
                className={styles.designCardClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCard(null);
                }}
              >
                ✕
              </button>
              <h3>Algorithm-First Design</h3>
              <h4>We Make Content That Gets Seen</h4>
              <p>
                Social media platforms want to keep people scrolling. So they push content that keeps people watching. We study what works on each platform—TikTok, Instagram, YouTube—and we make your content in a way that these platforms actually want to show to more people.
              </p>
              <ul>
                <li>Opening seconds that grab attention immediately (because most people scroll past in 2 seconds)</li>
                <li>Videos paced to keep people watching all the way through (longer watch time = more reach)</li>
                <li>Content designed to make people comment, share, and engage (platforms love engagement)</li>
                <li>Proper sizing and framing for each platform (vertical for TikTok, square for Instagram, etc.)</li>
                <li>Editing styles that feel native to each platform (so it doesn't look out of place)</li>
              </ul>
              <p className={styles.designCardEmphasis}>
                The platforms decide who sees your content. We make content they want to show.
              </p>
              <Link href="/contact" className={styles.designCardButton}>
                OPTIMIZE YOUR CONTENT
              </Link>
            </div>
          )}

          {/* Cross-Platform Adaptation Modal */}
          {openCard === 2 && (
            <div className={styles.designCardExpanded}>
              <button
                className={styles.designCardClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCard(null);
                }}
              >
                ✕
              </button>
              <h3>Cross-Platform Adaptation</h3>
              <h4>8 Platforms = 8x The Views. Free Eyes On Your Brand.</h4>
              <p>
                Here's the math that makes sense: Post on 1 platform, you get 1,000 views. Post on 8 platforms? That's 8,000 views. Same content. Same effort. 8x the reach. For free.
              </p>
              <p>
                We take one core concept and optimize it for every major platform. Each version is native to its home—the right format, the right pacing, the right messaging. Your brand stays consistent. Your reach multiplies.
              </p>
              <ul>
                <li>TikTok & Instagram Reels (9:16 vertical, fast-paced)</li>
                <li>Instagram Feed (1:1 square, aesthetic-focused)</li>
                <li>YouTube & LinkedIn (16:9 landscape, long-form)</li>
                <li>Facebook Feed (4:5 portrait, community-driven)</li>
                <li>Twitter/X (optimized clips with text overlays)</li>
                <li>Pinterest (vertical pins that drive traffic)</li>
                <li>Platform-specific captions, hashtags, & CTAs for each</li>
              </ul>
              <p className={styles.designCardEmphasis}>
                Stop leaving views on the table. One shoot. Eight platforms. Exponential reach.
              </p>
              <Link href="/contact" className={styles.designCardButton}>
                MULTIPLY YOUR REACH
              </Link>
            </div>
          )}

          {/* Organic Growth Tactics Modal */}
          {openCard === 3 && (
            <div className={styles.designCardExpanded}>
              <button
                className={styles.designCardClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCard(null);
                }}
              >
                ✕
              </button>
              <h3>Organic Growth Tactics</h3>
              <h4>Content That Spreads For Free</h4>
              <p>
                Viral content isn't luck. It follows patterns. We study what makes people stop scrolling, what makes them watch the whole thing, and what makes them share it with their friends. Then we apply those same patterns to your content. The result? More views, more followers, and you didn't spend a dollar on ads.
              </p>
              <ul>
                <li>Opening lines that make people stop mid-scroll (you have 2 seconds to grab them)</li>
                <li>Unexpected moments that break the pattern and demand attention</li>
                <li>Content that makes people feel something (happy, surprised, inspired—emotion drives shares)</li>
                <li>Questions and topics that make people want to comment and debate</li>
                <li>Clear next steps that turn viewers into followers ("Follow for more", "Check out the full video", etc.)</li>
              </ul>
              <p className={styles.designCardEmphasis}>
                Ads cost money every time someone sees them. Good content spreads for free. Forever.
              </p>
              <Link href="/contact" className={styles.designCardButton}>
                GROW ORGANICALLY
              </Link>
            </div>
          )}

          {/* Trend-Aware Execution Modal */}
          {openCard === 4 && (
            <div className={styles.designCardExpanded}>
              <button
                className={styles.designCardClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCard(null);
                }}
              >
                ✕
              </button>
              <h3>Trend-Aware Execution</h3>
              <h4>Catch Trends While They're Hot</h4>
              <p>
                Trends on social media move fast. Really fast. By the time most businesses notice a trend and try to use it, everyone's already moved on. We watch trends all day, every day. We catch them early, figure out which ones fit your brand, and create content before the trend dies. That's how you get massive reach.
              </p>
              <ul>
                <li>We monitor what's trending across all platforms in real-time (so you don't have to)</li>
                <li>We filter out trends that don't make sense for your brand (not every trend is worth jumping on)</li>
                <li>We adapt trends to fit your brand's voice and style (so it feels authentic, not forced)</li>
                <li>We move fast—create and post while the trend is still growing (timing is everything)</li>
                <li>We put your own spin on trends (so you stand out instead of blending in)</li>
              </ul>
              <p className={styles.designCardEmphasis}>
                Trends are free exposure. But only if you're early. We make sure you are.
              </p>
              <Link href="/contact" className={styles.designCardButton}>
                STAY AHEAD OF TRENDS
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}

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

    // Social strategy - directional animations
    const socialSection = container.querySelector('.social-section');
    const socialRightColumn = container.querySelector('.social-right-column');
    const socialLines = container.querySelectorAll('.social-line');
    const socialBottomLeft = container.querySelector('.social-tagline')?.parentElement;

    // Header (04 SOCIAL STRATEGY) - slide from left
    if (socialRightColumn) {
      gsap.from(socialRightColumn, {
        opacity: 0,
        x: -200,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: socialSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    // Four phrases - slide from right, staggered
    socialLines.forEach((line, index) => {
      gsap.from(line, {
        opacity: 0,
        x: 200,
        duration: 1,
        delay: 0.2 + (index * 0.1),
        ease: 'power3.out',
        scrollTrigger: {
          trigger: socialSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      });
    });

    // Tagline and button - slide up from bottom
    if (socialBottomLeft) {
      gsap.from(socialBottomLeft, {
        opacity: 0,
        y: 100,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: socialSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      });
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

    // Launch & Growth - Animation removed per user request

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
          start: 'top bottom',
          toggleActions: 'play none none reverse',
        }
      });
    }

    const ctaButton = container.querySelector('.cta-button');
    if (ctaButton) {
      gsap.from(ctaButton, {
        opacity: 0,
        y: 60,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaButton,
          start: 'top bottom',
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
          <Link href="/work/nissan-warsaw-dealership" className={styles.productionShowcaseLink}>
            <div className={`${styles.productionShowcaseWrapper} production-showcase`}>
              {/* White border frame */}
              <div className={styles.productionShowcaseFrame}></div>

              {/* Video container */}
              <div className={styles.productionShowcase}>
                {/* Video Background - Nissan Warsaw Commercial */}
                <iframe
                  src="https://customer-w6h9o08eg118alny.cloudflarestream.com/700297c313e97262173f0c2107f3b8db/iframe?muted=true&autoplay=true&loop=true&controls=false&preload=true&poster=https%3A%2F%2Fcustomer-w6h9o08eg118alny.cloudflarestream.com%2F700297c313e97262173f0c2107f3b8db%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D2s%26height%3D600"
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
                    <div className={styles.showcaseClient}>NISSAN WARSAW</div>
                    <div className={styles.showcaseViewButton}>
                      <span>VIEW PROJECT</span>
                    </div>
                  </div>

                  {/* Center Title */}
                  <div className={styles.showcaseCenterTitle}>
                    <div className={styles.showcaseTitleText}>NISSAN</div>
                    <div className={styles.showcaseTitleText}>WARSAW</div>
                  </div>

                  {/* Bottom Subtitle */}
                  <div className={styles.showcaseBottomRow}>
                    <div className={styles.showcaseSubtitle}>COMMERCIAL</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          </div>
        </div>
      </section>

      {/* 02. CREATIVE & DESIGN - Platform Strategy */}
      <DesignSection />

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
              src="https://customer-w6h9o08eg118alny.cloudflarestream.com/beeb2ee6a9a30c655e79bdc1f4fb6d20/iframe?muted=true&autoplay=true&loop=true&controls=false"
              className={styles.postVideoIframe}
              allow="autoplay; encrypted-media;"
            ></iframe>
            <div className={styles.postLabel}>Color Grading</div>
          </div>
          <div className={`${styles.postVideoItem} post-video-item`}>
            <iframe
              src="https://customer-w6h9o08eg118alny.cloudflarestream.com/851821b5ba9d7b4ca9abc3f80660016d/iframe?muted=true&autoplay=true&loop=true&controls=false"
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

      {/* 03. SOCIAL STRATEGY - Two Column Layout */}
      <section className={`${styles.socialSection} social-section`}>
        <div className={styles.socialContent}>
          <div className={styles.socialGrid}>
            {/* Left Column - Header at top, Tagline & CTA below */}
            <div className={`${styles.socialLeftColumn} social-left-column`}>
              <div className={styles.socialRightColumn}>
                <div className={styles.socialHeader}>
                  <div className={`${styles.socialNumber} social-number`}>04</div>
                  <div className={styles.socialTitleWrapper}>
                    <p className={`${styles.socialMiniTitle} social-mini-title`}>DIGITAL MARKETING</p>
                    <h2 className={`${styles.socialMainTitle} social-main-title`}>SOCIAL STRATEGY</h2>
                  </div>
                </div>
              </div>

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

            {/* Right Column - Stair-stepped Lines */}
            <div className={`${styles.socialMiddleColumn} social-middle-column`}>
              <div className={styles.socialLines}>
                <h2 className={`${styles.socialLine} social-line`}><span className={styles.socialColoredWord}>CONTENT</span> CALENDARS.</h2>
                <h2 className={`${styles.socialLine} social-line`}><span className={styles.socialColoredWord}>PLATFORM</span> MANAGEMENT.</h2>
                <h2 className={`${styles.socialLine} social-line`}><span className={styles.socialColoredWord}>COMMUNITY</span> ENGAGEMENT.</h2>
                <h2 className={`${styles.socialLine} social-line`}>REAL GROWTH.</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LAUNCH & GROWTH - Diagonal Cards */}
      <LaunchSection />

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

          {/* Promo Banner */}
          <div className={styles.promoBannerStudio}>
            <span className={styles.promoTextStudio}>
              <strong>Holiday Special! </strong>Book 3 Hours for $100 (regularly $150) - Limited Time! &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Holiday Special! </strong>Book 3 Hours for $100 (regularly $150) - Limited Time! &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Holiday Special! </strong>Book 3 Hours for $100 (regularly $150) - Limited Time! &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Holiday Special! </strong>Book 3 Hours for $100 (regularly $150) - Limited Time! &nbsp;&nbsp;|&nbsp;&nbsp;
            </span>
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

      {/* Contact Form */}
      <MusicContactForm />
    </div>
  );
}
