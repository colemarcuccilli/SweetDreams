# Sweet Dreams Site Flow & User Journey

## User Flow Diagram

```
                    [Landing Page]
                          |
            ┌─────────────┴─────────────┐
            ▼                           ▼
      [Music Section]             [Media Section]
            |                           |
      ┌─────┴─────┐               ┌────┴────┐
      ▼           ▼               ▼         ▼
  [Services]  [Booking]      [Portfolio] [Contact]
      |           |               |         |
      └─────┬─────┘               └────┬────┘
            ▼                          ▼
    [Stripe Checkout]            [Lead Captured]
            |                          |
            ▼                          ▼
    [Booking Confirmed]          [Admin Notified]
```

## Page-by-Page Visual Layout

### 🏠 HOME PAGE (/)
```
┌──────────────────────────────────────────────────┐
│  [Sweet Dreams Logo]            [Music] [Media]  │  <- Header (sticky)
├──────────────────────────────────────────────────┤
│                                                  │
│              SWEET DREAMS                       │  <- Large title
│     Professional music production and           │
│         media services in Fort Wayne            │
│                                                  │
│  ┌────────────────┐  ┌────────────────┐        │
│  │  🎵 MUSIC      │  │  📹 MEDIA      │        │  <- Choice cards
│  │                │  │                │        │
│  │  Recording     │  │  Videography   │        │
│  │  studio &      │  │  & commercial  │        │
│  │  production    │  │  production    │        │
│  └────────────────┘  └────────────────┘        │
│                                                  │
├──────────────────────────────────────────────────┤
│  Sweet Dreams Music | Sweet Dreams Media        │  <- Footer
│  Contact Info       | Contact Info              │
└──────────────────────────────────────────────────┘
```

### 🎵 MUSIC PAGE (/music)
```
┌──────────────────────────────────────────────────┐
│  [Logo]  Music  Media   Home|Services|Book|...  │
├──────────────────────────────────────────────────┤
│                                                  │
│  ╔═══════════════════════════════════════════╗  │  <- Hero (purple gradient)
│  ║  DEVELOP YOUR BRAND, YOUR WAY             ║  │
│  ║  Welcome to Sweet Dreams Music...         ║  │
│  ║         [BOOK A SESSION ↓]                ║  │
│  ╚═══════════════════════════════════════════╝  │
│                                                  │
│  Our Services                                   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │  <- Service cards
│  │Beats│ │Video│ │ Rec │ │Mix &│              │
│  └─────┘ └─────┘ └─────┘ └─────┘              │
│                                                  │
│  Studio Packages                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐          │  <- Package cards
│  │ BASIC   │ │STANDARD*│ │ PREMIUM │          │
│  │ $450    │ │ $675    │ │ $975    │          │
│  └─────────┘ └─────────┘ └─────────┘          │
│                                                  │
│  ┌─────────────┬─────────────┐                 │  <- Pricing section
│  │ Hourly Rates│ Sweet Spot  │                 │
│  │ • Recording │ $1,800       │                 │
│  │ • Mixing    │ 15 hours     │                 │
│  └─────────────┴─────────────┘                 │
│                                                  │
│  Book Your Session                              │
│  ┌──────────────┬──────────────┐               │  <- Booking system
│  │  📅 Calendar │ Package:     │               │
│  │  [Oct 2025]  │ ○ Hourly     │               │
│  │              │ ○ Basic      │               │
│  │  Time Slots: │ ● Standard   │               │
│  │  [10AM][11AM]│               │               │
│  │              │ Deposit: $337│               │
│  │              │ [PAY NOW]    │               │
│  └──────────────┴──────────────┘               │
│                                                  │
│  What Our Clients Say                           │
│  [← "Amazing experience..." - Artist Name →]    │  <- Testimonial carousel
│                                                  │
│  📍 Location & Hours                            │
│  [Google Map]                                   │
│  Mon-Sat: 10AM-6PM                             │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 📹 MEDIA PAGE (/media)
```
┌──────────────────────────────────────────────────┐
│  [Logo]  Music  Media   Home|Portfolio|Contact  │
├──────────────────────────────────────────────────┤
│                                                  │
│  ╔═══════════════════════════════════════════╗  │  <- Hero (blue gradient)
│  ║  YOUR VISION, AMPLIFIED                   ║  │
│  ║  Transform your brand story...            ║  │
│  ║       [DISCUSS YOUR VISION]               ║  │
│  ╚═══════════════════════════════════════════╝  │
│                                                  │
│  Our Portfolio                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐                   │  <- Video grid
│  │ ▶️    │ │ ▶️    │ │ ▶️    │                   │
│  │Video1│ │Video2│ │Video3│                   │
│  └──────┘ └──────┘ └──────┘                   │
│  ┌──────┐ ┌──────┐ ┌──────┐                   │
│  │ ▶️    │ │Coming│ │ ▶️    │                   │
│  │Video4│ │ Soon │ │Video6│                   │
│  └──────┘ └──────┘ └──────┘                   │
│                                                  │
│  What We Do                                     │
│  [🎬 Brand Films] [📹 Commercials]              │  <- Service icons
│  [🎥 Events] [💼 Corporate]                     │
│                                                  │
│  Our Clients                                    │
│  [Logo1] [Logo2] [Logo3] [Logo4] [Logo5]       │  <- Client logos
│                                                  │
│  ┌────────────────────────────────────┐        │  <- Stats bar
│  │ 400k+ Views | 130+ Projects | 24hr │        │
│  └────────────────────────────────────┘        │
│                                                  │
│  Let's Create Something Amazing                 │
│  ┌────────────────────────────┐                │  <- Contact form
│  │ Name: [_______________]     │                │
│  │ Email: [______________]     │                │
│  │ Message: [____________]     │                │
│  │         [SEND MESSAGE]      │                │
│  └────────────────────────────┘                │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 🔐 ADMIN DASHBOARD (/admin/dashboard)
```
┌──────────────────────────────────────────────────┐
│  [Logo] Admin Panel              [Logout]       │
├─────────┬────────────────────────────────────────┤
│         │  Dashboard Overview                    │
│ Menu    │  ┌─────────┬─────────┬─────────┐     │
│         │  │Bookings │  Leads  │Portfolio│     │  <- Stats cards
│ ▶ Dash  │  │   12    │   45    │   8     │     │
│ Bookings│  └─────────┴─────────┴─────────┘     │
│ Portfolio│                                       │
│ Leads   │  Recent Bookings                      │
│         │  ┌──────────────────────────────┐     │  <- Table
│         │  │ Date  │Client│Package│Status │     │
│         │  ├──────────────────────────────┤     │
│         │  │Oct 1 │John │Standard│✓Paid  │     │
│         │  │Oct 2 │Jane │Hourly  │Pending│     │
│         │  │      │     │        │[Charge]│     │
│         │  └──────────────────────────────┘     │
│         │                                        │
│         │  Quick Actions                        │
│         │  [Add Portfolio] [Export Leads]       │
│         │                                        │
└─────────┴────────────────────────────────────────┘
```

## Interactive Elements & Micro-interactions

### Button States
```
Default:     [────────────]
Hover:       [▓▓▓▓▓▓▓▓▓▓▓▓]  (darker)
Active:      [░░░░░░░░░░░░]  (pressed)
Loading:     [◐ Loading...]  (spinner)
Disabled:    [············]  (grayed out)
```

### Form Validation Flow
```
Empty Field:     [_______________]
Typing:          [John D_________]
Valid:           [John Doe_______] ✓
Invalid:         [john@_________] ✗ Invalid email
```

### Modal/Popup Flow
```
Trigger → Overlay Fade In → Content Slide Up → User Action → Close Animation
```

## Responsive Behavior

### Desktop (1024px+)
- Full navigation in header
- Multi-column layouts
- Side-by-side forms

### Tablet (768px-1023px)
- Condensed navigation
- 2-column grids become single
- Stacked forms

### Mobile (< 768px)
- Hamburger menu
- Single column layout
- Full-width buttons
- Touch-optimized spacing

## Color Psychology & Usage

### Purple (Music Section)
- **Emotion**: Creative, Premium, Artistic
- **Usage**: CTAs, active states, hero gradients
- **Psychology**: Appeals to artists and musicians

### Blue (Media Section)
- **Emotion**: Professional, Trustworthy, Corporate
- **Usage**: Business elements, video overlays
- **Psychology**: Appeals to business clients

### State Colors
```
Success: ✓ Green  - Bookings confirmed
Warning: ⚠ Yellow - Pending actions
Error:   ✗ Red    - Failed operations
Info:    ℹ Blue   - General information
```

## User Journey Maps

### Music Customer Journey
```
1. Discover → Landing page → Choose Music
2. Explore → View services & packages
3. Decide → Compare pricing options
4. Book → Select date/time/package
5. Pay → Stripe checkout (deposit)
6. Confirm → Receive booking confirmation
7. Attend → Come to studio session
8. Complete → Final payment processed
```

### Media Customer Journey
```
1. Discover → Landing page → Choose Media
2. Browse → View portfolio videos
3. Evaluate → Check client list & stats
4. Contact → Fill out lead form
5. Discuss → Receive follow-up call
6. Contract → Sign agreement (offline)
7. Project → Video production
8. Deliver → Final video delivered
```

### Admin Journey
```
1. Login → Authenticate
2. Overview → Dashboard stats
3. Manage → View bookings/leads
4. Action → Process payments
5. Update → Add portfolio items
6. Export → Download lead data
```

## Performance Metrics

### Target Load Times
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Largest Contentful Paint: < 2.5s

### Optimization Strategy
- Lazy load videos/images
- Progressive enhancement
- CDN for static assets
- Minimize JavaScript bundle