'use client';

import { useEffect, useRef } from 'react';
import Link from "next/link";
import styles from "./Solutions.module.css";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SOLUTIONS = [
  "Creative & Design",
  "Production",
  "Post-Production",
  "Social Strategy",
  "Launch & Growth",
  "Music Studio"
];

export default function SolutionsAnimated() {
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !cardInnerRef.current || !cardContainerRef.current) return;

    const cardInner = cardInnerRef.current;
    const cardContainer = cardContainerRef.current;

    // Hover to flip to logo and scale down
    const handleMouseEnter = () => {
      gsap.to(cardInner, {
        rotationY: 180,
        scale: 0.75,
        duration: 0.6,
        ease: 'power2.inOut'
      });
    };

    // Mouse leave to flip back to team photo at full size
    const handleMouseLeave = () => {
      gsap.to(cardInner, {
        rotationY: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.inOut'
      });
    };

    cardContainer.addEventListener('mouseenter', handleMouseEnter);
    cardContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cardContainer.removeEventListener('mouseenter', handleMouseEnter);
      cardContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>WHAT WE DO</h2>
        <h3 className={styles.mainText}>SOLUTIONS</h3>

        <div className={styles.contentWrapper}>
          <div className={styles.leftContent}>
            <p className={styles.description}>
              From shooting ads to crafting campaigns, designing visuals, managing your social presence, and everything in-between—we handle it all. (And yeah, we especially love the in-between.)
            </p>

            <div className={styles.solutionsList}>
              {SOLUTIONS.map((solution, index) => (
                <span key={index} className={styles.solutionTag}>
                  {solution}
                </span>
              ))}
            </div>

            <Link href="/solutions" className={styles.learnMoreButton}>
              LEARN MORE
            </Link>
          </div>

          <div className={styles.rightContent}>
            <div className={styles.flipCard} ref={cardContainerRef}>
              <div className={styles.flipCardInner} ref={cardInnerRef}>
                {/* Front - Team Photo */}
                <div className={styles.flipCardFront}>
                  <img
                    src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/team/FX300218.jpg"
                    alt="Sweet Dreams Team"
                    className={styles.teamPhoto}
                  />
                </div>
                {/* Back - Logo */}
                <div className={styles.flipCardBack}>
                  <img
                    src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg"
                    alt="Sweet Dreams Logo"
                    className={styles.logoImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
