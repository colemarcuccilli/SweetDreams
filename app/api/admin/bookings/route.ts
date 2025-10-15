import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin
    // Verify the request is from an authenticated admin user

    const supabase = await createClient();

    // Fetch all bookings ordered by creation date (newest first)
    const { data: bookings, error } = await supabase
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

    // Transform the data to match the frontend interface
    const transformedBookings = bookings.map((booking) => {
      const startTime = new Date(booking.start_time);
      return {
        id: booking.id,
        customerName: booking.customer_name,
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
