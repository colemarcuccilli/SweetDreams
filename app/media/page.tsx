"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "./media.module.css";

export default function MediaPage() {
  useEffect(() => {
    const handleScroll = () => {
      const title = document.getElementById('scrolling-title');
      const section = document.getElementById('value-section');
      if (title && section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionMiddle = sectionTop + (sectionHeight / 2);
        const scrolled = window.pageYOffset + (window.innerHeight / 2);
        const offset = scrolled - sectionMiddle;
        title.style.transform = `translateX(${-offset * 1}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero Section - White */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <p className={styles.miniTitle}>SWEET DREAMS MEDIA</p>
          <h1 className={styles.heroTitle}>
            YOUR VISION,<br />
            AMPLIFIED
          </h1>
          <p className={styles.heroSubtitle}>
            Professional video production and content creation that brings your brand to life.
          </p>
          <Link href="#contact" className={styles.heroButton}>
            DISCUSS YOUR VISION
          </Link>
        </div>
      </section>

      {/* Why Choose Us - Black */}
      <section className={styles.why}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>WHY SWEET DREAMS</p>
          <h2 className={styles.sectionTitle}>WHAT SETS US APART</h2>

          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <h3 className={styles.whyTitle}>FAST TURNAROUND</h3>
              <p className={styles.whyDescription}>
                We respond to all inquiries within 24 hours and deliver projects on time, every time. No endless waiting.
              </p>
            </div>
            <div className={styles.whyCard}>
              <h3 className={styles.whyTitle}>FULL-SERVICE PRODUCTION</h3>
              <p className={styles.whyDescription}>
                From concept to final edit, we handle everything. Music, videography, editing, color grading—all in-house.
              </p>
            </div>
            <div className={styles.whyCard}>
              <h3 className={styles.whyTitle}>CLIENT-FOCUSED APPROACH</h3>
              <p className={styles.whyDescription}>
                Your vision matters. We work closely with you at every step to ensure the final product exceeds expectations.
              </p>
            </div>
            <div className={styles.whyCard}>
              <h3 className={styles.whyTitle}>PROFESSIONAL QUALITY</h3>
              <p className={styles.whyDescription}>
                Cinema-grade cameras, professional audio, expert color grading. We don't compromise on quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services - White */}
      <section className={styles.services}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>SERVICES</p>
          <h2 className={styles.sectionTitle}>OUR SOLUTIONS</h2>

          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>BRAND FILMS</h3>
              <p className={styles.serviceDescription}>
                Cinematic storytelling that captures your brand's essence and connects with your audience.
              </p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>COMMERCIALS</h3>
              <p className={styles.serviceDescription}>
                High-impact commercials designed to convert viewers into customers.
              </p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>EVENT COVERAGE</h3>
              <p className={styles.serviceDescription}>
                Professional event documentation that preserves your most important moments.
              </p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>CORPORATE CONTENT</h3>
              <p className={styles.serviceDescription}>
                From training videos to internal communications, we help your business communicate effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Showcase - Black */}
      <section className={styles.clients}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>TRUSTED BY</p>
          <h2 className={styles.sectionTitle}>OUR CLIENTS</h2>

          <div className={styles.clientsGrid}>
            <div className={styles.clientCard}>Fort Wayne Vintage</div>
            <div className={styles.clientCard}>Ride Worx</div>
            <div className={styles.clientCard}>Children's Museum</div>
            <div className={styles.clientCard}>Brookfield Zoo</div>
            <div className={styles.clientCard}>Aegis Dental</div>
            <div className={styles.clientCard}>Kissel Entertainment</div>
          </div>
        </div>
      </section>

      {/* Value Proposition - White */}
      <section className={styles.value} id="value-section">
        <h2 className={styles.valueTitle} id="scrolling-title">
          WE BUILD VALUE, BEYOND VIDEO.
        </h2>
        <div className={styles.container}>
          <p className={styles.valueSubtitle}>
            Professional content that amplifies your message and gets you noticed. No shortcuts, no compromises.
          </p>
        </div>
      </section>

      {/* Complete Portfolio - Black */}
      <section className={styles.projectList}>
        <div className={styles.container}>
          <p className={styles.miniTitle}>ALL WORK</p>
          <h2 className={styles.sectionTitle}>COMPLETE PORTFOLIO</h2>

          <div className={styles.portfolioGrid}>
            {/* Published Projects */}
            <Link href="/work/knoxville-carnival-coverage" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://customer-w6h9o08eg118alny.cloudflarestream.com/d554360a479b1380f96df7a4ef8f03a3/thumbnails/thumbnail.jpg?time=1s&height=600"
                  alt="Knoxville Carnival"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>KISSEL ENTERTAINMENT COMMERCIAL & MORE</h3>
                <p className={styles.portfolioClient}>Kissel Entertainment</p>
              </div>
            </Link>

            <Link href="/work/indianapolis-childrens-museum-ferris-wheel" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://videodelivery.net/7a243650c649bdcf4369622acd47abf6/thumbnails/thumbnail.jpg?time=1s&height=600"
                  alt="Indianapolis Children's Museum"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>INDIANAPOLIS CHILDREN'S MUSEUM FERRIS WHEEL</h3>
                <p className={styles.portfolioClient}>Indianapolis Children's Museum</p>
              </div>
            </Link>

            <Link href="/work/brookfield-zoo-ferris-wheel" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://videodelivery.net/b3b94bd1543e2452571b90aab0a38e9b/thumbnails/thumbnail.jpg?time=1s&height=600"
                  alt="Brookfield Zoo Ferris Wheel"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>BROOKFIELD ZOO FERRIS WHEEL</h3>
                <p className={styles.portfolioClient}>RideWorx & Brookfield Zoo</p>
              </div>
            </Link>

            <Link href="/work/fort-wayne-hyperlapse-showcase" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://customer-w6h9o08eg118alny.cloudflarestream.com/a507a5b8a369b70b7332c0567cbbcc4c/thumbnails/thumbnail.jpg?time=5s&height=600"
                  alt="Fort Wayne Hyperlapse"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>FORT WAYNE HYPERLAPSE CITY SHOWCASE</h3>
                <p className={styles.portfolioClient}>Sweet Dreams Media</p>
              </div>
            </Link>

            <Link href="/work/wake-up-blind-music-video" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://videodelivery.net/9db7601df93c3b1634ac41ad715aa9c6/thumbnails/thumbnail.jpg?time=1s&height=600"
                  alt="Wake Up Blind Music Video"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>WAKE UP BLIND MUSIC VIDEO</h3>
                <p className={styles.portfolioClient}>Jay Val Leo</p>
              </div>
            </Link>

            <Link href="/work/aegis-dental-trusted-dentistry" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://videodelivery.net/089a5f4bac2141b90d9583820ee2b6cb/thumbnails/thumbnail.jpg?time=1s&height=600"
                  alt="Aegis Dental"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>AEGIS DENTAL - TRUSTED DENTISTRY</h3>
                <p className={styles.portfolioClient}>Aegis Dental Group</p>
              </div>
            </Link>

            <Link href="/work/sweet-dreams-recording-studio" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://customer-w6h9o08eg118alny.cloudflarestream.com/d912b8bd58831e95431db3c24791e44b/thumbnails/thumbnail.jpg?time=1s&height=600"
                  alt="Sweet Dreams Recording Studio"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>SWEET DREAMS RECORDING STUDIO SHOWCASE</h3>
                <p className={styles.portfolioClient}>Sweet Dreams Media</p>
              </div>
            </Link>

            <Link href="/work/vegas-dream-travel-content" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VegasDream/VegasDreamCover.png"
                  alt="Vegas Dream"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>VEGAS DREAM - TRAVEL CONTENT</h3>
                <p className={styles.portfolioClient}>Sweet Dreams Media</p>
              </div>
            </Link>

            <Link href="/work/cumberland-falls-ky-nature-showcase" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://customer-w6h9o08eg118alny.cloudflarestream.com/62314c34c826a3b298815ee506ad875f/thumbnails/thumbnail.jpg?time=3s&height=600"
                  alt="Cumberland Falls"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>CUMBERLAND FALLS, KY NATURE SHOWCASE</h3>
                <p className={styles.portfolioClient}>Personal Project</p>
              </div>
            </Link>

            <Link href="/work/snobiz-snowcone-truck-commercial" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/SnoBizSnoCone/_DSC4925.jpg"
                  alt="SnoB'iz SnowCone Truck"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>SNOB'IZ SNOWCONE TRUCK COMMERCIAL</h3>
                <p className={styles.portfolioClient}>SnoB'iz</p>
              </div>
            </Link>

            <Link href="/work/sliced-by-sonny-commercial" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/JSonnyBarberShop/DSC07101.jpg"
                  alt="Sliced By Sonny"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>SLICED BY SONNY COMMERCIAL</h3>
                <p className={styles.portfolioClient}>Sliced By Sonny</p>
              </div>
            </Link>

            <Link href="/work/vintage-fest-fort-wayne" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DJI_20250817131856_0026_D.jpg"
                  alt="Vintage Fest Fort Wayne"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>VINTAGE FEST FORT WAYNE</h3>
                <p className={styles.portfolioClient}>Vintage Fest</p>
              </div>
            </Link>

            <Link href="/work/fort-wayne-carnival-recap" className={styles.portfolioCard}>
              <div className={styles.portfolioImage}>
                <img
                  src="https://videodelivery.net/1a0f730d316664839064b8a88543d63a/thumbnails/thumbnail.jpg?time=1s&height=600"
                  alt="Fort Wayne Carnival"
                />
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>FORT WAYNE CARNIVAL RECAP</h3>
                <p className={styles.portfolioClient}>Kissel Entertainment</p>
              </div>
            </Link>

            {/* Coming Soon Projects */}
            <Link href="/work/nissan-warsaw-dealership" className={styles.portfolioCard + ' ' + styles.comingSoonCard}>
              <div className={styles.portfolioImage}>
                <div className={styles.comingSoon}>
                  <div className={styles.comingSoonText}>COMING SOON</div>
                </div>
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>NISSAN WARSAW DEALERSHIP</h3>
                <p className={styles.portfolioClient}>Nissan Prime Dealer</p>
              </div>
            </Link>

            <Link href="/work/dear-lover-music-video" className={styles.portfolioCard + ' ' + styles.comingSoonCard}>
              <div className={styles.portfolioImage}>
                <div className={styles.comingSoon}>
                  <div className={styles.comingSoonText}>COMING SOON</div>
                </div>
              </div>
              <div className={styles.portfolioInfo}>
                <h3 className={styles.portfolioTitle}>DEAR LOVER - MUSIC VIDEO</h3>
                <p className={styles.portfolioClient}>Lyaz</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - White */}
      <section className={styles.cta} id="contact">
        <div className={styles.container}>
          <p className={styles.miniTitle}>GET IN TOUCH</p>
          <h2 className={styles.ctaTitle}>
            READY TO CREATE<br />
            SOMETHING AMAZING?
          </h2>
          <p className={styles.ctaSubtitle}>
            Let's discuss your project and bring your vision to life
          </p>

          <form className={styles.form}>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="Your Name"
                className={styles.input}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className={styles.input}
                required
              />
            </div>
            <input
              type="tel"
              placeholder="Phone Number (Optional)"
              className={styles.input}
            />
            <textarea
              placeholder="Tell us about your project..."
              className={styles.textarea}
              rows={6}
              required
            />
            <button type="submit" className={styles.submitButton}>
              SEND MESSAGE
            </button>
          </form>
        </div>
      </section>

      {/* Footer Info - Black */}
      <section className={styles.info}>
        <div className={styles.container}>
          <p className={styles.infoText}>
            Sweet Dreams Media is a full-service video production company based in Fort Wayne, Indiana.
            We specialize in creating compelling visual content that helps brands stand out and connect with their audience.
          </p>
        </div>
      </section>
    </div>
  );
}
