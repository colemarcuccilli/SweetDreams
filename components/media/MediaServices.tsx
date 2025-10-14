import { Film, Video, Camera, Briefcase } from "lucide-react";

export default function MediaServices() {
  const services = [
    {
      icon: <Film size={48} />,
      title: "BRAND FILMS",
      description: "Cinematic storytelling that defines your brand",
    },
    {
      icon: <Video size={48} />,
      title: "COMMERCIALS",
      description: "High-impact content that drives conversions",
    },
    {
      icon: <Camera size={48} />,
      title: "EVENT COVERAGE",
      description: "Capturing moments that matter",
    },
    {
      icon: <Briefcase size={48} />,
      title: "CORPORATE CONTENT",
      description: "Professional videos for business communication",
    },
  ];

  return (
    <section className="py-32 border-t">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="mb-20">
          <h2 className="text-6xl md:text-7xl font-black uppercase mb-6">SERVICES</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="mb-6 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="font-bold text-lg mb-3 uppercase tracking-wide">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}