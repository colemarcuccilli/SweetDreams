'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addDays, isSameDay as isSameDayFns } from 'date-fns';
import 'react-day-picker/dist/style.css';
import styles from './BookingCalendar.module.css';
import {
  getSessionProducts,
  isAfterHours,
  isSameDay,
  isValidBookingTime,
  isTooSoonToBook,
  calculateSameDayFee,
  calculateAfterHoursFee,
  calculateOvertimeHours,
  BOOKING_PRODUCTS,
  STUDIO_HOURS
} from '@/lib/booking-config';
import { createClient } from '@/utils/supabase/client';
import AuthModal from './AuthModal';

interface BookingCalendarProps {
  onBookingSubmit?: (bookingData: BookingData) => void;
}

export interface BookingData {
  date: Date;
  startTime: number; // hour (0-23)
  startMinute: number; // minute (0 or 30)
  duration: number; // hours
  depositAmount: number;
  totalAmount: number;
  guestCount: number;
  fees: {
    sameDayFee: boolean;
    afterHoursFee: boolean;
  };
}

// Generate time slots with half-hour intervals from 9 AM to 11 PM
const TIME_SLOTS: Array<{ hour: number; minute: number; label: string }> = [];
for (let hour = 9; hour <= 23; hour++) {
  TIME_SLOTS.push({ hour, minute: 0, label: format(new Date().setHours(hour, 0), 'h:mm a') });
  if (hour < 23) { // Don't add 11:30 PM as last slot
    TIME_SLOTS.push({ hour, minute: 30, label: format(new Date().setHours(hour, 30), 'h:mm a') });
  }
}

const SESSION_DURATIONS = [1, 2, 3, 4, 5, 6]; // hours

export default function BookingCalendar({ onBookingSubmit }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<number>();
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [duration, setDuration] = useState<number>(2);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstTimeBooker, setIsFirstTimeBooker] = useState(false);
  const [showDiscountHint, setShowDiscountHint] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  const supabase = createClient();

  // Check authentication status and load user data
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      console.log('🔐 BookingCalendar: Auth check', {
        hasUser: !!user,
        email: user?.email,
        currentEmailValue: customerEmail
      });

      if (user) {
        setIsAuthenticated(true);
        setCustomerEmail(user.email || '');

        // Auto-fill user data from Supabase auth metadata
        if (user.user_metadata) {
          setFirstName(user.user_metadata.first_name || '');
          setLastName(user.user_metadata.last_name || '');
          setArtistName(user.user_metadata.artist_name || '');
          setCustomerPhone(user.user_metadata.phone || '');
        }

        // Check if this is a first-time booker
        const { data: previousBookings } = await supabase
          .from('bookings')
          .select('id')
          .eq('customer_email', user.email)
          .limit(1);

        if (!previousBookings || previousBookings.length === 0) {
          setIsFirstTimeBooker(true);
        }

        console.log('✅ User authenticated:', user.email);
        console.log('📋 First time booker:', !previousBookings || previousBookings.length === 0);
      } else {
        // IMPORTANT: Clear all user data when not authenticated
        console.log('❌ No user - clearing all fields');
        setIsAuthenticated(false);
        setCustomerEmail('');
        setFirstName('');
        setLastName('');
        setArtistName('');
        setCustomerPhone('');
        setIsFirstTimeBooker(false);
      }

      // Mark auth check as complete
      setAuthCheckComplete(true);
    };

    checkAuth();

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔐 BookingCalendar: Auth state changed:', _event);

      if (session?.user) {
        setIsAuthenticated(true);
        setCustomerEmail(session.user.email || '');

        if (session.user.user_metadata) {
          setFirstName(session.user.user_metadata.first_name || '');
          setLastName(session.user.user_metadata.last_name || '');
          setArtistName(session.user.user_metadata.artist_name || '');
          setCustomerPhone(session.user.user_metadata.phone || '');
        }

        // Check if first-time booker
        const { data: previousBookings } = await supabase
          .from('bookings')
          .select('id')
          .eq('customer_email', session.user.email)
          .limit(1);

        if (!previousBookings || previousBookings.length === 0) {
          setIsFirstTimeBooker(true);
        }

        console.log('✅ User logged in:', session.user.email);
      } else {
        // IMPORTANT: Clear all user data when logged out
        console.log('❌ User logged out - clearing all fields');
        setIsAuthenticated(false);
        setCustomerEmail('');
        setFirstName('');
        setLastName('');
        setArtistName('');
        setCustomerPhone('');
        setIsFirstTimeBooker(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Adjust duration if it becomes invalid when time changes
  const handleTimeSelect = async (hour: number, minute: number) => {
    setSelectedTime(hour);
    setSelectedMinute(minute);

    // If current duration is invalid for this time, find the longest valid duration
    if (!isValidBookingTime(hour, duration)) {
      for (let hrs = 5; hrs >= 1; hrs--) {
        if (isValidBookingTime(hour, hrs)) {
          setDuration(hrs);
          break;
        }
      }
    }

    // Only show auth modal if auth check is complete AND user is not authenticated
    if (authCheckComplete && !isAuthenticated) {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = async () => {
    setIsAuthModalOpen(false);
    setIsAuthenticated(true);

    // Reload user data
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCustomerEmail(user.email || '');

      if (user.user_metadata) {
        setFirstName(user.user_metadata.first_name || '');
        setLastName(user.user_metadata.last_name || '');
        setArtistName(user.user_metadata.artist_name || '');
        setCustomerPhone(user.user_metadata.phone || '');
      }
    }
  };

  // Calculate pricing
  const calculatePricing = () => {
    if (!selectedDate || selectedTime === undefined) {
      return { deposit: 0, total: 0, fees: { sameDayFee: false, afterHoursFee: false }, feeAmounts: { sameDayFee: 0, afterHoursFee: 0 }, overtimeHours: 0 };
    }

    const { deposit: depositProduct } = getSessionProducts(duration);
    let depositAmount = depositProduct.amount;
    let totalAmount = depositAmount * 2; // Deposit + Remainder

    // For 1-hour sessions, total = deposit (no remainder)
    if (duration === 1) {
      totalAmount = depositAmount;
    }

    // Calculate how many hours fall after 9 PM
    const overtimeHours = calculateOvertimeHours(selectedTime, duration);

    const fees = {
      sameDayFee: isSameDay(selectedDate),
      afterHoursFee: overtimeHours > 0
    };

    const feeAmounts = {
      sameDayFee: 0,
      afterHoursFee: 0
    };

    // Add fees to total
    if (fees.sameDayFee) {
      feeAmounts.sameDayFee = calculateSameDayFee(duration);
      totalAmount += feeAmounts.sameDayFee;
    }
    if (fees.afterHoursFee) {
      feeAmounts.afterHoursFee = calculateAfterHoursFee(overtimeHours);
      totalAmount += feeAmounts.afterHoursFee;
    }

    return { deposit: depositAmount, total: totalAmount, fees, feeAmounts, overtimeHours };
  };

  const pricing = calculatePricing();

  // Disable past dates and Sundays
  const disabledDays = [
    { before: new Date() },
    { dayOfWeek: [0] } // Sunday
  ];

  const handleSubmit = async () => {
    // Require authentication before booking
    if (!isAuthenticated) {
      alert('Please sign in or create an account to complete your booking.');
      setIsAuthModalOpen(true);
      return;
    }

    // Check if email is verified
    const { data: { user } } = await supabase.auth.getUser();
    if (user && !user.email_confirmed_at) {
      alert('Please verify your email address before booking. Check your inbox for the verification email from Supabase.');
      return;
    }

    if (!selectedDate || selectedTime === undefined || !firstName || !lastName || !artistName || !customerEmail) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate booking time
    if (!isValidBookingTime(selectedTime, duration)) {
      alert('Invalid booking time. This session would exceed studio hours (closes at 3:00 AM).');
      return;
    }

    // Check 2-hour minimum advance booking
    if (isTooSoonToBook(selectedDate, selectedTime, selectedMinute)) {
      alert('Bookings must be made at least 2 hours in advance. Please select a later time.');
      return;
    }

    // Check if time slot is blocked by admin
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const availabilityResponse = await fetch(
        `/api/music/check-availability?date=${dateStr}&startTime=${selectedTime}&duration=${duration}`
      );
      const availabilityData = await availabilityResponse.json();

      if (!availabilityData.available) {
        alert('Sorry, this time slot is not available. Please select a different time or date.');
        return;
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Failed to verify availability. Please try again.');
      return;
    }

    const bookingData: BookingData = {
      date: selectedDate,
      startTime: selectedTime,
      startMinute: selectedMinute,
      duration,
      depositAmount: pricing.deposit,
      totalAmount: pricing.total,
      guestCount,
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
                {TIME_SLOTS.map((slot) => {
                  const isAfterHoursSlot = isAfterHours(slot.hour);
                  const isTooSoon = selectedDate && isTooSoonToBook(selectedDate, slot.hour, slot.minute);
                  const isSelected = selectedTime === slot.hour && selectedMinute === slot.minute;

                  return (
                    <button
                      key={`${slot.hour}-${slot.minute}`}
                      className={`${styles.timeButton} ${isSelected ? styles.active : ''} ${
                        isAfterHoursSlot ? styles.afterHours : ''
                      }`}
                      onClick={() => handleTimeSelect(slot.hour, slot.minute)}
                      disabled={isTooSoon}
                      title={isTooSoon ? 'Must book at least 2 hours in advance' : ''}
                    >
                      {slot.label}
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
                  disabled={isAuthenticated}
                  style={isAuthenticated ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
                />
                {isAuthenticated && (
                  <p className={styles.helpText}>Using your verified account email</p>
                )}
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

              <div className={styles.formGroup}>
                <label className={styles.label}>Number of Guests *</label>
                <input
                  type="number"
                  className={styles.input}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Math.max(1, Math.min(3, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="3"
                  placeholder="1"
                  required
                />
                <p className={styles.helpText}>Including yourself (max 4 people total)</p>
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
                    <span>Same Day Fee ({duration} hrs × $10)</span>
                    <span>+${(pricing.feeAmounts.sameDayFee / 100).toFixed(2)}</span>
                  </div>
                )}
                {pricing.fees.afterHoursFee && (
                  <div className={styles.summaryRow}>
                    <span>After Hours Fee ({pricing.overtimeHours} {pricing.overtimeHours === 1 ? 'hr' : 'hrs'} after 9pm × $10)</span>
                    <span>+${(pricing.feeAmounts.afterHoursFee / 100).toFixed(2)}</span>
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

              {/* First-Timer Discount Hint */}
              {isFirstTimeBooker && (
                <div className={styles.discountHint}>
                  <div className={styles.discountBadge}>
                    <span className={styles.discountIcon}>🎉</span>
                    <div>
                      <p className={styles.discountTitle}>Welcome to Dream Suite!</p>
                      <p className={styles.discountText}>
                        New Account Special: Use code <strong>FIRSTTIME40</strong> at checkout for 40% off your first session
                      </p>
                    </div>
                  </div>
                </div>
              )}

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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
