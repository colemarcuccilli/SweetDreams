// Booking system configuration for Sweet Dreams Music Studio
// Product IDs from Stripe

export interface BookingProduct {
  productId: string;
  priceId: string; // You'll need to get these from Stripe
  name: string;
  amount: number; // in cents
  type: 'deposit' | 'remainder' | 'full' | 'fee';
  sessionDuration?: number; // in hours
}

export const BOOKING_PRODUCTS: Record<string, BookingProduct> = {
  // 1 Hour Session - Full payment upfront
  '1hr_full': {
    productId: 'prod_TJzRyi06m0d9Yl',
    priceId: 'price_1SNLZOGLKrGlFRBUTc2x4wyL',
    name: '1hr Studio Session',
    amount: 6000, // $60.00
    type: 'full',
    sessionDuration: 1
  },

  // 2 Hour Session
  '2hr_deposit': {
    productId: 'prod_Sc91XyreQxCW5T',
    priceId: 'price_1RgujAGLKrGlFRBUFZqK7jIe',
    name: '2Hr Studio Session (Deposit)',
    amount: 5000, // $50.00
    type: 'deposit',
    sessionDuration: 2
  },
  '2hr_remainder': {
    productId: 'prod_TJzZ5TlG8pIanK',
    priceId: 'price_1SNLbHGLKrGlFRBUvZwulfsa',
    name: '2Hr Studio Session (Remainder)',
    amount: 5000, // $50.00
    type: 'remainder',
    sessionDuration: 2
  },

  // 3 Hour Session - Holiday Special
  '3hr_holiday_full': {
    productId: 'prod_TOUp0SK1fct3XH',
    priceId: 'price_1SRhqCGLKrGlFRBUAyJZtz79',
    name: '3 Hour Studio Session Holiday Deal',
    amount: 10000, // $100.00 - Full payment, no deposit/remainder split
    type: 'full',
    sessionDuration: 3
  },

  // 3 Hour Session - Regular (Legacy - kept for potential future use)
  '3hr_deposit': {
    productId: 'prod_SLCsTSU4Jk0KJa',
    priceId: 'price_1SNLZwGLKrGlFRBU6LedKrnd',
    name: '3Hr Studio Session (Deposit)',
    amount: 7500, // $75.00
    type: 'deposit',
    sessionDuration: 3
  },
  '3hr_remainder': {
    productId: 'prod_TJzZoCXS5UleYD',
    priceId: 'price_1SNLbLGLKrGlFRBUWVXd32p1',
    name: '3Hr Studio Session (Remainder)',
    amount: 7500, // $75.00
    type: 'remainder',
    sessionDuration: 3
  },

  // 4 Hour Session
  '4hr_deposit': {
    productId: 'prod_TJzZ4u42Ebrt5f',
    priceId: 'price_1SNLc6GLKrGlFRBUaBW3dNLG',
    name: '4Hr Studio Session (Deposit)',
    amount: 9000, // $90.00
    type: 'deposit',
    sessionDuration: 4
  },
  '4hr_remainder': {
    productId: 'prod_TJzZwgbnjONmVa',
    priceId: 'price_1SNLcCGLKrGlFRBU7nPwvG1s',
    name: '4Hr Studio Session (Remainder)',
    amount: 9000, // $90.00
    type: 'remainder',
    sessionDuration: 4
  },

  // 5 Hour Session
  '5hr_deposit': {
    productId: 'prod_TJzZ6CndQkKPHB',
    priceId: 'price_1SNLcXGLKrGlFRBUgHYhhVzk',
    name: '5Hr Studio Session (Deposit)',
    amount: 11250, // $112.50
    type: 'deposit',
    sessionDuration: 5
  },
  '5hr_remainder': {
    productId: 'prod_TJzZZ68BXiC2F6',
    priceId: 'price_1SNLhCGLKrGlFRBU3NSYEInh',
    name: '5Hr Studio Session (Remainder)',
    amount: 11250, // $112.50
    type: 'remainder',
    sessionDuration: 5
  },

  // 6 Hour Session
  '6hr_deposit': {
    productId: 'prod_TJza169WRxR9Pr',
    priceId: 'price_1SNLhFGLKrGlFRBUl8HelUhL',
    name: '6Hr Studio Session (Deposit)',
    amount: 13500, // $135.00
    type: 'deposit',
    sessionDuration: 6
  },
  '6hr_remainder': {
    productId: 'prod_TJzanFS5QzsqJA',
    priceId: 'price_1SNLhJGLKrGlFRBUrJHa4LJ3',
    name: '6Hr Studio Session (Remainder)',
    amount: 13500, // $135.00
    type: 'remainder',
    sessionDuration: 6
  },

  // Additional Fees
  'same_day_fee': {
    productId: 'prod_TJzaA4EKSbYGjB',
    priceId: 'price_1SNLm6GLKrGlFRBUtTjqoGqk',
    name: 'Same Day Hourly Fee',
    amount: 1000, // $10.00
    type: 'fee'
  },
  'after_hours_fee': {
    productId: 'prod_TJzaB5VSynvR3y',
    priceId: 'price_1SNLmDGLKrGlFRBUTYHL662f',
    name: 'After Hours Fee',
    amount: 1000, // $10.00
    type: 'fee'
  }
};

// Studio hours configuration
export const STUDIO_HOURS = {
  monday: { open: 9, close: 23, lateNightClose: 3 }, // Can go until 3:00 AM
  tuesday: { open: 9, close: 23, lateNightClose: 3 },
  wednesday: { open: 9, close: 23, lateNightClose: 3 },
  thursday: { open: 9, close: 23, lateNightClose: 3 },
  friday: { open: 9, close: 23, lateNightClose: 3 },
  saturday: { open: 9, close: 23, lateNightClose: 3 },
  sunday: { open: 9, close: 23, lateNightClose: 3 } // Now open on Sundays!
};

// Helper function to get deposit and remainder products for a session duration
export function getSessionProducts(hours: number) {
  // 1-hour sessions are full payment
  if (hours === 1) {
    const fullPayment = BOOKING_PRODUCTS['1hr_full'];
    return { deposit: fullPayment, remainder: null };
  }

  // All other sessions (including 3-hour) use deposit + remainder
  const depositKey = `${hours}hr_deposit`;
  const deposit = BOOKING_PRODUCTS[depositKey];
  const remainderKey = `${hours}hr_remainder`;
  const remainder = BOOKING_PRODUCTS[remainderKey];

  return { deposit, remainder };
}

// Helper function to calculate if after hours fee applies (after 9 PM)
export function isAfterHours(startHour: number): boolean {
  return startHour >= 21; // 9 PM or later
}

// Helper function to calculate how many hours fall after 9 PM (21:00)
export function calculateOvertimeHours(startHour: number, duration: number): number {
  const overtimeStartHour = 21; // 9 PM
  let overtimeHours = 0;

  // Loop through each hour of the session
  for (let i = 0; i < duration; i++) {
    const currentHour = startHour + i;
    if (currentHour >= overtimeStartHour) {
      overtimeHours++;
    }
  }

  return overtimeHours;
}

// Helper function to check if same day fee applies
export function isSameDay(bookingDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  bookingDate.setHours(0, 0, 0, 0);
  return bookingDate.getTime() === today.getTime();
}

// Helper function to check if booking is within 2-hour minimum advance notice
export function isTooSoonToBook(bookingDate: Date, startHour: number, startMinute: number = 0): boolean {
  const bookingDateTime = new Date(bookingDate);
  bookingDateTime.setHours(startHour, startMinute, 0, 0);

  const now = new Date();
  const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));

  return bookingDateTime < twoHoursFromNow;
}

// Helper function to calculate total same-day fee (per hour)
export function calculateSameDayFee(duration: number): number {
  return BOOKING_PRODUCTS.same_day_fee.amount * duration;
}

// Helper function to calculate total after-hours fee (only for hours after 9 PM)
export function calculateAfterHoursFee(overtimeHours: number): number {
  return BOOKING_PRODUCTS.after_hours_fee.amount * overtimeHours;
}

// Helper function to validate if a booking time + duration is valid
export function isValidBookingTime(startHour: number, duration: number): boolean {
  // Can't start sessions after 11 PM (but 11 PM itself is allowed)
  if (startHour > 23) {
    return false;
  }

  const endHour = startHour + duration;

  // Sessions can run until 3:00 AM (27 in 24h+ format)
  // 9 PM + 6 hours = 3 AM is allowed
  // 11 PM + 4 hours = 3 AM is allowed
  if (endHour > 27) { // 3:00 AM next day
    return false;
  }

  return true;
}
