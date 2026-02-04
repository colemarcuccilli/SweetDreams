'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import Script from 'next/script';
import { createClient } from '@/utils/supabase/client';
import styles from './AuthModal.module.css';

// Turnstile site key
const TURNSTILE_SITE_KEY = "0x4AAAAAACJodExIWnZ-7sQq";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
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

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'choice' | 'login' | 'signup'>('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const supabase = createClient();

  const renderTurnstile = useCallback(() => {
    if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            setTurnstileToken(token);
          },
          'error-callback': () => {
            setTurnstileToken(null);
          },
          'expired-callback': () => {
            setTurnstileToken(null);
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
    // Render Turnstile when entering signup mode
    if (mode === 'signup' && window.turnstile) {
      // Small delay to ensure DOM is ready
      setTimeout(renderTurnstile, 100);
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
  }, [mode, renderTurnstile]);

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

    for (const [pattern, replacement] of Object.entries(errorMappings)) {
      if (errorMessage.includes(pattern)) {
        friendlyMessage = replacement;
        break;
      }
    }

    friendlyMessage = friendlyMessage.replace(/^AuthApiError:\s*/i, '');

    return friendlyMessage;
  };

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      onAuthSuccess();
    } catch (err: any) {
      setError(parseErrorMessage(err.message || 'Failed to login'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Verify Turnstile token
    if (!turnstileToken) {
      setError('Please complete the verification.');
      return;
    }

    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate all password requirements are met
    const unmetRequirements = passwordRequirements.filter(req => !req.met);
    if (unmetRequirements.length > 0) {
      setError(`Password must meet all requirements: ${unmetRequirements.map(r => r.label).join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) throw signUpError;

      onAuthSuccess();
    } catch (err: any) {
      setError(parseErrorMessage(err.message || 'Failed to create account'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* Load Turnstile script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => {
          if (mode === 'signup') {
            setTimeout(renderTurnstile, 100);
          }
        }}
      />
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        {mode === 'choice' && (
          <div className={styles.choiceContainer}>
            <h2 className={styles.modalTitle}>Authentication Required</h2>
            <p className={styles.modalSubtitle}>Please sign in or create an account to book your session. This ensures we can send you confirmation emails and booking reminders.</p>

            <button className={styles.primaryButton} onClick={() => setMode('login')}>
              Login
            </button>

            <button className={styles.secondaryButton} onClick={() => setMode('signup')}>
              Create Account
            </button>
          </div>
        )}

        {mode === 'login' && (
          <div className={styles.formContainer}>
            <button className={styles.backButton} onClick={() => setMode('choice')}>
              ← Back
            </button>

            <h2 className={styles.modalTitle}>Login</h2>

            <form onSubmit={handleLogin}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        )}

        {mode === 'signup' && (
          <div className={styles.formContainer}>
            <button className={styles.backButton} onClick={() => setMode('choice')}>
              ← Back
            </button>

            <h2 className={styles.modalTitle}>Create Account</h2>

            <form onSubmit={handleSignup}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>First Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />

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

              <div className={styles.formGroup}>
                <label className={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  className={styles.input}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Turnstile Widget */}
              <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                <div ref={turnstileRef}></div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !turnstileToken}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
