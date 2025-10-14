import { Clock, Calendar } from "lucide-react";

export default function PricingSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl md:text-7xl font-black text-center mb-12 uppercase tracking-tight">PRICING OPTIONS</h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-purple-600" size={32} />
              <h3 className="text-2xl font-bold">Hourly Rates</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span>Recording</span>
                <span className="font-semibold">$125/hour</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Mixing</span>
                <span className="font-semibold">$100/hour</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Mastering</span>
                <span className="font-semibold">$75/track</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Beat Production</span>
                <span className="font-semibold">$150-500/beat</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Sweet Spot Package</h3>
            <div className="text-4xl font-bold mb-4">$1,800</div>
            <ul className="space-y-2">
              <li>• 15 hours of studio time</li>
              <li>• Use within 30 days</li>
              <li>• Professional recording</li>
              <li>• Advanced mixing included</li>
              <li>• Basic mastering included</li>
              <li>• Priority scheduling</li>
            </ul>
            <div className="mt-6 text-yellow-300 font-semibold">
              Save $175 vs. hourly rates!
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Calendar size={24} className="text-yellow-600" />
            Additional Fees
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">After Hours (6PM-9AM):</span>
              <span className="ml-2">+$50/session</span>
            </div>
            <div>
              <span className="font-semibold">Same-Day Booking:</span>
              <span className="ml-2">+$100</span>
            </div>
            <div>
              <span className="font-semibold">Weekend Premium:</span>
              <span className="ml-2">+$25/hour</span>
            </div>
            <div>
              <span className="font-semibold">Cancellation (&lt; 24hrs):</span>
              <span className="ml-2">50% deposit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}