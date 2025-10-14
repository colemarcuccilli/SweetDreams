import { Music, Video, Mic, Sliders } from "lucide-react";

export default function ServicesGrid() {
  const services = [
    {
      icon: <Music size={40} />,
      title: "Original Beats",
      description: "Custom-produced beats tailored to your unique style and vision",
    },
    {
      icon: <Video size={40} />,
      title: "Videography",
      description: "Professional music videos and visual content creation",
    },
    {
      icon: <Mic size={40} />,
      title: "Recording",
      description: "State-of-the-art recording studio with expert engineers",
    },
    {
      icon: <Sliders size={40} />,
      title: "Mixing & Mastering",
      description: "Professional post-production to make your tracks radio-ready",
    },
  ];

  return (
    <section id="services" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl md:text-7xl font-black text-center mb-12 uppercase tracking-tight">OUR SERVICES</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-purple-600 mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}