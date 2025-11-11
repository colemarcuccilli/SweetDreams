// OAuth utility functions for token management and PKCE

import crypto from 'crypto';

/**
 * Generate a random state parameter for OAuth security
 */
export function generateState(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Generate PKCE code verifier
 */
export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Generate PKCE code challenge from verifier
 */
export function generateCodeChallenge(verifier: string): string {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
}

/**
 * Calculate token expiration timestamp
 */
export function calculateExpiresAt(expiresIn: number): Date {
  return new Date(Date.now() + expiresIn * 1000);
}

/**
 * Check if a token is expired or will expire within buffer time
 */
export function isTokenExpired(
  expiresAt: Date | null,
  bufferSeconds: number = 300 // 5 minutes default buffer
): boolean {
  if (!expiresAt) return false; // No expiration means token is long-lived
  return new Date(expiresAt).getTime() <= Date.now() + bufferSeconds * 1000;
}

/**
 * Safely parse OAuth state parameter
 */
export function parseOAuthState(state: string): {
  userId: string;
  platform: string;
  returnUrl?: string;
} | null {
  try {
    const decoded = Buffer.from(state, 'base64url').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to parse OAuth state:', error);
    return null;
  }
}

/**
 * Create OAuth state parameter with embedded data
 */
export function createOAuthState(data: {
  userId: string;
  platform: string;
  returnUrl?: string;
}): string {
  const json = JSON.stringify(data);
  return Buffer.from(json).toString('base64url');
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForToken(
  platform: string,
  code: string,
  redirectUri: string,
  clientId: string,
  clientSecret: string,
  tokenUrl: string,
  codeVerifier?: string
): Promise<any> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });

  // Add PKCE verifier if required
  if (codeVerifier) {
    params.append('code_verifier', codeVerifier);
  }

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Refresh an OAuth token
 */
export async function refreshOAuthToken(
  platform: string,
  refreshToken: string,
  clientId: string,
  clientSecret: string,
  refreshUrl: string
): Promise<any> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(refreshUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Fetch user information from platform
 */
export async function fetchPlatformUserInfo(
  platform: string,
  accessToken: string,
  userInfoUrl: string
): Promise<any> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
  };

  // Platform-specific headers
  if (platform === 'tiktok') {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(userInfoUrl, {
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`User info fetch failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Normalize user info across different platforms
 */
export function normalizeUserInfo(platform: string, rawData: any): {
  id: string;
  username?: string;
  email?: string;
  displayName?: string;
  profilePictureUrl?: string;
} {
  switch (platform) {
    case 'instagram':
      return {
        id: rawData.id || rawData.user_id,
        username: rawData.username,
        displayName: rawData.name || rawData.username,
        profilePictureUrl: rawData.profile_picture_url,
      };

    case 'spotify':
      return {
        id: rawData.id,
        username: rawData.id,
        email: rawData.email,
        displayName: rawData.display_name,
        profilePictureUrl: rawData.images?.[0]?.url,
      };

    case 'youtube':
    case 'youtube_music':
      return {
        id: rawData.items?.[0]?.id || rawData.id,
        username: rawData.items?.[0]?.snippet?.customUrl,
        displayName: rawData.items?.[0]?.snippet?.title,
        profilePictureUrl: rawData.items?.[0]?.snippet?.thumbnails?.default?.url,
      };

    case 'tiktok':
      return {
        id: rawData.data?.user?.open_id,
        username: rawData.data?.user?.username,
        displayName: rawData.data?.user?.display_name,
        profilePictureUrl: rawData.data?.user?.avatar_url,
      };

    case 'twitter':
      return {
        id: rawData.data?.id,
        username: rawData.data?.username,
        displayName: rawData.data?.name,
        profilePictureUrl: rawData.data?.profile_image_url,
      };

    case 'facebook':
      return {
        id: rawData.id,
        username: rawData.username,
        email: rawData.email,
        displayName: rawData.name,
        profilePictureUrl: rawData.picture?.data?.url,
      };

    default:
      return {
        id: rawData.id || rawData.user_id,
        username: rawData.username || rawData.login,
        email: rawData.email,
        displayName: rawData.display_name || rawData.name,
        profilePictureUrl: rawData.profile_picture_url || rawData.avatar_url,
      };
  }
}