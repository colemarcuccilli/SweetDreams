"use client";

export default function MediaHero() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="max-w-5xl">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight mb-8">
            YOUR VISION,
            <br />
            <span className="text-gray-400">AMPLIFIED</span>
          </h1>

          <div className="max-w-2xl mb-12">
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Transform your brand story into compelling visual narratives that
              captivate audiences and drive results.
            </p>
          </div>

          <button
            onClick={scrollToContact}
            className="group inline-flex items-center gap-3 text-lg font-medium border-2 border-black hover:bg-black hover:text-white px-8 py-4 transition-all duration-200"
          >
            DISCUSS YOUR VISION
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}