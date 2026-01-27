'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/all';
import styles from './partnerships.module.css';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
}

// Turnstile site key
const TURNSTILE_SITE_KEY = '0x4AAAAAACJodExIWnZ-7sQq';

// Extend Window interface for Turnstile
declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
        size?: 'normal' | 'flexible' | 'compact';
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

// FAQ data
const FAQ_ITEMS = [
  {
    id: 1,
    question: 'What if I don\'t grow?',
    answer: 'Then we don\'t get paid much. That\'s the point. Our performance fee is tied directly to your revenue growth—if you don\'t grow, we earn less. The foundation fee covers our costs to build your systems, but our real upside comes from your success. Traditional agencies get paid whether you grow or not. We only win when you win.'
  },
  {
    id: 2,
    question: 'How do you track growth?',
    answer: 'We integrate with your existing systems—CRM, booking software, payment processor, analytics. We track what\'s actually driving leads, which trends convert into real sales, and where those sales originate. You get complete transparency with monthly reporting. No black boxes, no vanity metrics—just revenue.'
  },
  {
    id: 3,
    question: 'What\'s the contract length?',
    answer: '12 months. Real growth takes time—building systems, creating content, optimizing funnels, building trust with your audience. Shorter timelines don\'t allow for the compound effects that drive exponential results. After Year 1, we move to annual renewals with adjusted terms based on performance.'
  },
  {
    id: 4,
    question: 'Why not just charge a flat retainer?',
    answer: 'Because flat fees create misaligned incentives. The agency gets paid the same whether you grow 10% or 300%. They\'re incentivized to keep you paying, not to grow you. We wanted a model where we\'re rewarded for outsized results—and where you\'re protected if results take longer. Our success is literally measured by yours.'
  },
  {
    id: 5,
    question: 'How is this different from other agencies?',
    answer: 'Traditional agencies sell hours and deliverables. We sell outcomes. They report on activity ("here\'s what we did"). We report on revenue ("here\'s what you made"). They\'re vendors. We\'re partners. They move on when you churn. We\'re invested in your long-term success because that\'s how we get paid.'
  },
  {
    id: 6,
    question: 'How do I know this will work for me?',
    answer: 'We\'ll have multiple conversations before any commitment. We\'ll dig into your numbers, your market, your capacity. If we don\'t see clear growth potential, we\'ll tell you. We\'re selective because our income depends on your growth—we only take on partnerships where we believe we can deliver real results.'
  },
  {
    id: 7,
    question: 'What if I just need one video?',
    answer: 'Check out our Solutions page for one-time projects—commercials, brand videos, event coverage. The partnership model is specifically for businesses ready for ongoing, compounding growth. Not everyone needs that, and that\'s okay. But if you want a growth engine, not just a video, this is it.'
  }
];

export default function PartnershipsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const includedRef = useRef<HTMLElement>(null);
  const whoRef = useRef<HTMLElement>(null);
  const investRef = useRef<HTMLElement>(null);
  const caseRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    website: '',
    yourName: '',
    email: '',
    phone: '',
    revenue: '',
    challenge: '',
    whyPartner: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Main GSAP animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    CustomEase.create('customEase', '0.86, 0, 0.07, 1');
    CustomEase.create('smoothOut', '0.25, 0.1, 0.25, 1');

    const ctx = gsap.context(() => {
      // ========================================
      // HERO ANIMATION - Split Layout with Chart
      // ========================================
      if (heroRef.current) {
        const heroContainer = heroRef.current;
        const heroLeft = heroContainer.querySelector(`.${styles.heroLeft}`);
        const heroRight = heroContainer.querySelector(`.${styles.heroRight}`);
        const chartBox = heroContainer.querySelector(`.${styles.heroChartBox}`);
        const titleLines = heroContainer.querySelectorAll('.title-line');
        const label = heroContainer.querySelector(`.${styles.heroLabel}`);
        const subtext = heroContainer.querySelector(`.${styles.heroSubtext}`);
        const cta = heroContainer.querySelector(`.${styles.heroCta}`);
        const lineChartPaths = heroContainer.querySelectorAll(`.${styles.lineChartPath}`);
        const chartLegend = heroContainer.querySelector(`.${styles.chartLegend}`);
        const chartCaption = heroContainer.querySelector(`.${styles.chartCaption}`);

        // Initial states
        gsap.set(heroLeft, { x: -100, opacity: 0 });
        gsap.set(heroRight, { x: 100, opacity: 0 });
        gsap.set(titleLines, { y: 80, opacity: 0, rotationX: -30 });
        gsap.set(label, { y: -20, opacity: 0 });
        gsap.set(subtext, { y: 30, opacity: 0 });
        gsap.set(cta, { y: 30, opacity: 0, scale: 0.9 });
        // Set up line chart path animation (draw from left to right)
        lineChartPaths.forEach((path) => {
          const pathElement = path as SVGPathElement;
          const length = pathElement.getTotalLength();
          gsap.set(pathElement, {
            strokeDasharray: length,
            strokeDashoffset: length
          });
        });
        gsap.set(chartLegend, { opacity: 0, y: 10 });
        gsap.set(chartCaption, { opacity: 0, y: 20 });

        const heroTl = gsap.timeline({ delay: 0.2 });

        // Left and right sides slide in
        heroTl.to(heroLeft, {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }, 0);

        heroTl.to(heroRight, {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }, 0.1);

        // Label fades in
        heroTl.to(label, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        }, 0.4);

        // Title lines cascade in
        titleLines.forEach((line, i) => {
          heroTl.to(line, {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.8,
            ease: 'power3.out'
          }, 0.5 + (i * 0.12));
        });

        // Subtext fades in
        heroTl.to(subtext, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        }, 1);

        // CTA pops in
        heroTl.to(cta, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.7)'
        }, 1.1);

        // Line charts draw in from left to right
        heroTl.to(lineChartPaths, {
          strokeDashoffset: 0,
          duration: 3,
          stagger: 0.2,
          ease: 'power2.out'
        }, 0.8);

        // Legend fades in
        heroTl.to(chartLegend, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, 2.2);

        // Chart caption fades in
        heroTl.to(chartCaption, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, 2.5);
      }

      // ========================================
      // MANIFESTO - Scroll-linked opacity
      // Words start at 10% opacity, fade to 100% as they reach middle of screen
      // ========================================
      if (problemRef.current) {
        const words = problemRef.current.querySelectorAll('.manifesto-word');

        // Each word fades from 10% to 100% opacity as it scrolls up
        words.forEach((word) => {
          // Set initial opacity
          gsap.set(word, { opacity: 0.1 });

          // Smooth scroll-linked opacity animation
          gsap.fromTo(word,
            { opacity: 0.1 },
            {
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: word,
                start: 'top 85%',  // Start fading in when word enters bottom
                end: 'top 50%',    // Reach full opacity at middle of screen
                scrub: 0.5,        // Smooth scroll-linked animation with slight lag
                onLeave: () => {
                  // Once scrolled past middle, lock in the active class
                  gsap.set(word, { opacity: 1 });
                  word.classList.add(styles.manifestoWordActive);
                }
              }
            }
          );
        });
      }

      // ========================================
      // HOW IT WORKS - Cards slide & scale
      // ========================================
      if (howRef.current) {
        const label = howRef.current.querySelector(`.${styles.sectionLabel}`);
        const title = howRef.current.querySelector(`.${styles.sectionTitle}`);
        const cards = howRef.current.querySelectorAll(`.${styles.howCard}`);

        // Section header animation
        gsap.from([label, title], {
          y: 80,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: howRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        // Cards with 3D rotation entrance
        cards.forEach((card, i) => {
          const htmlCard = card as HTMLElement;
          gsap.set(card, { transformPerspective: 1000 });

          gsap.from(card, {
            y: 100,
            opacity: 0,
            rotationY: i === 1 ? 0 : (i === 0 ? 15 : -15),
            scale: 0.8,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          });

          // Mouse tracking for gradient border
          const handleMouseMove = (e: MouseEvent) => {
            const rect = htmlCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const width = rect.width;
            const height = rect.height;

            // Calculate position as percentage
            const xPercent = (x / width) * 100;
            const yPercent = (y / height) * 100;

            // Calculate angle from center to mouse position
            const centerX = width / 2;
            const centerY = height / 2;
            const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;

            // Update CSS variables for gradient position
            htmlCard.style.setProperty('--gradient-x', `${xPercent}%`);
            htmlCard.style.setProperty('--gradient-y', `${yPercent}%`);
            htmlCard.style.setProperty('--gradient-angle', `${angle}deg`);
          };

          // Hover effects
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.02,
              duration: 0.3,
              ease: 'power2.out'
            });
          });

          card.addEventListener('mousemove', handleMouseMove as EventListener);

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              duration: 0.3,
              ease: 'power2.out'
            });
          });
        });

        // Step numbers count animation
        const steps = howRef.current.querySelectorAll(`.${styles.howStep}`);
        steps.forEach((step, i) => {
          gsap.from(step, {
            scale: 3,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            delay: i * 0.15
          });
        });
      }

      // ========================================
      // INCLUDED SECTION - Staggered card grid
      // ========================================
      if (includedRef.current) {
        const label = includedRef.current.querySelector(`.${styles.sectionLabel}`);
        const title = includedRef.current.querySelector(`.${styles.sectionTitle}`);
        const cards = includedRef.current.querySelectorAll(`.${styles.includedCard}`);
        const icons = includedRef.current.querySelectorAll(`.${styles.includedIcon}`);

        gsap.from([label, title], {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: includedRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        // Cards stagger in from different directions
        cards.forEach((card, i) => {
          const directions = [
            { x: -100, y: 50 },
            { x: 0, y: 100 },
            { x: 100, y: 50 },
            { x: -100, y: 50 },
            { x: 0, y: 100 },
            { x: 100, y: 50 }
          ];
          const dir = directions[i % 6];

          gsap.from(card, {
            x: dir.x,
            y: dir.y,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          });
        });

        // Icons spin in
        icons.forEach((icon, i) => {
          gsap.from(icon, {
            rotation: -180,
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: icon,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            delay: i * 0.1
          });
        });

        // Icon bounce on card hover
        cards.forEach((card) => {
          const icon = card.querySelector(`.${styles.includedIcon}`);
          if (icon) {
            card.addEventListener('mouseenter', () => {
              gsap.to(icon, {
                y: -15,
                duration: 0.25,
                ease: 'power2.out',
                onComplete: () => {
                  gsap.to(icon, {
                    y: 0,
                    duration: 0.4,
                    ease: 'bounce.out'
                  });
                }
              });
            });
          }
        });
      }

      // ========================================
      // WHO SECTION - Columns slide in
      // ========================================
      if (whoRef.current) {
        const label = whoRef.current.querySelector(`.${styles.sectionLabel}`);
        const title = whoRef.current.querySelector(`.${styles.sectionTitle}`);
        const columns = whoRef.current.querySelectorAll(`.${styles.whoColumn}`);
        const items = whoRef.current.querySelectorAll(`.${styles.whoItem}`);

        gsap.from([label, title], {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: whoRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        // Left column slides from left, right from right
        gsap.from(columns[0], {
          x: -150,
          opacity: 0,
          rotation: -5,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: columns[0],
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        gsap.from(columns[1], {
          x: 150,
          opacity: 0,
          rotation: 5,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: columns[1],
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        // List items stagger in
        items.forEach((item, i) => {
          gsap.from(item, {
            x: i < 6 ? -30 : 30,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          });

          // Bounce the check/x icon on hover
          const icon = item.querySelector(`.${styles.whoCheck}, .${styles.whoX}`);
          if (icon) {
            item.addEventListener('mouseenter', () => {
              gsap.to(icon, {
                y: -8,
                scale: 1.2,
                duration: 0.2,
                ease: 'power2.out',
                onComplete: () => {
                  gsap.to(icon, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: 'bounce.out'
                  });
                }
              });
            });
          }
        });
      }

      // ========================================
      // INVESTMENT SECTION - Cards with pulse
      // ========================================
      if (investRef.current) {
        const label = investRef.current.querySelector(`.${styles.sectionLabel}`);
        const title = investRef.current.querySelector(`.${styles.sectionTitle}`);
        const cards = investRef.current.querySelectorAll(`.${styles.investCard}`);
        const cta = investRef.current.querySelector(`.${styles.investCta}`);
        const amounts = investRef.current.querySelectorAll(`.${styles.investCardAmount}`);

        gsap.from([label, title], {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: investRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        // Cards scale up with glow
        cards.forEach((card, i) => {
          gsap.from(card, {
            scale: 0.8,
            opacity: 0,
            y: 60,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            delay: i * 0.2
          });
        });

        // Amount text typewriter-style reveal
        amounts.forEach((amount) => {
          gsap.from(amount, {
            scale: 1.5,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: amount,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          });
        });

        // CTA button pulse
        if (cta) {
          gsap.from(cta, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cta,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      }

      // ========================================
      // CASE STUDY - Numbers count up
      // ========================================
      if (caseRef.current) {
        const label = caseRef.current.querySelector(`.${styles.sectionLabel}`);
        const title = caseRef.current.querySelector(`.${styles.sectionTitle}`);
        const content = caseRef.current.querySelector(`.${styles.caseContent}`);
        const beforeNum = caseRef.current.querySelector(`.${styles.caseBefore} .${styles.caseNumber}`);
        const afterNum = caseRef.current.querySelector(`.${styles.caseAfter} .${styles.caseNumber}`);
        const stats = caseRef.current.querySelectorAll(`.${styles.caseStat}`);
        const arrow = caseRef.current.querySelector(`.${styles.caseArrow}`);

        gsap.from([label, title], {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: caseRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        // Content box reveal
        if (content) {
          gsap.from(content, {
            y: 100,
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: content,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          });
        }

        // Arrow animation
        if (arrow) {
          gsap.from(arrow, {
            scale: 0,
            rotation: -180,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: arrow,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          });

          // Pulsing arrow
          gsap.to(arrow, {
            x: 10,
            duration: 0.6,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
            scrollTrigger: {
              trigger: arrow,
              start: 'top 85%',
              toggleActions: 'play pause resume pause'
            }
          });
        }

        // Stats stagger in with scale
        stats.forEach((stat, i) => {
          gsap.from(stat, {
            y: 40,
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: stat,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            },
            delay: i * 0.15
          });
        });
      }

      // ========================================
      // FAQ SECTION - Items slide in
      // ========================================
      if (faqRef.current) {
        const label = faqRef.current.querySelector(`.${styles.sectionLabel}`);
        const title = faqRef.current.querySelector(`.${styles.sectionTitle}`);
        const items = faqRef.current.querySelectorAll(`.${styles.faqItem}`);

        gsap.from([label, title], {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: faqRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        items.forEach((item, i) => {
          gsap.from(item, {
            x: i % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          });
        });
      }

      // ========================================
      // FORM SECTION - Elegant reveal
      // ========================================
      if (formRef.current) {
        const header = formRef.current.querySelector(`.${styles.formHeader}`);
        const form = formRef.current.querySelector(`.${styles.form}`);
        const inputs = formRef.current.querySelectorAll(`.${styles.input}, .${styles.select}, .${styles.textarea}`);

        gsap.from(header, {
          x: -100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        });

        gsap.from(form, {
          x: 100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        });

        // Form inputs stagger in
        inputs.forEach((input, i) => {
          gsap.from(input, {
            y: 30,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: input,
              start: 'top 95%',
              toggleActions: 'play none none reverse'
            },
            delay: i * 0.05
          });
        });
      }

      // Refresh ScrollTrigger
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
  }, []);

  // Turnstile setup
  const renderTurnstile = useCallback(() => {
    if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            setTurnstileToken(token);
            setTurnstileError(null);
          },
          'error-callback': () => {
            setTurnstileError('Verification failed. Please try again.');
            setTurnstileToken(null);
          },
          'expired-callback': () => {
            setTurnstileToken(null);
            setTurnstileError('Verification expired. Please verify again.');
          },
          theme: 'light',
          size: 'flexible',
        });
      } catch (error) {
        console.error('Turnstile render error:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (window.turnstile) {
      renderTurnstile();
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [renderTurnstile]);

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const scrollToForm = () => {
    const formSection = document.getElementById('apply');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      setTurnstileError('Please complete the verification.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/partnership-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          businessName: '',
          industry: '',
          website: '',
          yourName: '',
          email: '',
          phone: '',
          revenue: '',
          challenge: '',
          whyPartner: ''
        });
        setTurnstileToken(null);
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      } else {
        const data = await response.json();
        if (data.error === 'Invalid verification') {
          setTurnstileError('Verification failed. Please try again.');
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current);
          }
        }
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Load Turnstile script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={renderTurnstile}
      />

      {/* HERO SECTION - Project Showcase Style */}
      <section className={styles.heroSection} ref={heroRef} data-cursor-hide>
        <div className={styles.heroContainer}>
          {/* Left Side - Title & Info */}
          <div className={styles.heroLeft}>
            <span className={styles.heroLabel}>GROWTH PARTNERSHIPS</span>
            <h1 className={styles.heroTitle}>
              <span className={`${styles.heroTitleLine} title-line`}>WE DON'T</span>
              <span className={`${styles.heroTitleLine} title-line`}>DO RETAINERS.</span>
              <span className={`${styles.heroTitleLine} ${styles.heroTitleAccent} title-line`}>WE DO RESULTS.</span>
            </h1>
            <p className={styles.heroSubtext}>
              A different kind of agency. One where we only win when you win.
            </p>
            <button className={styles.heroCta} onClick={scrollToForm}>
              APPLY FOR PARTNERSHIP
            </button>
          </div>

          {/* Right Side - Growth Chart Visualization */}
          <div className={styles.heroRight}>
            <div className={styles.heroChartBox}>
              {/* Stacked Line Charts - Both starting from same origin */}
              <div className={styles.lineChartsContainer}>
                <div className={styles.lineChartWrapper}>
                  <svg className={styles.lineChartSvg} viewBox="0 -100 300 200" preserveAspectRatio="none">
                    {/* Marketing Investment Line - strong exponential growth */}
                    <path
                      className={`${styles.lineChartPath} ${styles.marketingLine}`}
                      d="M0,98 L43,94 L86,86 L129,72 L172,52 L215,30 L258,10 L300,-10"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="miter"
                    />
                    {/* Revenue Growth Line - 3x higher, keeps accelerating */}
                    <path
                      className={`${styles.lineChartPath} ${styles.revenueLine}`}
                      d="M0,98 L43,88 L86,68 L129,40 L172,5 L215,-35 L258,-65 L300,-90"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="miter"
                    />

                    {/* Hover points for Marketing Line */}
                    <g className={styles.chartPoints}>
                      <circle cx="0" cy="98" r="5" className={styles.marketingPoint} />
                      <circle cx="43" cy="94" r="5" className={styles.marketingPoint} />
                      <circle cx="86" cy="86" r="5" className={styles.marketingPoint} />
                      <circle cx="129" cy="72" r="5" className={styles.marketingPoint} />
                      <circle cx="172" cy="52" r="5" className={styles.marketingPoint} />
                      <circle cx="215" cy="30" r="5" className={styles.marketingPoint} />
                      <circle cx="258" cy="10" r="5" className={styles.marketingPoint} />
                      <circle cx="300" cy="-10" r="5" className={styles.marketingPoint} />
                    </g>

                    {/* Hover points for Revenue Line */}
                    <g className={styles.chartPoints}>
                      <circle cx="0" cy="98" r="5" className={styles.revenuePoint} />
                      <circle cx="43" cy="88" r="5" className={styles.revenuePoint} />
                      <circle cx="86" cy="68" r="5" className={styles.revenuePoint} />
                      <circle cx="129" cy="40" r="5" className={styles.revenuePoint} />
                      <circle cx="172" cy="5" r="5" className={styles.revenuePoint} />
                      <circle cx="215" cy="-35" r="5" className={styles.revenuePoint} />
                      <circle cx="258" cy="-65" r="5" className={styles.revenuePoint} />
                      <circle cx="300" cy="-90" r="5" className={styles.revenuePoint} />
                    </g>
                  </svg>
                </div>
                {/* Legend */}
                <div className={styles.chartLegend}>
                  <div className={styles.chartLegendItem}>
                    <span className={styles.chartLegendLine} style={{ background: '#4A90E2' }}></span>
                    <span className={styles.chartLegendLabel}>Marketing Investment</span>
                  </div>
                  <div className={styles.chartLegendItem}>
                    <span className={styles.chartLegendLine} style={{ background: '#059669' }}></span>
                    <span className={styles.chartLegendLabel}>Revenue Growth</span>
                  </div>
                </div>
              </div>

              {/* Chart caption */}
              <p className={styles.chartCaption}>As we build more, you grow more. That's the partnership.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE MANIFESTO */}
      <section className={styles.manifestoSection} ref={problemRef}>
        <div className={styles.manifestoContainer}>
          <span className={styles.manifestoLabel}>THE PARTNERSHIP MANIFESTO</span>

          <div className={styles.manifestoContent}>
            <p className={styles.manifestoLine}>
              <span className={`manifesto-word ${styles.manifestoWord}`}>Agencies</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>love</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>retainers.</span>
            </p>
            <p className={styles.manifestoLine}>
              <span className={`manifesto-word ${styles.manifestoWord}`}>Predictable</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>income.</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>Pretty</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>reports.</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>Low</span>
              <span className={`manifesto-word ${styles.manifestoWord} ${styles.manifestoHighlightRed}`}>accountability.</span>
            </p>
            <p className={styles.manifestoLine}>
              <span className={`manifesto-word ${styles.manifestoWord}`}>You</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>pay</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>$3k-$10k/month</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>and</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>hope</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>it</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>works.</span>
            </p>
            <p className={styles.manifestoLine}>
              <span className={`manifesto-word ${styles.manifestoWord} ${styles.manifestoHighlightRed}`}>Risk</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>is</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>all</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>on</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>you.</span>
            </p>

            <div className={styles.manifestoDivider}></div>

            <p className={styles.manifestoLine}>
              <span className={`manifesto-word ${styles.manifestoWord}`}>Ours</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>works</span>
              <span className={`manifesto-word ${styles.manifestoWord} ${styles.manifestoHighlightGreen}`}>differently.</span>
            </p>
            <p className={styles.manifestoLine}>
              <span className={`manifesto-word ${styles.manifestoWord}`}>Our</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>pay</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>is</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>tied</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>to</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>your</span>
              <span className={`manifesto-word ${styles.manifestoWord} ${styles.manifestoHighlightGreen}`}>growth.</span>
            </p>
            <p className={styles.manifestoLine}>
              <span className={`manifesto-word ${styles.manifestoWord}`}>No</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>results?</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>No</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>payday</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>for</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>us.</span>
            </p>
            <p className={styles.manifestoLine}>
              <span className={`manifesto-word ${styles.manifestoWord}`}>Big</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>results,</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>we</span>
              <span className={`manifesto-word ${styles.manifestoWord}`}>both</span>
              <span className={`manifesto-word ${styles.manifestoWord} ${styles.manifestoHighlight}`}>win.</span>
            </p>

            <div className={styles.manifestoFinal}>
              <p className={styles.manifestoLine}>
                <span className={`manifesto-word ${styles.manifestoWord}`}>Aligned</span>
                <span className={`manifesto-word ${styles.manifestoWord}`}>incentives.</span>
                <span className={`manifesto-word ${styles.manifestoWord}`}>Shared</span>
                <span className={`manifesto-word ${styles.manifestoWord}`}>risk.</span>
              </p>
              <p className={styles.manifestoLine}>
                <span className={`manifesto-word ${styles.manifestoWord}`}>That's</span>
                <span className={`manifesto-word ${styles.manifestoWord}`}>the</span>
                <span className={`manifesto-word ${styles.manifestoWord} ${styles.manifestoPartnershipWord}`}>partnership.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className={styles.howSection} ref={howRef} data-cursor-hide>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>THE MODEL</span>
          <h2 className={styles.sectionTitle}>HOW IT WORKS</h2>

          <div className={styles.howGrid}>
            <div className={styles.howCard}>
              <span className={styles.howStep}>01</span>
              <h3 className={styles.howCardTitle}>FOUNDATION FEE</h3>
              <p className={styles.howCardText}>Small annual commitment based on your current revenue (2-3%). Shows you're serious. Covers our baseline investment to build your systems.</p>
            </div>
            <div className={styles.howCard}>
              <span className={styles.howStep}>02</span>
              <h3 className={styles.howCardTitle}>WE BUILD EVERYTHING</h3>
              <p className={styles.howCardText}>Content engine. Brand assets. Social management. Lead tracking. Offer development. We become deeply integrated with your operations—as a resource, not a burden.</p>
            </div>
            <div className={styles.howCard}>
              <span className={styles.howStep}>03</span>
              <h3 className={styles.howCardTitle}>GROWTH FEE</h3>
              <p className={styles.howCardText}>Tiered percentage on revenue above your baseline. You grow 50%? We earn more. You 3x? We both win big. We only get paid when you make money.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED SECTION */}
      <section className={styles.includedSection} ref={includedRef}>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>NOT JUST VIDEOS</span>
          <h2 className={styles.sectionTitle}>A GROWTH ENGINE</h2>

          <div className={styles.includedGrid}>
            <div className={styles.includedCard}>
              <div className={styles.includedIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
              </div>
              <h3 className={styles.includedCardTitle}>CONTENT ENGINE</h3>
              <p className={styles.includedCardText}>Unlimited video production. Daily posts across every platform. Before/afters, project walkthroughs, social cutdowns, photo documentation, behind-the-scenes, testimonials, reels, stories. We're on your job sites, in your shop, capturing everything. You'll never run out of content again.</p>
            </div>
            <div className={styles.includedCard}>
              <div className={styles.includedIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <h3 className={styles.includedCardTitle}>BRAND ASSETS</h3>
              <p className={styles.includedCardText}>Business trailer. Founder story documentary. Case study videos. Recruiting content. Sales decks. Pitch materials. Premium media that positions you as the undeniable choice in your market. Your work finally looks as good as it actually is.</p>
            </div>
            <div className={styles.includedCard}>
              <div className={styles.includedIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className={styles.includedCardTitle}>SOCIAL MANAGEMENT</h3>
              <p className={styles.includedCardText}>We take over your brand presence completely. Daily posting, comment replies, DM responses, community engagement, reputation management. Every platform, every touchpoint, every day. Fill every gap. Your competitors will feel invisible.</p>
            </div>
            <div className={styles.includedCard}>
              <div className={styles.includedIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 className={styles.includedCardTitle}>DEVELOPMENT SUPPORT</h3>
              <p className={styles.includedCardText}>Full website design and development—included. Landing pages. Sales funnels. Lead capture systems. Email sequences. Anything digital that helps you grow, we build from scratch. Your brand becomes airtight. Every touchpoint. Every channel. Every leverage point filled.</p>
            </div>
            <div className={styles.includedCard}>
              <div className={styles.includedIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3 className={styles.includedCardTitle}>MARKET ANALYSIS & OFFER REFINEMENT</h3>
              <p className={styles.includedCardText}>We don't just market what you have—we help you build something better. Competitive analysis. Pricing psychology. Packaging and positioning. We turn your business into its own Grand Slam offer—so compelling that choosing anyone else feels risky.</p>
            </div>
            <div className={styles.includedCard}>
              <div className={styles.includedIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className={styles.includedCardTitle}>FLUID COMMUNICATION</h3>
              <p className={styles.includedCardText}>We're not vendors hiding behind email chains and scheduled calls. Slack. Text. Call. Whatever works for you. We're embedded in your operations—available when you need us. Weekly check-ins. Real-time collaboration. Partners, not providers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR SECTION */}
      <section className={styles.whoSection} ref={whoRef} data-cursor-hide>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>BE HONEST WITH YOURSELF</span>
          <h2 className={styles.sectionTitle}>IS THIS FOR YOU?</h2>

          <div className={styles.whoGrid}>
            <div className={styles.whoColumn}>
              <h3 className={styles.whoColumnTitle}>GOOD FIT</h3>
              <div className={styles.whoList}>
                <div className={styles.whoItem}>
                  <span className={styles.whoCheck}>✓</span>
                  <span>You're great at what you do (just bad at marketing it)</span>
                </div>
                <div className={styles.whoItem}>
                  <span className={styles.whoCheck}>✓</span>
                  <span>Ready to invest in growth, not just "try it for a month"</span>
                </div>
                <div className={styles.whoItem}>
                  <span className={styles.whoCheck}>✓</span>
                  <span>Can actually handle more business</span>
                </div>
                <div className={styles.whoItem}>
                  <span className={styles.whoCheck}>✓</span>
                  <span>Coachable, hungry, willing to implement</span>
                </div>
                <div className={styles.whoItem}>
                  <span className={styles.whoCheck}>✓</span>
                  <span>Want a partner who's invested in your success</span>
                </div>
              </div>
            </div>

            <div className={styles.whoColumn}>
              <h3 className={styles.whoColumnTitleNot}>NOT A FIT</h3>
              <div className={styles.whoList}>
                <div className={styles.whoItem}>
                  <span className={styles.whoX}>✗</span>
                  <span>Shopping for the cheapest option</span>
                </div>
                <div className={styles.whoItem}>
                  <span className={styles.whoX}>✗</span>
                  <span>Want to micromanage and approve every post</span>
                </div>
                <div className={styles.whoItem}>
                  <span className={styles.whoX}>✗</span>
                  <span>Not ready to scale or commit</span>
                </div>
                <div className={styles.whoItem}>
                  <span className={styles.whoX}>✗</span>
                  <span>Just need "one video" and hope it works</span>
                </div>
                <div className={styles.whoItem}>
                  <span className={styles.whoX}>✗</span>
                  <span>Burned through 5 agencies and blame all of them</span>
                </div>
                <div className={styles.whoItem}>
                  <span className={styles.whoX}>✗</span>
                  <span>Unrealistic expectations ("10x in 30 days")</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INVESTMENT SECTION */}
      <section className={styles.investSection} ref={investRef}>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>THE DEAL</span>
          <h2 className={styles.sectionTitle}>YOUR INVESTMENT</h2>

          <div className={styles.investGrid}>
            <div className={styles.investCard}>
              <h3 className={styles.investCardTitle}>FOUNDATION FEE</h3>
              <p className={styles.investCardDetail}>Paid annually (or quarterly)</p>
              <p className={styles.investCardText}>Shows you're serious. Covers our baseline investment to build your content systems, automation, analytics, brand assets, and strategy.</p>
            </div>
            <div className={styles.investCard}>
              <h3 className={styles.investCardTitle}>GROWTH FEE</h3>
              <p className={styles.investCardDetail}>Tiered based on performance</p>
              <p className={styles.investCardText}>We only earn when you grow. Higher growth unlocks higher tiers. You 3x your business? We both win big. That's the alignment.</p>
            </div>
          </div>

          <p className={styles.investNote}>No hourly billing. No retainers that drain you whether it works or not.<br />We share the risk. We share the reward.</p>

          <button className={styles.investCta} onClick={scrollToForm}>
            START THE CONVERSATION
          </button>
        </div>
      </section>

      {/* CASE STUDY SECTION */}
      <section className={styles.caseSection} ref={caseRef} data-cursor-hide>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>WHAT THIS LOOKS LIKE</span>
          <h2 className={styles.sectionTitle}>REAL EXAMPLE</h2>

          <div className={styles.caseContent}>
            <div className={styles.caseHeader}>
              <span className={styles.caseType}>ENTERTAINMENT BUSINESS</span>
            </div>

            <div className={styles.caseComparison}>
              <div className={styles.caseBefore}>
                <h4 className={styles.caseLabel}>BEFORE</h4>
                <p className={styles.caseNumber}>$12,000<span>/month</span></p>
                <ul className={styles.caseList}>
                  <li>Inconsistent content</li>
                  <li>No system for leads</li>
                  <li>Word-of-mouth only</li>
                  <li>Cookie-cutter media</li>
                </ul>
              </div>

              <div className={styles.caseArrow}>→</div>

              <div className={styles.caseAfter}>
                <h4 className={styles.caseLabel}>AFTER 12 MONTHS</h4>
                <p className={styles.caseNumber}>$46,000<span>/month</span></p>
                <ul className={styles.caseList}>
                  <li>Daily content engine</li>
                  <li>Leads tracked & nurtured</li>
                  <li>Offer refined & optimized</li>
                  <li>Premium brand perception</li>
                </ul>
              </div>
            </div>

            <div className={styles.caseBottom}>
              <div className={styles.caseStat}>
                <span className={styles.caseStatLabel}>TOTAL FEES PAID</span>
                <span className={styles.caseStatValue}>~$25,000</span>
              </div>
              <div className={styles.caseStat}>
                <span className={styles.caseStatLabel}>NEW ANNUAL REVENUE</span>
                <span className={styles.caseStatValue}>$408,000</span>
              </div>
              <div className={styles.caseStat}>
                <span className={styles.caseStatLabel}>ROI</span>
                <span className={styles.caseStatValue}>16x</span>
              </div>
            </div>
          </div>

          <p className={styles.caseDisclaimer}>Same quality work. Premium media. Competitors feel bland in comparison.</p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className={styles.faqSection} ref={faqRef}>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>QUESTIONS?</span>
          <h2 className={styles.sectionTitle}>FAQ</h2>

          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item) => (
              <div key={item.id} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={expandedFaq === item.id}
                >
                  <span>{item.question}</span>
                  <svg
                    className={`${styles.faqArrow} ${expandedFaq === item.id ? styles.faqArrowOpen : ''}`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {expandedFaq === item.id && (
                  <div className={styles.faqAnswer}>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM SECTION */}
      <section className={styles.formSection} id="apply" ref={formRef} data-cursor-hide>
        <div className={styles.container}>
          <div className={styles.formHeader}>
            <span className={styles.sectionLabel}>LET'S TALK</span>
            <h2 className={styles.formTitle}>APPLY FOR<br />PARTNERSHIP</h2>
            <p className={styles.formSubtitle}>
              We're selective—because results take commitment from both sides. Not everyone's a fit, and that's okay. Fill this out and we'll schedule a call to see if there's alignment.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <input
                type="text"
                name="businessName"
                placeholder="Business Name *"
                className={styles.input}
                value={formData.businessName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="industry"
                placeholder="Industry"
                className={styles.input}
                value={formData.industry}
                onChange={handleChange}
              />
            </div>

            <input
              type="text"
              name="website"
              placeholder="Website / Social Links"
              className={styles.input}
              value={formData.website}
              onChange={handleChange}
            />

            <div className={styles.formGrid}>
              <input
                type="text"
                name="yourName"
                placeholder="Your Name *"
                className={styles.input}
                value={formData.yourName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email *"
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGrid}>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                className={styles.input}
                value={formData.phone}
                onChange={handleChange}
              />
              <select
                name="revenue"
                className={styles.select}
                value={formData.revenue}
                onChange={handleChange}
                required
              >
                <option value="">Current Monthly Revenue *</option>
                <option value="10-25k">$10,000 - $25,000</option>
                <option value="25-50k">$25,000 - $50,000</option>
                <option value="50-100k">$50,000 - $100,000</option>
                <option value="100k+">$100,000+</option>
              </select>
            </div>

            <textarea
              name="challenge"
              placeholder="What's your biggest growth challenge right now?"
              className={styles.textarea}
              rows={4}
              value={formData.challenge}
              onChange={handleChange}
              required
            />

            <textarea
              name="whyPartner"
              placeholder="Why do you want to partner with us?"
              className={styles.textarea}
              rows={4}
              value={formData.whyPartner}
              onChange={handleChange}
            />

            {/* Turnstile Widget */}
            <div className={styles.turnstileContainer}>
              <div ref={turnstileRef} className={styles.turnstileWidget}></div>
              {turnstileError && (
                <p className={styles.turnstileError}>{turnstileError}</p>
              )}
            </div>

            {submitStatus === 'success' && (
              <p className={styles.successMessage}>
                Application submitted successfully! We'll review your information and get back to you within 48 hours.
              </p>
            )}

            {submitStatus === 'error' && (
              <p className={styles.errorMessage}>
                Failed to submit application. Please try again or email us directly.
              </p>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !turnstileToken}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
