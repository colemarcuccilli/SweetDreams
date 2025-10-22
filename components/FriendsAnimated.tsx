'use client';

import { useEffect, useRef } from 'react';
import styles from "./Friends.module.css";
import { gsap } from 'gsap';

const CLIENT_LOGOS = [
  {
    name: "Brookfield Zoo",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/BrookfieldZooLogo.png"
  },
  {
    name: "Crooked Lake Music Festival",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CrookedLakeLogo.png"
  },
  {
    name: "Indianapolis Children's Museum",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/IndyChildrensMuseumLogo.png"
  },
  {
    name: "Kissel Entertainment",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/KisselLogo.png"
  },
  {
    name: "Nissan",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/nissanredlogo.png"
  },
  {
    name: "RideWorx",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/RideWorxLogo.png"
  },
  {
    name: "Summit City Vintage",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SummitCityVintageLogo.png"
  },
  {
    name: "Trusted Dental",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/TrustedDentalLogo.png"
  },
  {
    name: "Sno Biz",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/logo-snobiz-footer-ret.png"
  },
  {
    name: "Sliced by Sonny",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/slicedBySonny.png"
  },
  {
    name: "The Landing",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/TheLandingLogo.png"
  },
  {
    name: "City of Fort Wayne",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CityofFortWayneLogo.png"
  }
];

export default function FriendsAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    let oldX = 0;
    let oldY = 0;
    let deltaX = 0;
    let deltaY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate movement delta
      deltaX = e.clientX - oldX;
      deltaY = e.clientY - oldY;

      // Update old coordinates
      oldX = e.clientX;
      oldY = e.clientY;
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);

    // Wait a bit to ensure all logos are rendered
    const setupAnimations = () => {
      // Add hover effect to each logo
      const logoItems = container.querySelectorAll(`.${styles.logoItem}`);

      logoItems.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          const tl = gsap.timeline({
            onComplete: () => {
              tl.kill();
            }
          });

          tl.timeScale(1.2); // Animation plays 20% faster

          const img = el.querySelector('img');
          if (!img) return;

          // Fling effect - simulate inertia manually since we don't have the plugin
          const velocityX = deltaX * 30;
          const velocityY = deltaY * 30;

          // Animate with momentum effect
          tl.to(img, {
            x: velocityX / 10, // Scale down for reasonable movement
            y: velocityY / 10,
            duration: 0.6,
            ease: 'power2.out',
          });

          // Return to original position
          tl.to(img, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
          });

          // Random rotation with yoyo
          tl.fromTo(img, {
            rotate: 0
          }, {
            duration: 0.4,
            rotate: (Math.random() - 0.5) * 30, // Random angle between -15 and 15
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
          }, '<'); // Start at same time as first tween

          // Increase z-index on hover
          gsap.set(el, { zIndex: 10 });
          tl.eventCallback('onComplete', () => {
            gsap.set(el, { zIndex: 1 });
          });
        });
      });
    };

    // Setup animations immediately
    setupAnimations();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.textSection}>
          <h2 className={styles.title}>TRUSTED BY</h2>
          <h3 className={styles.mainText}>OUR FRIENDS</h3>
        </div>

        <div className={styles.logosGrid}>
          {CLIENT_LOGOS.map((client, index) => (
            <div key={index} className={styles.logoItem}>
              <img
                src={client.url}
                alt={client.name}
                className={styles.logo}
                style={{ willChange: 'transform' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
