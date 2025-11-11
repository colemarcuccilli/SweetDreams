// Token Manager - Handles token refresh and validation
// Used by data collection systems and API calls

import { createClient } from '@/utils/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { OAUTH_CONFIGS } from './config';
import { refreshOAuthToken, calculateExpiresAt, isTokenExpired } from './utils';

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  platformUserId?: string;
  platformUsername?: string;
  metadata?: Record<string, any>;
}

/**
 * Get a valid OAuth token for a user and platform
 * Automatically refreshes if expired or about to expire
 */
export async function getValidToken(
  userId: string,
  platform: string
): Promise<TokenData | null> {
  const supabase: SupabaseClient = await createClient();

  // Fetch current token
  const { data: tokenRecord, error } = await supabase
    .from('oauth_tokens')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', platform)
    .eq('is_active', true)
    .single();

  if (error || !tokenRecord) {
    console.error(`No active token found for ${platform}:`, error);
    return null;
  }

  // Check if token needs refresh
  const expiresAt = tokenRecord.expires_at ? new Date(tokenRecord.expires_at) : null;
  const needsRefresh = expiresAt && isTokenExpired(expiresAt, 600); // 10 min buffer

  if (needsRefresh && tokenRecord.refresh_token) {
    try {
      const refreshedToken = await refreshToken(userId, platform, tokenRecord.refresh_token);
      return refreshedToken;
    } catch (error) {
      console.error(`Failed to refresh token for ${platform}:`, error);

      // Mark token as having errors
      await supabase
        .from('oauth_tokens')
        .update({
          error_count: tokenRecord.error_count + 1,
          last_error: error instanceof Error ? error.message : 'Token refresh failed',
          last_error_at: new Date().toISOString(),
          is_active: tokenRecord.error_count >= 2, // Deactivate after 3 errors
        })
        .eq('id', tokenRecord.id);

      return null;
    }
  }

  // Token is valid, return it
  return {
    accessToken: tokenRecord.access_token,
    refreshToken: tokenRecord.refresh_token,
    expiresAt: expiresAt || undefined,
    platformUserId: tokenRecord.platform_user_id,
    platformUsername: tokenRecord.platform_username,
    metadata: tokenRecord.metadata,
  };
}

/**
 * Refresh an OAuth token
 */
export async function refreshToken(
  userId: string,
  platform: string,
  currentRefreshToken: string
): Promise<TokenData> {
  const config = OAUTH_CONFIGS[platform];
  if (!config) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  if (!config.supportsRefresh || !config.refreshUrl) {
    throw new Error(`Platform ${platform} does not support token refresh`);
  }

  // Call platform's refresh endpoint
  const tokenData = await refreshOAuthToken(
    platform,
    currentRefreshToken,
    config.clientId,
    config.clientSecret,
    config.refreshUrl
  );

  // Calculate new expiration
  const expiresAt = tokenData.expires_in
    ? calculateExpiresAt(tokenData.expires_in)
    : config.tokenExpiresIn
    ? calculateExpiresAt(config.tokenExpiresIn)
    : null;

  // Update token in database
  const supabase: SupabaseClient = await createClient();
  const { error } = await supabase
    .from('oauth_tokens')
    .update({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || currentRefreshToken, // Some platforms don't return new refresh token
      expires_at: expiresAt?.toISOString() || null,
      last_refresh_at: new Date().toISOString(),
      last_used_at: new Date().toISOString(),
      error_count: 0, // Reset error count on successful refresh
      last_error: null,
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('platform', platform);

  if (error) {
    throw new Error(`Failed to update token in database: ${error.message}`);
  }

  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token || currentRefreshToken,
    expiresAt: expiresAt || undefined,
  };
}

/**
 * Check if a user has a valid connection to a platform
 */
export async function hasValidConnection(
  userId: string,
  platform: string
): Promise<boolean> {
  const token = await getValidToken(userId, platform);
  return token !== null;
}

/**
 * Get all connected platforms for a user
 */
export async function getConnectedPlatforms(
  userId: string
): Promise<string[]> {
  const supabase: SupabaseClient = await createClient();

  const { data, error } = await supabase
    .from('oauth_tokens')
    .select('platform')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) {
    console.error('Failed to fetch connected platforms:', error);
    return [];
  }

  return data.map(record => record.platform);
}

/**
 * Get all tokens that need refresh (expiring within 24 hours)
 * Useful for background refresh jobs
 */
export async function getTokensNeedingRefresh(): Promise<
  Array<{
    userId: string;
    platform: string;
    refreshToken: string;
    expiresAt: Date;
  }>
> {
  const supabase: SupabaseClient = await createClient();

  // Get tokens expiring in the next 24 hours
  const expiryThreshold = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('oauth_tokens')
    .select('user_id, platform, refresh_token, expires_at')
    .eq('is_active', true)
    .not('refresh_token', 'is', null)
    .lt('expires_at', expiryThreshold.toISOString());

  if (error) {
    console.error('Failed to fetch tokens needing refresh:', error);
    return [];
  }

  return data.map(record => ({
    userId: record.user_id,
    platform: record.platform,
    refreshToken: record.refresh_token,
    expiresAt: new Date(record.expires_at),
  }));
}

/**
 * Disconnect a platform (revoke and delete token)
 */
export async function disconnectPlatform(
  userId: string,
  platform: string
): Promise<boolean> {
  const supabase: SupabaseClient = await createClient();

  // TODO: Call platform's revoke endpoint if available
  // For now, just delete from database

  const { error } = await supabase
    .from('oauth_tokens')
    .delete()
    .eq('user_id', userId)
    .eq('platform', platform);

  if (error) {
    console.error(`Failed to disconnect ${platform}:`, error);
    return false;
  }

  // Update connected_platforms in profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('connected_platforms')
    .eq('user_id', userId)
    .single();

  if (profile?.connected_platforms) {
    const updated = profile.connected_platforms.filter(
      (p: string) => p !== platform
    );

    await supabase
      .from('profiles')
      .update({ connected_platforms: updated })
      .eq('user_id', userId);
  }

  return true;
}

/**
 * Make an authenticated API request to a platform
 * Automatically handles token refresh if needed
 */
export async function makeAuthenticatedRequest(
  userId: string,
  platform: string,
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getValidToken(userId, platform);

  if (!token) {
    throw new Error(`No valid token available for ${platform}`);
  }

  // Add authorization header
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token.accessToken}`);

  // Update last_used_at
  const supabase: SupabaseClient = await createClient();
  await supabase
    .from('oauth_tokens')
    .update({ last_used_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('platform', platform);

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, token might be invalid - mark for refresh
  if (response.status === 401) {
    await supabase
      .from('oauth_tokens')
      .update({
        error_count: supabase.sql`error_count + 1`,
        last_error: 'Unauthorized API request',
        last_error_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('platform', platform);
  }

  return response;
}