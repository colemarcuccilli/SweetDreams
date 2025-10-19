'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import styles from './PortfolioHorizontalScroll.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PortfolioItem {
  href: string;
  image: string;
  title: string;
  client: string;
  logo: string;
  category?: string;
  year?: string;
  comingSoon?: boolean;
}

interface PortfolioHorizontalScrollProps {
  items: PortfolioItem[];
  onMouseEnter: (logo: string) => void;
  onMouseLeave: () => void;
}

export default function PortfolioHorizontalScroll({
  items,
  onMouseEnter,
  onMouseLeave
}: PortfolioHorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup function only
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.portfolioSection}>
      <div ref={scrollContainerRef} className={styles.scrollContainer}>
        {/* Section header */}
        <div className={styles.header}>
          <p className={styles.miniTitle}>ALL WORK</p>
          <h2 className={styles.sectionTitle}>COMPLETE PORTFOLIO</h2>
        </div>

        <div className={styles.grid}>
          {items.map((item, itemIndex) => (
            <Link
              key={itemIndex}
              href={item.href}
              className={`${styles.portfolioCard} ${item.comingSoon ? styles.comingSoonCard : ''}`}
              onMouseEnter={() => onMouseEnter(item.logo)}
              onMouseLeave={onMouseLeave}
            >
              <div className={styles.portfolioImage}>
                {item.comingSoon ? (
                  <div className={styles.comingSoon}>
                    <div className={styles.comingSoonText}>COMING SOON</div>
                  </div>
                ) : (
                  <img src={item.image} alt={item.title} />
                )}
              </div>
              <div className={styles.portfolioInfo}>
                <p className={styles.portfolioClient}>{item.client}</p>
                <h3 className={styles.portfolioTitle}>{item.title}</h3>
                {item.category && (
                  <p className={styles.portfolioCategory}>{item.category}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
