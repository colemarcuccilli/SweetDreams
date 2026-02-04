'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { signUp } from '@/lib/useAuth';
import styles from '../login/auth.module.css';

// Turnstile site key
const TURNSTILE_SITE_KEY = "0x4AAAAAACJodExIWnZ-7sQq";

// Extend Window interface for Turnstile
declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
        size?: 'normal' | 'flexible' | 'compact';
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderTurnstile = useCallback(() => {
    if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            setTurnstileToken(token);
            setTurnstileError(null);
          },
          'error-callback': () => {
            setTurnstileError("Verification failed. Please try again.");
            setTurnstileToken(null);
          },
          'expired-callback': () => {
            setTurnstileToken(null);
            setTurnstileError("Verification expired. Please verify again.");
          },
          theme: 'light',
          size: 'flexible',
        });
      } catch (error) {
        console.error("Turnstile render error:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (window.turnstile) {
      renderTurnstile();
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [renderTurnstile]);

  // Password validation requirements
  const passwordRequirements = useMemo((): PasswordRequirement[] => {
    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
      { label: 'Contains a number', met: /[0-9]/.test(password) },
      { label: 'Contains special character (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];
  }, [password]);

  // Password strength calculator
  const passwordStrength = useMemo((): PasswordStrength => {
    if (password.length === 0) {
      return { score: 0, label: '', color: '#666' };
    }

    const metCount = passwordRequirements.filter(req => req.met).length;

    if (metCount <= 1) {
      return { score: 1, label: 'Weak', color: '#ff4444' };
    } else if (metCount === 2 || metCount === 3) {
      return { score: 2, label: 'Fair', color: '#ffaa00' };
    } else if (metCount === 4) {
      return { score: 3, label: 'Good', color: '#66cc66' };
    } else {
      return { score: 4, label: 'Strong', color: '#00cc00' };
    }
  }, [password, passwordRequirements]);

  // Helper function to parse and improve Supabase error messages
  const parseErrorMessage = (errorMessage: string): string => {
    // Common Supabase error patterns and user-friendly replacements
    const errorMappings: { [key: string]: string } = {
      'Password should be at least': 'Your password must be at least',
      'User already registered': 'An account with this email already exists. Please login instead.',
      'Invalid email': 'Please enter a valid email address.',
      'Email not confirmed': 'Please check your email and confirm your account before logging in.',
      'Invalid login credentials': 'Incorrect email or password. Please try again.',
      'Unable to validate email address': 'Please enter a valid email address.',
      'Signup requires a valid password': 'Please enter a valid password that meets all requirements.',
    };

    let friendlyMessage = errorMessage;

    // Replace technical error messages with friendly ones
    for (const [pattern, replacement] of Object.entries(errorMappings)) {
      if (errorMessage.includes(pattern)) {
        friendlyMessage = replacement;
        break;
      }
    }

    // Remove "AuthApiError: " prefix if present
    friendlyMessage = friendlyMessage.replace(/^AuthApiError:\s*/i, '');

    return friendlyMessage;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTurnstileError(null);

    // Verify Turnstile token
    if (!turnstileToken) {
      setTurnstileError("Please complete the verification.");
      return;
    }

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

    // Validate all password requirements are met
    const unmetRequirements = passwordRequirements.filter(req => !req.met);
    if (unmetRequirements.length > 0) {
      console.error('❌ SIGNUP: Password requirements not met');
      setError(`Password must meet all requirements: ${unmetRequirements.map(r => r.label).join(', ')}`);
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
      setError(parseErrorMessage(error.message));
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
      {/* Load Turnstile script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={renderTurnstile}
      />

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
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
                disabled={loading}
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className={styles.passwordStrengthContainer}>
                <div className={styles.passwordStrengthBar}>
                  <div
                    className={styles.passwordStrengthFill}
                    style={{
                      width: `${(passwordStrength.score / 4) * 100}%`,
                      backgroundColor: passwordStrength.color,
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
                <span
                  className={styles.passwordStrengthLabel}
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.label}
                </span>
              </div>
            )}

            {/* Password Requirements */}
            <div className={styles.passwordRequirements}>
              <p className={styles.requirementsTitle}>Password must contain:</p>
              <ul className={styles.requirementsList}>
                {passwordRequirements.map((req, index) => (
                  <li
                    key={index}
                    className={`${styles.requirement} ${req.met ? styles.requirementMet : styles.requirementUnmet}`}
                  >
                    <span className={styles.requirementIcon}>
                      {req.met ? '✓' : '○'}
                    </span>
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              CONFIRM PASSWORD
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
                disabled={loading}
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Turnstile Widget */}
          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <div ref={turnstileRef}></div>
            {turnstileError && (
              <p className={styles.error} style={{ marginTop: '0.5rem' }}>{turnstileError}</p>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !turnstileToken}
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
