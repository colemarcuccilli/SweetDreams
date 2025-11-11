'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { createClient } from '@/utils/supabase/client';
import { PLATFORM_INFO } from '@/lib/oauth/config';
import styles from '../profile.module.css';

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📷', category: 'social' },
  { id: 'facebook', name: 'Facebook', icon: '👥', category: 'social' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', category: 'social' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', category: 'social' },
  { id: 'twitter', name: 'X (Twitter)', icon: '🐦', category: 'social' },
  { id: 'spotify', name: 'Spotify', icon: '🎧', category: 'streaming' },
  { id: 'apple_music', name: 'Apple Music', icon: '🍎', category: 'streaming' },
  { id: 'deezer', name: 'Deezer', icon: '🎶', category: 'streaming' },
  { id: 'soundcloud', name: 'SoundCloud', icon: '☁️', category: 'streaming' },
  { id: 'amazon_music', name: 'Amazon Music', icon: '📦', category: 'streaming' },
  { id: 'youtube_music', name: 'YouTube Music', icon: '🎼', category: 'streaming' },
  { id: 'tidal', name: 'Tidal', icon: '🌊', category: 'streaming' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadConnectedPlatforms();

    // Check for OAuth callback results
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');
    const platform = searchParams.get('platform');

    if (connected) {
      setNotification({
        type: 'success',
        message: `Successfully connected ${PLATFORM_INFO[connected as keyof typeof PLATFORM_INFO]?.name || connected}!`,
      });
      // Clear URL params after showing notification
      setTimeout(() => {
        window.history.replaceState({}, '', '/profile/onboarding');
      }, 100);
    } else if (error && platform) {
      const errorMessage = searchParams.get('message') || error;
      setNotification({
        type: 'error',
        message: `Failed to connect ${PLATFORM_INFO[platform as keyof typeof PLATFORM_INFO]?.name || platform}: ${errorMessage}`,
      });
      setTimeout(() => {
        window.history.replaceState({}, '', '/profile/onboarding');
      }, 100);
    }
  }, [user, searchParams]);

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function loadConnectedPlatforms() {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('connected_platforms')
      .eq('user_id', user.id)
      .single();

    if (data?.connected_platforms) {
      setConnectedPlatforms(data.connected_platforms);
    }
    setLoading(false);
  }

  async function handlePlatformConnect(platformId: string) {
    const isConnected = connectedPlatforms.includes(platformId);

    if (isConnected) {
      // Disconnect platform
      const confirmDisconnect = window.confirm(
        `Are you sure you want to disconnect ${PLATFORM_INFO[platformId]?.name || platformId}? This will remove your authentication and you'll need to reconnect to access this platform's data.`
      );

      if (!confirmDisconnect) return;

      try {
        // Delete OAuth token
        const { error } = await supabase
          .from('oauth_tokens')
          .delete()
          .eq('user_id', user?.id)
          .eq('platform', platformId);

        if (error) throw error;

        // Update connected platforms
        const updated = connectedPlatforms.filter(p => p !== platformId);
        setConnectedPlatforms(updated);

        await supabase
          .from('profiles')
          .update({ connected_platforms: updated })
          .eq('user_id', user?.id);

        setNotification({
          type: 'success',
          message: `Disconnected ${PLATFORM_INFO[platformId]?.name || platformId}`,
        });
      } catch (error) {
        console.error('Failed to disconnect platform:', error);
        setNotification({
          type: 'error',
          message: 'Failed to disconnect platform. Please try again.',
        });
      }
    } else {
      // Connect platform via OAuth
      setConnecting(platformId);

      try {
        // Redirect to OAuth initiation endpoint
        window.location.href = `/api/auth/connect/${platformId}?returnUrl=/profile/onboarding`;
      } catch (error) {
        console.error('Failed to initiate OAuth:', error);
        setNotification({
          type: 'error',
          message: 'Failed to start connection. Please try again.',
        });
        setConnecting(null);
      }
    }
  }

  async function handleComplete() {
    if (connectedPlatforms.length === 0) {
      alert('Please connect at least one platform to continue');
      return;
    }

    setSaving(true);

    // Save connected platforms, award XP, and set level to 1
    const bonusXP = connectedPlatforms.length * 50; // 50 XP per platform
    const { error } = await supabase
      .from('profiles')
      .update({
        connected_platforms: connectedPlatforms,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        xp: bonusXP,
        level: 1, // Level up from 0 to 1 on completion
      })
      .eq('id', user?.id);

    if (error) {
      console.error('Error saving onboarding:', error);
      alert('Error saving your progress. Please try again.');
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push('/profile/dream-suite');
  }

  if (loading) {
    return <div style={{ padding: '48px', color: '#666' }}>Loading...</div>;
  }

  const socialPlatforms = PLATFORMS.filter(p => p.category === 'social');
  const streamingPlatforms = PLATFORMS.filter(p => p.category === 'streaming');

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Notification Banner */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          maxWidth: '400px',
          padding: '16px 20px',
          background: notification.type === 'success'
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 1000,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {notification.type === 'success' ? 'Success!' : 'Error'}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.95 }}>
            {notification.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '16px'
        }}>
          Welcome to Dream Suite! 🎉
        </h1>
        <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.6' }}>
          Connect your social media and streaming platforms to unlock AI-powered insights,
          analytics, and growth tools. You'll earn <strong>50 XP per platform</strong> connected!
        </p>
      </div>

      {/* Social Media Platforms */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span>📱 Social Media</span>
          <span style={{
            fontSize: '14px',
            fontWeight: 'normal',
            color: '#666'
          }}>
            ({connectedPlatforms.filter(p => socialPlatforms.some(sp => sp.id === p)).length}/{socialPlatforms.length} connected)
          </span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {socialPlatforms.map((platform) => {
            const isConnected = connectedPlatforms.includes(platform.id);
            const isConnecting = connecting === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformConnect(platform.id)}
                disabled={isConnecting}
                style={{
                  padding: '20px',
                  background: isConnected
                    ? 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))'
                    : isConnecting
                    ? '#f3f4f6'
                    : 'white',
                  border: isConnected ? 'none' : '2px solid #ddd',
                  borderRadius: '8px',
                  cursor: isConnecting ? 'wait' : 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'left',
                  position: 'relative',
                  opacity: isConnecting ? 0.7 : 1
                }}
              >
                <div style={{
                  fontSize: '32px',
                  marginBottom: '8px'
                }}>
                  {isConnecting ? '⏳' : platform.icon}
                </div>
                <div style={{
                  fontWeight: 'bold',
                  color: isConnected ? 'white' : '#000',
                  marginBottom: '4px'
                }}>
                  {platform.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: isConnected ? 'rgba(255,255,255,0.8)' : '#666'
                }}>
                  {isConnecting
                    ? 'Connecting...'
                    : isConnected
                    ? '✓ Connected (click to disconnect)'
                    : 'Click to connect'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Streaming Platforms */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span>🎵 Streaming Services</span>
          <span style={{
            fontSize: '14px',
            fontWeight: 'normal',
            color: '#666'
          }}>
            ({connectedPlatforms.filter(p => streamingPlatforms.some(sp => sp.id === p)).length}/{streamingPlatforms.length} connected)
          </span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {streamingPlatforms.map((platform) => {
            const isConnected = connectedPlatforms.includes(platform.id);
            const isConnecting = connecting === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformConnect(platform.id)}
                disabled={isConnecting}
                style={{
                  padding: '20px',
                  background: isConnected
                    ? 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))'
                    : isConnecting
                    ? '#f3f4f6'
                    : 'white',
                  border: isConnected ? 'none' : '2px solid #ddd',
                  borderRadius: '8px',
                  cursor: isConnecting ? 'wait' : 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'left',
                  position: 'relative',
                  opacity: isConnecting ? 0.7 : 1
                }}
              >
                <div style={{
                  fontSize: '32px',
                  marginBottom: '8px'
                }}>
                  {isConnecting ? '⏳' : platform.icon}
                </div>
                <div style={{
                  fontWeight: 'bold',
                  color: isConnected ? 'white' : '#000',
                  marginBottom: '4px'
                }}>
                  {platform.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: isConnected ? 'rgba(255,255,255,0.8)' : '#666'
                }}>
                  {isConnecting
                    ? 'Connecting...'
                    : isConnected
                    ? '✓ Connected (click to disconnect)'
                    : 'Click to connect'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Complete Button */}
      <div style={{
        position: 'sticky',
        bottom: '0',
        background: 'white',
        padding: '24px 0',
        borderTop: '2px solid #ddd',
        textAlign: 'center'
      }}>
        <button
          onClick={handleComplete}
          disabled={saving || connectedPlatforms.length === 0}
          style={{
            padding: '16px 48px',
            background: connectedPlatforms.length > 0
              ? 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))'
              : '#ccc',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: connectedPlatforms.length > 0 ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s'
          }}
        >
          {saving ? 'Saving...' : `Complete Setup & Earn ${connectedPlatforms.length * 50} XP →`}
        </button>

        {connectedPlatforms.length === 0 && (
          <p style={{
            color: '#999',
            fontSize: '14px',
            marginTop: '12px'
          }}>
            Connect at least one platform to continue
          </p>
        )}
      </div>
    </div>
  );
}
