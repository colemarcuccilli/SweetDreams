'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useAuth, signOut } from '@/lib/useAuth';
import styles from './MobileNav.module.css';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const ovalRef = useRef<SVGEllipseElement>(null);
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

  // Function to position oval around active link
  const positionOval = () => {
    if (!ovalRef.current || !isOpen) return;

    const activeLink = linkRefs.current[pathname];
    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      const menuRect = activeLink.closest(`.${styles.mobileMenu}`)?.getBoundingClientRect();

      if (menuRect) {
        const cx = rect.left + rect.width / 2 - menuRect.left;
        const cy = rect.top + rect.height / 2 - menuRect.top;
        const rx = rect.width / 2 + 8;
        const ry = rect.height / 2 + 4;

        gsap.to(ovalRef.current, {
          attr: { cx, cy, rx, ry },
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out'
        });
      }
    }
  };

  // Animate oval to active link when menu opens or pathname changes
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(positionOval, 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, pathname]);

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
        attr: { strokeWidth: 4 },
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isHovering]);

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
        {/* Animated SVG Oval */}
        <svg
          className={styles.ovalSvg}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
        >
          <ellipse
            ref={ovalRef}
            cx="0"
            cy="0"
            rx="0"
            ry="0"
            fill="none"
            stroke="white"
            strokeWidth="4"
            opacity="0"
            style={{ pointerEvents: 'auto', cursor: 'pointer', transition: 'stroke-width 0.3s ease' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          />
        </svg>

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
              onMouseEnter={() => pathname === link.href && setIsHovering(true)}
              onMouseLeave={() => pathname === link.href && setIsHovering(false)}
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
