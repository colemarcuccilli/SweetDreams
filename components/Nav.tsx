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

          {/* Left Navigation Links */}
          <div className={styles.navLeft}>
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

          {/* Right Navigation Links */}
          <div className={styles.navRight}>
            <Link
              href="/solutions"
              className={`${styles.navLink} ${pathname === '/solutions' ? styles.navLinkActive : ''}`}
            >
              SOLUTIONS
            </Link>

            {/* CTA Button */}
            <Link href="/book" className={styles.ctaButton}>
              BOOK A CALL
            </Link>
          </div>

          {/* Hamburger Menu - Always Visible */}
          <div className={styles.hamburgerWrapper}>
            <MobileNav />
          </div>

        </div>
      </div>
    </nav>
  );
}
