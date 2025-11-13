# Production Migration Notes - Dream Suite

## CRITICAL: Before Merging to Production

### 1. Update Meta Developer Console URLs

**Current (Testing):**
- Site URL: `https://sweetdreams-preview.vercel.app` (or similar Vercel preview URL)
- OAuth Redirect URIs:
  - `https://[vercel-preview].vercel.app/api/auth/callback/facebook`
  - `https://[vercel-preview].vercel.app/api/auth/callback/instagram`

**Must Change To (Production):**
- Site URL: `https://sweetdreamsmusic.com`
- OAuth Redirect URIs:
  - `https://sweetdreamsmusic.com/api/auth/callback/facebook`
  - `https://sweetdreamsmusic.com/api/auth/callback/instagram`

**Where to Update:**
1. Meta Developer Console → Your App → Settings → Basic → Site URL
2. Meta Developer Console → Your App → Facebook Login → Settings → Valid OAuth Redirect URIs
3. Meta Developer Console → Your App → Instagram Graph API → Settings → Valid OAuth Redirect URIs

---

### 2. Update Vercel Environment Variables

**Current (Preview Environment):**
- OAuth credentials configured for Preview scope only

**Must Do (Production):**
1. Copy all environment variables from Preview to Production scope
2. Verify Supabase credentials are correct for production
3. Verify Meta OAuth credentials (Client ID/Secret) are correct
4. Add environment variables for all 12 platforms:
   - Instagram, Facebook, YouTube, TikTok, X/Twitter
   - Spotify, Apple Music, Deezer, SoundCloud, Amazon Music, YouTube Music, Tidal

---

### 3. Meta App Review Requirements

**Before Production Launch:**
- Submit Meta App for Review
- Request necessary permissions:
  - `email`
  - `public_profile`
  - `instagram_basic`
  - `instagram_manage_insights`
  - `pages_show_list` (if needed)
- Provide Privacy Policy URL
- Provide Terms of Service URL
- Complete Data Deletion Instructions
- Complete App Icon and Display Name

**Current Status:** App in Development Mode (not approved for public use)

---

### 4. OAuth Platform Configurations

Complete OAuth setup for remaining 10 platforms:
- [ ] YouTube (Google OAuth)
- [ ] TikTok
- [ ] X/Twitter
- [ ] Spotify
- [ ] Apple Music
- [ ] Deezer
- [ ] SoundCloud
- [ ] Amazon Music
- [ ] YouTube Music
- [ ] Tidal

Each requires:
1. Developer account setup
2. App registration
3. OAuth credentials (Client ID/Secret)
4. Redirect URI configuration
5. Scope/permission requests
6. Environment variables in Vercel

---

### 5. Database Considerations

**Current State:**
- `oauth_tokens` table created in Supabase
- RLS policies enabled
- Indexes created

**Before Production:**
- [ ] Backup database
- [ ] Test RLS policies thoroughly
- [ ] Verify token refresh logic works for all platforms
- [ ] Test error handling for expired/invalid tokens
- [ ] Set up monitoring for OAuth failures

---

### 6. Testing Checklist Before Merge

- [ ] Test onboarding flow end-to-end
- [ ] Test OAuth connection for all available platforms
- [ ] Test OAuth disconnection
- [ ] Test token refresh logic (wait for token to near expiration)
- [ ] Test Dream Suite dashboard access (with and without onboarding)
- [ ] Test XP and level calculation
- [ ] Verify admin account follows same rules as regular users
- [ ] Test error handling (connection failures, API errors, etc.)
- [ ] Performance test (load times, API response times)
- [ ] Security audit (token storage, RLS policies, input validation)

---

### 7. Deployment Strategy

**Recommended Approach:**
1. Keep feature/dream-suite branch for testing
2. Deploy to Vercel preview environment first
3. Complete all OAuth configurations with preview URL
4. Test thoroughly on preview deployment
5. Update all OAuth redirect URIs to production URLs
6. Merge to main branch
7. Deploy to production
8. Monitor for issues

**Rollback Plan:**
- Keep feature/dream-suite branch until confirmed stable
- Document rollback procedure (revert merge, redeploy previous version)

---

## Notes

- **DO NOT merge to main** until all items above are completed and verified
- **DO NOT push to production** without explicit approval
- This is a side branch development - production site must remain operational
- All testing must be done on preview/staging environment first

---

## Current Status

- ✅ OAuth implementation complete
- ✅ Database migrations run
- ⏳ Vercel preview deployment (waiting for successful build)
- ⏳ Meta OAuth configuration (in progress)
- ❌ Other 10 platforms not configured yet
- ❌ Meta App Review not submitted
- ❌ Production URLs not configured
