'use client';

import { useEffect, useRef } from 'react';
import styles from './TransitionSection2.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Custom line splitting function
function splitTextIntoLines(element: HTMLElement): HTMLElement[] {
  const text = element.textContent || '';
  const words = text.split(' ');

  // Clear the element
  element.innerHTML = '';

  // Create a temporary container to measure line breaks
  const tempSpans: HTMLSpanElement[] = [];

  words.forEach((word) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.display = 'inline-block';
    span.style.marginRight = '0.25em'; // Add space using margin
    element.appendChild(span);
    tempSpans.push(span);
  });

  // Now detect line breaks based on Y position
  const lines: HTMLElement[] = [];
  let currentLine: HTMLElement | null = null;
  let currentY = -1;

  tempSpans.forEach((span) => {
    const rect = span.getBoundingClientRect();

    if (rect.top !== currentY) {
      // New line detected
      currentY = rect.top;
      currentLine = document.createElement('div');
      currentLine.className = styles.line;
      lines.push(currentLine);
    }

    if (currentLine) {
      const wordSpan = document.createElement('span');
      wordSpan.textContent = span.textContent;
      wordSpan.style.display = 'inline-block';
      wordSpan.style.marginRight = '0.25em';
      currentLine.appendChild(wordSpan);
    }
  });

  // Clear and rebuild with line divs
  element.innerHTML = '';
  lines.forEach(line => {
    const wrapper = document.createElement('div');
    wrapper.className = styles.lineWrapper;
    wrapper.appendChild(line);
    element.appendChild(wrapper);
  });

  return lines;
}

export default function TransitionSection2() {
  const sectionRef = useRef<HTMLElement>(null);
  const largeTextRef = useRef<HTMLParagraphElement>(null);
  const mediumTextRef = useRef<HTMLParagraphElement>(null);
  const smallTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const elements = [largeTextRef.current, mediumTextRef.current, smallTextRef.current];

      elements.forEach((element) => {
        if (!element) return;

        // Split text into lines
        const lines = splitTextIntoLines(element);

        // Set initial state
        gsap.set(lines, {
          yPercent: 100,
          opacity: 0
        });

        // Create ScrollTrigger animation
        gsap.to(lines, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} id="transition-section-2" ref={sectionRef}>
      <div className={styles.container}>
        <p className={styles.largeText} ref={largeTextRef}>
          OUR RETAINER PACKAGES DELIVER HIGH-VOLUME, ENGAGING CONTENT THAT KEEPS YOUR BRAND IN FRONT OF YOUR CUSTOMERS. MORE CONTENT MEANS MORE TOUCHPOINTS. MORE TOUCHPOINTS MEANS MORE TRUST. MORE TRUST MEANS MORE SALES.
        </p>
        <p className={styles.mediumText} ref={mediumTextRef}>
          WE GREW UP IN THIS. RAISED ON SOCIAL MEDIA, TRAINED IN TRENDS. WE KNOW WHAT WORKS IN 2025 BECAUSE WE LIVE IT EVERY DAY.
        </p>
        <p className={styles.smallText} ref={smallTextRef}>
          LET'S BUILD YOUR CONTENT STRATEGY
        </p>
      </div>
    </section>
  );
}
