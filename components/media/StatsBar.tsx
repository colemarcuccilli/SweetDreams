export default function StatsBar() {
  const stats = [
    { value: "400K+", label: "TOTAL VIEWS" },
    { value: "130+", label: "PROJECTS COMPLETED" },
    { value: "24HR", label: "RESPONSE TIME" },
  ];

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-5xl md:text-6xl font-black mb-3">{stat.value}</div>
              <div className="text-gray-400 uppercase tracking-widest text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}