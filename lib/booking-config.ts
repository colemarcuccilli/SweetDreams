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
    productId: 'prod_TEzb5OMjrFBOjM',
    priceId: 'price_1SIVcm4M2L4m9dALYnLJDQyC',
    name: '1hr Studio Session',
    amount: 6000, // $60.00
    type: 'full',
    sessionDuration: 1
  },

  // 2 Hour Session
  '2hr_deposit': {
    productId: 'prod_TEzeKBNnoi76Vu',
    priceId: 'price_1SIVgF4M2L4m9dALwiCGzdVD',
    name: '2Hr Studio Session (Deposit)',
    amount: 5000, // $50.00
    type: 'deposit',
    sessionDuration: 2
  },
  '2hr_remainder': {
    productId: 'prod_TEzfSaaPR21bxQ',
    priceId: 'price_XXX', // TODO: Missing from your price list - please provide
    name: '2Hr Studio Session (Remainder)',
    amount: 5000, // $50.00
    type: 'remainder',
    sessionDuration: 2
  },

  // 3 Hour Session
  '3hr_deposit': {
    productId: 'prod_TEzfhzC8rn6Fwr',
    priceId: 'price_1SIVgd4M2L4m9dALKl4CjXWs',
    name: '3Hr Studio Session (Deposit)',
    amount: 7500, // $75.00
    type: 'deposit',
    sessionDuration: 3
  },
  '3hr_remainder': {
    productId: 'prod_TEzg6YASO5foca',
    priceId: 'price_1SIVgv4M2L4m9dALL7OD7bD1',
    name: '3Hr Studio Session (Remainder)',
    amount: 7500, // $75.00
    type: 'remainder',
    sessionDuration: 3
  },

  // 4 Hour Session
  '4hr_deposit': {
    productId: 'prod_TEzgNKlplkf429',
    priceId: 'price_1SIVhB4M2L4m9dALrRk20Qug',
    name: '4Hr Studio Session (Deposit)',
    amount: 9000, // $90.00
    type: 'deposit',
    sessionDuration: 4
  },
  '4hr_remainder': {
    productId: 'prod_TF0h5js84wYb1U',
    priceId: 'price_1SIWgR4M2L4m9dALNYYktHPC',
    name: '4Hr Studio Session (Remainder)',
    amount: 9000, // $90.00
    type: 'remainder',
    sessionDuration: 4
  },

  // 5 Hour Session
  '5hr_deposit': {
    productId: 'prod_TEzjbDHWZfmKYX',
    priceId: 'price_1SIVjq4M2L4m9dALXdGVdBkh',
    name: '5Hr Studio Session (Deposit)',
    amount: 11250, // $112.50
    type: 'deposit',
    sessionDuration: 5
  },
  '5hr_remainder': {
    productId: 'prod_TEzjfRPxmCQvDL',
    priceId: 'price_1SIVk94M2L4m9dALLfI3zoCH',
    name: '5Hr Studio Session (Remainder)',
    amount: 11250, // $112.50
    type: 'remainder',
    sessionDuration: 5
  },

  // 6 Hour Session
  '6hr_deposit': {
    productId: 'prod_TF1pn9RlWhdoHh',
    priceId: 'price_1SIXlM4M2L4m9dALtlJRSrig',
    name: '6Hr Studio Session (Deposit)',
    amount: 13500, // $135.00
    type: 'deposit',
    sessionDuration: 6
  },
  '6hr_remainder': {
    productId: 'prod_TF1pRaRcFtA41T',
    priceId: 'price_1SIXmE4M2L4m9dALlzsNRp9e',
    name: '6Hr Studio Session (Remainder)',
    amount: 13500, // $135.00
    type: 'remainder',
    sessionDuration: 6
  },

  // Additional Fees
  'same_day_fee': {
    productId: 'prod_TEzhlSDpodZ8wC',
    priceId: 'price_1SIViI4M2L4m9dALIgURyL29',
    name: 'Same Day Hourly Fee',
    amount: 1000, // $10.00
    type: 'fee'
  },
  'after_hours_fee': {
    productId: 'prod_TEzhs37LD24Wdt',
    priceId: 'price_1SIViZ4M2L4m9dAL0w5uICZx',
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
  sunday: null // Closed on Sundays
};

// Helper function to get deposit and remainder products for a session duration
export function getSessionProducts(hours: number) {
  const key = hours === 1 ? '1hr_full' : `${hours}hr_deposit`;
  const deposit = BOOKING_PRODUCTS[key];

  if (hours === 1) {
    return { deposit, remainder: null };
  }

  const remainderKey = `${hours}hr_remainder`;
  const remainder = BOOKING_PRODUCTS[remainderKey];

  return { deposit, remainder };
}

// Helper function to calculate if after hours fee applies (after 9 PM)
export function isAfterHours(startHour: number): boolean {
  return startHour >= 21; // 9 PM or later
}

// Helper function to check if same day fee applies
export function isSameDay(bookingDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  bookingDate.setHours(0, 0, 0, 0);
  return bookingDate.getTime() === today.getTime();
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
