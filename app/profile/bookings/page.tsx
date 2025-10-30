'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { createClient } from '@/utils/supabase/client';
import styles from './page.module.css';

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  duration: number;
  status: string;
  total_amount: number;
  deposit_amount: number;
  artist_name: string;
  created_at: string;
}

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    console.log('📅 Bookings: Loading bookings for', user.email);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_email', user.email)
      .order('start_time', { ascending: false });

    if (data) {
      console.log('📅 Bookings: Loaded', data.length, 'bookings');
      setBookings(data);
    } else if (error) {
      console.error('❌ Bookings: Error loading bookings:', error);
    }

    setLoading(false);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!user) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? This action cannot be undone.'
    );

    if (!confirmed) return;

    setCancelling(bookingId);

    try {
      const response = await fetch('/api/music/cancel-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking');
      }

      alert('Booking cancelled successfully');
      await loadBookings(); // Reload bookings
    } catch (error: any) {
      console.error('❌ Cancel booking error:', error);
      alert(error.message || 'Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const canCancelBooking = (booking: Booking): boolean => {
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return false;
    }

    const bookingTime = new Date(booking.start_time);
    const now = new Date();
    const hoursUntil = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntil >= 24;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>MY BOOKINGS</h1>
        <p className={styles.subtitle}>
          View and manage your studio session bookings
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <h3 className={styles.emptyTitle}>No bookings yet</h3>
          <p className={styles.emptyText}>
            You haven't booked any sessions yet. Book your first session to get started!
          </p>
          <Link href="/profile/book" className={styles.bookButton}>
            BOOK A SESSION
          </Link>
        </div>
      ) : (
        <div className={styles.bookingsList}>
          {bookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <h3 className={styles.bookingTitle}>{booking.artist_name}</h3>
                <span className={`${styles.status} ${styles[booking.status]}`}>
                  {booking.status.replace('_', ' ')}
                </span>
              </div>
              <div className={styles.bookingDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Date:</span>
                  <span className={styles.detailValue}>
                    {new Date(booking.start_time).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Time:</span>
                  <span className={styles.detailValue}>
                    {new Date(booking.start_time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })} - {new Date(booking.end_time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Duration:</span>
                  <span className={styles.detailValue}>{booking.duration} hours</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Total:</span>
                  <span className={styles.detailValue}>${(booking.total_amount / 100).toFixed(2)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Deposit Paid:</span>
                  <span className={styles.detailValue}>${(booking.deposit_amount / 100).toFixed(2)}</span>
                </div>
              </div>

              {canCancelBooking(booking) && (
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  disabled={cancelling === booking.id}
                  className={styles.cancelButton}
                >
                  {cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
