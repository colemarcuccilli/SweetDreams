'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { isAdmin } from '@/lib/admin-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !isAdmin(user.email)) {
        alert('Unauthorized - Admin access required');
        router.push('/');
        return;
      }

      setUserEmail(user.email || '');
      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Welcome, {userEmail}</p>
      </div>

      <div className={styles.grid}>
        <Link href="/admin/bookings" className={styles.card}>
          <div className={styles.cardIcon}>📅</div>
          <h2 className={styles.cardTitle}>Bookings</h2>
          <p className={styles.cardDescription}>
            View all studio bookings and charge remainder payments
          </p>
        </Link>

        <Link href="/admin/availability" className={styles.card}>
          <div className={styles.cardIcon}>🚫</div>
          <h2 className={styles.cardTitle}>Calendar Availability</h2>
          <p className={styles.cardDescription}>
            Block dates and times to prevent bookings
          </p>
        </Link>
      </div>
    </div>
  );
}
