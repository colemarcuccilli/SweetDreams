"use client";

import { useState } from "react";
import styles from "./MusicContactForm.module.css";

export default function MusicContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/music/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
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
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (Optional)"
            className={styles.input}
            value={formData.phone}
            onChange={handleChange}
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

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
          </button>
        </form>
      </div>
    </div>
  );
}
