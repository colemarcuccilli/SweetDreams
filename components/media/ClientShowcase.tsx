export default function ClientShowcase() {
  const clients = [
    "Fort Wayne Vintage",
    "Ride Worx",
    "City Festival",
    "Tech Solutions Inc.",
    "Urban Development Group",
    "Creative Studios",
    "Local Motors",
    "Innovation Hub",
  ];

  return (
    <section className="py-32 border-t">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="mb-20">
          <h2 className="text-6xl md:text-7xl font-black uppercase mb-6">CLIENTS</h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            Trusted by leading brands and organizations across Indiana.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8">
          {clients.map((client, index) => (
            <div
              key={index}
              className="text-2xl font-bold text-gray-400 hover:text-gray-900 transition-colors duration-300 uppercase tracking-tight"
            >
              {client}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}