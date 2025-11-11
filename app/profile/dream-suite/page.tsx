'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { createClient } from '@/utils/supabase/client';

export default function DreamSuitePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
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

  const isAdmin = user?.email === 'cole@sweetdreamsmusic.com';
  const onboardingComplete = profile?.onboarding_completed || false;
  const connectedCount = profile?.connected_platforms?.length || 0;

  // Show "Profile Incomplete" if onboarding not done (NO BYPASS - even for admin)
  if (!onboardingComplete) {
    return (
      <div style={{ padding: '0', textAlign: 'center', maxWidth: '600px', margin: '80px auto' }}>
        <div style={{
          fontSize: '80px',
          marginBottom: '24px'
        }}>
          🎯
        </div>
        <h1 style={{
          fontSize: '42px',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '16px'
        }}>
          Profile Not Complete
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.8',
          marginBottom: '32px'
        }}>
          To access Dream Suite, you need to connect your social media and streaming platforms.
          This helps us analyze your audience and provide personalized insights to grow your music career.
        </p>
        <a
          href="/profile/onboarding"
          style={{
            display: 'inline-block',
            padding: '16px 48px',
            background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            textDecoration: 'none',
            transition: 'all 0.3s'
          }}
        >
          Complete Your Profile →
        </a>
        <div style={{
          marginTop: '48px',
          padding: '24px',
          background: '#f9f9f9',
          borderRadius: '8px',
          border: '2px solid #e5e5e5',
          textAlign: 'left'
        }}>
          <h3 style={{
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#000'
          }}>
            What you'll unlock:
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: '#666'
          }}>
            <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>✅</span> AI-powered insights for your music career
            </li>
            <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>✅</span> Cross-platform analytics dashboard
            </li>
            <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>✅</span> Content calendar & scheduling tools
            </li>
            <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>✅</span> Growth tools (playlists, sync licensing, etc.)
            </li>
            <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>✅</span> XP & achievement system
            </li>
          </ul>
        </div>
      </div>
    );
  }

  const level = profile?.level || 0;
  const xp = profile?.xp || 0;
  const nextLevelXP = level === 0 ? 500 : (level + 1) * 500;
  const xpProgress = (xp / nextLevelXP) * 100;

  return (
    <div style={{ padding: '0' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '8px'
        }}>
          Welcome to Dream Suite, {profile?.artist_name || 'Artist'}
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Your AI-powered music career dashboard
        </p>
      </div>

      {/* Admin Badge */}
      {isAdmin && (
        <div style={{
          padding: '12px 24px',
          background: 'linear-gradient(to right, rgb(251, 191, 36), rgb(245, 158, 11))',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'inline-block'
        }}>
          <span style={{ color: '#000', fontWeight: '600' }}>🔑 Admin Access - All Features Unlocked</span>
        </div>
      )}

      {/* Progress Card */}
      <div style={{
        background: 'white',
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '32px',
        marginBottom: '32px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#000' }}>
          Your Progress
        </h2>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#000' }}>
              Level {level}
            </span>
            <span style={{ color: '#666' }}>{xp} XP</span>
          </div>

          {/* XP Progress Bar */}
          <div style={{
            width: '100%',
            height: '12px',
            background: '#e5e5e5',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${xpProgress}%`,
              height: '100%',
              background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))',
              transition: 'width 0.3s ease'
            }} />
          </div>

          <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
            {(nextLevelXP - xp).toLocaleString()} XP until Level {level + 1}
          </p>
        </div>

        {/* Posting Streak */}
        <div style={{
          borderTop: '2px solid #ddd',
          paddingTop: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              padding: '16px',
              background: 'linear-gradient(to bottom right, #fed7aa, #fca5a5)',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '32px' }}>🔥</span>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#000' }}>
                {profile?.posting_streak || 0} Days
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Posting Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div style={{
        background: 'white',
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '32px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#000' }}>
          Coming Soon
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          {[
            { icon: '💡', title: 'AI Insights', desc: 'Personalized recommendations for your music career' },
            { icon: '📊', title: 'Analytics', desc: 'Track your growth across all platforms' },
            { icon: '📅', title: 'Content Calendar', desc: 'Plan and schedule your releases' },
            { icon: '🚀', title: 'Growth Tools', desc: 'Playlist pitching, sync licensing & more' }
          ].map((feature) => (
            <div key={feature.title} style={{
              padding: '24px',
              background: '#f9f9f9',
              borderRadius: '8px',
              border: '2px solid #e5e5e5'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{feature.icon}</div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>{feature.title}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
