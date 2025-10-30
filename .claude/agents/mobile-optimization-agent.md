# Mobile Optimization Agent

## Mission
Transform the desktop-first Sweet Dreams website into a fully responsive, mobile-optimized experience across all device sizes, replacing hover interactions with touch-friendly alternatives and adding clear UI guidance for mobile users.

## Context
- **Current State**: Designed primarily for large desktop screens
- **Challenge**: Hover states don't work on mobile - need touch-friendly alternatives
- **Goal**: Seamless experience on phones (small to large) and tablets

## Target Breakpoints
1. **Large Desktop**: 1440px+ (current design)
2. **Small Desktop/Laptop**: 1024px - 1439px
3. **Tablet**: 768px - 1023px
4. **Large Phone**: 430px - 767px
5. **Medium Phone**: 375px - 429px
6. **Small Phone**: 320px - 374px

## Tech Stack
- Next.js 14+ with CSS Modules
- Tailwind CSS
- GSAP animations
- React hooks for device detection

## Primary Tasks

### 1. Responsive Layout System

**Create Mobile Detection Hook:**
```typescript
// hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Usage:
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1023px)');
```

**Create Breakpoint Constants:**
```typescript
// lib/breakpoints.ts
export const BREAKPOINTS = {
  sm: 320,
  md: 375,
  lg: 430,
  tablet: 768,
  desktop: 1024,
  xl: 1440,
} as const;

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.tablet - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
} as const;
```

### 2. Navigation Optimization

**Mobile-First Navigation:**
```typescript
// components/MobileNav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './MobileNav.module.css';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        className={styles.hamburger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className={isOpen ? styles.open : ''}></span>
        <span className={isOpen ? styles.open : ''}></span>
        <span className={isOpen ? styles.open : ''}></span>
      </button>

      {/* Full-Screen Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <Link href="/music" onClick={() => setIsOpen(false)}>
              MUSIC
            </Link>
            <Link href="/media" onClick={() => setIsOpen(false)}>
              MEDIA
            </Link>
            <Link href="/solutions" onClick={() => setIsOpen(false)}>
              SOLUTIONS
            </Link>
            <Link href="/login" onClick={() => setIsOpen(false)}>
              LOGIN
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
```

**Responsive Logo Sizing:**
```css
/* Mobile: Smaller logo */
@media (max-width: 767px) {
  .logoImage {
    height: 80px; /* From 155px */
  }

  .navLogo {
    padding: 8px 16px; /* From 16px 36px */
  }
}
```

### 3. Replace Hover States with Touch Interactions

**Problem:** Current site uses hover effects extensively - these don't work on mobile.

**Solution:** Add visible tap indicators and instant feedback.

**Service Cards - Before (Desktop Hover):**
```css
.serviceCard:hover {
  border: 3px dotted white;
  transform: translateY(-8px);
}
```

**Service Cards - After (Mobile-Friendly):**
```css
/* Desktop keeps hover */
@media (min-width: 1024px) {
  .serviceCard:hover {
    border: 3px dotted white;
    transform: translateY(-8px);
  }
}

/* Mobile: Always show clickable indicator */
@media (max-width: 1023px) {
  .serviceCard {
    border: 2px solid rgba(255, 255, 255, 0.3);
    position: relative;
  }

  /* Add "Tap to view" text */
  .serviceCard::after {
    content: 'TAP TO VIEW';
    position: absolute;
    bottom: 16px;
    right: 16px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0.1em;
    padding: 4px 8px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  /* Active state on tap */
  .serviceCard:active {
    transform: scale(0.98);
    background: rgba(255, 255, 255, 0.1);
  }
}
```

**Portfolio Cards - Mobile Alternative:**
```typescript
// Replace logo cursor with touch-friendly overlay
{isMobile ? (
  // Mobile: Show overlay on tap
  <div className={styles.mobileOverlay}>
    <div className={styles.projectInfo}>
      <img src={logo} alt="Client" className={styles.logo} />
      <h3>{title}</h3>
      <p>TAP TO VIEW PROJECT</p>
    </div>
  </div>
) : (
  // Desktop: Cursor follows mouse
  <LogoCursor logo={logo} />
)}
```

### 4. Touch-Optimized Buttons

**Minimum Touch Target Size: 48x48px**

```css
/* Ensure all interactive elements meet minimum size */
.button,
.navLink,
.iconButton,
.closeButton {
  min-width: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Increase tap targets on mobile */
@media (max-width: 767px) {
  .ctaButton {
    padding: 18px 32px; /* Larger padding */
    font-size: 16px; /* More readable */
  }

  .navLink {
    padding: 16px 24px; /* Easier to tap */
  }
}
```

### 5. Typography Scaling

**Fluid Typography System:**
```css
/* Use clamp() for responsive text */
.heroTitle {
  font-size: clamp(32px, 8vw, 120px);
  line-height: 1.1;
}

.sectionTitle {
  font-size: clamp(28px, 6vw, 80px);
}

.bodyText {
  font-size: clamp(14px, 4vw, 18px);
  line-height: 1.6;
}

/* Ensure readability on small screens */
@media (max-width: 430px) {
  body {
    font-size: 16px; /* Prevent browser zoom */
  }

  .miniTitle {
    font-size: 10px;
    letter-spacing: 0.2em;
  }
}
```

### 6. Mobile-Specific Components

**Hero Section - Mobile Version:**
```css
/* Desktop: Large dramatic hero */
@media (min-width: 1024px) {
  .heroBox {
    aspect-ratio: 16 / 9;
    max-height: 85vh;
  }

  .titleText {
    font-size: 200px;
  }
}

/* Tablet: Medium size */
@media (min-width: 768px) and (max-width: 1023px) {
  .heroBox {
    aspect-ratio: 16 / 9;
    max-height: 60vh;
  }

  .titleText {
    font-size: 120px;
  }
}

/* Mobile: Compact, vertical-friendly */
@media (max-width: 767px) {
  .heroBox {
    aspect-ratio: 4 / 5; /* Taller for mobile */
    max-height: 70vh;
    border-radius: 24px; /* Smaller radius */
  }

  .titleText {
    font-size: 48px;
    text-align: center;
  }

  .videoContent {
    padding: 24px; /* Less padding */
  }
}
```

**Service Grid - Responsive:**
```css
/* Desktop: 4 columns */
@media (min-width: 1024px) {
  .servicesGrid {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
}

/* Tablet: 2 columns */
@media (min-width: 768px) and (max-width: 1023px) {
  .servicesGrid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Mobile: 1 column, stacked */
@media (max-width: 767px) {
  .servicesGrid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .serviceCard {
    padding: 32px 24px; /* Less padding */
  }
}
```

### 7. Form Optimization for Mobile

**Mobile-Friendly Forms:**
```typescript
// components/MobileOptimizedForm.tsx
export default function ContactForm() {
  return (
    <form className={styles.form}>
      {/* Use appropriate input types for mobile keyboards */}
      <input
        type="text"
        inputMode="text"
        autoComplete="name"
        placeholder="Your Name"
        className={styles.input}
      />

      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="Email Address"
        className={styles.input}
      />

      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="Phone Number"
        className={styles.input}
      />

      <textarea
        rows={5}
        placeholder="Tell us about your project"
        className={styles.textarea}
      />

      <button type="submit" className={styles.submitButton}>
        SEND MESSAGE
      </button>
    </form>
  );
}
```

```css
/* Mobile form styling */
@media (max-width: 767px) {
  .input,
  .textarea {
    font-size: 16px; /* Prevents iOS zoom */
    padding: 16px;
    border-radius: 8px;
  }

  .submitButton {
    width: 100%; /* Full width on mobile */
    padding: 18px;
    font-size: 16px;
  }
}
```

### 8. Modal/Popup Optimization

**Service Modal - Mobile Version:**
```css
/* Desktop: Centered modal */
@media (min-width: 1024px) {
  .serviceCardExpanded {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 1400px;
    width: 92%;
    padding: 80px;
  }
}

/* Mobile: Full-screen modal */
@media (max-width: 767px) {
  .serviceCardExpanded {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    max-height: 100vh;
    padding: 60px 24px 24px;
    border-radius: 0; /* No radius on mobile */
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  }

  .serviceCardClose {
    position: fixed; /* Stays visible while scrolling */
    top: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
    z-index: 1001;
  }
}
```

### 9. Photo Gallery Mobile Optimization

**Touch-Friendly Gallery:**
```typescript
// Add swipe gestures
const handleTouchStart = (e: React.TouchEvent) => {
  setTouchStart(e.touches[0].clientX);
};

const handleTouchEnd = (e: React.TouchEvent) => {
  const touchEnd = e.changedTouches[0].clientX;
  const diff = touchStart - touchEnd;

  if (Math.abs(diff) > 50) { // Swipe threshold
    if (diff > 0) {
      goToNext(); // Swipe left
    } else {
      goToPrevious(); // Swipe right
    }
  }
};

<div
  className={styles.lightbox}
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>
  {/* Gallery content */}
</div>
```

```css
/* Mobile gallery adjustments */
@media (max-width: 767px) {
  .navButton {
    width: 48px;
    height: 48px;
    font-size: 28px;
  }

  .prevButton {
    left: 8px;
  }

  .nextButton {
    right: 8px;
  }

  .mainImage {
    max-height: 60vh; /* Leave room for controls */
  }

  .thumbnailStrip {
    display: none; /* Hide on very small screens */
  }

  /* Show swipe hint */
  .lightbox::after {
    content: 'SWIPE TO NAVIGATE';
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    animation: fadeInOut 3s ease-in-out;
  }
}
```

### 10. Booking Calendar Mobile UX

**Mobile-Optimized Booking:**
```css
/* Desktop: Side-by-side calendar and details */
@media (min-width: 1024px) {
  .bookingContainer {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 48px;
  }
}

/* Mobile: Stacked, step-by-step */
@media (max-width: 767px) {
  .bookingContainer {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* Make calendar dates larger for touch */
  .calendarDate {
    min-width: 40px;
    min-height: 40px;
    font-size: 14px;
  }

  /* Full-width selection summary */
  .bookingDetails {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 16px;
    border-top: 2px solid #000;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  }
}
```

### 11. Video Player Mobile Optimization

**Touch-Friendly Video Controls:**
```typescript
// Use native controls on mobile
const isMobile = useMediaQuery('(max-width: 768px)');

<iframe
  src={videoUrl}
  controls={isMobile ? true : false}
  className={styles.video}
/>
```

```css
/* Mobile video sizing */
@media (max-width: 767px) {
  .videoWrapper {
    aspect-ratio: 16 / 9;
    width: 100%;
    height: auto;
  }

  /* Larger play button for touch */
  .playButton {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }
}
```

### 12. Performance Optimization for Mobile

**Lazy Loading Strategy:**
```typescript
// Only load images in viewport
<img
  src={imageSrc}
  loading="lazy"
  decoding="async"
  alt={alt}
/>
```

**Reduce Animation Complexity:**
```typescript
// Disable heavy animations on mobile
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
const isMobile = useMediaQuery('(max-width: 768px)');

const shouldAnimate = !prefersReducedMotion && !isMobile;

useEffect(() => {
  if (!shouldAnimate) return;

  // GSAP animations only on desktop
  gsap.to(element, { ... });
}, [shouldAnimate]);
```

### 13. Touch Gesture Indicators

**Add Visual Hints:**
```typescript
// Show gesture hints on first visit
const [showHint, setShowHint] = useState(true);

useEffect(() => {
  const hasSeenHint = localStorage.getItem('galleryHintSeen');
  if (hasSeenHint) setShowHint(false);

  const timer = setTimeout(() => {
    setShowHint(false);
    localStorage.setItem('galleryHintSeen', 'true');
  }, 3000);

  return () => clearTimeout(timer);
}, []);

{showHint && isMobile && (
  <div className={styles.gestureHint}>
    <div className={styles.swipeIcon}>←  →</div>
    <p>Swipe to navigate</p>
  </div>
)}
```

### 14. Safe Area Insets (iOS)

**Handle iPhone Notch:**
```css
/* Respect safe areas on iOS */
.header {
  padding-top: max(16px, env(safe-area-inset-top));
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
}

/* Add to viewport meta tag */
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

### 15. Mobile Testing Checklist

**Test On:**
- [ ] iPhone SE (375x667)
- [ ] iPhone 12/13/14 (390x844)
- [ ] iPhone 14 Pro Max (430x932)
- [ ] Samsung Galaxy S21 (360x800)
- [ ] iPad Mini (768x1024)
- [ ] iPad Pro (1024x1366)

**Testing Tools:**
- Chrome DevTools Device Mode
- BrowserStack (real devices)
- Safari iOS Simulator
- Lighthouse Mobile audit

## Implementation Priority

### Phase 1: Critical (Week 1)
1. Navigation - Mobile menu
2. Typography - Responsive scaling
3. Layout - Grid breakpoints
4. Touch targets - Minimum 48px
5. Forms - Mobile optimization

### Phase 2: Important (Week 2)
6. Hero sections - Mobile versions
7. Service cards - Touch indicators
8. Portfolio grid - Mobile layout
9. Modals - Full-screen on mobile
10. Buttons - Active states

### Phase 3: Enhancement (Week 3)
11. Gallery - Swipe gestures
12. Booking - Mobile flow
13. Video - Touch controls
14. Performance - Lazy loading
15. Animations - Conditional

### Phase 4: Polish (Week 4)
16. Gesture hints
17. Safe area insets
18. Reduced motion support
19. Testing across devices
20. Final optimizations

## Success Criteria
- [ ] All pages usable on 320px width
- [ ] No horizontal scrolling
- [ ] All text readable without zoom
- [ ] Touch targets minimum 48x48px
- [ ] Forms work with mobile keyboards
- [ ] No hover-dependent functionality
- [ ] Lighthouse mobile score >90
- [ ] Test on real devices successful
- [ ] Loading performance <3s on 3G

## Mobile-Specific Features to Add

1. **Pull-to-refresh** (optional)
2. **Bottom navigation** (for key actions)
3. **Floating action button** (for booking)
4. **Toast notifications** (better than alerts)
5. **Skeleton screens** (loading states)
6. **Progressive image loading**
7. **Offline support** (service worker)

## Resources
- MDN Responsive Design Guide
- Google Mobile-First Indexing Best Practices
- iOS Human Interface Guidelines
- Material Design Touch Targets
- Web.dev Mobile Performance Guide
