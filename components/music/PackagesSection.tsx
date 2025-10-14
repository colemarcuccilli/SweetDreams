import { Check, Star } from "lucide-react";

export default function PackagesSection() {
  const packages = [
    {
      name: "Basic",
      price: "$450",
      features: [
        "3 hours of studio time",
        "Professional recording",
        "Basic mixing",
      ],
      addons: ["Extra hour: $100", "Videography: +$125", "Mastering: +$50"],
      popular: false,
    },
    {
      name: "Standard",
      price: "$675",
      features: [
        "5 hours of studio time",
        "Professional recording",
        "Advanced mixing",
        "Basic mastering included",
      ],
      addons: ["Extra hour: $75", "Videography: +$100", "Advanced mastering: +$25"],
      popular: true,
    },
    {
      name: "Premium",
      price: "$975",
      features: [
        "8 hours of studio time",
        "Professional recording",
        "Advanced mixing",
        "Professional mastering",
        "2 revisions included",
      ],
      addons: ["Extra hour: $50", "Videography: +$75", "Additional revision: +$25"],
      popular: false,
    },
  ];

  return (
    <section id="packages" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl md:text-7xl font-black text-center mb-12 uppercase tracking-tight">STUDIO PACKAGES</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg p-8 relative ${
                pkg.popular ? "ring-2 ring-purple-500" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star size={16} />
                    Most Popular
                  </div>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4">{pkg.name} Package</h3>
              <div className="text-4xl font-bold mb-6 text-purple-600">
                {pkg.price}
              </div>
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2">
                    <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2 text-sm">Discounted Add-ons:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {pkg.addons.map((addon, aIndex) => (
                    <li key={aIndex}>{addon}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}