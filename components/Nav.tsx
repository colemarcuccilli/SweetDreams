"use client";

import Link from "next/link";
import { useAuth, signOut } from "@/lib/useAuth";
import styles from "./Header.module.css";

export default function Nav() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navContent}>

          {/* Left Navigation Links */}
          <div className={styles.navLeft}>
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

          {/* Right Navigation Links */}
          <div className={styles.navRight}>
            <Link href="/solutions" className={styles.navLink}>
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
