"use client";

import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking");
    bookingSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent uppercase tracking-tighter leading-none">
          DEVELOP<br/>YOUR BRAND,<br/>YOUR WAY
        </h1>
        <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto font-bold uppercase tracking-wide">
          FORT WAYNE'S PREMIER DESTINATION FOR ARTISTS
        </p>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-semibold">
          STATE-OF-THE-ART FACILITY • EXPERT TEAM • CREATIVE DREAMS TO LIFE
        </p>
        <button
          onClick={scrollToBooking}
          className="bg-purple-600 hover:bg-purple-700 text-white font-black px-12 py-6 rounded-lg text-2xl transition-colors inline-flex items-center gap-3 uppercase tracking-wide"
        >
          BOOK A SESSION
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
}