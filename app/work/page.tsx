"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "../media/media.module.css";
import WhyAnimated from "@/components/media/WhyAnimated";
import ServicesAnimated from "@/components/media/ServicesAnimated";
import MediaHeroAnimated from "@/components/media/MediaHeroAnimated";
import PortfolioHorizontalScroll from "@/components/media/PortfolioHorizontalScroll";
import MusicContactForm from "@/components/music/MusicContactForm";

export default function WorkPage() {
  const portfolioItems = [
    {
      href: "/work/mc-sim-racing",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/a279eed7ef4ceef1b3b257b0fb4dfc67/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "MC SIM RACING",
      client: "MC Sim Racing",
      category: "Brand Video",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/logoMCSimRacing.png",
    },
    {
      href: "/work/the-coleman-prime-story",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/d08682649901944d9bbec1dcfb8bde88/thumbnails/thumbnail.jpg?time=89s&height=600",
      title: "THE COLEMAN PRIME STORY",
      client: "Coleman Prime",
      category: "Brand Trailer",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/Primedealerequityfundlogoblack.png",
    },
    {
      href: "/work/knoxville-carnival-coverage",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/d554360a479b1380f96df7a4ef8f03a3/thumbnails/thumbnail.jpg?time=13s&height=600",
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
      image: "https://videodelivery.net/b3b94bd1543e2452571b90aab0a38e9b/thumbnails/thumbnail.jpg?time=13s&height=600",
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
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreamsMusic3StackBlackLogo%20(1).png",
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
      href: "/work/fort-wayne-traffic-hyperlapse",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/11ba969d7ad3bca18978a2c36580c51f/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "FORT WAYNE TRAFFIC HYPERLAPSE",
      client: "Sweet Dreams Media",
      category: "Hyperlapse",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg",
    },
    {
      href: "/work/cinema-drone-ad",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/7d5f758e9ad94d17703b2f7842ca309b/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "CINEMA DRONE AD",
      client: "Sweet Dreams Media",
      category: "Equipment Showcase",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg",
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
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/700297c313e97262173f0c2107f3b8db/thumbnails/thumbnail.jpg?time=2s&height=600",
      title: "NISSAN WARSAW DEALERSHIP",
      client: "Nissan Warsaw Dealer",
      category: "Commercial · Automotive",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/nissanredlogo.png",
    },
    {
      href: "/work/dear-lover-music-video",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/beeb2ee6a9a30c655e79bdc1f4fb6d20/thumbnails/thumbnail.jpg?time=3s&height=600",
      title: "DEAR LOVER - MUSIC VIDEO",
      client: "Lyaz",
      category: "Music Video",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreamsMusic3StackBlackLogo%20(1).png",
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

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero Section - White */}
      <MediaHeroAnimated />

      {/* Complete Portfolio - Horizontal Scroll */}
      <PortfolioHorizontalScroll
        items={portfolioItems}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
      />

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

      {/* Services - White */}
      <ServicesAnimated />

      {/* Contact Form */}
      <div id="contact">
        <MusicContactForm source="work" />
      </div>

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
