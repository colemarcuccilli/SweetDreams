export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}

/**
 * Refreshes an OAuth token for the given platform
 */
export async function refreshOAuthToken(
  platform: string,
  refreshToken: string,
  clientId: string,
  clientSecret: string,
  refreshUrl: string
): Promise<RefreshTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret
  });

  const response = await fetch(refreshUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to refresh ${platform} token: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Calculates expiration timestamp from expires_in seconds
 */
export function calculateExpiresAt(expiresInSeconds: number): Date {
  const now = new Date();
  return new Date(now.getTime() + expiresInSeconds * 1000);
}

/**
 * Checks if a token is expired or expiring soon (within buffer time)
 */
export function isTokenExpired(expiresAt: string | Date, bufferMinutes: number = 5): boolean {
  const expiryDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const now = new Date();
  const bufferMs = bufferMinutes * 60 * 1000;
  return expiryDate <= new Date(now.getTime() + bufferMs);
}

/**
 * Exchanges authorization code for access token
 */
export async function exchangeCodeForToken(
  platform: string,
  code: string,
  clientId: string,
  clientSecret: string,
  tokenUrl: string,
  redirectUri: string
): Promise<RefreshTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to exchange code for ${platform} token: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  return data;
}
