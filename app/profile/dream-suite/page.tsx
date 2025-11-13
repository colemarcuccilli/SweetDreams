'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { createClient } from '@/utils/supabase/client';
import { PLATFORM_INFO } from '@/lib/oauth/config';

export default function DreamSuitePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const profileData = data || {
        id: user.id,
        email: user.email,
        artist_name: user.user_metadata?.artist_name || user.email?.split('@')[0],
        level: 0,
        xp: 0,
        posting_streak: 0,
        onboarding_completed: false,
        connected_platforms: [],
      };

      setProfile(profileData);
      setLoading(false);
    }

    loadProfile();
  }, [user]);

  if (loading) {
    return <div style={{ padding: '48px', color: '#666' }}>Loading...</div>;
  }

  const onboardingComplete = profile?.onboarding_completed || false;
  const connectedPlatforms = profile?.connected_platforms || [];

  // Show "Profile Incomplete" if onboarding not done
  if (!onboardingComplete) {
    return (
      <div style={{ padding: '0', textAlign: 'center', maxWidth: '600px', margin: '80px auto' }}>
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎯</div>
        <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#000', marginBottom: '16px' }}>
          Profile Not Complete
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '32px' }}>
          To access Dream Suite, you need to connect your social media and streaming platforms.
        </p>
        <a
          href="/profile/onboarding"
          style={{
            display: 'inline-block',
            padding: '16px 32px',
            background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          Complete Your Profile →
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Header Section */}
      <div style={{
        marginBottom: '32px',
        padding: '24px',
        background: 'linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(236, 72, 153) 100%)',
        borderRadius: '16px',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          Welcome to Dream Suite
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>
          Your AI-powered music career dashboard
        </p>

        {/* XP and Level Display */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginTop: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '12px 24px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>LEVEL</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{profile.level}</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '12px 24px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>XP</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{profile.xp}</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '12px 24px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>POSTING STREAK</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{profile.posting_streak} days 🔥</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* AI Agent Card */}
        <div style={{
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '16px',
          padding: '24px',
          transition: 'all 0.2s',
          cursor: 'pointer'
        }}
        onClick={() => router.push('/profile/dream-suite/agent')}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgb(147, 51, 234)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(147, 51, 234, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>
            AI Career Agent
          </h2>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            Chat with your personal AI music career advisor. Never forgets your story, goals, or preferences.
          </p>
          <div style={{
            color: 'rgb(147, 51, 234)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Start Conversation →
          </div>
        </div>

        {/* Analytics Card */}
        <div style={{
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '16px',
          padding: '24px',
          transition: 'all 0.2s',
          cursor: 'pointer'
        }}
        onClick={() => router.push('/profile/dream-suite/analytics')}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgb(147, 51, 234)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(147, 51, 234, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>
            Analytics Dashboard
          </h2>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            View all your metrics from {connectedPlatforms.length} connected platform{connectedPlatforms.length !== 1 ? 's' : ''} in one place.
          </p>
          <div style={{
            color: 'rgb(147, 51, 234)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            View Analytics →
          </div>
        </div>

        {/* Content Calendar Card */}
        <div style={{
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '16px',
          padding: '24px',
          transition: 'all 0.2s',
          cursor: 'pointer'
        }}
        onClick={() => router.push('/profile/dream-suite/calendar')}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgb(147, 51, 234)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(147, 51, 234, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>
            Content Calendar
          </h2>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            Track your posts across platforms and compare performance over time.
          </p>
          <div style={{
            color: 'rgb(147, 51, 234)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            View Calendar →
          </div>
        </div>
      </div>

      {/* Connected Platforms Section */}
      <div style={{
        background: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>
          Connected Platforms ({connectedPlatforms.length})
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {connectedPlatforms.map((platform: string) => {
            const info = PLATFORM_INFO[platform as keyof typeof PLATFORM_INFO];
            return (
              <div
                key={platform}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: '#f3f4f6',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb'
                }}
              >
                <span style={{ fontSize: '24px' }}>{info?.icon || '🔗'}</span>
                <span style={{ fontWeight: '600', color: '#000' }}>{info?.name || platform}</span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#10b981',
                  borderRadius: '50%',
                  marginLeft: '4px'
                }} />
              </div>
            );
          })}
          <button
            onClick={() => router.push('/profile/onboarding')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: '2px dashed rgb(147, 51, 234)',
              borderRadius: '12px',
              color: 'rgb(147, 51, 234)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(147, 51, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            + Add More Platforms
          </button>
        </div>
      </div>

      {/* Quick Stats Grid (Placeholder for future analytics) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#000', marginBottom: '8px' }}>
            --
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total Followers</div>
        </div>
        <div style={{
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#000', marginBottom: '8px' }}>
            --
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Monthly Streams</div>
        </div>
        <div style={{
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#000', marginBottom: '8px' }}>
            --
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Engagement Rate</div>
        </div>
        <div style={{
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#000', marginBottom: '8px' }}>
            --
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Posts This Month</div>
        </div>
      </div>
    </div>
  );
}
