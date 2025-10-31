'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, signOut } from '@/lib/useAuth';
import { createClient } from '@/utils/supabase/client';
import styles from './profile.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    console.log('🔐 Profile: Auth state -', { loading, hasUser: !!user, email: user?.email });

    if (user) {
      console.log('🔐 Profile: Loading user data');
      setEmail(user.email || '');
      setFullName(user.user_metadata?.full_name || '');
      setArtistName(user.user_metadata?.artist_name || '');
      setPhone(user.user_metadata?.phone || '');
      setProfilePhotoUrl(user.user_metadata?.profile_photo_url || '');
      setEmailVerified(!!user.email_confirmed_at);
      setDataLoaded(true);
      console.log('📧 Email verified:', !!user.email_confirmed_at);
    }
  }, [user, loading]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // Update user metadata with photo URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          profile_photo_url: publicUrl,
        },
      });

      if (updateError) throw updateError;

      setProfilePhotoUrl(publicUrl);
      setMessage('Profile photo updated successfully!');
    } catch (err: any) {
      console.error('Photo upload error:', err);
      setError(err.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setUpdating(true);

    try {
      // Update user metadata (name, artist name, phone, photo)
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          artist_name: artistName,
          phone: phone,
          profile_photo_url: profilePhotoUrl,
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

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setResendingEmail(true);
    setResendMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) throw error;

      setResendMessage('Verification email sent! Please check your inbox.');
      console.log('✅ Verification email resent');
    } catch (err: any) {
      setResendMessage(`Error: ${err.message}`);
      console.error('❌ Error resending verification:', err);
    } finally {
      setResendingEmail(false);
    }
  };

  // Show loading state while data is being fetched
  if (!dataLoaded) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText}>Loading profile...</div>
      </div>
    );
  }

  return (
    <>
      {/* Email Verification Banner */}
      {!emailVerified && (
        <div className={styles.verificationBanner}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerIcon}>⚠️</div>
            <div className={styles.bannerText}>
              <h3 className={styles.bannerTitle}>Email Not Verified</h3>
              <p className={styles.bannerMessage}>
                Please verify your email address to book sessions. Check your inbox for the verification link.
              </p>
              {resendMessage && (
                <p className={styles.resendMessage}>{resendMessage}</p>
              )}
            </div>
            <button
              onClick={handleResendVerification}
              disabled={resendingEmail}
              className={styles.resendButton}
            >
              {resendingEmail ? 'SENDING...' : 'RESEND EMAIL'}
            </button>
          </div>
        </div>
      )}

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

            {/* Profile Photo */}
            <div className={styles.photoSection}>
              <label className={styles.label}>PROFILE PHOTO</label>
              <div className={styles.photoUpload}>
                <div className={styles.photoPreview}>
                  {profilePhotoUrl ? (
                    <img src={profilePhotoUrl} alt="Profile" className={styles.profileImage} />
                  ) : (
                    <div className={styles.photoPlaceholder}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M20 21a8 8 0 1 0-16 0"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className={styles.photoActions}>
                  <label htmlFor="photoUpload" className={styles.uploadButton}>
                    {uploading ? 'UPLOADING...' : 'CHOOSE PHOTO'}
                    <input
                      type="file"
                      id="photoUpload"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <p className={styles.photoHelperText}>Max size: 2MB. JPG, PNG, or GIF.</p>
                </div>
              </div>
            </div>

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
              <label htmlFor="artistName" className={styles.label}>
                ARTIST NAME / ALIAS
              </label>
              <input
                type="text"
                id="artistName"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className={styles.input}
                disabled={updating}
                placeholder="Stage name, band name, or how you want to be known"
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
    </>
  );
}
