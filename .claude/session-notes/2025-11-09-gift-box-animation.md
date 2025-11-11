# Session Notes - Gift Box Animation Implementation
**Date:** November 9, 2025
**Branch:** main

## Overview
Implemented an interactive gift box animation for the 3-hour holiday special booking button using GSAP (GreenSock Animation Platform).

## Goal
Create a gift box animation that:
- Makes the 3-hour booking button look like a present
- Unwraps when clicked to reveal the deal ($100 for 3 hours)
- Re-wraps when clicking other duration buttons
- Uses GSAP for smooth, professional animations

## Key Files Modified

### 1. `components/music/BookingCalendar.tsx`
**Changes:**
- Added GSAP timeline implementation with refs
- Created two separate useEffect hooks:
  - One to create timeline once on mount (with empty dependency array)
  - One to toggle play/reverse based on state
- Added `isGiftUnwrapped` state to track animation state
- Simplified gift box JSX structure to just two elements: lid and bottom
- Added client-side check (`typeof window === 'undefined'`) to prevent SSR issues

**Key Code:**
```typescript
const giftLidRef = useRef<HTMLDivElement>(null);
const giftContentRef = useRef<HTMLDivElement>(null);
const timelineRef = useRef<gsap.core.Timeline | null>(null);
const [isGiftUnwrapped, setIsGiftUnwrapped] = useState(false);

// Create timeline once on mount
useEffect(() => {
  if (typeof window === 'undefined') return;
  if (!giftLidRef.current || !giftContentRef.current) return;

  const tl = gsap.timeline({ paused: true });

  tl.to(giftLidRef.current, {
    yPercent: -200,
    rotationX: 120,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.inOut'
  })
  .to(giftContentRef.current, {
    opacity: 1,
    visibility: 'visible',
    duration: 0.5
  }, '<0.2');

  timelineRef.current = tl;
  return () => tl.kill();
}, []);

// Toggle animation
useEffect(() => {
  if (!timelineRef.current) return;

  if (isGiftUnwrapped) {
    timelineRef.current.play();
  } else {
    timelineRef.current.reverse();
  }
}, [isGiftUnwrapped]);
```

### 2. `components/music/BookingCalendar.module.css`
**Changes:**
- Set up 3D transforms with `perspective: 1200px`
- Configured lid with `transform-origin: top center` and `transform-style: preserve-3d`
- Made gift content absolutely positioned to fill entire box
- Added `line-height: 1` to all text elements to eliminate extra spacing
- Set lid `opacity: 1` initially so GSAP can animate it to 0

**Key Styles:**
```css
.giftButton {
  perspective: 1200px;
  min-height: 70px;
  overflow: visible;
}

.giftLid {
  position: absolute;
  top: 0;
  height: 100%;
  opacity: 1; /* Start visible */
  transform-origin: top center;
  transform-style: preserve-3d;
  z-index: 3;
}

.giftContent {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

### 3. `components/music/BookingCalendarWrapper.tsx` (New File)
**Purpose:** Simple client component wrapper to avoid SSR issues

**Content:**
```typescript
'use client';

import BookingCalendar from './BookingCalendar';

export default function BookingCalendarWrapper() {
  return <BookingCalendar />;
}
```

### 4. `app/music/page.tsx`
**Change:** Updated import to use wrapper component
```typescript
import BookingCalendarWrapper from "@/components/music/BookingCalendarWrapper";

// In JSX:
<BookingCalendarWrapper />
```

## Issues Encountered & Solutions

### Issue 1: Hydration Mismatch
**Error:** Server-rendered HTML didn't match client-rendered HTML

**Attempted Solutions:**
1. ❌ Used `dynamic` import with `ssr: false` directly in Server Component
   - Error: "ssr: false is not allowed with next/dynamic in Server Components"
2. ✅ Created `BookingCalendarWrapper.tsx` as Client Component
   - Wrapper handles the import separation

### Issue 2: GSAP Runtime Error
**Error:** "Cannot read properties of undefined (reading 'call')"

**Root Cause:** Timeline was being recreated on every state change

**Solution:**
- Split into two useEffect hooks
- Create timeline once with empty dependency array
- Store in ref and only toggle play/reverse

### Issue 3: Webpack Module Error
**Error:** "Cannot read properties of undefined (reading 'call')" in webpack

**Solution:** Removed dynamic import and used direct import with client-side check

### Issue 4: Lid Not Disappearing
**Problem:** Lid was still visible after flipping up

**Solution:**
- Changed `yPercent` from -100 to -200 (move further away)
- Added `opacity: 0` to GSAP animation
- Set initial `opacity: 1` in CSS

### Issue 5: Text Positioning
**Problem:** Text was clipping at the top edge of the box

**Solution:**
- Made content `position: absolute` with `top: 0, bottom: 0`
- Added `justify-content: center` to vertically center
- Added `line-height: 1` to remove extra spacing

## Animation Behavior

**Closed State:**
- Shows pink gift box with 🎁 emoji
- Lid covers the entire button

**Click 3-Hour Button:**
- Lid flips backward (rotationX: 120deg)
- Lid moves up 200% and fades to transparent
- Content fades in revealing:
  - "3 HOURS"
  - "$100"
  - "SAVE $50!"

**Click Other Duration:**
- Animation reverses smoothly
- Lid returns and becomes opaque
- Content fades out

## Technical Details

**GSAP Timeline Configuration:**
- `paused: true` - Timeline doesn't autoplay on creation
- `yPercent: -200` - Moves lid 200% of its height upward
- `rotationX: 120` - 3D flip backward effect
- `ease: 'power2.inOut'` - Smooth acceleration/deceleration
- `'<0.2'` - Content animation starts 0.2s after timeline begins

**CSS 3D Setup:**
- Parent: `perspective: 1200px`
- Container: `transform-style: preserve-3d`
- Lid: `transform-origin: top center`

## Commit History
1. `23ac202` - Add gift box unwrap animation for 3-hour holiday special
2. `20891d8` - Rebuild gift box with GSAP for professional animations
3. `6d44945` - Fix gift box animation and improve GSAP implementation ✅

## Testing Checklist
- [x] Gift box appears on 3-hour button
- [x] Clicking 3-hour button unwraps gift
- [x] Lid disappears completely when unwrapped
- [x] Content is centered in box
- [x] Clicking other buttons re-wraps gift
- [x] No hydration errors
- [x] No console errors
- [x] Animation is smooth and performant

## Dependencies
- **GSAP:** v3.13.0 (already installed)
- No additional packages required

## Next Steps
- Monitor production for any issues
- Consider adding mobile-specific tweaks if needed
- Potentially add confetti effect when unwrapping (future enhancement)

## Notes
- Used single timeline pattern from GSAP best practices guide
- Client-side only rendering prevents SSR mismatches
- Timeline stored in ref prevents recreation on re-renders
- Simple two-element structure (lid + bottom) keeps animation clean
