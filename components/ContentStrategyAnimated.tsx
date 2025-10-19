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

    const words = ['WATCHING', 'LISTENING', 'BUYING', 'TRUSTING'];
    let currentIndex = 0;

    const animateWord = () => {
      const wordElement = rotatingWordRef.current;
      if (!wordElement) return;

      const currentWord = words[currentIndex];
      wordElement.textContent = currentWord;

      // Wait 2 seconds, then transition to next word
      setTimeout(() => {
        const nextIndex = (currentIndex + 1) % words.length;
        const nextWord = words[nextIndex];

        const tl = gsap.timeline();

        // Slide current word out to the left
        tl.to(wordElement, {
          x: -window.innerWidth,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
        });

        // Change text and position for slide in from far right
        tl.call(() => {
          wordElement.textContent = nextWord;
          currentIndex = nextIndex;
          gsap.set(wordElement, { x: window.innerWidth, opacity: 1 });
        });

        // Slide new word in from the right edge - quicker motion
        tl.to(wordElement, {
          x: 0,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            setTimeout(animateWord, 2000);
          }
        });
      }, 2000);
    };

    // Start the animation when scrolled into view
    ScrollTrigger.create({
      trigger: titleRef.current,
      start: 'top 80%',
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
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        x: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      });
    }

  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.miniTitle}>OUR APPROACH</p>
        <h2 className={styles.title} ref={titleRef}>
          CONTENT THAT KEEPS THEM <span ref={rotatingWordRef} className={styles.rotatingWord}>WATCHING</span>
        </h2>

        <p className={styles.intro}>
          WE DON'T JUST CREATE ONE VIDEO AND CALL IT A DAY. WE BUILD TRUST THROUGH ENTERTAINMENT. IN 2025, YOUR AUDIENCE CONSUMES CONTENT CONSTANTLY—THEY'RE NOT READING NEWSPAPER ADS ANYMORE.
        </p>

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
            <h4 className={styles.ratioTitle}>THE GIVE-TO-ASK RATIO</h4>
            <p className={styles.ratioText}>
              FOR EVERY PIECE OF CONTENT ASKING FOR SOMETHING (BUY, SUBSCRIBE, BOOK), YOU SHOULD DELIVER AT LEAST 6 PIECES OF PURE VALUE. WE RECOMMEND A 10:1 RATIO. THE HIGHER YOUR RATIO, THE STRONGER YOUR BRAND TRAJECTORY.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
