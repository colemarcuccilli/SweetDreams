import Link from 'next/link';
import styles from './booking-success.module.css';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { format } from 'date-fns';
import Stripe from 'stripe';

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function BookingSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  // Send admin approval email after Stripe checkout completes
  if (sessionId) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-08-27.basil',
      });

      const supabase = createServiceRoleClient();

      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single();

      if (!fetchError && booking) {
        // Fetch the Stripe session to get payment intent and discount info
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log('💳 Retrieved Stripe session:', session.id);
        console.log('💳 Payment intent:', session.payment_intent);
        console.log('💳 Payment status:', session.payment_status);

        // Extract coupon and discount information
        let couponCode = null;
        let discountAmount = 0;

        if (session.total_details?.amount_discount && session.total_details.amount_discount > 0) {
          discountAmount = session.total_details.amount_discount;
          console.log('💰 Discount applied:', discountAmount, 'cents');
        }

        // Get coupon code if available
        if (session.discounts && session.discounts.length > 0) {
          const discount = session.discounts[0];
          if (discount && typeof discount === 'object' && 'coupon' in discount && discount.coupon) {
            if (typeof discount.coupon === 'string') {
              couponCode = discount.coupon;
            } else if (typeof discount.coupon === 'object') {
              couponCode = discount.coupon.name || discount.coupon.id;
            }
            console.log('🎟️ Coupon used:', couponCode);
          }
        }

        // Update booking with payment intent ID and coupon info
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            stripe_payment_intent_id: session.payment_intent as string,
            coupon_code: couponCode,
            discount_amount: discountAmount,
          })
          .eq('id', booking.id);

        if (updateError) {
          console.error('❌ Error updating booking with payment intent:', updateError);
        } else {
          console.log('✅ Updated booking with payment intent and discount info');
        }

        // Log to audit trail
        await supabase.rpc('log_booking_action', {
          p_booking_id: booking.id,
          p_action: 'payment_authorized',
          p_performed_by: 'system',
          p_details: {
            stripe_session_id: session.id,
            payment_intent_id: session.payment_intent as string,
            coupon_code: couponCode,
            discount_amount: discountAmount,
            payment_status: session.payment_status
          }
        });
        const startTime = new Date(booking.start_time);
        const endTime = new Date(booking.end_time);
        const formattedDate = format(startTime, 'EEEE, MMMM d, yyyy');
        const formattedStartTime = format(startTime, 'h:mm a');
        const formattedEndTime = format(endTime, 'h:mm a');

        console.log('📧 Sending admin approval request email to:', ADMIN_EMAIL);

        await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `⚠️ NEW BOOKING NEEDS APPROVAL - ${booking.artist_name} on ${formattedDate}`,
          html: `
            <h2>⚠️ New Booking Needs Approval</h2>
            <p><strong>A new booking request has been submitted and payment is authorized.</strong></p>
            <p>Please log in to approve or reject this booking.</p>

            <h3>Customer Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${booking.first_name} ${booking.last_name}</li>
              <li><strong>Artist Name:</strong> ${booking.artist_name}</li>
              <li><strong>Email:</strong> <a href="mailto:${booking.customer_email}">${booking.customer_email}</a></li>
              <li><strong>Phone:</strong> ${booking.customer_phone || 'N/A'}</li>
            </ul>

            <h3>Booking Details:</h3>
            <ul>
              <li><strong>Date:</strong> ${formattedDate}</li>
              <li><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</li>
              <li><strong>Duration:</strong> ${booking.duration} hours</li>
            </ul>

            <h3>Payment Details:</h3>
            <ul>
              <li><strong>Deposit (Authorized):</strong> $${(booking.deposit_amount / 100).toFixed(2)}</li>
              <li><strong>Total Session Cost:</strong> $${(booking.total_amount / 100).toFixed(2)}</li>
              <li><strong>Remainder Due After:</strong> $${(booking.remainder_amount / 100).toFixed(2)}</li>
            </ul>

            <p style="margin-top: 20px;">
              <a href="https://sweetdreams.us/profile/manage-bookings" style="background: #ff9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Go to Manage Bookings
              </a>
            </p>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Payment will be captured when you approve. If rejected, the authorization will be released.
            </p>
          `,
        });

        console.log('✅ Admin approval request email sent successfully');

        // Log to audit trail
        await supabase.rpc('log_booking_action', {
          p_booking_id: booking.id,
          p_action: 'admin_notified',
          p_performed_by: 'system',
          p_details: {
            email_sent_to: ADMIN_EMAIL,
            triggered_from: 'booking_success_page',
            timestamp: new Date().toISOString()
          }
        });

        // Send customer confirmation email
        console.log('📧 Sending customer confirmation email to:', booking.customer_email);

        await resend.emails.send({
          from: FROM_EMAIL,
          to: booking.customer_email,
          subject: `Booking Request Received - Awaiting Approval`,
          html: `
            <h2>Thank You for Your Booking Request!</h2>
            <p>Hi ${booking.first_name},</p>

            <p>We've received your studio booking request and our engineer will review it within 24-48 hours.</p>

            <h3>Booking Details:</h3>
            <ul>
              <li><strong>Artist Name:</strong> ${booking.artist_name}</li>
              <li><strong>Date:</strong> ${formattedDate}</li>
              <li><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</li>
              <li><strong>Duration:</strong> ${booking.duration} hours</li>
            </ul>

            <h3>Invoice Summary:</h3>
            <ul>
              <li><strong>Deposit (50%):</strong> $${(booking.deposit_amount / 100).toFixed(2)}</li>
              <li><strong>Total Session Cost:</strong> $${(booking.total_amount / 100).toFixed(2)}</li>
              <li><strong>Balance Due After Session:</strong> $${(booking.remainder_amount / 100).toFixed(2)}</li>
            </ul>

            <h3>Payment Status:</h3>
            <p><strong>Your card has been AUTHORIZED but NOT charged yet.</strong></p>
            <p>Here's what happens next:</p>
            <ol>
              <li>Our engineer reviews your booking request (24-48 hours)</li>
              <li>If approved, we'll capture the $${(booking.deposit_amount / 100).toFixed(2)} deposit</li>
              <li>You'll receive a confirmation email once approved</li>
              <li>The remaining $${(booking.remainder_amount / 100).toFixed(2)} is due after your session</li>
            </ol>

            <p>If you need to make any changes or have questions, please contact us immediately at <a href="mailto:jayvalleo@sweetdreamsmusic.com">jayvalleo@sweetdreamsmusic.com</a>.</p>

            <p>Thank you,<br>Sweet Dreams Music Studio</p>
          `,
        });

        console.log('✅ Customer confirmation email sent successfully');

        await supabase.rpc('log_booking_action', {
          p_booking_id: booking.id,
          p_action: 'customer_confirmation_sent',
          p_performed_by: 'system',
          p_details: {
            email_sent_to: booking.customer_email,
            triggered_from: 'booking_success_page',
            timestamp: new Date().toISOString()
          }
        });
      }
    } catch (error) {
      console.error('❌ Error sending admin email:', error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.checkIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className={styles.title}>Booking Request Submitted!</h1>

        <p className={styles.message}>
          Your studio session request has been received and is pending approval. We've placed a temporary hold on your card for the deposit amount, but no charge has been made yet.
        </p>

        <div className={styles.infoBox}>
          <h3>What's Next?</h3>
          <ul>
            <li>We'll review your booking request within 24 hours</li>
            <li>Once approved, you'll receive a confirmation email with all the details</li>
            <li>Your card will only be charged after we approve the booking</li>
            <li>The remaining balance will be charged after your session</li>
            <li>If your booking is not approved, the hold will be released automatically</li>
          </ul>
        </div>

        <div className={styles.contactInfo}>
          <p className={styles.contactTitle}>Questions?</p>
          <p>Contact us at <a href="tel:+12604507739">(260) 450-7739</a></p>
          <p>Or email <a href="mailto:jayvalleo@sweetdreamsmusic.com">jayvalleo@sweetdreamsmusic.com</a></p>
        </div>

        <div className={styles.actions}>
          <Link href="/profile" className={styles.primaryButton}>
            View My Profile
          </Link>
          <Link href="/music" className={styles.secondaryButton}>
            Back to Music Page
          </Link>
          <Link href="/" className={styles.secondaryButton}>
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
