'use client';

import { useEffect, useRef } from 'react';
import styles from './WhoAreWe.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Split text into individual characters, keeping words together
function splitTextIntoCharacters(element: HTMLElement): HTMLElement[] {
  const text = element.textContent || '';
  const words = text.split(' ');
  element.innerHTML = '';

  const chars: HTMLElement[] = [];

  words.forEach((word, wordIndex) => {
    // Create a wrapper for each word to prevent breaking
    const wordWrapper = document.createElement('span');
    wordWrapper.style.display = 'inline-block';
    wordWrapper.style.whiteSpace = 'nowrap';
    wordWrapper.style.marginRight = '0.25em'; // Add small margin for word spacing

    // Split word into characters
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      wordWrapper.appendChild(span);
      chars.push(span);
    }

    element.appendChild(wordWrapper);
    chars.push(wordWrapper); // Add word wrapper to chars for animation
  });

  return chars;
}

export default function WhoAreWeAnimated() {
  const sectionRef = useRef<HTMLElement>(null);
  const mainTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      if (!mainTextRef.current) return;

      // Split text into characters
      const chars = splitTextIntoCharacters(mainTextRef.current);

      // Set initial state - coming from the right
      gsap.set(chars, {
        x: 100,
        opacity: 0
      });

      // Create ScrollTrigger animation
      gsap.to(chars, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.015,
        ease: 'power3.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: mainTextRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          WHO ARE WE
        </h2>

        <p className={styles.mainText} ref={mainTextRef}>
          WE SPECIALIZE IN BRAND DEVELOPMENT, CREATIVE STORYTELLING, AND MULTIMEDIA SOLUTIONS THAT HELP BUSINESSES STAND OUT AND CONNECT WITH THEIR AUDIENCE.
        </p>
      </div>
    </section>
  );
}
