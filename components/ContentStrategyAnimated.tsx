'use client';

import { useEffect, useRef } from 'react';
import styles from "./ContentStrategy.module.css";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContentStrategyAnimated() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const rotatingWordRef = useRef<HTMLSpanElement>(null);
  const ratioCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !titleRef.current || !rotatingWordRef.current) return;

    const isMobile = window.innerWidth <= 768;
    const words = ['WATCHING', 'LISTENING', 'BUYING', 'TRUSTING'];
    const wordClasses: { [key: string]: string } = {
      'WATCHING': styles.wordWatching,
      'LISTENING': styles.wordListening,
      'BUYING': styles.wordBuying,
      'TRUSTING': styles.wordTrusting,
    };
    let currentIndex = 0;
    let animationTimeout: NodeJS.Timeout | null = null;

    const applyWordClass = (element: HTMLElement, word: string) => {
      // Remove all word classes
      Object.values(wordClasses).forEach(cls => element.classList.remove(cls));
      // Add the current word class
      if (wordClasses[word]) {
        element.classList.add(wordClasses[word]);
      }
    };

    const animateWord = () => {
      const wordElement = rotatingWordRef.current;
      if (!wordElement) return;

      const currentWord = words[currentIndex];
      wordElement.textContent = currentWord;
      applyWordClass(wordElement, currentWord);

      // Start floating animation for current word
      const floatAnimation = gsap.to(wordElement, {
        y: -15,
        rotation: -3,
        duration: 1.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Wait 2 seconds, then transition to next word
      animationTimeout = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % words.length;
        const nextWord = words[nextIndex];

        const tl = gsap.timeline();

        // Kill the floating animation before sliding
        floatAnimation.kill();

        // Slide current word out to the left with motion blur
        tl.to(wordElement, {
          x: -window.innerWidth,
          opacity: 0,
          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5)) blur(10px)',
          duration: 0.35,
          ease: 'power2.in',
        });

        // Change text and position for slide in from far right
        tl.call(() => {
          wordElement.textContent = nextWord;
          applyWordClass(wordElement, nextWord);
          currentIndex = nextIndex;
          gsap.set(wordElement, { x: window.innerWidth, opacity: 1, y: 0, rotation: 0, filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5)) blur(4px)' });
        });

        // Slide new word in from the right edge with motion blur fading out
        tl.to(wordElement, {
          x: 0,
          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5)) blur(0px)',
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            animationTimeout = setTimeout(animateWord, 2000);
          }
        });
      }, 2000);
    };

    // Add delay to ensure proper layout after navigation
    const setupTimeout = setTimeout(() => {
      // Start the animation when scrolled into view - trigger earlier on mobile
      const trigger = ScrollTrigger.create({
        trigger: titleRef.current,
        start: isMobile ? 'top 100%' : 'top 80%',
        once: true,
        onEnter: () => {
          setTimeout(animateWord, 1000); // Start after 1 second
        }
      });

      // Animate ratio cards sliding in
      if (ratioCardsRef.current) {
        const ratioCards = ratioCardsRef.current.querySelectorAll('.ratio-card');

        gsap.from(ratioCards, {
          scrollTrigger: {
            trigger: ratioCardsRef.current,
            start: isMobile ? 'top 100%' : 'top 80%',
            toggleActions: 'play none none none',
          },
          x: -100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
        });
      }

      // Refresh ScrollTrigger after setup
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(setupTimeout);
      if (animationTimeout) clearTimeout(animationTimeout);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.miniTitle}>OUR APPROACH</p>
        <h2 className={styles.title} ref={titleRef}>
          CONTENT THAT KEEPS THEM <span ref={rotatingWordRef} className={styles.rotatingWord}>WATCHING</span>
        </h2>

        <div className={styles.introBlock}>
          <p className={styles.introLine}>WE BUILD TRUST THROUGH ENTERTAINMENT.</p>
          <p className={styles.introSubline}>IN 2026, YOUR AUDIENCE CONSUMES CONTENT CONSTANTLY—THEY'RE NOT READING NEWSPAPER ADS ANYMORE.</p>
        </div>

        <div className={styles.giveContent}>
          <div className={styles.giveGrid} ref={ratioCardsRef}>
            <div className={`${styles.giveCard} ratio-card`}>
              <h3 className={styles.giveCardTitle}>GIVE</h3>
              <p className={styles.giveCardText}>ENTERTAINMENT FIRST</p>
            </div>
            <div className={`${styles.giveCard} ratio-card`}>
              <h3 className={styles.giveCardTitle}>GIVE</h3>
              <p className={styles.giveCardText}>VALUE THROUGH VOLUME</p>
            </div>
            <div className={`${styles.giveCard} ratio-card`}>
              <h3 className={styles.giveCardTitle}>GIVE</h3>
              <p className={styles.giveCardText}>TRUST THROUGH CONSISTENCY</p>
            </div>
          </div>

          <div className={styles.ratioExplanation}>
            <h4 className={styles.ratioTitle}>THE 10:1 RATIO</h4>
            <p className={styles.ratioText}>
              FOR EVERY ASK, DELIVER 10 PIECES OF PURE VALUE.
            </p>
            <p className={styles.ratioTagline}>
              THE HIGHER YOUR RATIO, THE STRONGER YOUR TRAJECTORY.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
