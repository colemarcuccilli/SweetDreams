"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Script from "next/script";
import styles from "./MusicContactForm.module.css";

// Turnstile site key
const TURNSTILE_SITE_KEY = "0x4AAAAAACJodExIWnZ-7sQq";

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

interface MusicContactFormProps {
  source?: 'music' | 'media' | 'solutions';
}

export default function MusicContactForm({ source = 'music' }: MusicContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

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
            setTurnstileError("Verification failed. Please try again.");
            setTurnstileToken(null);
          },
          'expired-callback': () => {
            setTurnstileToken(null);
            setTurnstileError("Verification expired. Please verify again.");
          },
          theme: 'light',
          size: 'flexible',
        });
      } catch (error) {
        console.error("Turnstile render error:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Try to render if Turnstile is already loaded
    if (window.turnstile) {
      renderTurnstile();
    }

    return () => {
      // Cleanup widget on unmount
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for Turnstile token
    if (!turnstileToken) {
      setTurnstileError("Please complete the verification.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/music/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
          source,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTurnstileToken(null);
        // Reset Turnstile widget after successful submission
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      } else {
        const data = await response.json();
        if (data.error === "Invalid verification") {
          setTurnstileError("Verification failed. Please try again.");
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current);
          }
        }
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={styles.formSection} id="contact">
      {/* Load Turnstile script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={renderTurnstile}
      />

      <div className={styles.container}>
        <div className={styles.formHeader}>
          <p className={styles.miniTitle}>GET IN TOUCH</p>
          <h2 className={styles.title}>
            READY TO START<br />
            YOUR NEXT PROJECT?
          </h2>
          <p className={styles.subtitle}>
            Let's discuss your music production needs and bring your vision to life
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            inputMode="text"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            inputMode="email"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (Optional)"
            className={styles.input}
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel"
            inputMode="tel"
          />
          <textarea
            name="message"
            placeholder="Tell us about your project..."
            className={styles.textarea}
            rows={8}
            value={formData.message}
            onChange={handleChange}
            required
          />

          {/* Turnstile Widget */}
          <div className={styles.turnstileContainer}>
            <div ref={turnstileRef} className={styles.turnstileWidget}></div>
            {turnstileError && (
              <p className={styles.turnstileError}>{turnstileError}</p>
            )}
          </div>

          {submitStatus === "success" && (
            <p className={styles.successMessage}>
              Message sent successfully! We'll get back to you soon.
            </p>
          )}

          {submitStatus === "error" && (
            <p className={styles.errorMessage}>
              Failed to send message. Please try again or contact us directly.
            </p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !turnstileToken}
          >
            {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
          </button>
        </form>
      </div>
    </div>
  );
}
