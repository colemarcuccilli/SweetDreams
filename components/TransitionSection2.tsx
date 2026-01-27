'use client';

import { useEffect, useRef } from 'react';
import styles from './TransitionSection2.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TransitionSection2() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mainTextRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const elements = [
        { ref: titleRef.current, delay: 0 },
        { ref: mainTextRef.current, delay: 0.15 },
        { ref: subTextRef.current, delay: 0.3 },
        { ref: photoRef.current, delay: 0.45 }
      ];

      elements.forEach(({ ref, delay }) => {
        if (!ref) return;

        gsap.set(ref, {
          y: 50,
          opacity: 0
        });

        gsap.to(ref, {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          }
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <p className={styles.miniTitle} ref={titleRef}>WHY US?</p>

          <h2 className={styles.mainHeadline} ref={mainTextRef}>
            MORE TOUCHPOINTS.<br />
            MORE TRUST.<br />
            MORE SALES.
          </h2>

          <p className={styles.subText} ref={subTextRef}>
            Raised on social media. Trained in trends.<br />
            We know what works because we live it every day.
          </p>
        </div>

        <div className={styles.teamPhotoWrapper} ref={photoRef}>
          <img
            src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/team/FX300218.jpg"
            alt="Sweet Dreams Team"
            className={styles.teamPhoto}
          />
        </div>
      </div>
    </section>
  );
}
