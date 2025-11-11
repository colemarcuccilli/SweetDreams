// API Route: /api/auth/status
// Get OAuth connection status for current user

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase: SupabaseClient = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all OAuth tokens for user
    const { data: tokens, error: tokensError } = await supabase
      .from('oauth_tokens')
      .select('platform, platform_username, expires_at, is_active, last_used_at, error_count, last_error')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (tokensError) {
      throw tokensError;
    }

    // Fetch connected platforms from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('connected_platforms')
      .eq('user_id', user.id)
      .single();

    // Format response with connection health
    const connections = (tokens || []).map(token => {
      const expiresAt = token.expires_at ? new Date(token.expires_at) : null;
      const isExpired = expiresAt ? expiresAt.getTime() < Date.now() : false;
      const isExpiringSoon = expiresAt
        ? expiresAt.getTime() < Date.now() + 24 * 60 * 60 * 1000
        : false;

      let status: 'healthy' | 'expiring_soon' | 'expired' | 'error' | 'inactive';

      if (!token.is_active) {
        status = 'inactive';
      } else if (token.error_count > 0) {
        status = 'error';
      } else if (isExpired) {
        status = 'expired';
      } else if (isExpiringSoon) {
        status = 'expiring_soon';
      } else {
        status = 'healthy';
      }

      return {
        platform: token.platform,
        username: token.platform_username,
        status,
        expiresAt: token.expires_at,
        lastUsedAt: token.last_used_at,
        errorCount: token.error_count,
        lastError: token.last_error,
      };
    });

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      connectedPlatforms: profile?.connected_platforms || [],
      connections,
      summary: {
        total: connections.length,
        healthy: connections.filter(c => c.status === 'healthy').length,
        expiringSoon: connections.filter(c => c.status === 'expiring_soon').length,
        expired: connections.filter(c => c.status === 'expired').length,
        errors: connections.filter(c => c.status === 'error').length,
        inactive: connections.filter(c => c.status === 'inactive').length,
      },
    });
  } catch (error) {
    console.error('Failed to fetch OAuth status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connection status' },
      { status: 500 }
    );
  }
}