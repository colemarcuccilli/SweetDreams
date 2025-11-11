# OAuth Setup Guide for Dream Suite

This guide walks you through setting up OAuth authentication for all supported platforms in the Dream Suite onboarding flow.

## Architecture Overview

### Flow Diagram
```
User clicks "Connect Instagram"
  → GET /api/auth/connect/instagram
  → Redirect to Instagram OAuth page
  → User authorizes
  → Redirect to /api/auth/callback/instagram?code=...
  → Exchange code for tokens
  → Store in oauth_tokens table
  → Redirect back to /profile/onboarding?connected=instagram
```

### Database Schema

**oauth_tokens table**:
- Stores access tokens, refresh tokens, and metadata
- Row-level security ensures users only see their own tokens
- Automatic token refresh before expiration
- Error tracking for failed API calls

**profiles.connected_platforms**:
- Array of platform IDs
- Used for quick checks and XP calculations

## Prerequisites

1. **Supabase Setup**: Run the migration
   ```bash
   npx supabase migration up
   ```

2. **Environment Variables**: Copy `.env.oauth.example` to `.env.local`
   ```bash
   cp .env.oauth.example .env.local
   ```

3. **Public URL**: Set your app URL
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000  # Development
   NEXT_PUBLIC_APP_URL=https://yourdomain.com  # Production
   ```

## Platform Setup Instructions

### Priority 1: Instagram (via Facebook)

Instagram uses Facebook's OAuth system.

1. **Create Facebook App**
   - Go to https://developers.facebook.com/apps
   - Create new app → Type: Business
   - Add "Instagram Basic Display" and "Instagram Graph API" products

2. **Configure OAuth Settings**
   - Navigate to: App Settings → Basic
   - Add redirect URIs:
     - `http://localhost:3000/api/auth/callback/instagram`
     - `https://yourdomain.com/api/auth/callback/instagram`

3. **Get Credentials**
   - App ID → `NEXT_PUBLIC_INSTAGRAM_CLIENT_ID`
   - App Secret → `INSTAGRAM_CLIENT_SECRET`

4. **Required Permissions**
   - `instagram_basic`
   - `instagram_manage_insights`
   - `pages_show_list`
   - `pages_read_engagement`

5. **Test Users** (for development)
   - Roles → Add Test Users
   - Instagram accounts must be added as Test Users before they can authorize

---

### Priority 2: Spotify

1. **Create Spotify App**
   - Go to https://developer.spotify.com/dashboard
   - Create new app
   - App Settings

2. **Configure Redirect URIs**
   - Settings → Redirect URIs → Add:
     - `http://localhost:3000/api/auth/callback/spotify`
     - `https://yourdomain.com/api/auth/callback/spotify`

3. **Get Credentials**
   - Client ID → `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`
   - Client Secret → `SPOTIFY_CLIENT_SECRET`

4. **Scopes Used**
   - `user-read-private`
   - `user-read-email`
   - `user-top-read`
   - `user-library-read`

---

### YouTube (Google OAuth)

1. **Create Google Cloud Project**
   - Go to https://console.cloud.google.com/
   - Create new project

2. **Enable YouTube Data API**
   - APIs & Services → Library
   - Search "YouTube Data API v3"
   - Enable

3. **Create OAuth Credentials**
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type: Web application

4. **Configure Authorized Redirect URIs**
   - Add:
     - `http://localhost:3000/api/auth/callback/youtube`
     - `https://yourdomain.com/api/auth/callback/youtube`

5. **Get Credentials**
   - Client ID → `NEXT_PUBLIC_YOUTUBE_CLIENT_ID`
   - Client Secret → `YOUTUBE_CLIENT_SECRET`

6. **OAuth Consent Screen**
   - Configure consent screen (External or Internal)
   - Add scopes:
     - `.../auth/youtube.readonly`
     - `.../auth/youtube.force-ssl`

---

### TikTok

TikTok has strict API access requirements.

1. **Apply for Developer Access**
   - Go to https://developers.tiktok.com/
   - Register as a developer
   - Apply for API access (can take weeks)

2. **Create App** (after approval)
   - Developer Portal → Create App
   - Add "Login Kit" product

3. **Configure Redirect URL**
   - Redirect URL:
     - `http://localhost:3000/api/auth/callback/tiktok`
     - `https://yourdomain.com/api/auth/callback/tiktok`

4. **Get Credentials**
   - Client Key → `NEXT_PUBLIC_TIKTOK_CLIENT_KEY`
   - Client Secret → `TIKTOK_CLIENT_SECRET`

5. **Note**: TikTok requires PKCE (code challenge). This is handled automatically.

---

### Twitter / X

Twitter now requires OAuth 2.0 with PKCE.

1. **Create Twitter App**
   - Go to https://developer.twitter.com/
   - Sign up for developer account
   - Create project → Create app

2. **Enable OAuth 2.0**
   - App Settings → User authentication settings
   - Type of App: Web App
   - Enable OAuth 2.0

3. **Configure Callback URL**
   - Callback URL:
     - `http://localhost:3000/api/auth/callback/twitter`
     - `https://yourdomain.com/api/auth/callback/twitter`

4. **Get Credentials**
   - OAuth 2.0 Client ID → `NEXT_PUBLIC_TWITTER_CLIENT_ID`
   - OAuth 2.0 Client Secret → `TWITTER_CLIENT_SECRET`

---

### Apple Music

Apple Music requires an Apple Developer account ($99/year).

1. **Join Apple Developer Program**
   - https://developer.apple.com/programs/

2. **Register Service ID**
   - Certificates, Identifiers & Profiles
   - Identifiers → App IDs → Service IDs
   - Create new Service ID

3. **Configure Sign In with Apple**
   - Enable "Sign In with Apple"
   - Configure Return URLs:
     - `http://localhost:3000/api/auth/callback/apple_music`
     - `https://yourdomain.com/api/auth/callback/apple_music`

4. **Create Private Key**
   - Keys → Create new key
   - Enable "MusicKit"
   - Download .p8 file

5. **Get Credentials**
   - Service ID → `NEXT_PUBLIC_APPLE_MUSIC_SERVICE_ID`
   - Team ID → `APPLE_MUSIC_TEAM_ID`
   - Key ID → `APPLE_MUSIC_KEY_ID`
   - Private Key content → `APPLE_MUSIC_PRIVATE_KEY`

---

### Other Platforms

The following platforms have similar OAuth flows. Refer to their developer documentation:

- **Facebook**: https://developers.facebook.com/docs/facebook-login
- **SoundCloud**: https://developers.soundcloud.com/docs/api/guide
- **Deezer**: https://developers.deezer.com/api/oauth
- **Amazon Music**: https://developer.amazon.com/docs/login-with-amazon
- **Tidal**: Contact Tidal for API access
- **YouTube Music**: Uses same OAuth as YouTube

## Testing the OAuth Flow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Navigate to Onboarding**
   ```
   http://localhost:3000/profile/onboarding
   ```

3. **Click Platform Button**
   - Should redirect to platform's OAuth page
   - Authorize the app
   - Should redirect back with success notification

4. **Verify Token Storage**
   ```sql
   -- In Supabase SQL Editor
   SELECT * FROM oauth_tokens WHERE user_id = 'your-user-id';
   ```

## Troubleshooting

### "Redirect URI mismatch"
- Verify the redirect URI in your platform settings **exactly** matches
- Check for trailing slashes (most platforms don't want them)
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly

### "Invalid client credentials"
- Double-check Client ID and Secret
- Ensure secrets are in `.env.local` (not `.env`)
- Restart dev server after changing env vars

### "State parameter mismatch"
- Clear browser cookies
- Check if your app URL is correct
- Ensure you're not using multiple tabs

### Token not refreshing
- Verify platform supports refresh tokens
- Check `supportsRefresh` in `lib/oauth/config.ts`
- Ensure refresh token was stored in database

### "This app hasn't been verified"
- For Google/YouTube, add your email as test user
- For production, submit app for verification

## Token Refresh Strategy

Tokens are automatically refreshed by the `getValidToken()` function:

```typescript
import { getValidToken } from '@/lib/oauth/token-manager';

// In your data collection code
const token = await getValidToken(userId, 'instagram');
if (!token) {
  // User needs to reconnect
  throw new Error('Please reconnect your Instagram account');
}

// Use token.accessToken for API calls
```

### Background Refresh Job (Optional)

For production, set up a cron job to refresh tokens before expiration:

```typescript
// app/api/cron/refresh-tokens/route.ts
import { getTokensNeedingRefresh, refreshToken } from '@/lib/oauth/token-manager';

export async function GET(request: Request) {
  const tokens = await getTokensNeedingRefresh();

  for (const token of tokens) {
    try {
      await refreshToken(token.userId, token.platform, token.refreshToken);
    } catch (error) {
      console.error(`Failed to refresh ${token.platform}:`, error);
    }
  }

  return Response.json({ refreshed: tokens.length });
}
```

Schedule with Vercel Cron:
```json
{
  "crons": [
    {
      "path": "/api/cron/refresh-tokens",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

## Security Best Practices

1. **Never Commit Secrets**
   - Add `.env.local` to `.gitignore`
   - Use environment variables in production

2. **Use HTTPS in Production**
   - OAuth requires HTTPS for production redirects
   - Most platforms reject HTTP redirects

3. **Validate State Parameter**
   - Always included and validated (handled automatically)
   - Prevents CSRF attacks

4. **Token Encryption** (Future Enhancement)
   - Consider encrypting tokens at rest
   - Use Supabase Vault or application-level encryption

5. **Rate Limiting**
   - Implement rate limiting on OAuth endpoints
   - Prevent abuse of token exchange

## Next Steps

After setting up OAuth:

1. **Test all platforms** with your developer accounts
2. **Create data collection workflows** using `getValidToken()`
3. **Set up monitoring** for failed OAuth attempts
4. **Apply for production access** for platforms requiring review
5. **Implement token refresh cron job** for reliability

## Support

For platform-specific issues, refer to:
- Instagram: https://developers.facebook.com/support
- Spotify: https://developer.spotify.com/support
- YouTube: https://support.google.com/youtube
- TikTok: https://developers.tiktok.com/support
- Twitter: https://developer.twitter.com/en/support