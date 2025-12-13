import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin access
    const isAdmin = await verifyAdminAccess(supabase);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Fetch ALL bookings - admin needs to see everything to manage and debug
    const { data: allBookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    // Filter out abandoned checkouts - bookings with no payment intent
    // These are sessions where customer opened Stripe checkout but never entered payment info
    const bookings = allBookings.filter(booking => {
      // Keep all bookings that have a payment intent
      if (booking.stripe_payment_intent_id) return true;

      // Keep cancelled/rejected/deleted bookings (for history)
      if (['cancelled', 'rejected', 'deleted'].includes(booking.status)) return true;

      // Filter out pending_approval with no payment intent (abandoned checkout)
      if (booking.status === 'pending_approval' && !booking.stripe_payment_intent_id) {
        console.log('⚠️ Filtering out abandoned checkout:', booking.id, booking.customer_email);
        return false;
      }

      // Keep everything else
      return true;
    });

    // Transform the data to match the frontend interface
    const transformedBookings = bookings.map((booking) => {
      const startTime = new Date(booking.start_time);

      // Extract date and time in LOCAL timezone to avoid off-by-one day errors
      const year = startTime.getFullYear();
      const month = String(startTime.getMonth() + 1).padStart(2, '0');
      const day = String(startTime.getDate()).padStart(2, '0');
      const localDate = `${year}-${month}-${day}`;
      const localHour = startTime.getHours();

      return {
        id: booking.id,
        firstName: booking.first_name,
        lastName: booking.last_name,
        artistName: booking.artist_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone,
        date: localDate,
        startTime: localHour,
        duration: booking.duration,
        depositAmount: booking.deposit_amount,
        totalAmount: booking.total_amount,
        remainderAmount: booking.remainder_amount,
        status: booking.status,
        stripeCustomerId: booking.stripe_customer_id,
        stripePaymentIntentId: booking.stripe_payment_intent_id,
        couponCode: booking.coupon_code,
        discountAmount: booking.discount_amount,
        actualDepositPaid: booking.actual_deposit_paid,
        createdAt: booking.created_at,
        // New fields for admin approval workflow
        afterHoursFeeAmount: booking.after_hours_fee_amount,
        sameDayFeeAmount: booking.same_day_fee_amount,
        approvedAt: booking.approved_at,
        rejectedAt: booking.rejected_at,
        rejectedReason: booking.rejected_reason,
        deletedAt: booking.deleted_at,
        adminNotes: booking.admin_notes,
        cancellationEmailSentAt: booking.cancellation_email_sent_at,
      };
    });

    return NextResponse.json({
      bookings: transformedBookings,
    });

  } catch (error: unknown) {
    console.error('Error in bookings API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch bookings', details: errorMessage },
      { status: 500 }
    );
  }
}
