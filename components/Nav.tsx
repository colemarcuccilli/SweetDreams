"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, signOut } from "@/lib/useAuth";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./Header.module.css";

export default function Nav() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const ovalRef = useRef<SVGEllipseElement>(null);
  const musicRef = useRef<HTMLAnchorElement>(null);
  const mediaRef = useRef<HTMLAnchorElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const solutionsRef = useRef<HTMLAnchorElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [clickOffset, setClickOffset] = useState({ x: 0, y: 0 });

  const handleLogout = async () => {
    await signOut();
  };

  // Capture click position relative to element center
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;
    setClickOffset({ x: offsetX, y: offsetY });
  };

  // Determine which logo to show based on current page
  const isMusicPage = pathname?.startsWith('/music');
  const logoSrc = isMusicPage
    ? "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreamsMusic3StackBlackLogo%20(1).png"
    : "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png";

  // Animate oval to active link
  useEffect(() => {
    if (!ovalRef.current) return;

    let targetRef = null;
    let logoScale = 1.1; // Logo is bigger on homepage
    let showOval = false;

    if (pathname === '/music') {
      targetRef = musicRef;
      logoScale = 0.8;
      showOval = true;
    } else if (pathname === '/media') {
      targetRef = mediaRef;
      logoScale = 0.8;
      showOval = true;
    } else if (pathname === '/solutions') {
      targetRef = solutionsRef;
      logoScale = 0.8;
      showOval = true;
    }

    if (showOval && targetRef?.current) {
      // Slight delay to ensure DOM has updated after active class change
      setTimeout(() => {
        if (!targetRef?.current) return;

        const rect = targetRef.current.getBoundingClientRect();
        const navRect = targetRef.current.closest('nav')?.getBoundingClientRect();

        if (navRect) {
          const cx = rect.left + rect.width / 2 - navRect.left + clickOffset.x;
          const cy = rect.top + rect.height / 2 - navRect.top + clickOffset.y;
          // Use actual element dimensions for tighter fit
          const rx = rect.width / 2 + 10;
          const ry = rect.height / 2 + 2;

          gsap.to(ovalRef.current, {
            attr: { cx, cy, rx, ry },
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out'
          });
        }
      }, 50);
    } else {
      // Hide oval on homepage
      gsap.to(ovalRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out'
      });
    }

    // Animate logo size
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        scale: logoScale,
        duration: 0.6,
        ease: 'power3.out'
      });
    }
  }, [pathname, clickOffset]);

  // Oval hover effect
  useEffect(() => {
    if (!ovalRef.current) return;

    if (isHovering) {
      gsap.to(ovalRef.current, {
        attr: { strokeWidth: 6 },
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(ovalRef.current, {
        attr: { strokeWidth: 3 },
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isHovering]);

  return (
    <nav className={styles.nav}>
      {/* Animated SVG Oval */}
      <svg
        className={styles.navOvalSvg}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      >
        <ellipse
          ref={ovalRef}
          cx="0"
          cy="0"
          rx="0"
          ry="0"
          fill="none"
          stroke="black"
          strokeWidth="3"
          opacity="0"
          style={{ pointerEvents: 'auto', cursor: 'pointer', transition: 'stroke-width 0.3s ease' }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        />
      </svg>

      <div className={styles.navContainer}>
        <div className={styles.navContent}>

          {/* Left Navigation Links */}
          <div className={styles.navLeft}>
            <Link
              href="/music"
              className={`${styles.navLink} ${pathname === '/music' ? styles.navLinkActive : ''}`}
              ref={musicRef}
              onClick={handleNavClick}
              onMouseEnter={() => pathname === '/music' && setIsHovering(true)}
              onMouseLeave={() => pathname === '/music' && setIsHovering(false)}
            >
              MUSIC
            </Link>
            <Link
              href="/media"
              className={`${styles.navLink} ${pathname === '/media' ? styles.navLinkActive : ''}`}
              ref={mediaRef}
              onClick={handleNavClick}
              onMouseEnter={() => pathname === '/media' && setIsHovering(true)}
              onMouseLeave={() => pathname === '/media' && setIsHovering(false)}
            >
              MEDIA
            </Link>
          </div>

          {/* Center Logo */}
          <div className={styles.navCenter}>
            <Link href="/" className={styles.navLogo} ref={logoRef}>
              <img
                src={logoSrc}
                alt="Sweet Dreams"
                className={`${styles.logoImage} ${isMusicPage ? styles.musicLogo : ''}`}
              />
            </Link>
          </div>

          {/* Right Navigation Links */}
          <div className={styles.navRight}>
            <Link
              href="/solutions"
              className={`${styles.navLink} ${pathname === '/solutions' ? styles.navLinkActive : ''}`}
              ref={solutionsRef}
              onClick={handleNavClick}
              onMouseEnter={() => pathname === '/solutions' && setIsHovering(true)}
              onMouseLeave={() => pathname === '/solutions' && setIsHovering(false)}
            >
              SOLUTIONS
            </Link>

            {/* Stacked Auth Buttons */}
            {!loading && (
              <div className={styles.authContainer}>
                <div className={styles.authStack}>
                  {user ? (
                    // Logged in: Show PROFILE / LOG OUT
                    <>
                      <Link href="/profile" className={styles.authButton}>
                        PROFILE
                      </Link>
                      <div className={styles.authDivider}></div>
                      <button onClick={handleLogout} className={styles.authButton}>
                        LOG OUT
                      </button>
                    </>
                  ) : (
                    // Not logged in: Show LOGIN / SIGNUP
                    <>
                      <Link href="/login" className={styles.authButton}>
                        LOGIN
                      </Link>
                      <div className={styles.authDivider}></div>
                      <Link href="/signup" className={styles.authButton}>
                        SIGNUP
                      </Link>
                    </>
                  )}
                </div>
                <Link href="/profile" className={styles.profileIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M20 21a8 8 0 1 0-16 0"/>
                  </svg>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
