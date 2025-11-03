# Admin Dashboard Setup Guide

## Overview
This admin system allows studio administrators (cole@sweetdreamsmusic.com and jayvalleo@sweetdreamsmusic.com) to manage bookings and calendar availability.

---

## Features

### 1. **Bookings Management** (`/admin/bookings`)
- View all studio bookings
- Charge remainder payments
- Track booking status

### 2. **Calendar Availability** (`/admin/availability`)
- Block specific dates/times
- Block entire days
- Add reasons for blocks
- Remove blocks

---

## Database Setup

You need to create the `blocked_availability` table in Supabase.

### Step 1: Access Supabase SQL Editor
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Run the Migration
Copy and paste this SQL script:

```sql
-- Create blocked_availability table for admin calendar management
CREATE TABLE IF NOT EXISTS blocked_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date DATE NOT NULL,
  start_time INTEGER, -- Hour (0-23), NULL if blocking entire day
  end_time INTEGER, -- Hour (0-23), NULL if blocking entire day
  reason TEXT, -- Optional reason for blocking
  block_entire_day BOOLEAN DEFAULT FALSE,
  created_by TEXT NOT NULL, -- Email of admin who created the block
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_blocked_availability_date
  ON blocked_availability(blocked_date);

CREATE INDEX IF NOT EXISTS idx_blocked_availability_date_time
  ON blocked_availability(blocked_date, start_time, end_time);

-- Add RLS (Row Level Security) policies
ALTER TABLE blocked_availability ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read blocked availability
CREATE POLICY "Allow authenticated users to read blocked availability"
  ON blocked_availability
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to manage blocked availability
CREATE POLICY "Allow authenticated users to manage blocked availability"
  ON blocked_availability
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blocked_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_blocked_availability_updated_at_trigger
  BEFORE UPDATE ON blocked_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_blocked_availability_updated_at();

-- Add comment to table
COMMENT ON TABLE blocked_availability IS 'Stores dates and time slots blocked from booking by studio admins';
```

### Step 3: Run the Query
1. Click **"Run"** button (or press Ctrl/Cmd + Enter)
2. You should see "Success. No rows returned"

---

## Accessing Admin Dashboard

### URL
```
https://sweetdreamsmusic.com/admin
```

### Requirements
1. Must be logged in with one of these emails:
   - cole@sweetdreamsmusic.com
   - jayvalleo@sweetdreamsmusic.com

2. If you're not logged in, you'll be redirected to the homepage

---

## Using the Admin Dashboard

### Dashboard Home (`/admin`)
Central hub with links to:
- Bookings Management
- Calendar Availability

### Managing Bookings (`/admin/bookings`)

**Features:**
- View all bookings in chronological order
- See booking details (customer, date, time, duration, amounts)
- Charge remainder payments
- Track booking status

**Workflow:**
1. Customer pays deposit when booking
2. Booking status: "Confirmed"
3. After session, click "Charge Remainder" button
4. System charges remaining amount to customer's card
5. Status changes to "Completed"

### Managing Availability (`/admin/availability`)

**Block a Date/Time:**
1. Select a date from the calendar
2. Choose one of:
   - **Specific time range**: Set start and end time
   - **Entire day**: Check "Block Entire Day" checkbox
3. Optionally add a reason (e.g., "Studio maintenance", "Personal day")
4. Click "Block Availability"

**Unblock a Date/Time:**
1. Find the blocked slot in the list
2. Click "Unblock" button
3. Confirm the action

**Tips:**
- Blocked slots are sorted by date
- Each date shows all blocks for that day
- Customers cannot book blocked times
- Existing bookings are not affected by new blocks

---

## How Blocking Works

### Time Overlap Detection
When a customer tries to book, the system checks:
1. Is the entire day blocked?
2. Does the booking time overlap with any blocked slot?

**Example:**
- Blocked: 2:00 PM - 6:00 PM
- Customer tries: 4:00 PM - 7:00 PM
- Result: ❌ Blocked (overlaps 4:00 PM - 6:00 PM)

### Entire Day Blocks
- Prevents all bookings for that date
- Useful for holidays, days off, events

---

## Security

### Admin Access Control
- Hardcoded admin emails in `lib/admin-auth.ts`
- All admin routes check authentication
- API routes verify admin access
- Non-admins cannot access admin pages

### Database Security
- Row Level Security (RLS) enabled
- Authenticated users can read blocked slots
- Only prevents unauthorized database access
- Application logic handles admin-specific actions

---

## Files Created

### Admin Pages
- `app/admin/page.tsx` - Dashboard home
- `app/admin/bookings/page.tsx` - Bookings management (already existed)
- `app/admin/availability/page.tsx` - Availability management

### API Routes
- `app/api/admin/availability/route.ts` - CRUD operations for blocks
- `app/api/music/check-availability/route.ts` - Check if time is available

### Utilities
- `lib/admin-auth.ts` - Admin authentication helpers

### Styles
- `app/admin/admin.module.css` - Dashboard styles
- `app/admin/availability/availability.module.css` - Availability page styles

### Database
- `supabase/migrations/create_blocked_availability_table.sql` - Table schema

---

## Troubleshooting

### "Unauthorized - Admin access required"
**Cause:** Not logged in with admin email
**Fix:** Sign in with cole@sweetdreamsmusic.com or jayvalleo@sweetdreamsmusic.com

### Blocked slots not showing
**Cause:** Database table not created
**Fix:** Run the SQL migration script in Supabase

### Customers can still book blocked times
**Cause:** BookingCalendar not updated yet
**Fix:** Deploy the updated BookingCalendar component

### API returns 401 error
**Cause:** Not authenticated or not admin
**Fix:** Log in with admin account and refresh

---

## Adding More Admins

To add more admin emails:

1. Open `lib/admin-auth.ts`
2. Add email to `ADMIN_EMAILS` array:
   ```typescript
   export const ADMIN_EMAILS = [
     'cole@sweetdreamsmusic.com',
     'jayvalleo@sweetdreamsmusic.com',
     'newadmin@sweetdreamsmusic.com', // Add here
   ];
   ```
3. Commit and deploy

---

## Next Steps

1. ✅ Run database migration in Supabase
2. ✅ Deploy the code (already done)
3. ✅ Log in with admin account
4. ✅ Access `/admin` to test
5. ✅ Try blocking a date
6. ✅ Verify customers can't book that time

---

**Last Updated**: November 1, 2025
**Status**: Ready for use after database migration
