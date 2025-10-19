'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../../app/music/music.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LocationInfoAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const lines = containerRef.current.querySelectorAll('.animate-line');

    gsap.set(lines, { y: 30, opacity: 0 });

    gsap.to(lines, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      }
    });
  }, []);

  return (
    <section className={styles.locationInfo} ref={containerRef}>
      <div className={styles.container}>
        <div className={styles.locationInfoGrid}>
          <div className={styles.locationColumn}>
            <p className={styles.miniTitle}>LOCATION</p>
            <h2 className={styles.sectionTitle}>FIND US IN FORT WAYNE</h2>
            <p className={`${styles.locationText} animate-line`}>
              Sweet Dreams Music Studio is located at 3943 Parnell Ave, Fort Wayne, IN 46805. We're easily accessible and offer on-site parking.
            </p>
          </div>

          <div className={styles.infoColumn}>
            <h2 className={styles.sectionTitle}>IMPORTANT INFORMATION</h2>
            <p className={`${styles.infoText} animate-line`}>
              All prices listed are base rates and may vary depending on the specific needs and outcomes of each session. Additional charges may apply for extended or customized services, group sessions, or if multiple individuals are recording their own songs within the same session.
            </p>
            <p className={`${styles.infoText} animate-line`}>
              We require that all individuals attending the session be pre-approved, especially if extra people are requested. Please provide information on relationships, as additional people may be subject to approval and may incur extra charges.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
