'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../../app/music/music.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PricingListAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const rows = containerRef.current.querySelectorAll('.animate-price-row');

    gsap.set(rows, { x: 100, opacity: 0 });

    gsap.to(rows, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      }
    });
  }, []);

  return (
    <div className={styles.pricingList} ref={containerRef}>
      <div className={`${styles.priceRow} animate-price-row`}>
        <span className={styles.priceLabel}>1 Hour Session</span>
        <span className={styles.priceDots}></span>
        <span className={styles.priceValue}>$60/hr</span>
      </div>
      <div className={`${styles.priceRow} animate-price-row`}>
        <span className={styles.priceLabel}>2+ Hours</span>
        <span className={styles.priceDots}></span>
        <span className={styles.priceValue}>$50/hr</span>
      </div>
      <div className={`${styles.priceRow} ${styles.priceHighlight} animate-price-row`}>
        <span className={styles.priceLabel}>Sweet Spot (4 Hours)</span>
        <span className={styles.priceDots}></span>
        <span className={styles.priceValue}>$180</span>
      </div>
      <div className={`${styles.priceRow} animate-price-row`}>
        <span className={styles.priceLabel}>After 9 PM Fee</span>
        <span className={styles.priceDots}></span>
        <span className={styles.priceValue}>+$10/hr</span>
      </div>
      <div className={`${styles.priceRow} animate-price-row`}>
        <span className={styles.priceLabel}>Same Day Booking</span>
        <span className={styles.priceDots}></span>
        <span className={styles.priceValue}>+$10/hr</span>
      </div>

      <p className={styles.disclaimer}>*All prices are subject to change. Additional fees are applied on top of base hourly rates.</p>
    </div>
  );
}
