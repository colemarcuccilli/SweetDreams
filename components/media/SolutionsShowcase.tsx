'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SolutionsShowcase.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SolutionsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const container = containerRef.current;

    // Animate header
    const header = container.querySelector('.solutions-header');
    if (header) {
      gsap.from(header, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    // Animate each service card
    const cards = container.querySelectorAll('.solution-card');
    cards.forEach((card, index) => {
      const isEven = index % 2 === 0;

      gsap.from(card, {
        opacity: 0,
        x: isEven ? -100 : 100,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      });

      // Animate the number separately
      const number = card.querySelector('.solution-number');
      if (number) {
        gsap.from(number, {
          opacity: 0,
          scale: 0.5,
          duration: 0.6,
          delay: 0.2,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const solutions = [
    {
      number: '01',
      title: 'BRAND FILMS',
      description: 'Cinematic storytelling that captures your essence. We create films that don\'t just showcase your brand—they make people feel it.',
      metrics: '5M+ views across brand campaigns'
    },
    {
      number: '02',
      title: 'COMMERCIALS',
      description: 'High-impact ads designed to convert. Every frame is crafted to grab attention, build trust, and drive action.',
      metrics: 'Avg. 3.2x ROI for clients'
    },
    {
      number: '03',
      title: 'EVENT COVERAGE',
      description: 'Professional documentation that preserves the energy. From corporate events to festivals, we capture moments that matter.',
      metrics: '130+ events covered'
    },
    {
      number: '04',
      title: 'CORPORATE CONTENT',
      description: 'Internal communications that actually engage. Training videos, announcements, and corporate stories that your team will want to watch.',
      metrics: '24hr turnaround available'
    }
  ];

  return (
    <section className={styles.solutionsSection} ref={containerRef}>
      <div className={styles.container}>
        {/* Header */}
        <div className={`${styles.header} solutions-header`}>
          <p className={styles.miniTitle}>SERVICES</p>
          <h2 className={styles.sectionTitle}>OUR SOLUTIONS</h2>
          <p className={styles.headerSubtitle}>
            Full-service video production. From concept to final cut, we handle everything.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className={styles.solutionsGrid}>
          {solutions.map((solution, index) => (
            <div
              key={index}
              className={`${styles.solutionCard} solution-card ${index % 2 === 0 ? styles.cardLeft : styles.cardRight}`}
            >
              <div className={`${styles.solutionNumber} solution-number`}>
                {solution.number}
              </div>
              <div className={styles.solutionContent}>
                <h3 className={styles.solutionTitle}>{solution.title}</h3>
                <p className={styles.solutionDescription}>{solution.description}</p>
                <div className={styles.solutionMetric}>{solution.metrics}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Bar */}
        <div className={styles.trustBar}>
          <div className={styles.trustItem}>
            <div className={styles.trustNumber}>400K+</div>
            <div className={styles.trustLabel}>Total Views</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustNumber}>130+</div>
            <div className={styles.trustLabel}>Projects</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustNumber}>24HR</div>
            <div className={styles.trustLabel}>Response Time</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustNumber}>100%</div>
            <div className={styles.trustLabel}>Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}
