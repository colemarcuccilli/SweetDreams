# Email Audit - Sweet Dreams Booking System

## Current Email Status

### ✅ WORKING Emails

1. **Admin Approval Request** (webhook: checkout.session.completed)
   - TO: Admin
   - WHEN: After customer completes Stripe checkout (payment authorized, not captured)
   - TEMPLATE: `pending-booking-alert.tsx`
   - FILE: `app/api/webhooks/stripe/route.ts:158-211`

2. **Customer Confirmation** (approve booking)
   - TO: Customer
   - WHEN: Admin approves booking (payment captured)
   - TEMPLATE: `customer-booking-confirmation.tsx`
   - FILE: `app/api/admin/approve-booking/route.ts:231-275`

3. **Booking Cancellation** (exists but need to verify)
   - TEMPLATE: `booking-cancellation.tsx`
   - Need to check cancel-booking route

### ❌ MISSING Critical Admin Emails

4. **Payment Capture Success**
   - TO: Admin
   - WHEN: Admin approves booking and payment is successfully captured
   - STATUS: ❌ NOT SENT - Admin has no confirmation payment was captured

5. **Payment Capture Failure**
   - TO: Admin
   - WHEN: Payment capture fails (card declined, insufficient funds, etc.)
   - STATUS: ❌ NOT SENT - Admin doesn't know if capture failed

6. **Payment Authorization Failure**
   - TO: Admin
   - WHEN: Stripe webhook for payment_intent.payment_failed
   - STATUS: ❌ NO WEBHOOK HANDLER - We don't handle payment_intent.payment_failed events

7. **Booking Rejected**
   - TO: Customer
   - WHEN: Admin rejects booking
   - STATUS: ❌ NOT SENT - Customer never notified of rejection

8. **Booking Edited Notification**
   - TO: Customer & Admin
   - WHEN: Admin changes booking time/date
   - STATUS: ❌ NOT SENT - No notification when booking is edited

### ❌ MISSING Customer Emails

9. **Signup Confirmation**
   - TO: New user
   - WHEN: User signs up
   - STATUS: ❌ Supabase auth should send this, but user reports not receiving
   - NEED TO: Check Supabase email settings

10. **Booking Reminder**
    - TO: Customer
    - WHEN: 24 hours before session
    - STATUS: Need to check if cron job exists

11. **Remainder Charged**
    - TO: Customer
    - WHEN: Admin charges remainder after session
    - TEMPLATE: `remainder-charged.tsx`
    - Need to verify it's being sent

## Required Actions

### HIGH PRIORITY (Do Now)
1. ✅ Add `payment_intent.succeeded` webhook handler (admin email)
2. ✅ Add `payment_intent.payment_failed` webhook handler (admin email)
3. ✅ Add admin email when payment captured in approve-booking
4. ✅ Add customer email when booking rejected
5. ✅ Add customer & admin email when booking edited
6. ✅ Check Supabase email configuration

### MEDIUM PRIORITY (After high priority)
7. Verify remainder charged email is sent
8. Verify booking cancellation email is sent
9. Create admin summary email (daily digest of all bookings)

### LOW PRIORITY (Future)
10. Email open tracking
11. Email template improvements
12. SMS notifications for time-sensitive events

## Email Template Inventory

Existing templates in `lib/emails/`:
- ✅ admin-booking-notification.tsx
- ✅ booking-cancellation.tsx
- ✅ contact-form-confirmation.tsx
- ✅ contact-form-notification.tsx
- ✅ customer-booking-confirmation.tsx
- ✅ pending-booking-alert.tsx
- ✅ remainder-charged.tsx
- ✅ resend.ts (config)

Need to create:
- ❌ payment-capture-success.tsx (admin)
- ❌ payment-capture-failure.tsx (admin)
- ❌ payment-authorization-failure.tsx (admin)
- ❌ booking-rejected.tsx (customer)
- ❌ booking-edited.tsx (customer & admin)
