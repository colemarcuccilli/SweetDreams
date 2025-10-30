'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/useAuth';
import styles from '../login/auth.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🚀 SIGNUP: Starting signup process...');
    console.log('📧 Email:', email);
    console.log('👤 Full Name:', fullName);

    // Validate passwords match
    if (password !== confirmPassword) {
      console.error('❌ SIGNUP: Passwords do not match');
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      console.error('❌ SIGNUP: Password too short');
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    console.log('🔄 SIGNUP: Calling signUp function...');
    const { data, error } = await signUp(email, password, fullName);

    if (error) {
      console.error('❌ SIGNUP ERROR:', error);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      setError(error.message);
      setLoading(false);
    } else {
      console.log('✅ SIGNUP SUCCESS:', data);
      console.log('User created:', data?.user?.id);
      console.log('Email:', data?.user?.email);
      console.log('Session exists:', !!data?.session);

      // Check if user is auto-logged in (no email confirmation required)
      if (data?.session) {
        console.log('✅ User auto-logged in, redirecting to profile...');
        setSuccess(true);
        setLoading(false);
        // User is already logged in, redirect to profile
        setTimeout(() => {
          router.push('/profile');
          router.refresh(); // Refresh to update auth state
        }, 1500);
      } else {
        // Email confirmation required
        console.log('📧 Email confirmation required');
        setSuccess(true);
        setLoading(false);
        // Redirect to login after showing message
        setTimeout(() => {
          router.push('/login');
        }, 4000); // Longer delay to read message
      }
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>SUCCESS!</h1>
            <p className={styles.subtitle}>
              Your account has been created. Please check your email to verify your account.
            </p>
            <p className={styles.subtitle}>
              Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>SIGN UP</h1>
          <p className={styles.subtitle}>Create your Sweet Dreams account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
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
              required
              disabled={loading}
              autoComplete="name"
              inputMode="text"
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
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              disabled={loading}
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              disabled={loading}
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
              disabled={loading}
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </button>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Already have an account?{' '}
              <Link href="/login" className={styles.link}>
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
