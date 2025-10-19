'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// Log Supabase configuration on load (only once)
if (typeof window !== 'undefined') {
  console.log('🔧 SUPABASE CONFIG CHECK:');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export async function signUp(email: string, password: string, fullName: string) {
  console.log('🔐 AUTH: signUp function called');
  console.log('📧 Email:', email);
  console.log('👤 Full Name:', fullName);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.error('❌ AUTH ERROR from Supabase:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
  } else {
    console.log('✅ AUTH SUCCESS from Supabase');
    console.log('User data:', data);
  }

  return { data, error };
}

export async function signIn(email: string, password: string) {
  console.log('🔐 AUTH: signIn function called');
  console.log('📧 Email:', email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('❌ LOGIN ERROR from Supabase:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  } else {
    console.log('✅ LOGIN SUCCESS from Supabase');
    console.log('User:', data.user?.email);
  }

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
