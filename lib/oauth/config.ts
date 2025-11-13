// OAuth Configuration for all platforms
// Store actual client IDs and secrets in environment variables

export interface OAuthPlatformConfig {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  refreshUrl?: string;
  revokeUrl?: string;
  scopes: string[];
  userInfoUrl?: string;
  requiresCodeChallenge?: boolean; // For PKCE
  tokenExpiresIn?: number; // Default token lifetime in seconds
  supportsRefresh: boolean;
}

export interface OAuthToken {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  // Platform-specific fields
  [key: string]: any;
}

export interface PlatformUserInfo {
  id: string;
  username?: string;
  email?: string;
  displayName?: string;
  profilePictureUrl?: string;
  metadata?: Record<string, any>;
}

// OAuth platform configurations
export const OAUTH_CONFIGS: Record<string, OAuthPlatformConfig> = {
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID!,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    // Instagram now uses Facebook OAuth with Instagram permissions
    authorizationUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: [
      'instagram_basic',
      'instagram_manage_insights',
      'pages_show_list',
      'pages_read_engagement',
      'public_profile',
      'email',
    ],
    userInfoUrl: 'https://graph.facebook.com/me/accounts',
    tokenExpiresIn: 60 * 24 * 60 * 60, // 60 days
    supportsRefresh: false, // Facebook uses token exchange
  },

  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    authorizationUrl: 'https://accounts.spotify.com/authorize',
    tokenUrl: 'https://accounts.spotify.com/api/token',
    refreshUrl: 'https://accounts.spotify.com/api/token',
    scopes: [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'user-library-read',
      'user-follow-read',
      'playlist-read-private',
      'playlist-read-collaborative',
    ],
    userInfoUrl: 'https://api.spotify.com/v1/me',
    tokenExpiresIn: 3600, // 1 hour
    supportsRefresh: true,
  },

  youtube: {
    clientId: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    refreshUrl: 'https://oauth2.googleapis.com/token',
    revokeUrl: 'https://oauth2.googleapis.com/revoke',
    scopes: [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/youtubepartner',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    userInfoUrl: 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
    tokenExpiresIn: 3600, // 1 hour
    supportsRefresh: true,
  },

  tiktok: {
    clientId: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY!,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
    authorizationUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    refreshUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    scopes: [
      'user.info.basic',
      'user.info.profile',
      'user.info.stats',
      'video.list',
      'video.publish',
    ],
    userInfoUrl: 'https://open.tiktokapis.com/v2/user/info/',
    requiresCodeChallenge: true, // TikTok requires PKCE
    tokenExpiresIn: 86400, // 24 hours
    supportsRefresh: true,
  },

  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    authorizationUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: [
      'public_profile',
      'email',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_metadata',
      'pages_read_user_content',
    ],
    userInfoUrl: 'https://graph.facebook.com/me',
    tokenExpiresIn: 60 * 24 * 60 * 60, // 60 days for long-lived tokens
    supportsRefresh: false, // Facebook uses token exchange instead
  },

  twitter: {
    clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    authorizationUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    refreshUrl: 'https://api.twitter.com/2/oauth2/token',
    revokeUrl: 'https://api.twitter.com/2/oauth2/revoke',
    scopes: [
      'users.read',
      'tweet.read',
      'follows.read',
      'offline.access', // For refresh token
    ],
    userInfoUrl: 'https://api.twitter.com/2/users/me',
    requiresCodeChallenge: true, // Twitter OAuth 2.0 requires PKCE
    tokenExpiresIn: 7200, // 2 hours
    supportsRefresh: true,
  },

  apple_music: {
    clientId: process.env.NEXT_PUBLIC_APPLE_MUSIC_SERVICE_ID!,
    clientSecret: process.env.APPLE_MUSIC_PRIVATE_KEY!, // Requires JWT signing
    authorizationUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    refreshUrl: 'https://appleid.apple.com/auth/token',
    revokeUrl: 'https://appleid.apple.com/auth/revoke',
    scopes: ['name', 'email'],
    tokenExpiresIn: 3600, // 1 hour
    supportsRefresh: true,
  },

  soundcloud: {
    clientId: process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT_ID!,
    clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET!,
    authorizationUrl: 'https://api.soundcloud.com/connect',
    tokenUrl: 'https://api.soundcloud.com/oauth2/token',
    scopes: ['non-expiring'],
    userInfoUrl: 'https://api.soundcloud.com/me',
    supportsRefresh: false, // SoundCloud tokens don't expire
  },

  deezer: {
    clientId: process.env.NEXT_PUBLIC_DEEZER_APP_ID!,
    clientSecret: process.env.DEEZER_SECRET_KEY!,
    authorizationUrl: 'https://connect.deezer.com/oauth/auth.php',
    tokenUrl: 'https://connect.deezer.com/oauth/access_token.php',
    scopes: [
      'basic_access',
      'email',
      'offline_access',
      'manage_library',
      'manage_community',
      'listening_history',
    ],
    userInfoUrl: 'https://api.deezer.com/user/me',
    supportsRefresh: false, // Deezer tokens don't expire
  },

  amazon_music: {
    // Amazon Music uses Login with Amazon OAuth
    clientId: process.env.NEXT_PUBLIC_AMAZON_CLIENT_ID!,
    clientSecret: process.env.AMAZON_CLIENT_SECRET!,
    authorizationUrl: 'https://www.amazon.com/ap/oa',
    tokenUrl: 'https://api.amazon.com/auth/o2/token',
    refreshUrl: 'https://api.amazon.com/auth/o2/token',
    scopes: ['profile', 'profile:user_id'],
    tokenExpiresIn: 3600, // 1 hour
    supportsRefresh: true,
  },

  youtube_music: {
    // YouTube Music uses the same OAuth as YouTube
    clientId: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    refreshUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.readonly',
    ],
    tokenExpiresIn: 3600, // 1 hour
    supportsRefresh: true,
  },

  tidal: {
    clientId: process.env.NEXT_PUBLIC_TIDAL_CLIENT_ID!,
    clientSecret: process.env.TIDAL_CLIENT_SECRET!,
    authorizationUrl: 'https://login.tidal.com/authorize',
    tokenUrl: 'https://auth.tidal.com/v1/oauth2/token',
    refreshUrl: 'https://auth.tidal.com/v1/oauth2/token',
    scopes: ['r_usr', 'w_usr', 'w_sub'],
    userInfoUrl: 'https://api.tidal.com/v1/users/me',
    tokenExpiresIn: 604800, // 1 week
    supportsRefresh: true,
  },
};

// Helper to get redirect URI
export function getRedirectUri(platform: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/auth/callback/${platform}`;
}

// Helper to build authorization URL
export function buildAuthorizationUrl(
  platform: string,
  state: string,
  codeChallenge?: string
): string {
  const config = OAUTH_CONFIGS[platform];
  if (!config) {
    throw new Error(`Unknown platform: ${platform}`);
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: getRedirectUri(platform),
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
  });

  // Add platform-specific parameters
  switch (platform) {
    case 'instagram':
    case 'facebook':
      params.append('display', 'popup');
      break;
    case 'spotify':
      params.append('show_dialog', 'true');
      break;
    case 'youtube':
    case 'youtube_music':
      params.append('access_type', 'offline');
      params.append('prompt', 'consent');
      break;
    case 'tiktok':
    case 'twitter':
      if (codeChallenge) {
        params.append('code_challenge', codeChallenge);
        params.append('code_challenge_method', 'S256');
      }
      break;
  }

  return `${config.authorizationUrl}?${params.toString()}`;
}

// Platform display information
export const PLATFORM_INFO = {
  instagram: {
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    category: 'social',
  },
  facebook: {
    name: 'Facebook',
    icon: '👥',
    color: '#1877F2',
    category: 'social',
  },
  youtube: {
    name: 'YouTube',
    icon: '▶️',
    color: '#FF0000',
    category: 'social',
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    category: 'social',
  },
  twitter: {
    name: 'X (Twitter)',
    icon: '🐦',
    color: '#1DA1F2',
    category: 'social',
  },
  spotify: {
    name: 'Spotify',
    icon: '🎧',
    color: '#1DB954',
    category: 'streaming',
  },
  apple_music: {
    name: 'Apple Music',
    icon: '🍎',
    color: '#FA243C',
    category: 'streaming',
  },
  deezer: {
    name: 'Deezer',
    icon: '🎶',
    color: '#FF0092',
    category: 'streaming',
  },
  soundcloud: {
    name: 'SoundCloud',
    icon: '☁️',
    color: '#FF5500',
    category: 'streaming',
  },
  amazon_music: {
    name: 'Amazon Music',
    icon: '📦',
    color: '#232F3E',
    category: 'streaming',
  },
  youtube_music: {
    name: 'YouTube Music',
    icon: '🎼',
    color: '#FF0000',
    category: 'streaming',
  },
  tidal: {
    name: 'Tidal',
    icon: '🌊',
    color: '#000000',
    category: 'streaming',
  },
};