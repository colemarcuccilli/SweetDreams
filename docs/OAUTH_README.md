# OAuth Authentication System - Documentation Index

This directory contains comprehensive documentation for the OAuth authentication system implemented in the Sweet Dreams Music Dream Suite.

## Quick Links

| Document | Purpose | Time to Read |
|----------|---------|--------------|
| [Quick Start Guide](./OAUTH_QUICK_START.md) | Get Instagram & Spotify working in 15 minutes | 5 min |
| [Implementation Summary](./OAUTH_IMPLEMENTATION_SUMMARY.md) | Complete overview of what was built | 10 min |
| [Platform Setup Guide](./OAUTH_SETUP.md) | Detailed setup for all 12 platforms | 30 min |

## Getting Started

**If you're setting up OAuth for the first time:**

1. Start with [OAUTH_QUICK_START.md](./OAUTH_QUICK_START.md) to get Instagram and Spotify working
2. Review [OAUTH_IMPLEMENTATION_SUMMARY.md](./OAUTH_IMPLEMENTATION_SUMMARY.md) to understand the architecture
3. Reference [OAUTH_SETUP.md](./OAUTH_SETUP.md) when adding additional platforms

**If you're debugging OAuth issues:**

1. Check the Troubleshooting section in [OAUTH_QUICK_START.md](./OAUTH_QUICK_START.md)
2. Review the Troubleshooting section in [OAUTH_SETUP.md](./OAUTH_SETUP.md)
3. Use the `/api/auth/status` endpoint to check connection health

**If you're integrating OAuth into data collection:**

1. Read the "Using a Token" section in [OAUTH_IMPLEMENTATION_SUMMARY.md](./OAUTH_IMPLEMENTATION_SUMMARY.md)
2. See the Token Manager API reference below
3. Check the example code in [OAUTH_QUICK_START.md](./OAUTH_QUICK_START.md)

## Document Descriptions

### OAUTH_QUICK_START.md
**Best for**: Developers who want to get OAuth working immediately

Contains step-by-step instructions to:
- Run the database migration
- Set up Instagram OAuth (via Facebook)
- Set up Spotify OAuth
- Test the complete flow
- Troubleshoot common issues

**Outcome**: Working OAuth for Instagram and Spotify in 15 minutes

---

### OAUTH_IMPLEMENTATION_SUMMARY.md
**Best for**: Understanding what was built and how it works

Covers:
- Complete file structure
- Architecture overview
- Database schema details
- API endpoint documentation
- Data flow diagrams
- Security features
- Testing checklist
- Next steps for enhancements

**Outcome**: Deep understanding of the OAuth system architecture

---

### OAUTH_SETUP.md
**Best for**: Setting up additional platforms beyond Instagram/Spotify

Includes:
- Detailed setup for all 12 platforms
- OAuth configuration requirements
- Redirect URI formats
- Developer account prerequisites
- Scope explanations
- Token refresh strategies
- Production deployment considerations

**Outcome**: Ability to integrate any supported platform

## Code Quick Reference

### Using OAuth Tokens in Your Code

```typescript
import { getValidToken } from '@/lib/oauth/token-manager';

// Get a valid token (auto-refreshes if expired)
const token = await getValidToken(userId, 'instagram');

if (!token) {
  // User needs to reconnect
  throw new Error('Please reconnect your Instagram account');
}

// Use the token for API calls
const response = await fetch('https://graph.instagram.com/me', {
  headers: {
    'Authorization': `Bearer ${token.accessToken}`
  }
});
```

### Making Authenticated Requests

```typescript
import { makeAuthenticatedRequest } from '@/lib/oauth/token-manager';

// Token refresh handled automatically
const response = await makeAuthenticatedRequest(
  userId,
  'spotify',
  'https://api.spotify.com/v1/me'
);

const userData = await response.json();
```

### Check Connection Status

```typescript
import { hasValidConnection, getConnectedPlatforms } from '@/lib/oauth/token-manager';

// Check if user has valid connection
const isConnected = await hasValidConnection(userId, 'youtube');

// Get all connected platforms
const platforms = await getConnectedPlatforms(userId);
// Returns: ['instagram', 'spotify', 'youtube']
```

### Disconnect a Platform

```typescript
import { disconnectPlatform } from '@/lib/oauth/token-manager';

const success = await disconnectPlatform(userId, 'tiktok');
if (success) {
  console.log('Platform disconnected successfully');
}
```

## File Locations

### Core Implementation Files

```
lib/oauth/
├── config.ts              # Platform configurations
├── utils.ts               # OAuth utilities
└── token-manager.ts       # Token operations

app/api/auth/
├── connect/[platform]/route.ts   # Initiate OAuth
├── callback/[platform]/route.ts  # Handle callback
└── status/route.ts               # Connection status

supabase/migrations/
└── create_oauth_tokens_table.sql  # Database schema
```

### Configuration Files

```
.env.local                 # Your credentials (not in git)
.env.oauth.example         # Template for credentials
```

### UI Files

```
app/profile/onboarding/page.tsx   # Onboarding page with OAuth
```

## Environment Variables Required

**Priority Platforms** (for quick start):
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_INSTAGRAM_CLIENT_ID=...
INSTAGRAM_CLIENT_SECRET=...
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
```

**All Platforms** (see `.env.oauth.example`):
- Instagram (via Facebook)
- Facebook
- Spotify
- YouTube
- TikTok
- Twitter/X
- Apple Music
- Deezer
- SoundCloud
- Amazon Music
- YouTube Music
- Tidal

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/connect/[platform]` | GET | Initiate OAuth flow |
| `/api/auth/callback/[platform]` | GET | Handle OAuth callback |
| `/api/auth/status` | GET | View connection status |

## Database Tables

### oauth_tokens
Stores OAuth tokens securely with RLS policies.

**Key columns**:
- `user_id` - References auth.users
- `platform` - Platform identifier (instagram, spotify, etc.)
- `access_token` - OAuth access token
- `refresh_token` - OAuth refresh token (if supported)
- `expires_at` - Token expiration timestamp
- `is_active` - Connection status
- `error_count` - Consecutive error count
- `metadata` - Platform-specific data (JSONB)

### profiles.connected_platforms
Array of connected platform IDs for quick lookups.

## Testing Endpoints

### Check Token Status
```bash
curl http://localhost:3000/api/auth/status
```

### Manual Token Refresh Test
```sql
-- In Supabase SQL Editor
SELECT
  user_id,
  platform,
  expires_at,
  expires_at < NOW() + INTERVAL '1 day' AS needs_refresh
FROM oauth_tokens
WHERE is_active = true;
```

## Common Tasks

### Add a New Platform

1. Add configuration to `lib/oauth/config.ts`:
   ```typescript
   new_platform: {
     clientId: process.env.NEXT_PUBLIC_NEW_PLATFORM_ID!,
     clientSecret: process.env.NEW_PLATFORM_SECRET!,
     authorizationUrl: '...',
     tokenUrl: '...',
     scopes: ['...'],
     supportsRefresh: true,
   }
   ```

2. Add environment variables to `.env.local`

3. Test: Navigate to `/profile/onboarding` and click the platform

### Debug OAuth Flow

1. Check connection status: `/api/auth/status`
2. Check database: `SELECT * FROM oauth_tokens WHERE user_id = 'your-id'`
3. Check browser console for errors
4. Check server logs for API errors
5. Verify redirect URI in platform settings

### Manually Refresh a Token

```typescript
import { refreshToken } from '@/lib/oauth/token-manager';

const newToken = await refreshToken(userId, 'instagram', currentRefreshToken);
console.log('New access token:', newToken.accessToken);
```

## Security Checklist

- [ ] All secrets in environment variables (not code)
- [ ] `.env.local` in `.gitignore`
- [ ] RLS policies enabled on oauth_tokens
- [ ] State parameter validated on callback
- [ ] PKCE used for platforms that require it
- [ ] HTTPOnly cookies for sensitive data
- [ ] HTTPS in production
- [ ] Token expiration checked before use
- [ ] Error counting to prevent abuse

## Production Deployment

Before deploying to production:

1. **Update Environment Variables**:
   - Set `NEXT_PUBLIC_APP_URL` to production domain
   - Add all production secrets to Vercel/hosting platform

2. **Update Redirect URIs**:
   - Add production URLs to each platform's OAuth settings
   - Format: `https://yourdomain.com/api/auth/callback/{platform}`

3. **Enable HTTPS**:
   - Most platforms require HTTPS for production redirects

4. **Apply for Production Access**:
   - Facebook/Instagram: Submit for app review
   - YouTube: May require OAuth consent screen verification
   - TikTok: Production access separate from development

5. **Set Up Monitoring**:
   - Monitor `/api/auth/status` for error patterns
   - Set up alerts for high error rates
   - Track token refresh success rates

6. **Optional Token Refresh Cron**:
   - Create `/api/cron/refresh-tokens` route
   - Schedule with Vercel Cron (every 6 hours)
   - Prevents tokens from expiring

## Support & Resources

### Internal Documentation
- [Quick Start](./OAUTH_QUICK_START.md) - Get started in 15 minutes
- [Implementation Summary](./OAUTH_IMPLEMENTATION_SUMMARY.md) - Complete overview
- [Platform Setup](./OAUTH_SETUP.md) - Detailed platform guides

### External Resources
- [OAuth 2.0 Spec](https://oauth.net/2/)
- [PKCE Spec](https://oauth.net/2/pkce/)
- Platform-specific docs (see OAUTH_SETUP.md)

### Getting Help

1. Check documentation above
2. Review error logs in browser/server console
3. Test with `/api/auth/status` endpoint
4. Verify platform settings match documentation
5. Check platform developer forums

## Version History

- **v1.0** (2025-01-11): Initial OAuth implementation
  - 12 platforms supported
  - Automatic token refresh
  - Secure token storage
  - Complete documentation

---

**Last Updated**: 2025-01-11
**Status**: Production Ready
**Test Coverage**: Manual testing required