import Link from "next/link";
import styles from "./music.module.css";

export default function MusicPage() {
  return (
    <div className={styles.page}>
      {/* Hero Section - Black */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            DEVELOP YOUR<br />
            BRAND, YOUR WAY
          </h1>
          <p className={styles.heroSubtitle}>
            From beats to mixing, recording to video, we help you shape your music and brand. Let's make it happen together.
          </p>
          <Link href="#booking" className={styles.heroButton}>
            BOOK A SESSION
          </Link>
        </div>
      </section>

      {/* Video Showcase - White with curved top */}
      <Link href="/work/sweet-dreams-studio" className={styles.showcaseLink}>
        <section className={styles.showcase}>
          <div className={styles.showcaseContainer}>
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
          </div>
        </section>
      </Link>

      {/* Services Grid - Black */}
      <section className={styles.services}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>SERVICES</p>
          <h2 className={styles.sectionTitle}>WHAT WE OFFER</h2>

          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>BEATS</h3>
              <p className={styles.serviceDescription}>Original beats for any genre to elevate your sound.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>VIDEOGRAPHY</h3>
              <p className={styles.serviceDescription}>Professional music videos, social media content, and more.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>RECORDING</h3>
              <p className={styles.serviceDescription}>High-quality recording sessions to capture your best sound.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>MIXING & MASTERING</h3>
              <p className={styles.serviceDescription}>Get a polished, professional sound with our expert mastering.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - White */}
      <section className={styles.pricing}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>PRICING</p>
          <h2 className={styles.sectionTitle}>OUR RATES</h2>
          <p className={styles.sectionSubtitle}>Explore our competitive rates for recording sessions</p>

          <div className={styles.pricingList}>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>1 Hour Session</span>
              <span className={styles.priceDots}></span>
              <span className={styles.priceValue}>$60/hr</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>2+ Hours</span>
              <span className={styles.priceDots}></span>
              <span className={styles.priceValue}>$50/hr</span>
            </div>
            <div className={`${styles.priceRow} ${styles.priceHighlight}`}>
              <span className={styles.priceLabel}>Sweet Spot (4 Hours)</span>
              <span className={styles.priceDots}></span>
              <span className={styles.priceValue}>$180</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>After 9 PM Fee</span>
              <span className={styles.priceDots}></span>
              <span className={styles.priceValue}>+$10/hr</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Same Day Booking</span>
              <span className={styles.priceDots}></span>
              <span className={styles.priceValue}>+$10/hr</span>
            </div>
          </div>

          <p className={styles.disclaimer}>*All prices are subject to change. Additional fees are applied on top of base hourly rates.</p>
        </div>
      </section>

      {/* Packages - Black */}
      <section className={styles.packages}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>PACKAGES</p>
          <h2 className={styles.sectionTitle}>SERVICE PACKAGES</h2>
          <p className={styles.sectionSubtitle}>Choose the perfect package to fit your music production needs</p>

          <div className={styles.packagesGrid}>
            {/* Basic Package */}
            <div className={styles.packageCard}>
              <h3 className={styles.packageTitle}>BASIC PACKAGE</h3>
              <ul className={styles.packageFeatures}>
                <li>3 Hour Session</li>
                <li>Full Mix & Masters</li>
                <li>1 Short Form Video</li>
                <li>Stream Platform Guidance</li>
              </ul>
              <div className={styles.packageAddons}>
                <h4>Available Add-ons</h4>
                <p>Music Videos • Web Development • Long/Short Form Videos • Photoshoots</p>
              </div>
            </div>

            {/* Standard Package */}
            <div className={`${styles.packageCard} ${styles.packagePopular}`}>
              <div className={styles.popularBadge}>MOST POPULAR</div>
              <h3 className={styles.packageTitle}>STANDARD PACKAGE</h3>
              <ul className={styles.packageFeatures}>
                <li>10 Studio Hours</li>
                <li>Full Mix & Masters</li>
                <li>3 Short Form Videos</li>
                <li>Photoshoot (60 mins)</li>
                <li>Social Content Plan</li>
                <li>Spotify Canvas</li>
              </ul>
              <div className={styles.packageAddons}>
                <h4>Discounted Add-ons</h4>
                <p>Music Videos • Web Development 25% OFF • Short Form Videos 15% OFF • Studio Hours 25% OFF • Photoshoots 25% OFF</p>
              </div>
            </div>

            {/* Premium Package */}
            <div className={styles.packageCard}>
              <h3 className={styles.packageTitle}>PREMIUM PACKAGE</h3>
              <ul className={styles.packageFeatures}>
                <li>20 Studio Hours</li>
                <li>Full Mix & Masters</li>
                <li>5 Short Form Videos</li>
                <li>2 Photoshoots (60 mins)</li>
                <li>Social Content Plan</li>
                <li>Basic Website Package</li>
              </ul>
              <div className={styles.packageAddons}>
                <h4>Discounted Add-ons</h4>
                <p>Instrumentals 50% OFF • Music Videos 12% OFF • Web Development 30% OFF • Short Form Videos 25% OFF • Studio Hours 30% OFF • Photoshoots 30% OFF</p>
              </div>
            </div>
          </div>

          <p className={styles.disclaimer}>*Additional charges may apply. All packages subject to availability.</p>
        </div>
      </section>

      {/* Studio Hours - White */}
      <section className={styles.hours}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>AVAILABILITY</p>
          <h2 className={styles.sectionTitle}>STUDIO HOURS</h2>

          <div className={styles.hoursContent}>
            <div className={styles.hoursBlock}>
              <h3 className={styles.hoursLabel}>REGULAR HOURS</h3>
              <p className={styles.hoursText}>Monday - Thursday: 9:00 AM - 8:59 PM</p>
              <p className={styles.hoursText}>Saturday: Closed</p>
              <p className={styles.hoursText}>Sunday: Closed</p>
            </div>

            <div className={styles.hoursBlock}>
              <h3 className={styles.hoursLabel}>AFTER HOURS <span className={styles.feeTag}>+$10/hr</span></h3>
              <p className={styles.hoursText}>Monday - Friday: 9:00 PM - 2:00 AM</p>
              <p className={styles.hoursText}>Saturday: 11:00 AM - 3:00 AM</p>
              <p className={styles.hoursText}>Sunday: 11:00 AM - 3:00 AM</p>
            </div>
          </div>

          <p className={styles.note}>Note: After 9 PM sessions include a $10/hr additional fee. Same-day bookings also include a $10/hr fee.</p>
        </div>
      </section>

      {/* Testimonials - Black */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>TESTIMONIALS</p>
          <h2 className={styles.sectionTitle}>WHAT CLIENTS SAY</h2>

          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>
                "Jay is the complete producer. His musical knowledge is vast, and his versatility with beats and instruments makes him the right choice for any project. You'll get a producer who truly cares about the music."
              </p>
              <p className={styles.testimonialAuthor}>— anonymous, Artist</p>
            </div>

            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>
                "I call Jay the 'Delay King'—his mix and mastering skills are next level. He'll have you sounding right and get your file to you fast, always open to your input and adjustments to match your style."
              </p>
              <p className={styles.testimonialAuthor}>— Chicago, Producer</p>
            </div>

            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>
                "Working with Jay and Sweet Dreams is an incredible experience. He's part of a talented community and brings positive energy to every session, making sure you leave better than you came in."
              </p>
              <p className={styles.testimonialAuthor}>— anonymous, Musician</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA - White */}
      <section className={styles.bookingCTA} id="booking">
        <div className={styles.container}>
          <p className={styles.miniTitle}>GET STARTED</p>
          <h2 className={styles.ctaTitle}>BOOK YOUR FIRST SESSION 20% OFF!</h2>
          <Link href="/booking" className={styles.ctaButton}>
            BOOK SESSION
          </Link>
          <p className={styles.ctaNote}>Note: Let your producer know it's your first time when you arrive.</p>
        </div>
      </section>

      {/* Location & Important Info - Black */}
      <section className={styles.locationInfo}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>LOCATION</p>
          <h2 className={styles.sectionTitle}>FIND US IN FORT WAYNE</h2>
          <p className={styles.locationText}>
            Sweet Dreams Music Studio is located at 3943 Parnell Ave, Fort Wayne, IN 46805. We're easily accessible and offer on-site parking.
          </p>

          <div className={styles.divider}></div>

          <h2 className={styles.sectionTitle}>IMPORTANT INFORMATION</h2>
          <p className={styles.infoText}>
            All prices listed are base rates and may vary depending on the specific needs and outcomes of each session. Additional charges may apply for extended or customized services, group sessions, or if multiple individuals are recording their own songs within the same session.
          </p>
          <p className={styles.infoText}>
            We require that all individuals attending the session be pre-approved, especially if extra people are requested. Please provide information on relationships, as additional people may be subject to approval and may incur extra charges.
          </p>
        </div>
      </section>
    </div>
  );
}