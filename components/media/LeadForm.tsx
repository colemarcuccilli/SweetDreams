"use client";

import { useState } from "react";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/media/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 font-bold text-lg transition-all duration-200 ${
                    isSubmitting
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