# YouTube API Quick Start

**TL;DR** - Get YouTube integration running in Dream Suite in 15 minutes.

---

## What You Need

### APIs to Enable
1. **YouTube Data API v3** - Channel info, videos, stats, uploads
2. **YouTube Analytics API** - Performance metrics, growth trends

### OAuth Scopes
```typescript
// Read-only (recommended to start)
const scopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/yt-analytics.readonly'
];
```

---

## Quick Setup (15 mins)

### 1. Create Google Cloud Project (3 mins)

1. Go to https://console.cloud.google.com/
2. Create new project: "dream-suite-youtube"
3. Wait for creation

### 2. Enable APIs (2 mins)

1. Go to API Library
2. Enable "YouTube Data API v3"
3. Enable "YouTube Analytics API"

### 3. Configure OAuth Consent Screen (5 mins)

1. Go to OAuth consent screen
2. User type: **External**
3. Fill in:
   - App name: "Dream Suite"
   - Support email: your-email@domain.com
   - App domain: https://yourdomain.com
4. Add scopes:
   - `https://www.googleapis.com/auth/youtube.readonly`
   - `https://www.googleapis.com/auth/yt-analytics.readonly`
5. Add test users (your email)

### 4. Create Credentials (3 mins)

1. Go to Credentials → Create → OAuth client ID
2. Type: **Web application**
3. Add redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/youtube
   https://yourdomain.com/api/auth/callback/youtube
   ```
4. Copy Client ID and Client Secret

### 5. Add to .env.local (2 mins)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_YOUTUBE_CLIENT_ID=your-client-id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your-client-secret
```

---

## Test It

```bash
npm run dev
```

Go to http://localhost:3000/profile/onboarding

Click "Connect YouTube" → Should work!

---

## What You Get

### Channel Data
- Subscriber count
- Total views
- Video count
- Channel info

### Video Data
- List of all videos
- Views, likes, comments per video
- Publishing dates
- Thumbnails

### Analytics
- Daily views
- Watch time
- Subscriber growth
- Traffic sources
- Demographics
- Retention data

### Upload Capability (Phase 2)
- Upload videos programmatically
- Update video metadata
- Manage playlists

---

## Rate Limits

**Free Tier**: 10,000 units/day

**Typical Usage**:
- Fetch channel info: 1 unit
- List 50 videos: 1 unit
- Get analytics: ~5 units
- **Daily refresh per artist**: ~10 units

**Can support 500+ artists on free tier**

---

## Verification

### Testing (No Verification Needed)
- Add test users in OAuth consent screen
- Up to 100 test users
- Shows "unverified app" warning (click through it)

### Production (Requires Verification)
- Submit app for review
- Timeline: 3-7 days (readonly), 2-6 weeks (upload)
- Need: Privacy policy, ToS, demo video

---

## Common Issues

### "Redirect URI mismatch"
- Check redirect URI matches exactly
- No trailing slashes
- Correct protocol (http vs https)

### "This app isn't verified"
- Normal during testing
- Click "Advanced" → "Go to Dream Suite (unsafe)"
- Add yourself as test user

### "Access Not Configured"
- Wait 1-2 mins after enabling API
- Verify API is enabled in correct project

---

## Next Steps

1. **Test OAuth flow** - Connect your YouTube account
2. **Implement data collection** - Use the code examples
3. **Build dashboard UI** - Show analytics to users
4. **Submit for verification** - When ready for production

---

## Full Documentation

See `YOUTUBE-API-SETUP.md` for:
- Detailed API explanations
- Complete code examples
- Advanced features
- Troubleshooting guide
- Production checklist

---

## Support

- Official Docs: https://developers.google.com/youtube/v3
- Google Cloud Console: https://console.cloud.google.com/
- Stack Overflow: https://stackoverflow.com/questions/tagged/youtube-api
