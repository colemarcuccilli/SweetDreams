'use client';

import { useAuth } from '@/lib/useAuth';
import BookingCalendar from '@/components/music/BookingCalendar';
import styles from './page.module.css';

export default function BookPage() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>BOOK A SESSION</h1>
        <p className={styles.subtitle}>
          Select your preferred date and time to book your studio session
        </p>
      </div>

      <div className={styles.calendarWrapper}>
        <BookingCalendar />
      </div>
    </div>
  );
}
