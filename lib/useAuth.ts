'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

// Dev-only logging
const isDev = process.env.NODE_ENV === 'development';

// Get singleton Supabase client
const supabase = createClient();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isDev) {
        console.log('🔐 useAuth: Session check:', session ? '✅ Logged in as ' + session.user.email : '❌ No session');
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isDev) {
        console.log('🔐 useAuth: Auth state changed:', _event, session ? '✅ User: ' + session.user.email : '❌ No session');
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export async function signUp(email: string, password: string, fullName: string) {
  if (isDev) {
    console.log('🔐 AUTH: signUp function called');
    console.log('📧 Email:', email);
    console.log('👤 Full Name:', fullName);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (isDev) {
    if (error) {
      console.error('❌ AUTH ERROR from Supabase:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
    } else {
      console.log('✅ AUTH SUCCESS from Supabase');
      console.log('User data:', data);
    }
  }

  return { data, error };
}

export async function signIn(email: string, password: string) {
  if (isDev) {
    console.log('🔐 AUTH: signIn function called');
    console.log('📧 Email:', email);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (isDev) {
    if (error) {
      console.error('❌ LOGIN ERROR from Supabase:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    } else {
      console.log('✅ LOGIN SUCCESS from Supabase');
      console.log('User:', data.user?.email);
    }
  }

  return { data, error };
}

export async function signOut() {
  if (isDev) {
    console.log('🔐 AUTH: signOut function called');
  }

  const { error } = await supabase.auth.signOut();

  if (isDev) {
    if (error) {
      console.error('❌ LOGOUT ERROR:', error);
    } else {
      console.log('✅ LOGOUT SUCCESS');
    }
  }

  return { error };
}
