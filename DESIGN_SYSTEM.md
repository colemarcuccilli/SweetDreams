# Sweet Dreams Design System

## Color Palette

### Brand Colors
```
Primary Purple (Music): #9333EA (purple-600)
Primary Blue (Media): #2563EB (blue-600)

Purple Scale:
- purple-50: #FAF5FF
- purple-100: #F3E8FF
- purple-200: #E9D5FF
- purple-300: #D8B4FE
- purple-400: #C084FC
- purple-500: #A855F7
- purple-600: #9333EA
- purple-700: #7E22CE
- purple-800: #6B21A8
- purple-900: #581C87

Blue Scale:
- blue-50: #EFF6FF
- blue-100: #DBEAFE
- blue-200: #BFDBFE
- blue-300: #93C5FD
- blue-400: #60A5FA
- blue-500: #3B82F6
- blue-600: #2563EB
- blue-700: #1D4ED8
- blue-800: #1E40AF
- blue-900: #1E3A8A

Neutral:
- gray-50: #F9FAFB
- gray-600: #4B5563
- gray-900: #111827
- white: #FFFFFF
- black: #000000
```

### Usage Guidelines
- **Music Pages**: Purple gradients and accents
- **Media Pages**: Blue gradients and accents
- **Admin Pages**: Neutral grays with purple/blue status indicators
- **Success States**: Green-500 (#10B981)
- **Error States**: Red-500 (#EF4444)
- **Warning States**: Yellow-500 (#F59E0B)

## Typography

### Font Family
- **Primary**: IBM Plex Mono (all text)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Type Scale
```
Headings:
- H1: text-5xl md:text-7xl (48px/72px) font-bold
- H2: text-4xl (36px) font-bold
- H3: text-2xl (24px) font-semibold
- H4: text-xl (20px) font-semibold
- H5: text-lg (18px) font-semibold

Body:
- Large: text-xl (20px)
- Regular: text-base (16px)
- Small: text-sm (14px)
- Extra Small: text-xs (12px)
```

## Component Patterns

### Buttons
```css
Primary: bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg
Secondary: bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg
Outline: border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg
Danger: bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg
```

### Cards
```css
Basic Card: bg-white rounded-lg shadow-lg p-6
Hover Card: bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6
Featured Card: bg-white rounded-lg shadow-lg ring-2 ring-purple-500 p-8
```

### Sections
```css
Default Section: py-16
Alternate Section: py-16 bg-gray-50
Hero Section: min-h-[70vh] with gradient background
Container: container mx-auto px-4
```

## Page Flow & Layout

### 1. Landing Page (/)
```
┌─────────────────────────────────┐
│         Sweet Dreams            │
│    [Music Box] [Media Box]      │
│   Split 50/50 decision page     │
└─────────────────────────────────┘
```

### 2. Music Section (/music)
```
┌─────────────────────────────────┐
│ Hero: "Develop Your Brand"      │
│ [Book Session CTA]               │
├─────────────────────────────────┤
│ Services Grid (4 cards)          │
├─────────────────────────────────┤
│ Packages (3 columns)             │
│ [Basic] [Standard*] [Premium]   │
├─────────────────────────────────┤
│ Pricing: Hourly | Sweet Spot    │
├─────────────────────────────────┤
│ Booking Calendar & Package      │
│ [Date Picker] | [Package Select]│
├─────────────────────────────────┤
│ Testimonials Carousel            │
├─────────────────────────────────┤
│ Location & Hours                 │
└─────────────────────────────────┘
```

### 3. Media Section (/media)
```
┌─────────────────────────────────┐
│ Hero: "Your Vision, Amplified"  │
│ [Discuss Your Vision CTA]       │
├─────────────────────────────────┤
│ Portfolio Grid                   │
│ [Video] [Video] [Video]          │
│ [Video] [Coming] [Video]         │
├─────────────────────────────────┤
│ Services (4 icons)               │
├─────────────────────────────────┤
│ Client Logos                     │
├─────────────────────────────────┤
│ Stats Bar                        │
│ 400k+ views | 130+ projects     │
├─────────────────────────────────┤
│ Lead Form                        │
└─────────────────────────────────┘
```

### 4. Admin Dashboard (/admin)
```
┌─────────────────────────────────┐
│ Admin Header with Logout         │
├─────────────────────────────────┤
│ Sidebar | Main Content           │
│ - Dashboard                      │
│ - Bookings                       │
│ - Portfolio                      │
│ - Leads                          │
└─────────────────────────────────┘
```

## Animation & Interactions

### Hover States
- Cards: Lift effect with shadow increase
- Buttons: Color darkening with smooth transition
- Links: Underline or color change
- Images: Slight zoom or overlay effect

### Transitions
```css
Default: transition-all duration-300
Fast: transition-all duration-150
Slow: transition-all duration-500
```

### Scroll Behaviors
- Smooth scrolling for anchor links
- Fade-in animations for sections (optional)
- Sticky header with backdrop blur

## Responsive Breakpoints

```css
sm: 640px  (mobile landscape)
md: 768px  (tablet)
lg: 1024px (desktop)
xl: 1280px (large desktop)
2xl: 1536px (extra large)
```

### Mobile-First Approach
- Stack columns on mobile
- Hide non-essential elements
- Hamburger menu for navigation
- Touch-friendly button sizes (min 44px)

## Component States

### Form Elements
```css
Default: border-gray-300
Focus: border-purple-500 ring-2 ring-purple-200
Error: border-red-500 text-red-600
Disabled: bg-gray-100 cursor-not-allowed opacity-50
```

### Loading States
- Skeleton screens for content loading
- Spinner for button actions
- Progress bars for multi-step processes

## Special Effects

### Gradients
```css
Purple Gradient: bg-gradient-to-br from-purple-500 to-purple-700
Blue Gradient: bg-gradient-to-br from-blue-500 to-blue-700
Hero Gradient: bg-gradient-to-br from-purple-50 to-purple-100
```

### Shadows
```css
Small: shadow-sm
Default: shadow-lg
Large: shadow-xl
Colored: shadow-purple-500/20
```

## Accessibility

### Focus Indicators
- All interactive elements have visible focus states
- Skip navigation link
- ARIA labels for icons and buttons
- Semantic HTML structure

### Color Contrast
- Minimum WCAG AA compliance (4.5:1 for normal text)
- High contrast mode support
- No color-only information

## Grid System

### Standard Layouts
```css
Full Width: w-full
Container: max-w-7xl mx-auto
Content: max-w-4xl mx-auto
Narrow: max-w-2xl mx-auto
```

### Common Grids
```css
2 Column: grid md:grid-cols-2 gap-8
3 Column: grid md:grid-cols-3 gap-8
4 Column: grid md:grid-cols-2 lg:grid-cols-4 gap-8
```

## Navigation Patterns

### Header Navigation
- Sticky positioning with blur backdrop
- Brand switcher (Music/Media)
- Section-specific navigation links
- Mobile hamburger menu

### Footer Structure
- Two-column layout (Music | Media)
- Contact information
- Social media links
- Copyright notice

## Data Display

### Tables (Admin)
```css
Header: bg-gray-50 font-semibold
Row: border-b hover:bg-gray-50
Cell: px-4 py-2
```

### Status Badges
```css
Pending: bg-yellow-100 text-yellow-800
Confirmed: bg-green-100 text-green-800
Completed: bg-blue-100 text-blue-800
Cancelled: bg-red-100 text-red-800
```

## Modal/Dialog Patterns
```css
Overlay: fixed inset-0 bg-black/50
Content: bg-white rounded-lg shadow-xl p-6
Close Button: absolute top-4 right-4
```

## Icon Usage
- Lucide React for consistent iconography
- Size: 16px (small), 20px (default), 24px (large)
- Color: Inherit from parent text color

## Performance Guidelines
- Lazy load images and videos
- Code splitting for route-based chunks
- Optimize fonts with display: swap
- Minimize third-party scripts
- Use Next.js Image component for optimization