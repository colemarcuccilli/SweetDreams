"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, addDays, setHours, setMinutes, isBefore, isAfter, isSameDay, isWeekend } from "date-fns";
import { Clock, DollarSign, Calendar } from "lucide-react";
import "react-day-picker/dist/style.css";

export default function BookingSystem() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("hourly");
  const [hours, setHours] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM",
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM"
  ];

  const packages = [
    { id: "hourly", name: "Hourly", basePrice: 125 },
    { id: "basic", name: "Basic Package (3hrs)", price: 450 },
    { id: "standard", name: "Standard Package (5hrs)", price: 675 },
    { id: "premium", name: "Premium Package (8hrs)", price: 975 },
    { id: "sweetspot", name: "Sweet Spot (15hrs)", price: 1800 },
  ];

  const calculateDeposit = () => {
    let basePrice = 0;
    let additionalFees = 0;

    if (selectedPackage === "hourly") {
      basePrice = hours * 125;
    } else {
      const pkg = packages.find(p => p.id === selectedPackage);
      basePrice = pkg?.price || 0;
    }

    if (selectedDate && isSameDay(selectedDate, new Date())) {
      additionalFees += 100;
    }

    if (selectedDate && isWeekend(selectedDate)) {
      if (selectedPackage === "hourly") {
        additionalFees += hours * 25;
      }
    }

    const isAfterHours = selectedTimeSlot &&
      (parseInt(selectedTimeSlot) >= 18 || parseInt(selectedTimeSlot) < 9);
    if (isAfterHours) {
      additionalFees += 50;
    }

    const total = basePrice + additionalFees;
    return Math.round(total * 0.5);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select a date and time slot");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/music/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: selectedDate.toISOString(),
          endTime: addDays(selectedDate, 1).toISOString(),
          package: selectedPackage,
          hours: selectedPackage === "hourly" ? hours : undefined,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="booking" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl md:text-7xl font-black text-center mb-12 uppercase tracking-tight">BOOK YOUR SESSION</h2>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar size={24} />
              Select Date & Time
            </h3>

            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={[
                { before: new Date() },
                { dayOfWeek: [0] }
              ]}
              className="mb-6"
            />

            {selectedDate && (
              <div>
                <h4 className="font-semibold mb-3">Available Time Slots:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 px-3 rounded text-sm font-medium transition ${
                        selectedTimeSlot === slot
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Select Package</h3>

            <div className="space-y-2 mb-6">
              {packages.map((pkg) => (
                <label
                  key={pkg.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    selectedPackage === pkg.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="package"
                      value={pkg.id}
                      checked={selectedPackage === pkg.id}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      className="text-purple-600"
                    />
                    <span>{pkg.name}</span>
                  </div>
                  <span className="font-semibold">
                    ${pkg.id === "hourly" ? `${pkg.basePrice}/hr` : pkg.price}
                  </span>
                </label>
              ))}
            </div>

            {selectedPackage === "hourly" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Number of Hours:
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}

            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Deposit Amount (50%):</span>
                <span className="text-2xl font-bold text-purple-600">
                  ${calculateDeposit()}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Final payment due after session completion
              </p>
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTimeSlot || isLoading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                selectedDate && selectedTimeSlot && !isLoading
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Processing..." : "Confirm and Pay Deposit"}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 max-w-2xl mx-auto">
          <p>
            <strong>Studio Hours:</strong> Monday-Saturday 10:00 AM - 6:00 PM
          </p>
          <p>After hours sessions available with additional fee</p>
        </div>
      </div>
    </section>
  );
}