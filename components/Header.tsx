"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import styles from "./Header.module.css";

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

export default function Header() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % STUDIO_PHOTOS.length);
    }, 5000); // Change photo every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Top Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.navContent}>

            {/* Left Navigation Links */}
            <div className={styles.navLeft}>
              <Link href="/solutions" className={styles.navLink}>
                SOLUTIONS
              </Link>
              <Link href="/music" className={styles.navLink}>
                MUSIC
              </Link>
              <Link href="/media" className={styles.navLink}>
                MEDIA
              </Link>
            </div>

            {/* Center Logo */}
            <div className={styles.navCenter}>
              <Link href="/" className={styles.navLogo}>
                <img
                  src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSNAVLOGO.png"
                  alt="Sweet Dreams"
                  className={styles.logoImage}
                />
              </Link>
            </div>

            {/* Right Navigation Links */}
            <div className={styles.navRight}>
              <Link href="/shop" className={styles.navLink}>
                SHOP
              </Link>
              <Link href="/info" className={styles.navLink}>
                INFO
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* Header Section with Studio Photos */}
      <section className={styles.videoSection}>
        <div className={styles.videoContainer}>
          {/* Header Box - Rounded Rectangle */}
          <div className={styles.videoBox}>

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

            {/* Dark overlay for text readability */}
            <div className={styles.videoOverlay}></div>

            {/* Content Overlay */}
            <div className={styles.videoContent}>

              {/* Top Row */}
              <div className={styles.topRow}>
                {/* Client Name - Top Left */}
                <div className={styles.clientName}>
                  SWEET DREAMS MUSIC
                </div>

                {/* View Project Button - Top Right */}
                <button className={styles.viewButton}>
                  <span className={styles.viewButtonText}>VIEW PROJECT</span>
                </button>
              </div>

              {/* Center Title - Absolute Positioned */}
              <div className={styles.centerTitle}>
                <div>
                  <div className={styles.titleText}>YOUR VISION,</div>
                  <div className={styles.titleText}>AMPLIFIED</div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className={styles.bottomRow}>
                {/* Subtitle - Bottom Left */}
                <div className={styles.subtitle}>
                  GET NOTICED THE RIGHT WAY
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}