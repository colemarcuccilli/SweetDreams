'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addDays, isSameDay as isSameDayFns } from 'date-fns';
import 'react-day-picker/dist/style.css';
import styles from './BookingCalendar.module.css';
import {
  getSessionProducts,
  isAfterHours,
  isSameDay,
  isValidBookingTime,
  BOOKING_PRODUCTS,
  STUDIO_HOURS
} from '@/lib/booking-config';

interface BookingCalendarProps {
  onBookingSubmit?: (bookingData: BookingData) => void;
}

export interface BookingData {
  date: Date;
  startTime: number; // hour (0-23)
  duration: number; // hours
  depositAmount: number;
  totalAmount: number;
  fees: {
    sameDayFee: boolean;
    afterHoursFee: boolean;
  };
}

const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => i + 9); // 9 AM to 11 PM (9-23)
const SESSION_DURATIONS = [1, 2, 3, 4, 5, 6]; // hours

export default function BookingCalendar({ onBookingSubmit }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<number>();
  const [duration, setDuration] = useState<number>(2);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Adjust duration if it becomes invalid when time changes
  const handleTimeSelect = (time: number) => {
    setSelectedTime(time);

    // If current duration is invalid for this time, find the longest valid duration
    if (!isValidBookingTime(time, duration)) {
      for (let hrs = 5; hrs >= 1; hrs--) {
        if (isValidBookingTime(time, hrs)) {
          setDuration(hrs);
          break;
        }
      }
    }
  };

  // Calculate pricing
  const calculatePricing = () => {
    if (!selectedDate || selectedTime === undefined) {
      return { deposit: 0, total: 0, fees: { sameDayFee: false, afterHoursFee: false } };
    }

    const { deposit: depositProduct } = getSessionProducts(duration);
    let depositAmount = depositProduct.amount;
    let totalAmount = depositAmount * 2; // Deposit + Remainder

    // For 1-hour sessions, total = deposit (no remainder)
    if (duration === 1) {
      totalAmount = depositAmount;
    }

    const fees = {
      sameDayFee: isSameDay(selectedDate),
      afterHoursFee: isAfterHours(selectedTime)
    };

    // Add fees to total
    if (fees.sameDayFee) {
      totalAmount += BOOKING_PRODUCTS.same_day_fee.amount;
    }
    if (fees.afterHoursFee) {
      totalAmount += BOOKING_PRODUCTS.after_hours_fee.amount;
    }

    return { deposit: depositAmount, total: totalAmount, fees };
  };

  const pricing = calculatePricing();

  // Disable past dates and Sundays
  const disabledDays = [
    { before: new Date() },
    { dayOfWeek: [0] } // Sunday
  ];

  const handleSubmit = async () => {
    if (!selectedDate || selectedTime === undefined || !firstName || !lastName || !artistName || !customerEmail) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate booking time
    if (!isValidBookingTime(selectedTime, duration)) {
      alert('Invalid booking time. This session would exceed studio hours (closes at 3:00 AM).');
      return;
    }

    const bookingData: BookingData = {
      date: selectedDate,
      startTime: selectedTime,
      duration,
      depositAmount: pricing.deposit,
      totalAmount: pricing.total,
      fees: pricing.fees
    };

    if (onBookingSubmit) {
      onBookingSubmit(bookingData);
    }

    // Call API to create booking and checkout session
    try {
      const response = await fetch('/api/music/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          firstName,
          lastName,
          artistName,
          customerEmail,
          customerPhone
        })
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        alert('Error creating booking: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.bookingGrid}>
        {/* Calendar Section */}
        <div className={styles.calendarSection}>
          <h3 className={styles.sectionTitle}>Select Date</h3>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={disabledDays}
            className={styles.calendar}
          />
        </div>

        {/* Booking Details Section */}
        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Booking Details</h3>

          {/* Duration Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Session Duration</label>
            <div className={styles.durationGrid}>
              {SESSION_DURATIONS.map((hrs) => {
                const isDisabled = selectedTime !== undefined && !isValidBookingTime(selectedTime, hrs);
                return (
                  <button
                    key={hrs}
                    className={`${styles.durationButton} ${duration === hrs ? styles.active : ''}`}
                    onClick={() => setDuration(hrs)}
                    disabled={isDisabled}
                    title={isDisabled ? `${hrs} hour session would exceed studio hours` : ''}
                  >
                    {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
                  </button>
                );
              })}
            </div>
            {selectedTime !== undefined && selectedTime >= 20 && (
              <p className={styles.durationNote}>
                Late sessions (after 8 PM) may have limited duration options to stay within studio hours (closes at 3:00 AM).
              </p>
            )}
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Time</label>
              <div className={styles.timeGrid}>
                {TIME_SLOTS.map((hour) => {
                  const isAfterHoursSlot = isAfterHours(hour);
                  return (
                    <button
                      key={hour}
                      className={`${styles.timeButton} ${selectedTime === hour ? styles.active : ''} ${
                        isAfterHoursSlot ? styles.afterHours : ''
                      }`}
                      onClick={() => handleTimeSelect(hour)}
                    >
                      {format(new Date().setHours(hour, 0), 'h:mm a')}
                      {isAfterHoursSlot && <span className={styles.badge}>+$10/hr</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer Information */}
          {selectedTime !== undefined && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>First Name *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Last Name *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Artist Name *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Your artist/stage name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address *</label>
                <input
                  type="email"
                  className={styles.input}
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  className={styles.input}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Pricing Summary */}
              <div className={styles.pricingSummary}>
                <h4 className={styles.summaryTitle}>Booking Summary</h4>
                <div className={styles.summaryRow}>
                  <span>Session ({duration} {duration === 1 ? 'hour' : 'hours'})</span>
                  <span>${(pricing.deposit / 100).toFixed(2)}</span>
                </div>
                {pricing.fees.sameDayFee && (
                  <div className={styles.summaryRow}>
                    <span>Same Day Fee</span>
                    <span>+$10.00</span>
                  </div>
                )}
                {pricing.fees.afterHoursFee && (
                  <div className={styles.summaryRow}>
                    <span>After Hours Fee</span>
                    <span>+$10.00</span>
                  </div>
                )}
                <div className={styles.summaryDivider} />
                <div className={styles.summaryRow}>
                  <span className={styles.depositLabel}>Deposit Due Today</span>
                  <span className={styles.depositAmount}>${(pricing.deposit / 100).toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.totalLabel}>Total Session Cost</span>
                  <span className={styles.totalAmount}>${(pricing.total / 100).toFixed(2)}</span>
                </div>
                {duration > 1 && (
                  <p className={styles.remainderNote}>
                    Remainder of ${((pricing.total - pricing.deposit) / 100).toFixed(2)} will be charged after your session
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={!firstName || !lastName || !artistName || !customerEmail}
              >
                Proceed to Payment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
