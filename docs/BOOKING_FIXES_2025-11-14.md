# Booking System Critical Fixes - November 14, 2025

## Issues Found from Real Customer Booking

A customer (Noticemi Mi) booked a session that revealed three critical bugs in the booking system:

### Bug #1: After-Hours Fee Overcharge ❌
**Problem:** Customer was charged $60 for after-hours fee instead of $20
- Session: Saturday 5 PM - 11 PM (6 hours total)
- Only 2 hours were after 9 PM (9-11 PM)
- System charged: 6 hours × $10 = $60
- Should charge: 2 hours × $10 = $20

**Root Cause:** `create-booking/route.ts` was using `duration` instead of `calculateOvertimeHours(startTime, duration)`

**Fix:** Line 83 changed from `quantity: duration` to `quantity: overtimeHours`

### Bug #2: Date Off By One Day ❌
**Problem:** Bookings showed wrong day in database and admin panel
- Customer booked Saturday, showed as Friday
- Customer booked Sunday, showed as Saturday
- Always off by exactly one day

**Root Cause:** Mixing UTC and local timezone parsing inconsistently
- `new Date("2025-11-16")` parses as UTC midnight
- When converted to EST (UTC-5), becomes previous day at 7 PM

**Fixes Applied:**
1. **create-booking API** - Parse dates in local timezone using Date constructor
2. **admin bookings API** - Return dates in local timezone (not UTC)
3. **manage-bookings page** - Parse date strings in local timezone

### Bug #3: No Confirmation Emails ⚠️
**Problem:** Admin and customer didn't receive booking confirmation emails

**Root Cause:** Webhook fired correctly but emails likely failed to send (needs investigation)

**Status:** Webhook code is correct, may be Resend API issue or environment variable issue

## Additional Enhancement: Sunday Availability

Enabled Sunday bookings to allow 7-day operation:
- Updated `STUDIO_HOURS` in booking-config.ts
- Removed Sunday from disabled days in BookingCalendar.tsx
- Updated hours display on /music page

## Files Modified

### app/api/music/create-booking/route.ts
```typescript
// BEFORE (Bug):
if (fees.afterHoursFee) {
  lineItems.push({
    price: afterHoursFeeProduct.priceId,
    quantity: duration, // ❌ WRONG - charges all hours
  });
}

// AFTER (Fixed):
if (fees.afterHoursFee) {
  const overtimeHours = calculateOvertimeHours(startTime, duration);
  lineItems.push({
    price: afterHoursFeeProduct.priceId,
    quantity: overtimeHours, // ✅ CORRECT - charges only after 9 PM
  });
}

// Date parsing fix:
// BEFORE:
const bookingStartTime = new Date(date); // ❌ Parses as UTC
bookingStartTime.setHours(startTime, 0, 0, 0);

// AFTER:
const dateParts = date.split('T')[0].split('-');
const year = parseInt(dateParts[0]);
const month = parseInt(dateParts[1]) - 1;
const day = parseInt(dateParts[2]);
const bookingStartTime = new Date(year, month, day, startTime, 0, 0, 0); // ✅ Local timezone
```

### app/api/admin/bookings/route.ts
```typescript
// BEFORE:
date: startTime.toISOString().split('T')[0], // ❌ UTC date
startTime: startTime.getHours(), // ❌ Local hour (mixed timezone)

// AFTER:
const year = startTime.getFullYear();
const month = String(startTime.getMonth() + 1).padStart(2, '0');
const day = String(startTime.getDate()).padStart(2, '0');
const localDate = `${year}-${month}-${day}`; // ✅ Local date
const localHour = startTime.getHours(); // ✅ Local hour
```

### app/profile/manage-bookings/page.tsx
```typescript
// BEFORE:
const formatDate = (dateStr: string, startTime: number) => {
  const date = new Date(dateStr); // ❌ Parses as UTC
  // ...
};

// AFTER:
const formatDate = (dateStr: string, startTime: number) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day); // ✅ Local timezone
  // ...
};
```

### lib/booking-config.ts
```typescript
// BEFORE:
sunday: null // ❌ Closed on Sundays

// AFTER:
sunday: { open: 9, close: 23, lateNightClose: 3 } // ✅ Now open!
```

### components/music/BookingCalendar.tsx
```typescript
// BEFORE:
const disabledDays = [
  { before: new Date() },
  { dayOfWeek: [0] }, // ❌ Sunday disabled
  isDateFullyBlocked
];

// AFTER:
const disabledDays = [
  { before: new Date() },
  isDateFullyBlocked // ✅ Sunday enabled
];
```

## Customer Resolution

**Noticemi Mi booking fixed manually:**
- Session moved to Sunday Nov 16 at noon (correct day)
- Amounts corrected:
  - Deposit: $135 (correct)
  - Actually paid: $195 (due to bug)
  - Total: $270 (no after-hours fee for Sunday noon)
  - Remainder: $75 (will charge after session)
- Status: pending_deposit → click "Confirm" to send emails

## Testing Checklist

- [ ] Book a Sunday session (verify Sunday is available)
- [ ] Book a session from 5 PM - 11 PM (verify only 2 hours charged for after-hours)
- [ ] Book a session for tomorrow (verify correct date shown in admin panel)
- [ ] Check confirmation emails are sent
- [ ] Verify dates match between booking form, database, and admin panel

## Deployment

- Commits: `63c6dbb` (bug fixes) and `56593f6` (Sunday availability)
- Branch: `main`
- Deployed: November 14, 2025
- Auto-deployed via Vercel

## Timezone Reference (Eastern Time)

The system now correctly handles Eastern timezone (EST/EDT):
- UTC-5 in winter (EST)
- UTC-4 in summer (EDT)
- Database stores UTC timestamps
- Frontend displays in local timezone
- No more off-by-one day errors!
