"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./media.module.css";
import WhyAnimated from "@/components/media/WhyAnimated";
import ServicesAnimated from "@/components/media/ServicesAnimated";
import MediaHeroAnimated from "@/components/media/MediaHeroAnimated";
import PortfolioHorizontalScroll from "@/components/media/PortfolioHorizontalScroll";

export default function MediaPage() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorLogo, setCursorLogo] = useState<string | null>(null);

  const portfolioItems = [
    {
      href: "/work/knoxville-carnival-coverage",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/d554360a479b1380f96df7a4ef8f03a3/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "KISSEL ENTERTAINMENT",
      client: "Kissel Entertainment",
      category: "Commercial · Event Coverage",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/KisselLogo.png",
    },
    {
      href: "/work/indianapolis-childrens-museum-ferris-wheel",
      image: "https://videodelivery.net/7a243650c649bdcf4369622acd47abf6/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "INDIANAPOLIS CHILDREN'S MUSEUM FERRIS WHEEL",
      client: "Indianapolis Children's Museum",
      category: "Brand Film · Event",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/IndyChildrensMuseumLogo.png",
    },
    {
      href: "/work/brookfield-zoo-ferris-wheel",
      image: "https://videodelivery.net/b3b94bd1543e2452571b90aab0a38e9b/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "BROOKFIELD ZOO FERRIS WHEEL",
      client: "RideWorx & Brookfield Zoo",
      category: "Brand Film · Event",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/BrookfieldZooLogo.png",
    },
    {
      href: "/work/fort-wayne-hyperlapse-showcase",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/a507a5b8a369b70b7332c0567cbbcc4c/thumbnails/thumbnail.jpg?time=5s&height=600",
      title: "FORT WAYNE HYPERLAPSE CITY SHOWCASE",
      client: "Sweet Dreams Media",
      category: "Hyperlapse · Showcase",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CityofFortWayneLogo.png",
    },
    {
      href: "/work/heaven-in-fort-wayne",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/d8c34ebf7e9bb7a150feaa29cd60a9a6/thumbnails/thumbnail.jpg?time=3s&height=600",
      title: "HEAVEN IN FORT WAYNE",
      client: "Sweet Dreams Media",
      category: "Showcase · Travel",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CityofFortWayneLogo.png",
    },
    {
      href: "/work/wake-up-blind-music-video",
      image: "https://videodelivery.net/9db7601df93c3b1634ac41ad715aa9c6/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "WAKE UP BLIND MUSIC VIDEO",
      client: "Jay Val Leo",
      category: "Music Video",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg",
    },
    {
      href: "/work/aegis-dental-trusted-dentistry",
      image: "https://videodelivery.net/089a5f4bac2141b90d9583820ee2b6cb/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "AEGIS DENTAL - TRUSTED DENTISTRY",
      client: "Aegis Dental Group",
      category: "Commercial · Brand Film",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/TrustedDentalLogo.png",
    },
    {
      href: "/work/sweet-dreams-recording-studio",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/d912b8bd58831e95431db3c24791e44b/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "SWEET DREAMS RECORDING STUDIO SHOWCASE",
      client: "Sweet Dreams Media",
      category: "Brand Film · Showcase",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg",
    },
    {
      href: "/work/vegas-dream-travel-content",
      image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VegasDream/VegasDreamCover.png",
      title: "VEGAS DREAM - TRAVEL CONTENT",
      client: "Sweet Dreams Media",
      category: "Travel · Content Creation",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg",
    },
    {
      href: "/work/cumberland-falls-ky-nature-showcase",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/62314c34c826a3b298815ee506ad875f/thumbnails/thumbnail.jpg?time=3s&height=600",
      title: "CUMBERLAND FALLS, KY NATURE SHOWCASE",
      client: "Personal Project",
      category: "Nature · Showcase",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg",
    },
    {
      href: "/work/snobiz-snowcone-truck-commercial",
      image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/SnoBizSnoCone/_DSC4925.jpg",
      title: "SNOB'IZ SNOWCONE TRUCK COMMERCIAL",
      client: "SnoB'iz",
      category: "Commercial",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/logo-snobiz-footer-ret.png",
    },
    {
      href: "/work/sliced-by-sonny-commercial",
      image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/JSonnyBarberShop/DSC07101.jpg",
      title: "SLICED BY SONNY COMMERCIAL",
      client: "Sliced By Sonny",
      category: "Commercial",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/slicedBySonny.png",
    },
    {
      href: "/work/vintage-fest-fort-wayne",
      image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DJI_20250817131856_0026_D.jpg",
      title: "VINTAGE FEST FORT WAYNE",
      client: "Vintage Fest",
      category: "Event Coverage",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SummitCityVintageLogo.png",
    },
    {
      href: "/work/fort-wayne-carnival-recap",
      image: "https://videodelivery.net/1a0f730d316664839064b8a88543d63a/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "FORT WAYNE CARNIVAL RECAP",
      client: "Kissel Entertainment",
      category: "Event Coverage · Recap",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/KisselLogo.png",
    },
    {
      href: "/work/nissan-warsaw-dealership",
      image: "",
      title: "NISSAN WARSAW DEALERSHIP",
      client: "Nissan Prime Dealer",
      category: "Commercial · Automotive",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/NissanLogo.png",
      comingSoon: true,
    },
    {
      href: "/work/dear-lover-music-video",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/beeb2ee6a9a30c655e79bdc1f4fb6d20/thumbnails/thumbnail.jpg?time=3s&height=600",
      title: "DEAR LOVER - MUSIC VIDEO",
      client: "Lyaz",
      category: "Music Video",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/LyazLogo.png",
    },
  ];

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

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={styles.page}>
      {/* Custom Cursor with Logo */}
      {cursorLogo && (
        <div
          className={styles.customCursor}
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
        >
          <img src={cursorLogo} alt="Client Logo" className={styles.cursorLogo} />
        </div>
      )}

      {/* Hero Section - White */}
      <MediaHeroAnimated />

      {/* Why Choose Us - Black */}
      <WhyAnimated />

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

      {/* Complete Portfolio - Horizontal Scroll */}
      <PortfolioHorizontalScroll
        items={portfolioItems}
        onMouseEnter={(logo) => setCursorLogo(logo)}
        onMouseLeave={() => setCursorLogo(null)}
      />

      {/* Services - White */}
      <ServicesAnimated />

      {/* CTA Section - Grey */}
      <section className={styles.cta} id="contact">
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <p className={styles.miniTitle}>GET IN TOUCH</p>
            <h2 className={styles.ctaTitle}>
              READY TO CREATE<br />
              SOMETHING AMAZING?
            </h2>
            <p className={styles.ctaSubtitle}>
              Let's discuss your project and bring your vision to life
            </p>
          </div>

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
