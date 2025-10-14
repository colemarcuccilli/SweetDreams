"use client";

import { useState } from "react";
import {
  Music, Video, Mic, Sliders, Clock, Calendar, DollarSign,
  Check, Star, ChevronDown, Menu, X, Facebook, Instagram,
  Youtube, Mail, Phone, MapPin, AlertCircle, CheckCircle,
  XCircle, Info, Loader2, ArrowRight, Play, Pause, Volume2
} from "lucide-react";

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState("typography");
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    "typography", "colors", "buttons", "cards", "forms",
    "sections", "animations", "creative"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Sweet Dreams Design System</h1>
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition ${
                  activeTab === tab
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "typography" && <TypographySection />}
        {activeTab === "colors" && <ColorsSection />}
        {activeTab === "buttons" && <ButtonsSection />}
        {activeTab === "cards" && <CardsSection />}
        {activeTab === "forms" && <FormsSection />}
        {activeTab === "sections" && <SectionsShowcase />}
        {activeTab === "animations" && <AnimationsSection />}
        {activeTab === "creative" && <CreativeSection />}
      </div>
    </div>
  );
}

function TypographySection() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-6">Typography Scale</h2>

        <div className="space-y-6 bg-white p-8 rounded-lg">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 mb-2">H1 - text-7xl</p>
            <h1 className="text-7xl font-bold">Sweet Dreams</h1>
          </div>

          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 mb-2">H2 - text-5xl</p>
            <h2 className="text-5xl font-bold">Develop Your Brand</h2>
          </div>

          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 mb-2">H3 - text-4xl</p>
            <h3 className="text-4xl font-bold">Studio Packages</h3>
          </div>

          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 mb-2">H4 - text-2xl</p>
            <h4 className="text-2xl font-semibold">Professional Recording</h4>
          </div>

          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 mb-2">H5 - text-xl</p>
            <h5 className="text-xl font-semibold">Additional Services</h5>
          </div>

          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 mb-2">Body Large - text-lg</p>
            <p className="text-lg">Welcome to Sweet Dreams Music, Fort Wayne's premier destination.</p>
          </div>

          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 mb-2">Body Regular - text-base</p>
            <p className="text-base">Our state-of-the-art facility offers professional recording services.</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Small - text-sm</p>
            <p className="text-sm">Terms and conditions apply. See studio for details.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Font Weights</h2>
        <div className="bg-white p-8 rounded-lg space-y-4">
          <p className="font-normal">Font Weight 400 - Regular</p>
          <p className="font-medium">Font Weight 500 - Medium</p>
          <p className="font-semibold">Font Weight 600 - Semibold</p>
          <p className="font-bold">Font Weight 700 - Bold</p>
        </div>
      </section>
    </div>
  );
}

function ColorsSection() {
  const colorGroups = [
    {
      name: "Purple (Music Brand)",
      colors: [
        { name: "purple-50", value: "bg-purple-50", text: "text-purple-900" },
        { name: "purple-100", value: "bg-purple-100", text: "text-purple-900" },
        { name: "purple-200", value: "bg-purple-200", text: "text-purple-900" },
        { name: "purple-300", value: "bg-purple-300", text: "text-purple-900" },
        { name: "purple-400", value: "bg-purple-400", text: "text-white" },
        { name: "purple-500", value: "bg-purple-500", text: "text-white" },
        { name: "purple-600", value: "bg-purple-600", text: "text-white" },
        { name: "purple-700", value: "bg-purple-700", text: "text-white" },
        { name: "purple-800", value: "bg-purple-800", text: "text-white" },
        { name: "purple-900", value: "bg-purple-900", text: "text-white" },
      ]
    },
    {
      name: "Blue (Media Brand)",
      colors: [
        { name: "blue-50", value: "bg-blue-50", text: "text-blue-900" },
        { name: "blue-100", value: "bg-blue-100", text: "text-blue-900" },
        { name: "blue-200", value: "bg-blue-200", text: "text-blue-900" },
        { name: "blue-300", value: "bg-blue-300", text: "text-blue-900" },
        { name: "blue-400", value: "bg-blue-400", text: "text-white" },
        { name: "blue-500", value: "bg-blue-500", text: "text-white" },
        { name: "blue-600", value: "bg-blue-600", text: "text-white" },
        { name: "blue-700", value: "bg-blue-700", text: "text-white" },
        { name: "blue-800", value: "bg-blue-800", text: "text-white" },
        { name: "blue-900", value: "bg-blue-900", text: "text-white" },
      ]
    },
    {
      name: "Status Colors",
      colors: [
        { name: "Success", value: "bg-green-500", text: "text-white" },
        { name: "Warning", value: "bg-yellow-500", text: "text-white" },
        { name: "Error", value: "bg-red-500", text: "text-white" },
        { name: "Info", value: "bg-blue-500", text: "text-white" },
      ]
    },
    {
      name: "Gradients",
      colors: [
        { name: "Purple Gradient", value: "bg-gradient-to-br from-purple-500 to-purple-700", text: "text-white" },
        { name: "Blue Gradient", value: "bg-gradient-to-br from-blue-500 to-blue-700", text: "text-white" },
        { name: "Hero Gradient", value: "bg-gradient-to-br from-purple-50 to-purple-100", text: "text-purple-900" },
        { name: "Dark Gradient", value: "bg-gradient-to-br from-gray-800 to-gray-900", text: "text-white" },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {colorGroups.map((group) => (
        <section key={group.name}>
          <h3 className="text-xl font-bold mb-4">{group.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {group.colors.map((color) => (
              <div key={color.name} className="text-center">
                <div className={`${color.value} ${color.text} rounded-lg p-8 mb-2`}>
                  <span className="font-semibold">Aa</span>
                </div>
                <p className="text-sm">{color.name}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ButtonsSection() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-bold mb-4">Button Sizes</h3>
        <div className="bg-white p-8 rounded-lg space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition">
              Small Button
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition">
              Default Button
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg transition">
              Large Button
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Button Variants</h3>
        <div className="bg-white p-8 rounded-lg space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition">
              Primary
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg transition">
              Secondary
            </button>
            <button className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg transition">
              Outline
            </button>
            <button className="text-purple-600 hover:text-purple-700 px-6 py-3 transition">
              Text Only
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition">
              Danger
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Button States</h3>
        <div className="bg-white p-8 rounded-lg space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition">
              Normal
            </button>
            <button className="bg-purple-700 text-white px-6 py-3 rounded-lg">
              Hover/Focus
            </button>
            <button className="bg-purple-800 text-white px-6 py-3 rounded-lg">
              Active
            </button>
            <button disabled className="bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed opacity-50">
              Disabled
            </button>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              Loading
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Icon Buttons</h3>
        <div className="bg-white p-8 rounded-lg">
          <div className="flex items-center gap-4 flex-wrap">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition">
              <Music size={20} />
              With Icon
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition">
              Next Step
              <ArrowRight size={20} />
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition">
              <Play size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function CardsSection() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-bold mb-4">Basic Cards</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-xl font-semibold mb-2">Default Card</h4>
            <p className="text-gray-600">This is a basic card with shadow.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
            <h4 className="text-xl font-semibold mb-2">Hover Card</h4>
            <p className="text-gray-600">This card elevates on hover.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg ring-2 ring-purple-500 p-6">
            <h4 className="text-xl font-semibold mb-2">Featured Card</h4>
            <p className="text-gray-600">This card has a colored ring.</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Service Cards</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <Music className="text-purple-600 mb-4" size={40} />
            <h4 className="font-semibold mb-2">Original Beats</h4>
            <p className="text-sm text-gray-600">Custom production</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <Video className="text-purple-600 mb-4" size={40} />
            <h4 className="font-semibold mb-2">Videography</h4>
            <p className="text-sm text-gray-600">Music videos</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <Mic className="text-purple-600 mb-4" size={40} />
            <h4 className="font-semibold mb-2">Recording</h4>
            <p className="text-sm text-gray-600">Pro studio</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <Sliders className="text-purple-600 mb-4" size={40} />
            <h4 className="font-semibold mb-2">Mixing</h4>
            <p className="text-sm text-gray-600">Post-production</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Pricing Card</h3>
        <div className="max-w-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Star size={16} />
                Most Popular
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Standard Package</h3>
            <div className="text-4xl font-bold mb-6 text-purple-600">$675</div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <span>5 hours of studio time</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <span>Professional recording</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <span>Advanced mixing included</span>
              </li>
            </ul>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition">
              Book Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FormsSection() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-bold mb-4">Input Fields</h3>
        <div className="bg-white p-8 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Default Input</label>
            <input
              type="text"
              placeholder="Enter text..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">With Error</label>
            <input
              type="email"
              defaultValue="invalid-email"
              className="w-full px-4 py-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-200 transition"
            />
            <p className="text-red-500 text-sm mt-1">Please enter a valid email</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Disabled</label>
            <input
              type="text"
              disabled
              placeholder="Disabled input"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Textarea</label>
            <textarea
              rows={4}
              placeholder="Enter your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Select & Radio</h3>
        <div className="bg-white p-8 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Select Dropdown</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition">
              <option>Choose an option</option>
              <option>Basic Package</option>
              <option>Standard Package</option>
              <option>Premium Package</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Radio Group</label>
            <div className="space-y-2">
              {["Hourly", "Basic", "Standard", "Premium"].map((option) => (
                <label key={option} className="flex items-center gap-3 p-3 rounded-lg border hover:border-purple-500 cursor-pointer transition">
                  <input type="radio" name="package" className="text-purple-600" />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Contact Form</h3>
        <div className="max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h4 className="text-2xl font-bold mb-6">Get in Touch</h4>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionsShowcase() {
  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-12">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
          Hero Section Example
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-3xl">
          This is how a hero section looks with gradient background and large typography.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition">
          Call to Action
        </button>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Stats Bar</h3>
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg p-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">400k+</div>
              <div className="text-purple-100">Total Views</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">130+</div>
              <div className="text-purple-100">Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24hr</div>
              <div className="text-purple-100">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Testimonial</h3>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="text-yellow-400 fill-yellow-400" size={24} />
            ))}
          </div>
          <blockquote className="text-lg text-center mb-4 italic">
            "Sweet Dreams transformed my music. The production quality is unmatched,
            and the team's creativity brought my vision to life in ways I never imagined."
          </blockquote>
          <cite className="block text-center text-gray-600">- John Doe, Recording Artist</cite>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Alert Messages</h3>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-green-900">Success!</p>
              <p className="text-green-700">Your booking has been confirmed.</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-yellow-900">Warning</p>
              <p className="text-yellow-700">Your session is scheduled for tomorrow.</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700">Payment processing failed. Please try again.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="text-blue-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-blue-900">Information</p>
              <p className="text-blue-700">Studio hours are Monday-Saturday, 10AM-6PM.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AnimationsSection() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-bold mb-4">Hover Animations</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer">
            <p className="font-semibold">Scale Up</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:-translate-y-2 transition-transform cursor-pointer">
            <p className="font-semibold">Lift Up</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:rotate-3 transition-transform cursor-pointer">
            <p className="font-semibold">Rotate</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow cursor-pointer">
            <p className="font-semibold">Shadow Grow</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Loading States</h3>
        <div className="bg-white p-8 rounded-lg space-y-6">
          <div className="flex items-center gap-4">
            <Loader2 className="animate-spin text-purple-600" size={32} />
            <span>Spinner Animation</span>
          </div>

          <div className="w-full">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <span className="text-sm text-gray-600">Progress Bar</span>
          </div>

          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <span className="text-sm text-gray-600">Skeleton Loading</span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Pulse & Ping</h3>
        <div className="bg-white p-8 rounded-lg flex items-center gap-8">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            <span className="ml-6">Live Status</span>
          </div>

          <div className="relative inline-flex">
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg">
              New Messages
            </button>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </div>
        </div>
      </section>
    </div>
  );
}

function CreativeSection() {
  return (
    <div className="space-y-12">
      <section>
        <h3 className="text-xl font-bold mb-6">Large Display Typography</h3>
        <div className="bg-gradient-to-br from-purple-900 to-purple-600 text-white p-12 rounded-lg">
          <h1 className="text-8xl md:text-9xl font-bold mb-4">
            DREAM
          </h1>
          <h2 className="text-6xl md:text-7xl font-light opacity-80">
            BIG
          </h2>
          <p className="text-2xl mt-8 max-w-2xl">
            Push boundaries with oversized typography that demands attention
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6">Split Screen Design</h3>
        <div className="grid md:grid-cols-2 h-96 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-12 flex flex-col justify-center text-white">
            <Music size={64} className="mb-4" />
            <h3 className="text-4xl font-bold mb-2">Music</h3>
            <p className="text-lg opacity-90">Create your sound</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-12 flex flex-col justify-center text-white">
            <Video size={64} className="mb-4" />
            <h3 className="text-4xl font-bold mb-2">Media</h3>
            <p className="text-lg opacity-90">Tell your story</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6">Overlapping Elements</h3>
        <div className="relative bg-gray-100 rounded-lg p-12">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
            <h4 className="text-2xl font-bold mb-4">Featured Content</h4>
            <p>Main content area with shadow for depth</p>
          </div>
          <div className="absolute -bottom-6 -right-6 bg-purple-600 text-white rounded-lg p-6 max-w-xs">
            <p className="font-semibold">Overlapping accent box</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6">Text Overlays on Images</h3>
        <div className="relative h-64 bg-gradient-to-br from-purple-400 to-blue-600 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative h-full flex items-center justify-center text-center text-white p-8">
            <div>
              <h2 className="text-5xl font-bold mb-4">Studio Sessions</h2>
              <p className="text-xl">Professional recording in Fort Wayne</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6">Artistic Number Display</h3>
        <div className="bg-white rounded-lg p-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-7xl font-bold text-purple-600 mb-2">
                01
              </div>
              <h4 className="text-xl font-semibold">Record</h4>
              <p className="text-gray-600">Capture your sound</p>
            </div>
            <div>
              <div className="text-7xl font-bold text-purple-500 mb-2">
                02
              </div>
              <h4 className="text-xl font-semibold">Produce</h4>
              <p className="text-gray-600">Perfect your mix</p>
            </div>
            <div>
              <div className="text-7xl font-bold text-purple-400 mb-2">
                03
              </div>
              <h4 className="text-xl font-semibold">Release</h4>
              <p className="text-gray-600">Share with world</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6">Diagonal Section Divider</h3>
        <div className="relative">
          <div className="bg-purple-600 text-white p-12 rounded-t-lg">
            <h3 className="text-3xl font-bold">Top Section</h3>
            <p>Content in the upper area</p>
          </div>
          <svg className="w-full h-24 -mb-px" viewBox="0 0 100 20" preserveAspectRatio="none">
            <polygon points="0,0 100,20 0,20" fill="#9333EA" />
            <polygon points="100,20 0,20 100,20" fill="#ffffff" />
          </svg>
          <div className="bg-white p-12 rounded-b-lg">
            <h3 className="text-3xl font-bold">Bottom Section</h3>
            <p>Content in the lower area with diagonal transition</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6">Floating Action Buttons</h3>
        <div className="relative bg-gray-100 rounded-lg p-12 h-64">
          <p className="text-center text-gray-600">Main content area</p>
          <button className="absolute bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all">
            <Phone size={24} />
          </button>
          <button className="absolute bottom-6 right-20 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all">
            <Mail size={24} />
          </button>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6">Glassmorphism Effect</h3>
        <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-12 rounded-lg">
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-8 border border-white/30">
            <h4 className="text-3xl font-bold text-white mb-4">Glass Card</h4>
            <p className="text-white/90">
              This card has a frosted glass effect with backdrop blur
            </p>
            <button className="mt-6 bg-white/30 hover:bg-white/40 text-white px-6 py-3 rounded-lg backdrop-blur transition">
              Glass Button
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6">Creative Price Display</h3>
        <div className="bg-white rounded-lg p-12">
          <div className="text-center">
            <div className="inline-block relative">
              <span className="text-3xl text-gray-500 align-top">$</span>
              <span className="text-8xl font-bold text-purple-600">675</span>
              <span className="absolute -top-2 -right-12 bg-red-500 text-white text-sm px-2 py-1 rounded-full transform rotate-12">
                SAVE 25%
              </span>
            </div>
            <p className="mt-4 text-xl text-gray-600">Standard Package</p>
            <p className="text-gray-500">Most popular choice</p>
          </div>
        </div>
      </section>
    </div>
  );
}