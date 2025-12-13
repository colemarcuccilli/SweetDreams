export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  refreshUrl?: string;
  scopes: string[];
  callbackPath: string;
}

export const OAUTH_CONFIGS: Record<string, OAuthConfig> = {
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
    authUrl: 'https://accounts.spotify.com/authorize',
    tokenUrl: 'https://accounts.spotify.com/api/token',
    refreshUrl: 'https://accounts.spotify.com/api/token',
    scopes: [
      'user-read-email',
      'user-read-private',
      'user-top-read',
      'user-read-recently-played',
      'playlist-read-private',
      'playlist-read-collaborative'
    ],
    callbackPath: '/api/auth/spotify/callback'
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || '',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    refreshUrl: 'https://graph.instagram.com/refresh_access_token',
    scopes: ['user_profile', 'user_media'],
    callbackPath: '/api/auth/instagram/callback'
  },
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_ID || '',
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
    authUrl: 'https://www.tiktok.com/auth/authorize/',
    tokenUrl: 'https://open-api.tiktok.com/oauth/access_token/',
    refreshUrl: 'https://open-api.tiktok.com/oauth/refresh_token/',
    scopes: ['user.info.basic', 'video.list'],
    callbackPath: '/api/auth/tiktok/callback'
  },
  youtube: {
    clientId: process.env.YOUTUBE_CLIENT_ID || '',
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    refreshUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly'
    ],
    callbackPath: '/api/auth/youtube/callback'
  }
};
