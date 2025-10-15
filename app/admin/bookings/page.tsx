'use client';

import { useState, useEffect } from 'react';
import styles from './bookings.module.css';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  startTime: number;
  duration: number;
  depositAmount: number;
  totalAmount: number;
  remainderAmount: number;
  status: 'pending_deposit' | 'confirmed' | 'completed' | 'cancelled';
  stripeCustomerId: string;
  stripePaymentIntentId: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [chargingBookingId, setChargingBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/admin/bookings');
        const data = await response.json();

        if (data.bookings) {
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleChargeRemainder = async (booking: Booking) => {
    if (!confirm(`Charge remaining $${(booking.remainderAmount / 100).toFixed(2)} for ${booking.customerName}?`)) {
      return;
    }

    setChargingBookingId(booking.id);

    try {
      const response = await fetch('/api/admin/charge-remainder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          customerId: booking.stripeCustomerId,
          amount: booking.remainderAmount,
          duration: booking.duration
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Remainder charged successfully!');
        // Update booking status
        setBookings(bookings.map(b =>
          b.id === booking.id ? { ...b, status: 'completed' } : b
        ));
      } else {
        alert('Error charging remainder: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to charge remainder');
    } finally {
      setChargingBookingId(null);
    }
  };

  const formatDate = (dateStr: string, startTime: number) => {
    const date = new Date(dateStr);
    const timeStr = new Date().setHours(startTime, 0);
    return `${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at ${new Date(timeStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  };

  const getStatusBadge = (status: Booking['status']) => {
    const statusConfig = {
      pending_deposit: { label: 'Pending Deposit', color: '#ff9800' },
      confirmed: { label: 'Confirmed', color: '#2196f3' },
      completed: { label: 'Completed', color: '#4caf50' },
      cancelled: { label: 'Cancelled', color: '#f44336' }
    };

    const config = statusConfig[status];
    return (
      <span className={styles.statusBadge} style={{ background: config.color }}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Studio Bookings</h1>
        <p className={styles.subtitle}>Manage bookings and charge remainder payments</p>
      </div>

      {bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No bookings found</p>
        </div>
      ) : (
        <div className={styles.bookingsGrid}>
          {bookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.customerName}>{booking.customerName}</h3>
                  <p className={styles.customerEmail}>{booking.customerEmail}</p>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className={styles.bookingDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Date & Time:</span>
                  <span className={styles.detailValue}>
                    {formatDate(booking.date, booking.startTime)}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Duration:</span>
                  <span className={styles.detailValue}>
                    {booking.duration} {booking.duration === 1 ? 'hour' : 'hours'}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Deposit Paid:</span>
                  <span className={styles.detailValue}>
                    ${(booking.depositAmount / 100).toFixed(2)}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Total Amount:</span>
                  <span className={styles.detailValue}>
                    ${(booking.totalAmount / 100).toFixed(2)}
                  </span>
                </div>

                {booking.remainderAmount > 0 && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Remainder Due:</span>
                    <span className={`${styles.detailValue} ${styles.remainderAmount}`}>
                      ${(booking.remainderAmount / 100).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {booking.status === 'confirmed' && booking.remainderAmount > 0 && (
                <button
                  className={styles.chargeButton}
                  onClick={() => handleChargeRemainder(booking)}
                  disabled={chargingBookingId === booking.id}
                >
                  {chargingBookingId === booking.id
                    ? 'Processing...'
                    : `Charge Remainder ($${(booking.remainderAmount / 100).toFixed(2)})`
                  }
                </button>
              )}

              {booking.status === 'completed' && (
                <div className={styles.completedMessage}>
                  ✓ Payment completed
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
