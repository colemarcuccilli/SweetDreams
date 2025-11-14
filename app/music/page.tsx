import type { Metadata } from "next";
import Link from "next/link";
import styles from "./music.module.css";
import MusicHeroAnimated from "@/components/music/MusicHeroAnimated";
import ServicesAnimated from "@/components/music/ServicesAnimated";
import PackagesAnimated from "@/components/music/PackagesAnimated";
import TestimonialsAnimated from "@/components/music/TestimonialsAnimated";
import LocationInfoAnimated from "@/components/music/LocationInfoAnimated";
import PricingListAnimated from "@/components/music/PricingListAnimated";
import BookingCalendarWrapper from "@/components/music/BookingCalendarWrapper";
import MusicContactForm from "@/components/music/MusicContactForm";

export const metadata: Metadata = {
  title: "Studio Recording & Booking | Sweet Dreams Fort Wayne - $50/HR",
  description: "Professional recording studio in Fort Wayne, IN. Book your session starting at $50/hour. Music production, mixing, and mastering services. Holiday Special: 3 Hours for $100 (regularly $150)!",
  keywords: "Fort Wayne recording studio, book studio session, music production Fort Wayne, studio rental, professional recording, recording studio near me, mixing and mastering, studio booking Fort Wayne",
  alternates: {
    canonical: 'https://sweetdreamsmusic.com/music',
  },
  openGraph: {
    title: "Studio Booking | Sweet Dreams Fort Wayne",
    description: "Book your recording session at Fort Wayne's premier music studio. $50/hour starting rate. Holiday Special: 3 Hours for $100 (regularly $150).",
    url: "https://sweetdreamsmusic.com/music",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Booking | Sweet Dreams Fort Wayne",
    description: "Book your recording session. $50/hour. Holiday Special: 3 Hours for $100!",
  },
  other: {
    'geo.region': 'US-IN',
    'geo.placename': 'Fort Wayne',
  },
};

export default function MusicPage() {
  return (
    <div className={styles.page}>
      {/* Promo Banner */}
      <div className={styles.promoBanner}>
        <span className={styles.promoText}>
          <strong>Holiday Special! </strong>Book 3 Hours for $100 (regularly $150) - Limited Time! &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Holiday Special! </strong>Book 3 Hours for $100 (regularly $150) - Limited Time! &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Holiday Special! </strong>Book 3 Hours for $100 (regularly $150) - Limited Time! &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Holiday Special! </strong>Book 3 Hours for $100 (regularly $150) - Limited Time! &nbsp;&nbsp;|&nbsp;&nbsp;
        </span>
      </div>

      {/* Animated Hero Section */}
      <MusicHeroAnimated />

      {/* Services Grid - Black */}
      <ServicesAnimated />

      {/* Packages - White */}
      <section className={styles.pricing}>
        <div className={styles.container}>
          {/* Video Showcase */}
          <Link href="/work/sweet-dreams-recording-studio" className={styles.showcaseLink}>
            <div className={styles.showcaseBox}>
              <iframe
                src="https://customer-w6h9o08eg118alny.cloudflarestream.com/d912b8bd58831e95431db3c24791e44b/iframe?muted=true&autoplay=true&loop=true&controls=false"
                className={styles.showcaseVideo}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              />

              <div className={styles.showcaseOverlay}></div>

              <div className={styles.showcaseContent}>
                <div className={styles.showcaseTopRow}>
                  <div className={styles.showcaseClient}>SWEET DREAMS MUSIC</div>
                  <div className={styles.showcaseViewButton}>
                    <span className={styles.showcaseViewButtonText}>VIEW PROJECT</span>
                  </div>
                </div>

                <div className={styles.showcaseCenterTitle}>
                  <div>
                    <div className={styles.showcaseTitleText}>SEE HOW</div>
                    <div className={styles.showcaseTitleText}>WE WORK</div>
                  </div>
                </div>

                <div className={styles.showcaseBottomRow}>
                  <div className={styles.showcaseSubtitle}>BEHIND THE SCENES</div>
                </div>
              </div>
            </div>
          </Link>

          <PackagesAnimated />
        </div>
      </section>

      {/* Pricing - Black */}
      <section className={styles.packages}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>PRICING</p>
          <h2 className={styles.sectionTitle}>OUR RATES</h2>
          <p className={styles.sectionSubtitle}>Explore our competitive rates for recording sessions</p>

          <div className={styles.pricingContent}>
            <PricingListAnimated />

            <div className={styles.pricingImage}>
              <img
                src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/DSC00040%20(1).webp"
                alt="Sweet Dreams Studio"
                className={styles.studioImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section - White */}
      <section className={styles.bookingSection} id="booking">
        <div className={styles.container}>
          <p className={styles.miniTitle}>GET STARTED</p>
          <h2 className={styles.sectionTitle}>BOOK YOUR SESSION</h2>
          <p className={styles.sectionSubtitle}>Select your date, time, and session duration to get started</p>

          <BookingCalendarWrapper />

          <p className={styles.note}>
            <strong>Holiday Special!</strong> Book <strong>3 Hours for $100</strong> (regularly $150) - Limited Time Offer!
          </p>
        </div>
      </section>

      {/* Testimonials - Black */}
      <TestimonialsAnimated />

      {/* Studio Hours - Black */}
      <section className={styles.hoursBlack}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>AVAILABILITY</p>
          <h2 className={styles.sectionTitle}>STUDIO HOURS</h2>

          <div className={styles.hoursContent}>
            <div className={styles.hoursBlock}>
              <h3 className={styles.hoursLabel}>REGULAR HOURS</h3>
              <p className={styles.hoursText}>Monday - Sunday: 9:00 AM - 9:00 PM</p>
              <p className={styles.hoursText}>Open 7 Days a Week!</p>
            </div>

            <div className={`${styles.hoursBlock} ${styles.hoursBlockHighlight}`}>
              <h3 className={styles.hoursLabel}>AFTER HOURS <span className={styles.feeTag}>+$10/hr</span></h3>
              <p className={styles.hoursText}>Available Daily: 9:00 PM - 3:00 AM</p>
              <p className={styles.hoursText}>Late night sessions available every day!</p>
            </div>
          </div>

          <p className={styles.note}>Note: After 9 PM sessions include a $10/hr additional fee. Same-day bookings also include a $10/hr fee.</p>
        </div>
      </section>

      {/* Contact Form - White */}
      <MusicContactForm />

      {/* Location & Important Info - Black */}
      <LocationInfoAnimated />
    </div>
  );
}