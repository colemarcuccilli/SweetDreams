"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
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

      {/* Video Header Section with Cloudflare Stream */}
      <section className={styles.videoSection}>
        <div className={styles.videoContainer}>
          {/* Video Box - Rounded Rectangle */}
          <div className={styles.videoBox}>

            {/* Cloudflare Stream Video Background */}
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className={styles.videoElement}
            >
              <source
                src="https://customer-w6h9o08eg118alny.cloudflarestream.com/e80443ae9084ffea8f28180125ed3e15/manifest/video.m3u8"
                type="application/x-mpegURL"
              />
              <source
                src="https://customer-w6h9o08eg118alny.cloudflarestream.com/e80443ae9084ffea8f28180125ed3e15/manifest/video.mpd"
                type="application/dash+xml"
              />
            </video>

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