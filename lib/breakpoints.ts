/**
 * Breakpoint constants for responsive design
 *
 * Usage:
 * - Small Phone: 320px - 374px
 * - Medium Phone: 375px - 429px
 * - Large Phone: 430px - 767px
 * - Tablet: 768px - 1023px
 * - Desktop: 1024px - 1439px
 * - Large Desktop: 1440px+
 */

export const BREAKPOINTS = {
  sm: 320,
  md: 375,
  lg: 430,
  tablet: 768,
  desktop: 1024,
  xl: 1440,
} as const;

/**
 * Pre-defined media query strings for common use cases
 */
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.tablet - 1}px)`,
  mobileOnly: `(max-width: ${BREAKPOINTS.tablet - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
  tabletUp: `(min-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
  desktopOnly: `(min-width: ${BREAKPOINTS.desktop}px) and (max-width: ${BREAKPOINTS.xl - 1}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  touch: '(hover: none) and (pointer: coarse)',
  hover: '(hover: hover) and (pointer: fine)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
} as const;

/**
 * Minimum touch target size (in pixels) following WCAG guidelines
 */
export const MIN_TOUCH_TARGET = 48;

/**
 * Safe area inset values for iOS notch support
 */
export const SAFE_AREA = {
  top: 'max(16px, env(safe-area-inset-top))',
  bottom: 'max(16px, env(safe-area-inset-bottom))',
  left: 'max(16px, env(safe-area-inset-left))',
  right: 'max(16px, env(safe-area-inset-right))',
} as const;
