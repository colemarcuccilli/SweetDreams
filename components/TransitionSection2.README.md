# TransitionSection2 Component

## Overview
This component displays marketing content with a sophisticated GSAP SplitText line-by-line reveal animation triggered on scroll.

## Design
- **Background**: Off-gray (#2a2a2a)
- **Text Color**: Off-white (#e8e8e8)
- **Layout**: Single column, vertically centered content

## Content Structure
Three text blocks with different styles:
1. **Large Text** - Anton font, 40px, marketing message about retainer packages
2. **Medium Text** - IBM Plex Mono, 20px, brand positioning statement
3. **Small Text** - Anton font, 80px, call-to-action headline

## Animation Behavior

### Before SplitText Installation
The component will render normally with all text visible. A console warning will appear:
```
GSAP SplitText plugin is not available. Please install it from Club GSAP.
```

### After SplitText Installation
Each text block will animate independently:

1. **Trigger Point**: Animation starts when element reaches 80% of viewport height
2. **Effect**: Lines slide up from below (100% translateY) while fading in
3. **Stagger**: 0.1s delay between each line for a cascade effect
4. **Easing**: Power3.out for smooth deceleration
5. **Duration**: 1 second per line
6. **Reversible**: Animation reverses when scrolling back up

### Responsive Behavior
- `autoSplit: true` ensures text re-splits on:
  - Font loading completion
  - Window resize
  - Orientation change
- Animations automatically recreate with the new line breaks

## Technical Implementation

### Key GSAP Features
```typescript
SplitText(element, {
  type: 'lines',           // Split by line breaks
  mask: 'lines',           // Add clipping wrapper for reveal
  autoSplit: true,         // Handle responsive resizing
  aria: 'auto',            // Maintain accessibility
  onSplit: () => {         // Recreate animations on re-split
    // Animation code here
  }
})
```

### ScrollTrigger Configuration
```typescript
scrollTrigger: {
  trigger: element,
  start: 'top 80%',
  end: 'top 30%',
  toggleActions: 'play none none reverse'
}
```

## Accessibility
- `aria: "auto"` maintains proper ARIA labels
- Text remains readable even without animation
- No motion-based content is hidden from screen readers

## File Dependencies
- `TransitionSection2.tsx` - React component with GSAP logic
- `TransitionSection2.module.css` - Styles including line mask classes
- GSAP library (`gsap@3.13.0`)
- GSAP SplitText plugin (premium, requires Club GSAP)
- GSAP ScrollTrigger plugin (included with GSAP core)

## Installation Requirements
See `GSAP_SPLITTEXT_SETUP.md` in the project root for detailed instructions on obtaining and installing the SplitText plugin.

## Customization

### Adjust Animation Timing
In `TransitionSection2.tsx`, modify these values:
```typescript
gsap.to(split.lines, {
  duration: 1,        // Animation duration per line
  stagger: 0.1,       // Delay between lines
  ease: 'power3.out'  // Easing function
})
```

### Change Scroll Trigger Point
```typescript
scrollTrigger: {
  start: 'top 80%',   // Start when element is 80% down viewport
  end: 'top 30%'      // Complete by 30% down viewport
}
```

### Adjust Colors
In `TransitionSection2.module.css`:
```css
.section {
  background: #2a2a2a;  /* Off-gray background */
}

.largeText, .mediumText, .smallText {
  color: #e8e8e8;       /* Off-white text */
}
```

## Debugging
Uncomment this line in the ScrollTrigger config to see trigger markers:
```typescript
// markers: true
```

This will display visual indicators showing when animations trigger.

## Performance Notes
- GSAP context (`gsap.context()`) ensures proper cleanup
- Split instances are stored and reverted on unmount
- ScrollTrigger automatically manages scroll listeners efficiently
- `autoSplit` uses ResizeObserver under the hood for efficient resize detection

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Falls back to static text if SplitText unavailable
