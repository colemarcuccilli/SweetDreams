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

    // Fetch all bookings except cancelled (including pending_deposit for debugging)
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    // Transform the data to match the frontend interface
    const transformedBookings = bookings.map((booking) => {
      const startTime = new Date(booking.start_time);
      return {
        id: booking.id,
        firstName: booking.first_name,
        lastName: booking.last_name,
        artistName: booking.artist_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone,
        date: startTime.toISOString().split('T')[0],
        startTime: startTime.getHours(),
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
