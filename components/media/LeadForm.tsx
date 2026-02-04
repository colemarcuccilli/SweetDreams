"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Script from "next/script";

// Turnstile site key (same as other forms)
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

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    // Check for Turnstile token
    if (!turnstileToken) {
      setTurnstileError("Please complete the verification.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/media/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
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
        } else {
          setError(data.error || "Failed to send message. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-32 border-t">
      {/* Load Turnstile script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={renderTurnstile}
      />

      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-6xl md:text-7xl font-black uppercase mb-8">
              LET'S CREATE
              <br />
              <span className="text-gray-400">SOMETHING</span>
              <br />
              AMAZING
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Ready to elevate your brand with compelling visual content?
              Let's discuss your vision.
            </p>
            <div className="space-y-4 text-lg">
              <p className="text-gray-600">
                <span className="font-bold text-black">Email:</span>{" "}
                <a href="mailto:media@sweetdreamsmusic.com" className="hover:text-black transition">
                  media@sweetdreamsmusic.com
                </a>
              </p>
              <p className="text-gray-600">
                <span className="font-bold text-black">Phone:</span>{" "}
                <a href="tel:260-416-5955" className="hover:text-black transition">
                  (260) 416-5955
                </a>
              </p>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-12 text-center">
                <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
                <p className="text-gray-600">
                  We've received your message and will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="YOUR NAME"
                    required
                    autoComplete="name"
                    inputMode="text"
                    className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 focus:border-black outline-none transition-colors placeholder:text-gray-400 text-lg"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="YOUR EMAIL"
                    required
                    autoComplete="email"
                    inputMode="email"
                    className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 focus:border-black outline-none transition-colors placeholder:text-gray-400 text-lg"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="YOUR PHONE (OPTIONAL)"
                    autoComplete="tel"
                    inputMode="tel"
                    className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 focus:border-black outline-none transition-colors placeholder:text-gray-400 text-lg"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="TELL US ABOUT YOUR PROJECT"
                    required
                    rows={4}
                    className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 focus:border-black outline-none transition-colors placeholder:text-gray-400 text-lg resize-none"
                  />
                </div>

                {/* Turnstile Widget */}
                <div className="py-2">
                  <div ref={turnstileRef}></div>
                  {turnstileError && (
                    <p className="text-red-500 text-sm mt-2">{turnstileError}</p>
                  )}
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !turnstileToken}
                  className={`w-full py-4 font-bold text-lg transition-all duration-200 ${
                    isSubmitting || !turnstileToken
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-900"
                  }`}
                >
                  {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
