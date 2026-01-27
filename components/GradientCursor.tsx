'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './GradientCursor.module.css';

export default function GradientCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isOnPage = useRef(false);
  const isOverLightSection = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Set initial position off-screen
    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: -200, y: -200 });

    const updateVisibility = (show: boolean) => {
      gsap.to(cursor, {
        opacity: show ? 1 : 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Move cursor
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
      });

      // Check if mouse is over a light section (uses event delegation)
      const target = e.target as HTMLElement;
      const isInLightSection = target.closest('[data-cursor-hide]') !== null;

      if (isInLightSection !== isOverLightSection.current) {
        isOverLightSection.current = isInLightSection;
        updateVisibility(isOnPage.current && !isInLightSection);
      }
    };

    const handleMouseEnter = () => {
      isOnPage.current = true;
      if (!isOverLightSection.current) {
        updateVisibility(true);
      }
    };

    const handleMouseLeave = () => {
      isOnPage.current = false;
      updateVisibility(false);
    };

    // Add global listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={cursorRef} className={styles.gradientCursor} aria-hidden="true" />
  );
}
