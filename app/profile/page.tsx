'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, signOut } from '@/lib/useAuth';
import { supabase } from '@/lib/supabase';
import styles from './profile.module.css';

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

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (user) {
      setEmail(user.email || '');
      setFullName(user.user_metadata?.full_name || '');
      setPhone(user.user_metadata?.phone || '');
      loadBookings();
    }
  }, [user, loading, router]);

  const loadBookings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_email', user.email)
      .order('start_time', { ascending: false });

    if (data) {
      setBookings(data);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setUpdating(true);

    try {
      // Update user metadata (name, phone)
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          phone: phone,
        },
      });

      if (metadataError) throw metadataError;

      // Update password if provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (newPassword.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passwordError) throw passwordError;

        setNewPassword('');
        setConfirmPassword('');
      }

      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>MY PROFILE</h1>
          <button onClick={handleLogout} className={styles.logoutButton}>
            LOG OUT
          </button>
        </div>

        {/* Profile Update Form */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Account Information</h2>

          <form onSubmit={handleUpdateProfile} className={styles.form}>
            {message && (
              <div className={styles.success}>{message}</div>
            )}
            {error && (
              <div className={styles.error}>{error}</div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="fullName" className={styles.label}>
                FULL NAME
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={styles.input}
                disabled={updating}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                value={email}
                className={styles.input}
                disabled
              />
              <p className={styles.helperText}>Email cannot be changed</p>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                PHONE (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                disabled={updating}
              />
            </div>

            <div className={styles.divider}></div>

            <h3 className={styles.subsectionTitle}>Change Password</h3>

            <div className={styles.inputGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                NEW PASSWORD
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                disabled={updating}
                minLength={6}
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                CONFIRM NEW PASSWORD
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                disabled={updating}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={updating}
            >
              {updating ? 'UPDATING...' : 'UPDATE PROFILE'}
            </button>
          </form>
        </section>

        {/* Booking History */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>My Bookings</h2>

          {bookings.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No bookings yet</p>
              <a href="/music#booking" className={styles.bookButton}>
                BOOK A SESSION
              </a>
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
                    <p><strong>Date:</strong> {new Date(booking.start_time).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(booking.start_time).toLocaleTimeString()} - {new Date(booking.end_time).toLocaleTimeString()}</p>
                    <p><strong>Duration:</strong> {booking.duration} hours</p>
                    <p><strong>Total:</strong> ${(booking.total_amount / 100).toFixed(2)}</p>
                    <p><strong>Deposit Paid:</strong> ${(booking.deposit_amount / 100).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
