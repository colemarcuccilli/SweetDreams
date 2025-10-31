# Analytics & Tracking Agent - Complete Implementation

## Mission
Implement comprehensive multi-platform analytics and tracking across Sweet Dreams website to measure performance, user behavior, conversion funnels, ROI, and business KPIs.

## Tracking Platforms to Implement
1. **Google Analytics 4** - Core analytics
2. **Facebook Pixel** - Facebook/Instagram ads tracking
3. **Google Tag Manager** - Tag management system
4. **TikTok Pixel** - TikTok ads (future)
5. **LinkedIn Insight Tag** - B2B tracking (media clients)
6. **Microsoft Clarity** - Heatmaps & session recordings
7. **Vercel Analytics** - Performance tracking
8. **Hotjar** - User behavior (optional)

## Phase 1: Google Analytics 4 Setup

### 1.1 GA4 Installation
**Create GA4 Property:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create new property: "Sweet Dreams Music & Media"
3. Enable Google Signals (for cross-device tracking)
4. Get Measurement ID (G-XXXXXXXXXX)

**Implement in Next.js:**
```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 1.2 Custom Event Tracking
**Create Analytics Utility:**
```typescript
// lib/analytics.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track custom events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Pre-defined conversion events
export const trackBookingStarted = (sessionData: any) => {
  event({
    action: 'booking_started',
    category: 'Conversion',
    label: `${sessionData.duration}hr session`,
    value: sessionData.amount,
  })
}

export const trackBookingCompleted = (bookingData: any) => {
  event({
    action: 'booking_completed',
    category: 'Conversion',
    label: `${bookingData.duration}hr session`,
    value: bookingData.totalAmount / 100, // Convert cents to dollars
  })

  // Enhanced ecommerce tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: bookingData.stripeSessionId,
      value: bookingData.totalAmount / 100,
      currency: 'USD',
      items: [{
        item_id: bookingData.sessionType,
        item_name: `${bookingData.duration}hr Studio Session`,
        item_category: 'Recording Session',
        price: bookingData.totalAmount / 100,
        quantity: 1
      }]
    })
  }
}

export const trackLeadSubmitted = (formType: string) => {
  event({
    action: 'lead_submitted',
    category: 'Lead Generation',
    label: formType,
  })
}

export const trackVideoPlay = (videoTitle: string) => {
  event({
    action: 'video_play',
    category: 'Engagement',
    label: videoTitle,
  })
}

export const trackEmailCapture = (source: string) => {
  event({
    action: 'email_captured',
    category: 'Lead Generation',
    label: source,
  })
}
```

### 1.3 Track Page Views (App Router)
```typescript
// app/layout.tsx (add to existing)
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import * as analytics from '@/lib/analytics'

function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    analytics.pageview(url)
  }, [pathname, searchParams])

  return null
}

// Add to layout
<AnalyticsTracker />
```

### 1.4 Track Booking Events
```typescript
// components/music/BookingCalendar.tsx
import * as analytics from '@/lib/analytics'

// Track when user opens calendar
useEffect(() => {
  analytics.event({
    action: 'calendar_opened',
    category: 'Engagement',
    label: 'booking_calendar'
  })
}, [])

// Track when user selects date
const handleDateSelect = (date: Date) => {
  setSelectedDate(date)
  analytics.event({
    action: 'date_selected',
    category: 'Booking Funnel',
    label: date.toISOString()
  })
}

// Track when user starts booking
const handleStartBooking = () => {
  analytics.trackBookingStarted({
    duration: duration,
    amount: pricing.deposit
  })
}

// Track successful booking
const handleBookingSuccess = (booking: any) => {
  analytics.trackBookingCompleted(booking)
}
```

## Phase 2: Facebook Pixel Setup

### 2.1 Get Facebook Pixel ID
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create new pixel or get existing pixel ID
3. Add to `.env.local`

```env
NEXT_PUBLIC_FB_PIXEL_ID=1234567890123456
```

### 2.2 Implement Facebook Pixel
```typescript
// lib/facebook-pixel.ts
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID

export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView')
  }
}

// Standard events
export const trackEvent = (name: string, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options)
  }
}

// Custom events
export const trackCustomEvent = (name: string, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', name, options)
  }
}

// Pre-defined events
export const trackLead = (value?: number) => {
  trackEvent('Lead', value ? { value, currency: 'USD' } : {})
}

export const trackPurchase = (value: number, currency = 'USD') => {
  trackEvent('Purchase', {
    value,
    currency,
  })
}

export const trackInitiateCheckout = () => {
  trackEvent('InitiateCheckout')
}

export const trackViewContent = (contentName: string, contentType: string) => {
  trackEvent('ViewContent', {
    content_name: contentName,
    content_type: contentType,
  })
}

export const trackSearch = (searchString: string) => {
  trackEvent('Search', {
    search_string: searchString,
  })
}

export const trackContact = () => {
  trackEvent('Contact')
}
```

**Install Pixel in Layout:**
```typescript
// app/layout.tsx
import Script from 'next/script'

<head>
  {/* Facebook Pixel */}
  <Script id="facebook-pixel" strategy="afterInteractive">
    {`
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `}
  </Script>
  <noscript>
    <img
      height="1"
      width="1"
      style={{ display: 'none' }}
      src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`}
    />
  </noscript>
</head>
```

### 2.3 Track Conversions with Facebook Pixel
```typescript
// Track booking completion
import * as fbPixel from '@/lib/facebook-pixel'

const handleBookingComplete = (booking: any) => {
  // Track as purchase
  fbPixel.trackPurchase(booking.totalAmount / 100)

  // Also track as lead
  fbPixel.trackLead(booking.totalAmount / 100)
}

// Track lead form submission
const handleLeadSubmit = () => {
  fbPixel.trackLead()
  fbPixel.trackContact()
}

// Track when user views pricing
const handleViewPricing = () => {
  fbPixel.trackViewContent('Pricing', 'product')
}

// Track checkout initiation
const handleCheckoutStart = () => {
  fbPixel.trackInitiateCheckout()
}
```

## Phase 3: Google Tag Manager Setup

### 3.1 Install GTM
```typescript
// app/layout.tsx
<head>
  {/* Google Tag Manager */}
  <Script id="google-tag-manager" strategy="afterInteractive">
    {`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
    `}
  </Script>
</head>
<body>
  {/* Google Tag Manager (noscript) */}
  <noscript>
    <iframe
      src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
      height="0"
      width="0"
      style={{ display: 'none', visibility: 'hidden' }}
    />
  </noscript>
  {children}
</body>
```

### 3.2 Push Events to Data Layer
```typescript
// lib/gtm.ts
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export const pushEvent = (event: any) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event)
  }
}

// Pre-defined events
export const trackBooking = (bookingData: any) => {
  pushEvent({
    event: 'booking_completed',
    transactionId: bookingData.id,
    transactionTotal: bookingData.totalAmount / 100,
    transactionProducts: [{
      name: `${bookingData.duration}hr Studio Session`,
      sku: `session-${bookingData.duration}hr`,
      category: 'Recording Session',
      price: bookingData.totalAmount / 100,
      quantity: 1
    }]
  })
}

export const trackFormSubmission = (formName: string) => {
  pushEvent({
    event: 'form_submission',
    formName: formName,
    formLocation: window.location.pathname
  })
}
```

## Phase 4: Microsoft Clarity Setup

### 4.1 Install Clarity (Free Heatmaps)
```typescript
// app/layout.tsx
<head>
  {/* Microsoft Clarity */}
  <Script id="microsoft-clarity" strategy="afterInteractive">
    {`
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
    `}
  </Script>
</head>
```

**Clarity Features:**
- Session recordings
- Heatmaps
- Click tracking
- Scroll depth
- Dead click detection
- Rage click detection

## Phase 5: LinkedIn Insight Tag (For B2B Media Clients)

### 5.1 Install LinkedIn Pixel
```typescript
// app/layout.tsx
<head>
  {/* LinkedIn Insight Tag */}
  <Script id="linkedin-insight" strategy="afterInteractive">
    {`
      _linkedin_partner_id = "${process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID}";
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    `}
  </Script>
  <Script
    src="https://snap.licdn.com/li.lms-analytics/insight.min.js"
    strategy="afterInteractive"
  />
</head>
```

### 5.2 Track Conversions
```typescript
// lib/linkedin-pixel.ts
export const trackConversion = (conversionId: number) => {
  if (typeof window !== 'undefined' && window.lintrk) {
    window.lintrk('track', { conversion_id: conversionId })
  }
}

// Track media contact form as conversion
export const trackMediaLead = () => {
  trackConversion(12345678) // Replace with actual conversion ID
}
```

## Phase 6: Event Tracking Implementation

### 6.1 Booking Flow Tracking
```typescript
// Track complete booking funnel
export const trackBookingFunnel = {
  // Step 1: Viewed booking page
  viewBookingPage: () => {
    analytics.event({ action: 'view_booking', category: 'Funnel' })
    fbPixel.trackViewContent('Booking Calendar', 'product')
  },

  // Step 2: Selected date
  selectDate: (date: Date) => {
    analytics.event({ action: 'select_date', category: 'Funnel', label: date.toISOString() })
  },

  // Step 3: Selected time
  selectTime: (time: string) => {
    analytics.event({ action: 'select_time', category: 'Funnel', label: time })
  },

  // Step 4: Filled form
  fillForm: () => {
    analytics.event({ action: 'fill_form', category: 'Funnel' })
  },

  // Step 5: Initiated checkout
  initiateCheckout: (amount: number) => {
    analytics.event({ action: 'initiate_checkout', category: 'Funnel', value: amount })
    fbPixel.trackInitiateCheckout()
  },

  // Step 6: Completed booking
  completeBooking: (bookingData: any) => {
    analytics.trackBookingCompleted(bookingData)
    fbPixel.trackPurchase(bookingData.totalAmount / 100)
    gtm.trackBooking(bookingData)
  },

  // Abandonment tracking
  abandonBooking: (step: string) => {
    analytics.event({ action: 'abandon_booking', category: 'Funnel', label: step })
  }
}
```

### 6.2 Video Engagement Tracking
```typescript
// Track video interactions
export const trackVideo = {
  play: (videoTitle: string) => {
    analytics.trackVideoPlay(videoTitle)
    fbPixel.trackCustomEvent('VideoPlay', { video_title: videoTitle })
  },

  progress: (videoTitle: string, percent: number) => {
    if ([25, 50, 75, 100].includes(percent)) {
      analytics.event({
        action: 'video_progress',
        category: 'Engagement',
        label: `${videoTitle} - ${percent}%`,
      })
    }
  },

  complete: (videoTitle: string) => {
    analytics.event({
      action: 'video_complete',
      category: 'Engagement',
      label: videoTitle,
    })
  }
}
```

### 6.3 Lead Form Tracking
```typescript
// Track lead generation forms
export const trackLeadForm = {
  view: (formName: string) => {
    analytics.event({ action: 'view_form', category: 'Lead Gen', label: formName })
  },

  startFill: (formName: string) => {
    analytics.event({ action: 'start_form', category: 'Lead Gen', label: formName })
  },

  submit: (formName: string) => {
    analytics.trackLeadSubmitted(formName)
    fbPixel.trackLead()
    gtm.trackFormSubmission(formName)
  },

  error: (formName: string, errorType: string) => {
    analytics.event({
      action: 'form_error',
      category: 'Lead Gen',
      label: `${formName} - ${errorType}`,
    })
  }
}
```

## Phase 7: Conversion Tracking Setup

### 7.1 Create Custom Conversions
**In Facebook Ads Manager:**
1. Go to Events Manager → Aggregated Event Measurement
2. Set conversion priority:
   - Priority 1: Purchase (Booking)
   - Priority 2: Lead (Contact Form)
   - Priority 3: InitiateCheckout
   - Priority 4: ViewContent (Pricing)

**In Google Analytics:**
1. Go to Configure → Events
2. Mark as conversions:
   - `booking_completed`
   - `lead_submitted`
   - `email_captured`
   - `phone_clicked`

### 7.2 Set Up Goals in GA4
```typescript
// Custom goal tracking
export const trackGoal = (goalName: string, value?: number) => {
  analytics.event({
    action: 'goal_completed',
    category: 'Goals',
    label: goalName,
    value: value,
  })
}

// Pre-defined goals
export const goals = {
  booking: () => trackGoal('booking', 1),
  lead: () => trackGoal('lead', 1),
  emailSignup: () => trackGoal('email_signup', 1),
  phoneCall: () => trackGoal('phone_call', 1),
  videoWatch: () => trackGoal('video_watch', 1),
}
```

## Phase 8: Attribution & UTM Tracking

### 8.1 Capture UTM Parameters
```typescript
// lib/utm-tracking.ts
export const captureUTMParams = () => {
  if (typeof window === 'undefined') return null

  const urlParams = new URLSearchParams(window.location.search)

  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content'),
  }
}

// Store in localStorage for session tracking
export const storeAttribution = () => {
  const utm = captureUTMParams()
  if (utm.utm_source) {
    localStorage.setItem('attribution', JSON.stringify(utm))
  }
}

// Retrieve for conversion tracking
export const getAttribution = () => {
  const stored = localStorage.getItem('attribution')
  return stored ? JSON.parse(stored) : null
}
```

### 8.2 Track Attribution in Bookings
```typescript
// When booking is completed
const handleBookingComplete = async (bookingData: any) => {
  const attribution = getAttribution()

  await supabase.from('bookings').insert({
    ...bookingData,
    utm_source: attribution?.utm_source,
    utm_medium: attribution?.utm_medium,
    utm_campaign: attribution?.utm_campaign,
    utm_term: attribution?.utm_term,
    utm_content: attribution?.utm_content,
  })
}
```

## Phase 9: Performance Monitoring

### 9.1 Core Web Vitals Tracking
```typescript
// lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }
}

export function reportWebVitals() {
  getCLS(sendToAnalytics)
  getFID(sendToAnalytics)
  getFCP(sendToAnalytics)
  getLCP(sendToAnalytics)
  getTTFB(sendToAnalytics)
}
```

```typescript
// app/layout.tsx
'use client'

import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/web-vitals'

export default function RootLayout({ children }) {
  useEffect(() => {
    reportWebVitals()
  }, [])

  return (
    // ... layout
  )
}
```

## Environment Variables Required

```env
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=1234567890123456
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_CLARITY_ID=abcdefghij
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=1234567
NEXT_PUBLIC_TIKTOK_PIXEL_ID=ABCDEFGHIJ12345
```

## Testing & Validation

### Verify Installation:
1. **Facebook Pixel Helper** (Chrome extension)
2. **Google Tag Assistant** (Chrome extension)
3. **GA Debugger** (Chrome extension)
4. **Microsoft Clarity Dashboard**

### Test Conversions:
- Make test booking
- Submit test lead form
- Click phone number
- Watch video
- Check all platforms receive events

## Monthly Analytics Report Template

```typescript
// Generate monthly report
export const generateMonthlyReport = async () => {
  return {
    traffic: {
      total: 5000,
      organic: 2000,
      direct: 1500,
      social: 1000,
      paid: 500,
    },
    conversions: {
      bookings: 50,
      leads: 250,
      emailSignups: 100,
      phoneCalls: 30,
    },
    revenue: {
      total: 12500,
      averageBooking: 250,
    },
    engagement: {
      avgSessionDuration: '3m 45s',
      bounceRate: '45%',
      pagesPerSession: 4.2,
    },
    topPages: [
      { path: '/music', views: 1200 },
      { path: '/', views: 1000 },
      { path: '/media', views: 800 },
    ],
    topSources: [
      { source: 'google / organic', sessions: 2000 },
      { source: 'instagram', sessions: 600 },
      { source: 'facebook', sessions: 400 },
    ],
  }
}
```

## Resources
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Facebook Pixel Documentation](https://developers.facebook.com/docs/meta-pixel/)
- [Google Tag Manager Guide](https://developers.google.com/tag-manager)
- [Microsoft Clarity](https://clarity.microsoft.com/)
