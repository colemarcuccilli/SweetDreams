"use client";

import Link from "next/link";
import styles from "./Header.module.css";

export default function Nav() {
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
                src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSNAVLOGO.png"
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
            <Link href="/info" className={styles.navLink}>
              INFO
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}
