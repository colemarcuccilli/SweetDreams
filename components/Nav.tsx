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

          {/* Left: CTA Button + WORK */}
          <div className={styles.navLeft}>
            <Link href="/book" className={styles.ctaButton}>
              BOOK A CALL
            </Link>
            <Link
              href="/work"
              className={`${styles.navLink} ${pathname === '/work' || pathname.startsWith('/work/') ? styles.navLinkActive : ''}`}
            >
              WORK
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

          {/* Right: SOLUTIONS + Auth + Hamburger */}
          <div className={styles.navRight}>
            <Link
              href="/solutions"
              className={`${styles.navLink} ${pathname === '/solutions' ? styles.navLinkActive : ''}`}
            >
              SOLUTIONS
            </Link>

            {/* Auth Section */}
            <div className={styles.authContainer}>
              {loading ? null : user ? (
                <>
                  <Link href="/profile" className={styles.profileIcon}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M20 21a8 8 0 1 0-16 0"/>
                    </svg>
                  </Link>
                  <div className={styles.authStack}>
                    <button onClick={handleLogout} className={styles.authButton}>
                      LOG OUT
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.authStack}>
                  <Link href="/login" className={styles.authButton}>
                    LOGIN
                  </Link>
                  <div className={styles.authDivider} />
                  <Link href="/signup" className={styles.authButton}>
                    SIGN UP
                  </Link>
                </div>
              )}
            </div>

            {/* Hamburger - inline with auth */}
            <div className={styles.hamburgerInline}>
              <MobileNav />
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
