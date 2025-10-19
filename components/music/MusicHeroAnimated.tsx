'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/all';
import styles from './MusicHeroAnimated.module.css';

// Studio photos
const STUDIO_PHOTOS = [
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0502.jpg',
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0506.jpg',
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0519.jpg',
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0538.jpg',
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0545.jpg',
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0564.jpg',
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0587.jpg',
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0601.jpg',
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0607.jpg',
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0617.jpg',
];

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
}

export default function MusicHeroAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Photo carousel rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % STUDIO_PHOTOS.length);
    }, 5000); // Change photo every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    CustomEase.create("customEase", "0.86, 0, 0.07, 1");

    const container = containerRef.current;
    const textRows = container.querySelectorAll<HTMLDivElement>('.text-row');
    const slicedContainer = container.querySelector(`.${styles.slicedContainer}`);
    const rightContent = container.querySelector(`.${styles.rightContent}`);

    // Check if elements exist before animating
    if (!textRows.length || !rightContent) return;

    // Kill any existing animations to restart fresh
    gsap.killTweensOf([...textRows, '.text-row', `.${styles.textContent}`, `.${styles.rightContent}`]);

    // Set initial visibility for all elements to ensure they show
    const textContentElements = Array.from(textRows).map(row => row.querySelector(`.${styles.textContent}`));
    gsap.set([...textRows, ...textContentElements, rightContent], { clearProps: 'all' });

    // Main animation timeline
    const mainTimeline = gsap.timeline({
      delay: 0.1,
    });

    // Step 1: Slide each line in from bottom (center aligned)
    textRows.forEach((row, index) => {
      mainTimeline.from(row, {
        y: '100vh',
        opacity: 0,
        duration: 1,
        ease: "customEase",
      }, index * 0.15);
    });

    // Step 2: Wait a moment, then grow from center and translate to left simultaneously
    mainTimeline.to({}, { duration: 0.3 }, '+=0.3'); // Small pause

    // Step 3: Grow and translate each text element
    textRows.forEach((row, index) => {
      const textContent = row.querySelector(`.${styles.textContent}`);
      mainTimeline.to(textContent, {
        scaleX: 1.3,
        x: '-15vw', // Move to the left (less than before)
        transformOrigin: 'center center',
        duration: 0.8,
        ease: "customEase",
      }, '<' + (index * 0.05));
    });

    // Step 4: Fade in right side content
    mainTimeline.from(rightContent, {
      opacity: 0,
      x: 100,
      duration: 0.8,
      ease: "customEase",
      onComplete: () => {
        // Ensure final state persists
        gsap.set(rightContent, {
          opacity: 1,
          x: 0,
        });
      }
    }, '-=0.3');

    // Step 5: Slide words back in, bigger and with low opacity
    mainTimeline.to({}, { duration: 0.3 }, '+=0.5'); // Brief pause

    textRows.forEach((row, index) => {
      const textContent = row.querySelector(`.${styles.textContent}`);
      mainTimeline.to(textContent, {
        scaleX: 2.5,
        scaleY: 2.5,
        x: '10vw', // Shifted one letter width to the right
        opacity: 0.1,
        transformOrigin: 'center center',
        duration: 1.2,
        ease: "customEase",
        onComplete: () => {
          // Ensure final state persists
          gsap.set(textContent, {
            scaleX: 2.5,
            scaleY: 2.5,
            x: '10vw',
            opacity: 0.1,
            transformOrigin: 'center center',
          });
        }
      }, '<' + (index * 0.08));
    });

    // Kinetic type animation
    const kineticType = container.querySelector<HTMLDivElement>('#kinetic-type');
    if (kineticType) {
      const typeLines = kineticType.querySelectorAll<HTMLDivElement>('.type-line');

      typeLines.forEach((line, index) => {
        const isOdd = index % 2 === 0;
        gsap.to(line, {
          x: isOdd ? '-50%' : '50%',
          duration: 20,
          ease: 'none',
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % 100)
          }
        });
      });
    }

    // Don't cleanup - let the animation state persist
    return () => {
      // mainTimeline.kill(); // Commented out so animation state persists
    };
  }, []);

  return (
    <div className={styles.heroContainer} ref={containerRef}>
      <div className={styles.heroBox}>
        {/* Studio Photos Background Carousel */}
        <div className={styles.photoCarousel}>
          {STUDIO_PHOTOS.map((photo, index) => (
            <img
              key={photo}
              src={photo}
              alt={`Sweet Dreams Studio ${index + 1}`}
              className={`${styles.carouselPhoto} ${
                index === currentPhotoIndex ? styles.activePhoto : ''
              }`}
            />
          ))}
        </div>

        <div className={styles.gradientBackground}></div>

        <div className={styles.mainContent}>
        <div className={styles.slicedContainer}>
          <div className="text-row">
            <div className={styles.textContent}>RECORD</div>
          </div>

          <div className="text-row">
            <div className={styles.textContent}>CREATE</div>
          </div>

          <div className="text-row">
            <div className={styles.textContent}>RELEASE</div>
          </div>
        </div>

        <div className={styles.rightContent}>
          <div className={styles.infoCard}>
            <div className={styles.label}>STUDIO LOCATION</div>
            <div className={styles.value}>Fort Wayne, IN</div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.label}>STUDIO HOURS</div>
            <div className={styles.value}>Mon-Sat<br/>9AM - 2AM</div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.label}>STARTING AT</div>
            <div className={styles.value}>$40/HR</div>
          </div>

          <button className={styles.ctaButton}>
            BOOK A SESSION
          </button>
        </div>
      </div>

        <div className={styles.type} id="kinetic-type" aria-hidden="true">
          <div className="type-line odd">record record record</div>
          <div className="type-line even">create create create</div>
          <div className="type-line odd">release release release</div>
          <div className="type-line even">record record record</div>
          <div className="type-line odd">create create create</div>
          <div className="type-line even">record record record</div>
          <div className="type-line odd">record record record</div>
          <div className="type-line even">create create create</div>
          <div className="type-line odd">release release release</div>
          <div className="type-line even">record record record</div>
          <div className="type-line odd">create create create</div>
          <div className="type-line even">record record record</div>
        </div>
      </div>
    </div>
  );
}
