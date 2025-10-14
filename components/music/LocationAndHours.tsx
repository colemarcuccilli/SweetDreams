import { MapPin, Clock, AlertCircle } from "lucide-react";

export default function LocationAndHours() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl md:text-7xl font-black text-center mb-12 uppercase tracking-tight">FIND US</h2>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="text-purple-600" />
                Location
              </h3>

              <div className="mb-6">
                <p className="font-semibold text-lg mb-2">Sweet Dreams Music Studio</p>
                <p className="text-gray-600">3943 Parnell Ave</p>
                <p className="text-gray-600">Fort Wayne, IN 46805</p>
              </div>

              <div className="aspect-video bg-gray-200 rounded-lg mb-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.0!2d-85.1!3d41.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA2JzA3LjAiTiA4NcKwMDgnMzguMCJX!5e0!3m2!1sen!2sus!4v0"
                  width="100%"
                  height="100%"
                  className="rounded-lg"
                  loading="lazy"
                ></iframe>
              </div>

              <a
                href="https://maps.google.com/?q=3943+Parnell+Ave+Fort+Wayne+IN+46805"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition"
              >
                Get Directions
                <span>→</span>
              </a>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Clock className="text-purple-600" />
                Studio Hours
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-semibold">Monday - Friday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-semibold">Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b text-gray-500">
                  <span className="font-semibold">Sunday</span>
                  <span>Closed</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">After Hours Sessions:</span> Available 6PM-9AM
                  with additional $50 fee
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <AlertCircle className="text-yellow-600" />
                Important Information
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• 50% deposit required to secure booking</li>
                <li>• 24-hour cancellation policy</li>
                <li>• Free parking available on-site</li>
                <li>• All sessions include engineer</li>
              </ul>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-2">Questions? Ready to book?</p>
              <p className="text-2xl font-bold text-purple-600">
                <a href="tel:260-416-5955" className="hover:text-purple-700 transition">
                  (260) 416-5955
                </a>
              </p>
              <p className="text-gray-600">
                <a href="mailto:music@sweetdreamsmusic.com" className="hover:text-purple-600 transition">
                  music@sweetdreamsmusic.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}