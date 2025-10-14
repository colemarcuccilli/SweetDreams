"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";

const SOLUTIONS_DETAILED = [
  {
    id: "creative-design",
    title: "CREATIVE & DESIGN",
    description: "We bring your vision to life with bold concepts and compelling design. From brand identity to creative direction, we craft visuals that stand out and connect with your audience.",
    services: ["Brand Identity", "Art Direction", "Graphic Design", "Concept Development"],
    videoId: "a23b9f9d3c79e3d70e4153db6bcd1765"
  },
  {
    id: "production",
    title: "PRODUCTION",
    description: "High-quality video and photo production that captures your story. Our team handles everything from pre-production planning to on-set execution with professional equipment and expertise.",
    services: ["Video Production", "Photography", "Drone Footage", "Commercial Shoots"],
    videoId: "74039b5e05fc64845b39432227b686b1"
  },
  {
    id: "post-production",
    title: "POST-PRODUCTION",
    description: "Polished, professional results through expert editing and post-production. We refine every frame, color grade to perfection, and deliver content that's ready to impress.",
    services: ["Video Editing", "Color Grading", "Motion Graphics", "Sound Design"],
    videoId: "559702b328b08583c75a53b76a010a59"
  },
  {
    id: "social-strategy",
    title: "SOCIAL STRATEGY",
    description: "Strategic social media management that grows your presence and engages your audience. We create content calendars, manage your platforms, and analyze performance to drive results.",
    services: ["Content Strategy", "Platform Management", "Community Engagement", "Analytics & Reporting"],
    videoId: "6f51373416fe8c93e4912ff777fd7b68"
  },
  {
    id: "launch-growth",
    title: "LAUNCH & GROWTH",
    description: "From launching new products to scaling your brand, we develop strategies that drive growth. Our data-driven approach ensures your campaigns reach the right audience and deliver ROI.",
    services: ["Campaign Planning", "Digital Marketing", "Performance Analytics", "Growth Strategy"],
    videoId: "f73f75456f0d2bfff7b17e9b5308ca05"
  },
  {
    id: "music-studio",
    title: "MUSIC STUDIO",
    description: "Professional recording studio in Fort Wayne with state-of-the-art equipment. We offer recording, mixing, mastering, and production services to help artists develop their sound.",
    services: ["Recording", "Mixing & Mastering", "Beat Production", "Studio Sessions"],
    videoId: "30a49a596720b2078ba22551ddec221c"
  }
];

export default function SolutionsPage() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const solutionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const triggerPoint = window.innerHeight / 2;

      // Find which solution's midpoint is closest to the trigger point
      let closestIndex = 0;
      let closestDistance = Infinity;

      solutionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          // Use the middle of each section for consistent triggering
          const elementMiddle = rect.top + (rect.height / 2);
          const distance = Math.abs(elementMiddle - triggerPoint);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveVideoIndex(closestIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>SOLUTIONS</h1>
        <p className={styles.subtitle}>
          Comprehensive services to elevate your brand and bring your creative vision to life.
        </p>
      </header>

      <div className={styles.solutionsWrapper}>
        {/* Solutions Content */}
        <div className={styles.solutionsGrid}>
          {SOLUTIONS_DETAILED.map((solution, index) => (
            <div
              key={solution.id}
              id={solution.id}
              ref={(el) => (solutionRefs.current[index] = el)}
              className={styles.solutionCard}
            >
              <div className={styles.solutionText}>
                <h2 className={styles.solutionTitle}>{solution.title}</h2>
                <p className={styles.solutionDescription}>{solution.description}</p>

                <div className={styles.servicesList}>
                  {solution.services.map((service, idx) => (
                    <span key={idx} className={styles.serviceTag}>
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile Video - Only visible on mobile */}
              <div className={styles.mobileVideoWrapper}>
                <iframe
                  src={`https://customer-w6h9o08eg118alny.cloudflarestream.com/${solution.videoId}/iframe?muted=true&autoplay=true&loop=true&controls=false`}
                  style={{
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    borderRadius: '16px'
                  }}
                  allow="autoplay; encrypted-media;"
                ></iframe>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Video Container */}
        <div className={styles.stickyVideoContainer}>
          <div className={styles.stickyVideoWrapper}>
            {SOLUTIONS_DETAILED.map((solution, index) => (
              <div
                key={solution.id}
                className={`${styles.videoFrame} ${
                  index === activeVideoIndex ? styles.videoFrameActive : ''
                }`}
              >
                <iframe
                  src={`https://customer-w6h9o08eg118alny.cloudflarestream.com/${solution.videoId}/iframe?muted=true&autoplay=true&loop=true&controls=false`}
                  style={{
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    borderRadius: '16px'
                  }}
                  allow="autoplay; encrypted-media;"
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>READY TO GET STARTED?</h2>
        <Link href="/contact" className={styles.ctaButton}>
          LET'S TALK
        </Link>
      </div>
    </div>
  );
}
