'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth, signOut } from '@/lib/useAuth';
import { isAdmin } from '@/lib/admin-auth';
import styles from './layout.module.css';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    console.log('🔐 ProfileLayout: Logout clicked');
    const { error } = await signOut();
    if (!error) {
      console.log('🔐 ProfileLayout: Redirecting to home');
      router.push('/');
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Sidebar Navigation */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>MY ACCOUNT</h2>
            <p className={styles.userEmail}>{user.email}</p>
          </div>

          <nav className={styles.sidebarNav}>
            <Link
              href="/profile"
              className={`${styles.navItem} ${pathname === '/profile' ? styles.navItemActive : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4"/>
                <path d="M20 21a8 8 0 1 0-16 0"/>
              </svg>
              <span>Account Info</span>
            </Link>

            <Link
              href="/profile/book"
              className={`${styles.navItem} ${pathname === '/profile/book' ? styles.navItemActive : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>Book a Session</span>
            </Link>

            <Link
              href="/profile/bookings"
              className={`${styles.navItem} ${pathname === '/profile/bookings' ? styles.navItemActive : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>My Bookings</span>
            </Link>

            {/* Admin Dashboard - Only visible to admins */}
            {user && isAdmin(user.email) && (
              <Link
                href="/admin"
                className={`${styles.navItem} ${pathname?.startsWith('/admin') ? styles.navItemActive : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <span>Admin Dashboard</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className={`${styles.navItem} ${styles.logoutItem}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Log Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
