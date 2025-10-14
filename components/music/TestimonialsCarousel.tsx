"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      text: "Sweet Dreams transformed my music. The production quality is unmatched, and the team's creativity brought my vision to life in ways I never imagined.",
      author: "Marcus Johnson",
      role: "Recording Artist",
    },
    {
      text: "Best studio experience in Fort Wayne! The engineers really know their stuff, and the vibe is perfect for creativity. My tracks have never sounded better.",
      author: "Sarah Chen",
      role: "Singer-Songwriter",
    },
    {
      text: "From recording to mastering, every detail was perfect. The team went above and beyond to make sure my project exceeded expectations. Highly recommend!",
      author: "The Midnight Crew",
      role: "Band",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl md:text-7xl font-black text-center mb-12 uppercase tracking-tight">CLIENT TESTIMONIALS</h2>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 relative">
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronRight size={24} />
            </button>

            <div className="text-center px-8">
              <blockquote className="text-lg md:text-xl mb-6 italic text-gray-700">
                "{testimonials[currentIndex].text}"
              </blockquote>
              <div>
                <p className="font-semibold text-lg">{testimonials[currentIndex].author}</p>
                <p className="text-gray-600">{testimonials[currentIndex].role}</p>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentIndex ? "bg-purple-600 w-8" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}