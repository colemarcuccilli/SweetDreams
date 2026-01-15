"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, signOut } from "@/lib/useAuth";
import styles from "./Header.module.css";
import MobileNav from "./MobileNav";

export default function Nav() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    console.log('🔐 Nav: Logout button clicked');
    const { error } = await signOut();
    if (!error) {
      console.log('🔐 Nav: Redirecting to home after logout');
      router.push('/');
      router.refresh(); // Force refresh to clear any cached auth state
    }
  };

  // Single wide logo for all pages
  const logoSrc = "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreamsUSlogowide.png";

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navContent}>

          {/* Left Navigation Links - Desktop Only */}
          <div className={styles.navLeft}>
            <Link
              href="/music"
              className={`${styles.navLink} ${pathname === '/music' ? styles.navLinkActive : ''}`}
            >
              MUSIC
            </Link>
            <Link
              href="/media"
              className={`${styles.navLink} ${pathname === '/media' ? styles.navLinkActive : ''}`}
            >
              MEDIA
            </Link>
          </div>

          {/* Center Logo */}
          <div className={styles.navCenter}>
            <Link href="/" className={styles.navLogo}>
              <img
                src={logoSrc}
                alt="Sweet Dreams"
                className={`${styles.logoImage} ${styles.baseLogo}`}
              />
            </Link>
          </div>

          {/* Right Navigation Links - Desktop Only */}
          <div className={styles.navRight}>
            <Link
              href="/solutions"
              className={`${styles.navLink} ${pathname === '/solutions' ? styles.navLinkActive : ''}`}
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

          {/* Mobile Navigation - Mobile/Tablet Only */}
          <div className={styles.mobileNavWrapper}>
            <MobileNav />
          </div>

        </div>
      </div>
    </nav>
  );
}
