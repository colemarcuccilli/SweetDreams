"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import MobileNav from "./MobileNav";

export default function Header() {

  return (
    <>
      {/* Top Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.navContent}>

            {/* Left Navigation Links - Desktop Only */}
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
                  src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg"
                  alt="Sweet Dreams"
                  className={styles.logoImage}
                />
              </Link>
            </div>

            {/* Right Navigation Links - Desktop Only */}
            <div className={styles.navRight}>
              <Link href="/shop" className={styles.navLink}>
                SHOP
              </Link>
              <Link href="/info" className={styles.navLink}>
                INFO
              </Link>
            </div>

            {/* Mobile Navigation - Mobile/Tablet Only */}
            <div className={styles.mobileNavWrapper}>
              <MobileNav />
            </div>

          </div>
        </div>
      </nav>

      {/* Header Section with Video */}
      <section className={styles.videoSection}>
        <div className={styles.videoContainer}>
          {/* Header Box - Rounded Rectangle */}
          <div className={styles.videoBox}>

            {/* Cloudflare Stream Video Background */}
            <iframe
              key="header-video-heaven-in-fort-wayne"
              src="https://customer-w6h9o08eg118alny.cloudflarestream.com/5f3e38a5c811f9a664461845034f67cb/iframe?muted=true&autoplay=true&loop=true&controls=false&preload=auto&v=2"
              className={styles.videoElement}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={true}
              style={{ border: 'none' }}
            />

            {/* Dark overlay for text readability */}
            <div className={styles.videoOverlay}></div>

            {/* Content Overlay */}
            <div className={styles.videoContent}>

              {/* Top Row */}
              <div className={styles.topRow}>
                {/* Client Name - Top Left */}
                <div className={styles.clientName}>
                  SWEET DREAMS MEDIA
                </div>

                {/* View Project Button - Top Right */}
                <Link href="/work/heaven-in-fort-wayne" className={styles.viewButton}>
                  <span className={styles.viewButtonText}>VIEW PROJECT</span>
                </Link>
              </div>

              {/* Center Title - Absolute Positioned */}
              <div className={styles.centerTitle}>
                <div>
                  <div className={styles.titleText}>HEAVEN IN</div>
                  <div className={styles.titleText}>FORT WAYNE</div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className={styles.bottomRow}>
                {/* Subtitle - Bottom Left */}
                <div className={styles.subtitle}>
                  AERIAL CINEMATOGRAPHY
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}