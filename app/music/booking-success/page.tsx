import Link from 'next/link';
import styles from './booking-success.module.css';

export default function BookingSuccessPage() {
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

        <h1 className={styles.title}>Booking Confirmed!</h1>

        <p className={styles.message}>
          Your studio session has been successfully booked. You should receive a confirmation email shortly with all the details.
        </p>

        <div className={styles.infoBox}>
          <h3>What's Next?</h3>
          <ul>
            <li>Check your email for booking confirmation</li>
            <li>You'll receive a reminder 24 hours before your session</li>
            <li>The remaining balance will be charged after your session</li>
            <li>Arrive 5-10 minutes early for setup</li>
          </ul>
        </div>

        <div className={styles.contactInfo}>
          <p className={styles.contactTitle}>Questions?</p>
          <p>Contact us at <a href="tel:+12604507739">(260) 450-7739</a></p>
          <p>Or email <a href="mailto:jayvalleo@sweetdreamsmusic.com">jayvalleo@sweetdreamsmusic.com</a></p>
        </div>

        <div className={styles.actions}>
          <Link href="/music" className={styles.primaryButton}>
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
