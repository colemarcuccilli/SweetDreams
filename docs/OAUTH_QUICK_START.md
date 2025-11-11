# OAuth Quick Start - Instagram & Spotify

Get OAuth working in 15 minutes with the two priority platforms: Instagram and Spotify.

## Step 1: Run Database Migration (2 minutes)

```bash
cd C:\Users\cole\Desktop\SweetDreamsMusicLLC\SweetDreams

# Apply the oauth_tokens table migration
npx supabase migration up
```

Expected output:
```
✓ All migrations applied successfully
```

Verify in Supabase:
```sql
-- Run in SQL Editor
SELECT * FROM oauth_tokens LIMIT 1;
```

## Step 2: Set Up Instagram OAuth (5 minutes)

### Create Facebook App

1. Go to https://developers.facebook.com/apps
2. Click "Create App"
3. Select "Business" as app type
4. Fill in:
   - App Name: "Sweet Dreams Music Suite"
   - App Contact Email: cole@sweetdreamsmusic.com
5. Click "Create App"

### Add Instagram Product

1. In your new app dashboard, scroll to "Add Products"
2. Find "Instagram" → Click "Set Up"
3. Go to "Instagram Basic Display"
4. Click "Create New App" (Instagram app within Facebook app)
5. Fill in:
   - Display Name: "Sweet Dreams Music Suite"
   - Privacy Policy URL: https://yourdomain.com/privacy (use any URL for now)
   - Terms of Service URL: https://yourdomain.com/terms

### Configure OAuth Redirect

1. In Instagram Basic Display settings
2. Under "OAuth Redirect URIs", add:
   ```
   http://localhost:3000/api/auth/callback/instagram
   ```
3. Click "Save Changes"

### Get Credentials

1. Go to App Settings → Basic
2. Copy:
   - App ID (this is your Client ID)
   - App Secret (click "Show" button)

### Add to .env.local

Create or update `C:\Users\cole\Desktop\SweetDreamsMusicLLC\SweetDreams\.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_INSTAGRAM_CLIENT_ID=your_app_id_here
INSTAGRAM_CLIENT_SECRET=your_app_secret_here
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
```

Note: Instagram uses Facebook OAuth, so the IDs are the same.

### Add Test User

Instagram requires test users in development:

1. Go to Roles → Test Users
2. Click "Add Instagram Test Users"
3. Add your Instagram account
4. Accept the invitation on Instagram

## Step 3: Set Up Spotify OAuth (5 minutes)

### Create Spotify App

1. Go to https://developer.spotify.com/dashboard
2. Click "Create App"
3. Fill in:
   - App Name: "Sweet Dreams Music Suite"
   - App Description: "Music analytics and insights for artists"
   - Redirect URI: `http://localhost:3000/api/auth/callback/spotify`
4. Check the terms agreement
5. Click "Create"

### Get Credentials

1. Click on your new app
2. Click "Settings"
3. Copy:
   - Client ID
   - Client Secret (click "View client secret")

### Add to .env.local

Add to your `.env.local` file:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

## Step 4: Test the OAuth Flow (3 minutes)

### Start Development Server

```bash
npm run dev
```

Wait for server to start at http://localhost:3000

### Test Instagram Connection

1. Navigate to: http://localhost:3000/profile/onboarding
2. Click the "Instagram" button
3. Should redirect to Facebook login
4. Log in and authorize
5. Should redirect back with success message
6. Verify in Supabase:
   ```sql
   SELECT platform, platform_username, expires_at, is_active
   FROM oauth_tokens
   WHERE platform = 'instagram';
   ```

### Test Spotify Connection

1. On the same onboarding page
2. Click the "Spotify" button
3. Log into Spotify if needed
4. Click "Agree" to authorize
5. Should redirect back with success message
6. Verify in Supabase:
   ```sql
   SELECT platform, platform_username, expires_at, is_active
   FROM oauth_tokens
   WHERE platform = 'spotify';
   ```

### Check Connection Status

Visit: http://localhost:3000/api/auth/status

Should see JSON response:
```json
{
  "userId": "...",
  "email": "cole@sweetdreamsmusic.com",
  "connectedPlatforms": ["instagram", "spotify"],
  "connections": [
    {
      "platform": "instagram",
      "username": "your_username",
      "status": "healthy",
      "expiresAt": "2025-03-11T...",
      "errorCount": 0
    },
    {
      "platform": "spotify",
      "username": "your_username",
      "status": "healthy",
      "expiresAt": "2025-01-11T...",
      "errorCount": 0
    }
  ],
  "summary": {
    "total": 2,
    "healthy": 2,
    "expired": 0,
    "errors": 0
  }
}
```

## Step 5: Test Token Manager (Optional)

Create a test API route to verify token manager works:

**File**: `app/api/test-token/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getValidToken } from '@/lib/oauth/token-manager';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Test getting Instagram token
  const instagramToken = await getValidToken(user.id, 'instagram');

  // Test getting Spotify token
  const spotifyToken = await getValidToken(user.id, 'spotify');

  return NextResponse.json({
    instagram: {
      hasToken: !!instagramToken,
      expiresAt: instagramToken?.expiresAt,
      username: instagramToken?.platformUsername,
    },
    spotify: {
      hasToken: !!spotifyToken,
      expiresAt: spotifyToken?.expiresAt,
      username: spotifyToken?.platformUsername,
    },
  });
}
```

Visit: http://localhost:3000/api/test-token

Should see your tokens with expiration dates.

## Troubleshooting

### "Redirect URI mismatch" error

**Instagram**:
- Go to Facebook App → Instagram Basic Display → OAuth Redirect URIs
- Make sure it's EXACTLY: `http://localhost:3000/api/auth/callback/instagram`
- No trailing slash
- No https (use http for localhost)

**Spotify**:
- Go to Spotify App → Settings → Redirect URIs
- Make sure it's EXACTLY: `http://localhost:3000/api/auth/callback/spotify`
- Click "Save" after adding

### Can't connect Instagram - "App not authorized"

You need to add yourself as a test user:
1. Facebook App → Roles → Test Users
2. Add Instagram Test Users
3. Accept invitation on Instagram app

### Environment variables not loading

1. Make sure file is named `.env.local` (not `.env`)
2. Restart your dev server after changing env vars
3. Check for typos in variable names (case-sensitive)

### "Unauthorized" error

1. Make sure you're logged into Sweet Dreams Music
2. Clear browser cookies and try again
3. Check Supabase auth is working: http://localhost:3000/profile

### Tokens not appearing in database

1. Check RLS policies are enabled:
   ```sql
   SELECT tablename, policyname
   FROM pg_policies
   WHERE tablename = 'oauth_tokens';
   ```

2. Try querying as service role:
   ```sql
   -- In Supabase SQL Editor (automatically uses service role)
   SELECT * FROM oauth_tokens;
   ```

## What's Next?

Now that OAuth is working, you can:

1. **Add more platforms**: Follow `docs/OAUTH_SETUP.md` for YouTube, TikTok, etc.

2. **Use tokens in data collection**:
   ```typescript
   import { getValidToken } from '@/lib/oauth/token-manager';

   const token = await getValidToken(userId, 'instagram');

   const response = await fetch('https://graph.instagram.com/me?fields=username,followers_count', {
     headers: {
       'Authorization': `Bearer ${token.accessToken}`
     }
   });
   ```

3. **Build n8n workflows**: Use the token manager in your data collection workflows

4. **Set up token refresh cron**: Automatically refresh tokens before expiration

5. **Complete onboarding**: Users will earn 50 XP per connected platform

## Success Criteria

You've successfully set up OAuth when:

- [ ] Database migration applied
- [ ] Instagram OAuth app created
- [ ] Spotify OAuth app created
- [ ] Environment variables configured
- [ ] Can connect Instagram from onboarding page
- [ ] Can connect Spotify from onboarding page
- [ ] Tokens stored in `oauth_tokens` table
- [ ] `/api/auth/status` shows both connections as "healthy"
- [ ] Can disconnect and reconnect platforms

## Support

If you get stuck:

1. Check `docs/OAUTH_SETUP.md` for detailed platform instructions
2. Review `docs/OAUTH_IMPLEMENTATION_SUMMARY.md` for architecture
3. Check browser console for JavaScript errors
4. Check server logs for API errors
5. Verify environment variables with: `console.log(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID)`

---

**Estimated Time**: 15 minutes
**Difficulty**: Beginner
**Prerequisites**: Supabase set up, app running locally