# GSAP SplitText Plugin Setup Instructions

## Overview
The TransitionSection2 component has been configured to use GSAP SplitText for advanced line-by-line text reveal animations. However, SplitText is a **premium plugin** that requires a Club GSAP membership.

## Current Status
- ✅ GSAP core library installed (`gsap@3.13.0`)
- ✅ ScrollTrigger plugin available (included with GSAP)
- ⏳ SplitText plugin needs to be obtained and installed

## How to Get SplitText

### Option 1: Club GSAP Membership (Recommended)
1. Visit https://gsap.com/pricing/
2. Sign up for Club GSAP (starts at $99/year for personal use)
3. Benefits include:
   - Access to all premium plugins (SplitText, MorphSVG, DrawSVG, etc.)
   - Support from the GSAP team
   - Commercial use license

### Option 2: Business License
For commercial projects, consider the Business Green ($199/year) or higher tiers.

## Installation Steps

Once you have Club GSAP access:

### 1. Download the Plugin
- Log into your GSAP account at https://gsap.com/
- Navigate to Downloads
- Download the latest SplitText plugin files

### 2. Add to Your Project
Create a folder for premium GSAP plugins:
```bash
mkdir -p C:\Users\cole\Desktop\SweetDreamsMusicLLC\SweetDreams\lib\gsap
```

Place the `SplitText.min.js` file in this directory.

### 3. Update the Component
In `components/TransitionSection2.tsx`, uncomment these lines:

```typescript
// Change this:
// import { SplitText } from 'gsap/SplitText'; // Uncomment after adding SplitText plugin

// To this:
import { SplitText } from '../lib/gsap/SplitText.min.js';
```

And uncomment the registration:
```typescript
// Change this:
// gsap.registerPlugin(SplitText); // Uncomment after adding SplitText plugin

// To this:
gsap.registerPlugin(SplitText);
```

### 4. Alternative: NPM Installation (for Club members)
If you have access to the GSAP private NPM registry:

```bash
npm config set @gsap:registry https://npm.greensock.com
npm config set //npm.greensock.com/:_authToken YOUR_AUTH_TOKEN
npm install gsap@npm:@gsap/shockingly
```

Then import like this:
```typescript
import { SplitText } from 'gsap/SplitText';
```

## Testing the Animation

Once installed, the animation should:
1. Split text into lines automatically
2. Reveal each line with a smooth upward motion
3. Stagger the animation across lines (0.1s delay between each)
4. Trigger when scrolling into view (80% viewport)
5. Reverse when scrolling back up
6. Handle responsive resizing automatically with `autoSplit: true`

## Animation Features Used

- **type: "lines"** - Splits text by line breaks
- **mask: "lines"** - Adds clipping wrapper for clean reveal effects
- **autoSplit: true** - Automatically re-splits on font load and resize
- **aria: "auto"** - Maintains accessibility
- **onSplit() callback** - Creates animations that auto-update on re-split
- **ScrollTrigger integration** - Smooth scroll-based reveals

## Troubleshooting

### If you see a console warning:
```
GSAP SplitText plugin is not available. Please install it from Club GSAP.
```

This means the component loaded but SplitText wasn't found. Follow the installation steps above.

### The component will still render
Even without SplitText, the text will display normally with the off-gray background (#2a2a2a) and off-white text (#e8e8e8). It just won't have the animated reveal effect.

## Styling Details

The component uses:
- **Background**: `#2a2a2a` (off-gray)
- **Text Color**: `#e8e8e8` (off-white)
- **Fonts**:
  - Anton for large and small text
  - IBM Plex Mono for medium text
- **Animation**: Lines slide up from 100% below with opacity fade

## Support

For GSAP/SplitText support:
- GSAP Forums: https://gsap.com/community/
- Documentation: https://gsap.com/docs/v3/Plugins/SplitText/
- Email: support@greensock.com (Club members only)

For implementation issues:
- Check the browser console for errors
- Verify the SplitText file path is correct
- Ensure you've uncommented the import and registration lines
- Try enabling `markers: true` in ScrollTrigger config for debugging
