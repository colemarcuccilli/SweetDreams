# Analytics & Tracking Agent

## Mission
Implement comprehensive analytics and tracking across the Sweet Dreams website to measure performance, user behavior, conversion funnels, and business KPIs using Google Analytics 4, Vercel Analytics, Supabase, and Stripe reporting.

## Context
- **Business Goals**: Track bookings, lead generation, video views, user engagement
- **Key Conversions**: Studio bookings, contact form submissions, payment completions
- **Important Funnels**: Booking flow, contact forms, service discovery

## Tech Stack
- **Google Workspace**: Full access (Google Analytics 4, Tag Manager, Search Console)
- **Vercel**: Analytics, Web Vitals, deployment tracking
- **Supabase**: Database events, user tracking
- **Stripe**: Payment analytics, booking revenue
- **Next.js 14+**: App Router with built-in analytics support

## Primary Tasks

### 1. Google Analytics 4 Setup

**Implementation:**
```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

**Create .env.local:**
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Track Custom Events:**
```typescript
// lib/analytics.ts
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Usage examples:
trackEvent('booking_started', {
  package: 'Basic Package',
  service: 'Recording',
});

trackEvent('video_play', {
  video_title: 'Project Name',
  client: 'Client Name',
});

trackEvent('form_submit', {
  form_type: 'contact',
  page: '/media',
});
```

**Key Events to Track:**

1. **Booking Funnel**
   - `booking_view` - User views booking calendar
   - `booking_started` - User selects date/time
   - `booking_package_selected` - Package chosen
   - `booking_deposit_initiated` - Payment flow started
   - `booking_completed` - Successful booking

2. **Video Engagement**
   - `video_play` - Video started
   - `video_pause` - Video paused
   - `video_complete` - Video watched to end
   - `portfolio_item_clicked` - Project clicked

3. **Form Interactions**
   - `form_started` - User focuses on form
   - `form_field_completed` - Important field filled
   - `form_submitted` - Form submission
   - `form_error` - Form validation error

4. **Navigation**
   - `page_view` - Automatic
   - `cta_clicked` - Any CTA button
   - `nav_link_clicked` - Navigation interactions
   - `service_card_clicked` - Service selection

5. **E-commerce (Stripe)**
   - `begin_checkout` - Booking payment started
   - `purchase` - Payment completed
   - `add_payment_info` - Payment details entered

### 2. Google Tag Manager Integration

**Setup GTM Container:**
```typescript
// app/layout.tsx - Add to <head>
<Script id="gtm-script" strategy="afterInteractive">
  {`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-XXXXXX');
  `}
</Script>

// Add to <body>
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
```

**DataLayer Events:**
```typescript
export const pushToDataLayer = (event: any) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
  }
};

// Example:
pushToDataLayer({
  event: 'booking_completed',
  booking_value: 150,
  booking_type: 'Standard Package',
  transaction_id: 'booking_123',
});
```

### 3. Vercel Analytics Setup

**Install:**
```bash
npm install @vercel/analytics
```

**Implementation:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Custom Events:**
```typescript
import { track } from '@vercel/analytics';

// Track custom events
track('BookingStarted', { package: 'Premium' });
track('VideoPlayed', { projectId: 'abc123' });
```

**Metrics to Monitor:**
- Page views by route
- Unique visitors
- Bounce rate by page
- Average session duration
- Core Web Vitals (LCP, FID, CLS)
- Conversion rates

### 4. Supabase Analytics & Tracking

**Event Tracking Table:**
```sql
-- Create events table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  event_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for queries
CREATE INDEX idx_events_name ON analytics_events(event_name);
CREATE INDEX idx_events_created ON analytics_events(created_at DESC);
CREATE INDEX idx_events_user ON analytics_events(user_id);
```

**Track Events:**
```typescript
// lib/supabaseAnalytics.ts
export async function trackEvent(
  eventName: string,
  eventData?: Record<string, any>
) {
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from('analytics_events').insert({
    event_name: eventName,
    event_data: eventData,
    user_id: user?.id,
    page_url: window.location.href,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
  });
}
```

**Booking Funnel Tracking:**
```sql
-- View: Booking funnel drop-off
CREATE VIEW booking_funnel AS
SELECT
  COUNT(CASE WHEN event_name = 'booking_view' THEN 1 END) as views,
  COUNT(CASE WHEN event_name = 'booking_started' THEN 1 END) as started,
  COUNT(CASE WHEN event_name = 'booking_deposit_initiated' THEN 1 END) as initiated,
  COUNT(CASE WHEN event_name = 'booking_completed' THEN 1 END) as completed
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days';
```

### 5. Stripe Analytics Integration

**Webhook Event Tracking:**
```typescript
// app/api/webhooks/stripe/route.ts
const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

switch (event.type) {
  case 'checkout.session.completed':
    // Track successful booking
    await trackEvent('booking_completed', {
      amount: event.data.object.amount_total,
      currency: event.data.object.currency,
      customer: event.data.object.customer,
    });
    break;

  case 'payment_intent.payment_failed':
    // Track failed payments
    await trackEvent('payment_failed', {
      error: event.data.object.last_payment_error?.message,
    });
    break;
}
```

**Revenue Tracking:**
```typescript
// Track in GA4
trackEvent('purchase', {
  transaction_id: session.id,
  value: session.amount_total / 100,
  currency: session.currency,
  items: [{
    item_id: booking.id,
    item_name: booking.service_package,
    price: session.amount_total / 100,
  }],
});
```

### 6. Conversion Funnels

**Define Key Funnels:**

**Funnel 1: Music Booking**
1. Land on /music
2. Click "Book a Session"
3. Select date/time
4. Choose package
5. Enter details
6. Pay deposit
7. Confirmation

**Funnel 2: Media Inquiry**
1. Land on /media
2. View portfolio
3. Click "Get in Touch"
4. Fill form
5. Submit

**Funnel 3: Video Engagement**
1. View portfolio grid
2. Click project
3. Play video
4. Watch >50%
5. Click CTA

**Implementation:**
```typescript
// Track funnel steps
export const trackFunnelStep = (
  funnelName: string,
  stepNumber: number,
  stepName: string,
  metadata?: Record<string, any>
) => {
  trackEvent('funnel_step', {
    funnel_name: funnelName,
    step_number: stepNumber,
    step_name: stepName,
    ...metadata,
  });
};

// Usage:
trackFunnelStep('music_booking', 1, 'view_calendar');
trackFunnelStep('music_booking', 2, 'select_date', { date: selectedDate });
trackFunnelStep('music_booking', 3, 'choose_package', { package: 'Standard' });
```

### 7. Heatmaps & Session Recording

**Microsoft Clarity (Free, Good Alternative to Hotjar):**
```typescript
// app/layout.tsx
<Script id="clarity-script" strategy="afterInteractive">
  {`
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "YOUR_PROJECT_ID");
  `}
</Script>
```

**Track User Interactions:**
- Click patterns
- Scroll depth
- Form abandonment
- Rage clicks
- Dead clicks

### 8. Performance Monitoring

**Create Performance Dashboard:**
```sql
-- Page load times
CREATE TABLE page_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_url TEXT,
  lcp NUMERIC,
  fid NUMERIC,
  cls NUMERIC,
  ttfb NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Track Web Vitals:**
```typescript
// app/layout.tsx
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Send to analytics
    trackEvent('web_vitals', {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_id: metric.id,
    });

    // Send to Supabase
    supabase.from('page_performance').insert({
      page_url: window.location.pathname,
      [metric.name.toLowerCase()]: metric.value,
    });
  });

  return null;
}
```

### 9. Custom Dashboards

**Google Analytics 4 Custom Reports:**
1. **Booking Performance**
   - Booking conversion rate
   - Average booking value
   - Popular packages
   - Booking by day/time

2. **Content Engagement**
   - Most viewed projects
   - Video completion rates
   - Average time on page
   - Portfolio click-through rate

3. **Lead Generation**
   - Form submissions by source
   - Lead quality scores
   - Conversion by service type

4. **Traffic Sources**
   - Organic search keywords
   - Referral sources
   - Social media performance
   - Direct vs referral traffic

**Vercel Analytics Dashboard:**
- Top pages by views
- Real-time visitors
- Geographic distribution
- Device breakdown
- Conversion rates by page

### 10. Alert Configuration

**Set Up Alerts for:**
- Traffic drop >30% week-over-week
- Conversion rate drop >20%
- Page load time >3 seconds
- Error rate spike
- Form abandonment >70%
- Booking drop-off at any funnel stage

**Implementation:**
```typescript
// lib/alerts.ts
export async function checkAndAlert() {
  const metrics = await getWeeklyMetrics();

  if (metrics.conversionRate < 0.02) { // <2%
    await sendAlert('Low Conversion Rate', metrics);
  }

  if (metrics.avgLoadTime > 3000) { // >3s
    await sendAlert('Slow Page Load', metrics);
  }
}
```

### 11. A/B Testing Setup

**Vercel Edge Config + Middleware:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const bucket = Math.random() < 0.5 ? 'A' : 'B';
  const response = NextResponse.next();
  response.cookies.set('ab-test-bucket', bucket);
  return response;
}

// Track variant
trackEvent('ab_test_view', {
  test_name: 'booking_button_text',
  variant: bucket,
});
```

## Implementation Checklist

### Phase 1: Foundation
- [ ] Install all analytics packages
- [ ] Set up Google Analytics 4 property
- [ ] Configure Google Tag Manager
- [ ] Install Vercel Analytics
- [ ] Create Supabase tracking tables
- [ ] Set up environment variables

### Phase 2: Event Tracking
- [ ] Implement trackEvent utility
- [ ] Add page view tracking
- [ ] Add booking funnel events
- [ ] Add form interaction events
- [ ] Add video engagement events
- [ ] Add navigation tracking

### Phase 3: Conversion Tracking
- [ ] Set up e-commerce tracking
- [ ] Configure conversion goals in GA4
- [ ] Track Stripe webhooks
- [ ] Implement funnel visualization
- [ ] Set up revenue tracking

### Phase 4: Advanced Features
- [ ] Add Microsoft Clarity
- [ ] Set up Web Vitals tracking
- [ ] Create custom dashboards
- [ ] Configure alerts
- [ ] Test A/B testing framework

### Phase 5: Validation
- [ ] Test all event tracking
- [ ] Verify data in GA4
- [ ] Check Vercel Analytics
- [ ] Validate Supabase data
- [ ] Review Stripe reports

## Tools Required

**Free Tools:**
- Google Analytics 4
- Google Search Console
- Google Tag Manager
- Vercel Analytics (included)
- Microsoft Clarity
- Stripe Dashboard

**Optional Paid Tools:**
- Hotjar (heatmaps, recordings)
- Mixpanel (product analytics)
- Amplitude (user journey)

## Success Metrics

- All key events tracking correctly
- Funnel drop-off rates identified
- Real-time dashboard operational
- Conversion goals configured
- Alerts triggering appropriately
- Data flowing to all platforms
- Zero tracking errors in console

## Reporting Schedule

**Daily:**
- Real-time visitor count
- Today's bookings
- Active sessions

**Weekly:**
- Traffic sources breakdown
- Top performing content
- Conversion rates
- Funnel analysis

**Monthly:**
- Revenue by service
- Customer acquisition cost
- Lifetime value trends
- Content performance review
