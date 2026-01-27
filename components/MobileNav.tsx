'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, signOut } from '@/lib/useAuth';
import styles from './MobileNav.module.css';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  const handleLogout = async () => {
    console.log('🔐 MobileNav: Logout button clicked');
    const { error } = await signOut();
    setIsOpen(false);
    if (!error) {
      console.log('🔐 MobileNav: Redirecting to home after logout');
      router.push('/');
      router.refresh();
    }
  };

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);


  // Detect if hamburger is over dark background
  useEffect(() => {
    const checkBackground = () => {
      // Get element at hamburger position (top-right)
      const hamburgerX = window.innerWidth - 40;
      const hamburgerY = 40;
      let element = document.elementFromPoint(hamburgerX, hamburgerY);

      if (element) {
        // Walk up the DOM tree to find an element with a visible background
        let currentElement: Element | null = element;
        let isDark = false;

        while (currentElement && currentElement !== document.body) {
          const styles = window.getComputedStyle(currentElement);
          const bgColor = styles.backgroundColor;

          // Check if this element has an opaque background (not transparent/rgba with 0 alpha)
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            // Parse RGB values
            const rgbMatch = bgColor.match(/rgb[a]?\((\d+),\s*(\d+),\s*(\d+)/);
            if (rgbMatch) {
              const r = parseInt(rgbMatch[1]);
              const g = parseInt(rgbMatch[2]);
              const b = parseInt(rgbMatch[3]);

              // Calculate luminance - if less than 128 (mid-point), it's dark
              const luminance = (r + g + b) / 3;
              isDark = luminance < 128;
              break;
            }
          }

          // Also check for class names
          if (currentElement.classList.contains('bg-black') ||
              currentElement.className.includes('bg-black')) {
            isDark = true;
            break;
          }

          currentElement = currentElement.parentElement;
        }

        setIsOverDark(isDark);
      }
    };

    // Check on scroll and initially
    checkBackground();
    window.addEventListener('scroll', checkBackground);
    window.addEventListener('resize', checkBackground);

    // Use requestAnimationFrame for smoother updates
    let rafId: number;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkBackground);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkBackground);
      window.removeEventListener('resize', checkBackground);
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const baseNavLinks = [
    { href: '/', label: 'HOME' },
    { href: '/work', label: 'WORK' },
    { href: '/solutions', label: 'SOLUTIONS' },
    { href: '/book', label: 'BOOK A CALL' },
    { href: '/music', label: 'MUSIC' },
    { href: '/partnerships', label: 'PARTNERSHIPS' },
    { href: '/about', label: 'ABOUT' },
  ];

  // Add auth link based on user state
  const navLinks = [
    ...baseNavLinks,
    user ? { href: '/profile', label: 'PROFILE' } : { href: '/login', label: 'LOGIN' },
  ];

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        className={`${styles.hamburger} ${isOpen ? styles.open : ''} ${isOverDark && !isOpen ? styles.light : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Full-Screen Mobile Menu Overlay */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.menuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              ref={(el) => {
                linkRefs.current[link.href] = el;
              }}
              className={`${styles.navLink} ${
                pathname === link.href ? styles.active : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Logout button if user is logged in */}
          {user && (
            <button
              onClick={handleLogout}
              className={styles.navLink}
            >
              LOG OUT
            </button>
          )}
        </nav>

        {/* Mobile menu footer with profile icon if logged in */}
        <div className={styles.mobileMenuFooter}>
          {user && (
            <Link href="/profile" className={styles.mobileProfileIcon} onClick={() => setIsOpen(false)}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="8" r="4"/>
                <path d="M20 21a8 8 0 1 0-16 0"/>
              </svg>
            </Link>
          )}
          <p>Sweet Dreams Music & Media</p>
          <p>Fort Wayne, Indiana</p>
        </div>
      </div>
    </>
  );
}
