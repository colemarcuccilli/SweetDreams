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

  useEffect(() => {
    if (typeof window === 'undefined' || !titleRef.current || !rotatingWordRef.current) return;

    const words = ['WATCHING', 'LISTENING', 'BUYING', 'TRUSTING'];
    let currentIndex = 0;

    const animateWord = () => {
      const wordElement = rotatingWordRef.current;
      if (!wordElement) return;

      // Get the current word text
      const currentWord = words[currentIndex];

      // Split the word into individual characters
      const chars = currentWord.split('');
      wordElement.innerHTML = '';

      const charSpans: HTMLSpanElement[] = [];
      chars.forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.display = 'inline-block';
        wordElement.appendChild(span);
        charSpans.push(span);
      });

      // Create timeline for the animation
      const tl = gsap.timeline({
        delay: 2, // Wait 2 seconds before starting animation
      });

      // Animate characters flying out
      tl.to(charSpans, {
        x: () => gsap.utils.random(-400, 400),
        y: () => gsap.utils.random(-400, 400),
        rotation: () => gsap.utils.random(-720, 720),
        opacity: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'power2.in',
        onComplete: () => {
          // Move to next word
          currentIndex = (currentIndex + 1) % words.length;

          // Animate in the new word
          const newWord = words[currentIndex];
          const newChars = newWord.split('');
          wordElement.innerHTML = '';

          const newCharSpans: HTMLSpanElement[] = [];
          newChars.forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            wordElement.appendChild(span);
            newCharSpans.push(span);
          });

          // Set initial state for new characters (from random positions)
          gsap.set(newCharSpans, {
            x: () => gsap.utils.random(-400, 400),
            y: () => gsap.utils.random(-400, 400),
            rotation: () => gsap.utils.random(-720, 720),
            opacity: 0,
          });

          // Animate new characters in
          gsap.to(newCharSpans, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: 'power2.out',
            onComplete: () => {
              // Wait and then animate again
              setTimeout(animateWord, 2000);
            }
          });
        }
      });
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

  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.miniTitle}>OUR APPROACH</p>
        <h2 className={styles.title} ref={titleRef}>
          CONTENT THAT KEEPS THEM <span ref={rotatingWordRef} style={{ display: 'inline-block' }}>WATCHING</span>
        </h2>

        <p className={styles.intro}>
          WE DON'T JUST CREATE ONE VIDEO AND CALL IT A DAY. WE BUILD TRUST THROUGH ENTERTAINMENT. IN 2025, YOUR AUDIENCE CONSUMES CONTENT CONSTANTLY—THEY'RE NOT READING NEWSPAPER ADS ANYMORE.
        </p>

        <div className={styles.giveGrid}>
          <div className={styles.giveCard}>
            <h3 className={styles.giveNumber}>GIVE</h3>
            <p className={styles.giveLabel}>Entertainment First</p>
          </div>
          <div className={styles.giveCard}>
            <h3 className={styles.giveNumber}>GIVE</h3>
            <p className={styles.giveLabel}>Value Through Volume</p>
          </div>
          <div className={styles.giveCard}>
            <h3 className={styles.giveNumber}>GIVE</h3>
            <p className={styles.giveLabel}>Trust Through Consistency</p>
          </div>
        </div>
      </div>
    </section>
  );
}
