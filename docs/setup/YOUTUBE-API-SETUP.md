# YouTube API Integration Setup Guide

Complete guide for integrating YouTube APIs into Dream Suite for music career analytics and management.

---

## Table of Contents
1. [Overview](#overview)
2. [Which APIs Do You Need?](#which-apis-do-you-need)
3. [Required OAuth Scopes](#required-oauth-scopes)
4. [Google Cloud Console Setup](#google-cloud-console-setup)
5. [OAuth Verification Process](#oauth-verification-process)
6. [Rate Limits and Costs](#rate-limits-and-costs)
7. [Step-by-Step Setup Instructions](#step-by-step-setup-instructions)
8. [Testing Your Integration](#testing-your-integration)
9. [Code Implementation](#code-implementation)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Dream Suite needs YouTube integration to help musicians track and grow their video content performance. YouTube provides three main APIs that serve different purposes.

### What We're Building
- OAuth authentication for YouTube accounts
- Video performance analytics (views, watch time, engagement)
- Channel statistics (subscribers, total views)
- Video upload capability
- Comment and community engagement tracking
- Revenue and monetization data (if applicable)

---

## Which APIs Do You Need?

### 1. YouTube Data API v3 (REQUIRED)
**Purpose**: Core functionality for retrieving and managing YouTube data.

**What it provides**:
- Channel information (name, description, subscriber count)
- Video metadata (title, description, tags, category)
- Video statistics (views, likes, comments, shares)
- Playlist management
- Comment data
- Upload videos
- Search functionality

**Quota Cost**: 10,000 units/day (default, free)

**Use cases in Dream Suite**:
- Display channel overview stats
- List all videos with basic metrics
- Upload new videos from the platform
- Track engagement (likes, comments, shares)
- Monitor content performance

---

### 2. YouTube Analytics API (REQUIRED)
**Purpose**: Advanced analytics and performance metrics.

**What it provides**:
- Time-series data (views/day, watch time trends)
- Traffic sources (where viewers came from)
- Demographics (age, gender, geography)
- Revenue reports (for monetized channels)
- Audience retention graphs
- Click-through rates
- Average view duration
- Engagement metrics over time

**Quota**: Separate from Data API, generous limits

**Use cases in Dream Suite**:
- Show growth charts (subscriber/view trends)
- Analyze best performing content
- Track audience demographics
- Display revenue analytics
- Monitor watch time and retention
- Provide AI insights on performance patterns

---

### 3. YouTube Reporting API (OPTIONAL)
**Purpose**: Bulk data exports for historical analysis.

**What it provides**:
- Schedule automated reports
- Bulk historical data downloads
- Pre-aggregated CSV reports
- Historical performance data

**When to use**: Only if you need bulk historical data analysis or automated report generation. Most use cases are covered by Analytics API.

**Use cases in Dream Suite**:
- Generate monthly performance reports
- Export data for external analysis
- Long-term trend analysis

---

## Recommendation for Dream Suite

**Start with these two**:
1. YouTube Data API v3 - For real-time data and uploads
2. YouTube Analytics API - For detailed performance metrics

**Skip for now**:
- YouTube Reporting API - Can add later if bulk reporting is needed

---

## Required OAuth Scopes

YouTube uses Google OAuth 2.0. Here are the scopes you'll need:

### For YouTube Data API v3

#### Read-Only Access (Recommended to start)
```
https://www.googleapis.com/auth/youtube.readonly
```
**Grants**:
- Read channel information
- Read video data and statistics
- Read playlists
- Read comments
- View analytics data

**Does NOT grant**:
- Upload videos
- Modify channel settings
- Delete content

#### Full Access (If you need uploads)
```
https://www.googleapis.com/auth/youtube
```
**Grants**:
- Everything in readonly
- Upload videos
- Update video metadata
- Create/modify playlists
- Manage channel settings

**CAUTION**: Requires more extensive verification review.

#### Force SSL (Recommended)
```
https://www.googleapis.com/auth/youtube.force-ssl
```
**Grants**:
- Same as full access
- Forces secure HTTPS connections
- Required for production apps

---

### For YouTube Analytics API

```
https://www.googleapis.com/auth/yt-analytics.readonly
```
**Grants**:
- Access to YouTube Analytics data
- View reports and metrics
- Demographics and traffic sources

```
https://www.googleapis.com/auth/yt-analytics-monetary.readonly
```
**Grants** (if needed):
- Access to revenue data
- Monetization metrics
- Only needed if showing earnings

---

### Recommended Scope Combination for Dream Suite

**Phase 1 (Read-Only, Easier Verification)**:
```typescript
const scopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/yt-analytics.readonly'
];
```

**Phase 2 (Add Upload Capability)**:
```typescript
const scopes = [
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
  'https://www.googleapis.com/auth/yt-analytics-monetary.readonly' // Optional
];
```

---

## Google Cloud Console Setup

### Prerequisites
- Google account (can be personal or business)
- Credit card (required for verification, but APIs are free within quota)

---

## OAuth Verification Process

### When Do You Need Verification?

**Testing Phase (No Verification Needed)**:
- App status: "Testing"
- Can add up to 100 test users
- No time limits on testing
- Limited to test users only
- Shows "unverified app" warning to users

**Production Phase (Verification Required)**:
- App status: "In Production"
- Available to all Google users
- No "unverified app" warning
- Required for public launch

### What Google Reviews

1. **Application Purpose**: Clear explanation of why you need YouTube access
2. **Scope Justification**: Why each OAuth scope is necessary
3. **Privacy Policy**: How user data is handled and stored
4. **Terms of Service**: User agreements and compliance
5. **Demo Video**: Screen recording showing:
   - OAuth consent screen
   - How your app uses each scope
   - User experience flow

### Verification Timeline

- **Readonly scopes**: 3-7 business days
- **Write scopes (uploads)**: 2-6 weeks
- **Sensitive scopes**: Can take longer, may require additional documentation

### Tips for Faster Approval

1. **Clear Use Case**: "Analytics dashboard for independent musicians"
2. **Minimal Scopes**: Only request what you absolutely need
3. **Good Documentation**: Professional privacy policy and ToS
4. **Quality Video**: Show exactly how each scope is used
5. **Responsive**: Answer Google's questions promptly

### During Testing (No Verification)

Add test users in Google Cloud Console:
1. OAuth consent screen
2. Test users section
3. Add email addresses (up to 100)
4. These users can authorize without verification

---

## Rate Limits and Costs

### YouTube Data API v3 Quotas

**Default Allocation**: 10,000 units per day (FREE)

**Cost per Operation**:
- **Read operations** (list videos, channels): 1 unit
- **Write operations** (update metadata): 50 units
- **Video upload**: 1,600 units
- **Search**: 100 units

**Example Daily Usage**:
- Fetch channel info: 1 unit
- List 50 videos: 1 unit
- Get stats for 50 videos: 1 unit
- Upload 1 video: 1,600 units
- **Total**: ~1,603 units (well under 10,000 limit)

**For a typical musician**:
- Daily data refresh: ~10-20 units
- Can support 500+ artists on default quota

### YouTube Analytics API Quotas

**Much more generous than Data API**:
- Separate quota pool
- Designed for frequent analytics queries
- Rarely hit limits in normal usage
- No public quota numbers (very high)

### Requesting Higher Quotas

If you exceed 10,000 units/day:

1. **Complete Compliance Audit**:
   - Must be in production (verified)
   - Prove adherence to YouTube ToS
   - Show proper API usage

2. **Submit Quota Request**:
   - Google Cloud Console → Quotas
   - Explain why you need more
   - Provide usage statistics

3. **Typical Increase**: 100,000 - 1,000,000 units/day

### Monitoring Usage

**Google Cloud Console**:
1. Navigation → APIs & Services → Dashboard
2. Click "YouTube Data API v3"
3. View Quotas tab
4. See daily usage charts

**Set Up Alerts**:
1. Create billing alert (even though it's free)
2. Get notified at 50%, 75%, 90% quota usage

---

## Step-by-Step Setup Instructions

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Navigate to: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click the project dropdown (top left)
   - Click "New Project"
   - Project name: `dream-suite-youtube` (or your preference)
   - Organization: Leave as "No organization" (unless you have Google Workspace)
   - Location: Leave as default
   - Click "Create"

3. **Wait for Project Creation**
   - Takes 10-30 seconds
   - You'll see a notification when ready

---

### Step 2: Enable Required APIs

1. **Open API Library**
   - Hamburger menu → "APIs & Services" → "Library"
   - Or direct link: https://console.cloud.google.com/apis/library

2. **Enable YouTube Data API v3**
   - Search for "YouTube Data API v3"
   - Click on the result
   - Click "Enable"
   - Wait for confirmation (10-20 seconds)

3. **Enable YouTube Analytics API**
   - Click "ENABLE APIS AND SERVICES" at top
   - Search for "YouTube Analytics API"
   - Click on the result
   - Click "Enable"

4. **Enable YouTube Reporting API** (Optional)
   - Same process as above
   - Only if you need bulk reporting

5. **Verify APIs are Enabled**
   - Go to "APIs & Services" → "Dashboard"
   - Should see both APIs listed with usage graphs

---

### Step 3: Configure OAuth Consent Screen

**IMPORTANT**: You MUST do this before creating credentials.

1. **Navigate to Consent Screen**
   - APIs & Services → OAuth consent screen
   - Or: https://console.cloud.google.com/apis/credentials/consent

2. **Choose User Type**
   - **External** (recommended for most)
     - Available to any Google user
     - Requires verification for production
     - Choose this unless you have Google Workspace

   - **Internal** (only if you have Google Workspace)
     - Only available to users in your organization
     - No verification needed
     - Not suitable for customer-facing apps

3. **App Information**
   - **App name**: `Dream Suite`
   - **User support email**: Your support email
   - **App logo**: Upload Dream Suite logo (120x120px PNG)
   - **Application home page**: `https://yourdomain.com`
   - **Application privacy policy**: `https://yourdomain.com/privacy`
   - **Application terms of service**: `https://yourdomain.com/terms`

4. **Developer Contact Information**
   - Email addresses: Your contact email(s)
   - This is where Google will send verification updates

5. **Click "Save and Continue"**

---

### Step 4: Add OAuth Scopes

1. **Add Scopes**
   - Click "Add or Remove Scopes"

2. **Search and Select**:
   ```
   https://www.googleapis.com/auth/youtube.readonly
   https://www.googleapis.com/auth/yt-analytics.readonly
   ```

3. **Review Scope Details**
   - You'll see sensitivity level
   - User-facing permission text
   - API access details

4. **For Upload Capability** (Phase 2):
   - Also add: `https://www.googleapis.com/auth/youtube.force-ssl`

5. **Save and Continue**

---

### Step 5: Add Test Users (For Development)

1. **Test Users Section**
   - Add email addresses of people who will test
   - Can add up to 100 users
   - These users bypass "unverified app" warning

2. **Add Your Own Email**
   - Add your Google account
   - Add team members
   - Add any test accounts

3. **Save and Continue**

4. **Review Summary**
   - Verify all information
   - Click "Back to Dashboard"

---

### Step 6: Create OAuth Credentials

1. **Navigate to Credentials**
   - APIs & Services → Credentials
   - Or: https://console.cloud.google.com/apis/credentials

2. **Create OAuth Client ID**
   - Click "+ CREATE CREDENTIALS" at top
   - Select "OAuth client ID"

3. **Application Type**
   - Choose "Web application"

4. **Name Your Client**
   - Name: `Dream Suite Web Client`

5. **Authorized JavaScript Origins**
   Add your app URLs:
   ```
   http://localhost:3000
   https://yourdomain.com
   https://www.yourdomain.com
   ```

6. **Authorized Redirect URIs**
   Add callback URLs:
   ```
   http://localhost:3000/api/auth/callback/youtube
   https://yourdomain.com/api/auth/callback/youtube
   https://www.yourdomain.com/api/auth/callback/youtube
   ```

7. **Create**
   - Click "Create"
   - You'll see your Client ID and Client Secret

8. **Download JSON** (Optional)
   - Click "Download JSON" for backup
   - Store securely (never commit to Git)

---

### Step 7: Copy Credentials to Environment Variables

1. **Copy Client ID**
   - Shows in format: `123456789-abc123def456.apps.googleusercontent.com`
   - Add to `.env.local`:
   ```env
   NEXT_PUBLIC_YOUTUBE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
   ```

2. **Copy Client Secret**
   - Shows as random string
   - Add to `.env.local`:
   ```env
   YOUTUBE_CLIENT_SECRET=GOCSPX-abc123def456ghi789jkl
   ```

3. **Verify Environment Variables**
   ```env
   # .env.local
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_YOUTUBE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   YOUTUBE_CLIENT_SECRET=your-client-secret
   ```

---

### Step 8: Update OAuth Configuration (Code)

Add YouTube to your OAuth config:

**File**: `lib/oauth/config.ts`

```typescript
export const OAUTH_CONFIGS = {
  // ... other platforms

  youtube: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly'
    ],
    clientId: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    supportsRefresh: true,
    tokenExpiresIn: 3600, // 1 hour
    refreshBeforeExpiry: 300, // 5 minutes
  }
};
```

---

## Testing Your Integration

### Test OAuth Flow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Navigate to Onboarding**
   ```
   http://localhost:3000/profile/onboarding
   ```

3. **Click "Connect YouTube"**
   - Should redirect to Google OAuth page
   - Shows requested scopes
   - If testing: may show "unverified app" (this is normal)
   - Click "Advanced" → "Go to Dream Suite (unsafe)" (testing only)

4. **Authorize the App**
   - Select your YouTube/Google account
   - Review permissions
   - Click "Allow"

5. **Verify Redirect**
   - Should redirect back to Dream Suite
   - See success notification
   - YouTube should show as "Connected"

### Verify Token Storage

**Supabase Dashboard**:
1. Go to Table Editor
2. Open `oauth_tokens` table
3. Find your user's row
4. Verify:
   - `platform`: 'youtube'
   - `access_token`: Present (encrypted)
   - `refresh_token`: Present
   - `expires_at`: Future timestamp
   - `last_refreshed`: Recent timestamp

### Test API Calls

**File**: `lib/youtube/test.ts`

```typescript
import { google } from 'googleapis';
import { getValidToken } from '@/lib/oauth/token-manager';

export async function testYouTubeIntegration(userId: string) {
  // Get valid token (auto-refreshes if needed)
  const tokenData = await getValidToken(userId, 'youtube');

  if (!tokenData) {
    throw new Error('No YouTube token found. Please reconnect.');
  }

  // Initialize YouTube clients
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: tokenData.accessToken
  });

  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
  });

  const youtubeAnalytics = google.youtubeAnalytics({
    version: 'v2',
    auth: oauth2Client
  });

  // Test 1: Get channel info
  const channelResponse = await youtube.channels.list({
    part: ['snippet', 'statistics', 'contentDetails'],
    mine: true
  });

  const channel = channelResponse.data.items?.[0];
  console.log('Channel:', {
    name: channel?.snippet?.title,
    subscribers: channel?.statistics?.subscriberCount,
    totalViews: channel?.statistics?.viewCount,
    videoCount: channel?.statistics?.videoCount
  });

  // Test 2: Get recent videos
  const videosResponse = await youtube.search.list({
    part: ['snippet'],
    forMine: true,
    type: ['video'],
    maxResults: 10,
    order: 'date'
  });

  console.log('Recent Videos:', videosResponse.data.items?.length);

  // Test 3: Get analytics data
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const analyticsResponse = await youtubeAnalytics.reports.query({
    ids: `channel==${channel?.id}`,
    startDate: thirtyDaysAgo,
    endDate: today,
    metrics: 'views,estimatedMinutesWatched,averageViewDuration,subscribersGained',
    dimensions: 'day'
  });

  console.log('Analytics (30 days):', {
    dataPoints: analyticsResponse.data.rows?.length,
    metrics: analyticsResponse.data.columnHeaders?.map(h => h.name)
  });

  return {
    success: true,
    channel,
    videoCount: videosResponse.data.items?.length,
    analyticsAvailable: true
  };
}
```

**Run Test**:
```typescript
// In API route or server action
const result = await testYouTubeIntegration(userId);
console.log('YouTube Integration Test:', result);
```

---

## Code Implementation

### 1. Install Google API Client

```bash
npm install googleapis
```

### 2. Create YouTube Service

**File**: `lib/youtube/service.ts`

```typescript
import { google } from 'googleapis';
import { getValidToken } from '@/lib/oauth/token-manager';

export class YouTubeService {
  private oauth2Client;
  private youtube;
  private youtubeAnalytics;

  constructor(accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2();
    this.oauth2Client.setCredentials({ access_token: accessToken });

    this.youtube = google.youtube({
      version: 'v3',
      auth: this.oauth2Client
    });

    this.youtubeAnalytics = google.youtubeAnalytics({
      version: 'v2',
      auth: this.oauth2Client
    });
  }

  static async create(userId: string) {
    const tokenData = await getValidToken(userId, 'youtube');
    if (!tokenData) {
      throw new Error('YouTube not connected');
    }
    return new YouTubeService(tokenData.accessToken);
  }

  async getChannelInfo() {
    const response = await this.youtube.channels.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      mine: true
    });

    const channel = response.data.items?.[0];
    if (!channel) throw new Error('No channel found');

    return {
      id: channel.id!,
      name: channel.snippet?.title,
      description: channel.snippet?.description,
      thumbnail: channel.snippet?.thumbnails?.high?.url,
      subscriberCount: parseInt(channel.statistics?.subscriberCount || '0'),
      videoCount: parseInt(channel.statistics?.videoCount || '0'),
      viewCount: parseInt(channel.statistics?.viewCount || '0')
    };
  }

  async getRecentVideos(maxResults = 10) {
    const response = await this.youtube.search.list({
      part: ['snippet'],
      forMine: true,
      type: ['video'],
      maxResults,
      order: 'date'
    });

    const videoIds = response.data.items?.map(item => item.id?.videoId).filter(Boolean);

    if (!videoIds?.length) return [];

    // Get detailed stats
    const statsResponse = await this.youtube.videos.list({
      part: ['statistics', 'contentDetails'],
      id: videoIds
    });

    return response.data.items?.map((item, index) => {
      const stats = statsResponse.data.items?.[index]?.statistics;
      return {
        id: item.id?.videoId!,
        title: item.snippet?.title,
        description: item.snippet?.description,
        thumbnail: item.snippet?.thumbnails?.high?.url,
        publishedAt: item.snippet?.publishedAt,
        views: parseInt(stats?.viewCount || '0'),
        likes: parseInt(stats?.likeCount || '0'),
        comments: parseInt(stats?.commentCount || '0')
      };
    }) || [];
  }

  async getAnalytics(startDate: string, endDate: string, channelId: string) {
    const response = await this.youtubeAnalytics.reports.query({
      ids: `channel==${channelId}`,
      startDate,
      endDate,
      metrics: 'views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost',
      dimensions: 'day'
    });

    return response.data.rows?.map(row => ({
      date: row[0] as string,
      views: row[1] as number,
      watchTimeMinutes: row[2] as number,
      avgViewDuration: row[3] as number,
      subscribersGained: row[4] as number,
      subscribersLost: row[5] as number
    })) || [];
  }

  async uploadVideo(filePath: string, metadata: {
    title: string;
    description: string;
    tags?: string[];
    categoryId?: string;
    privacyStatus?: 'public' | 'private' | 'unlisted';
  }) {
    const fs = require('fs');

    const response = await this.youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          categoryId: metadata.categoryId || '10' // Music category
        },
        status: {
          privacyStatus: metadata.privacyStatus || 'private'
        }
      },
      media: {
        body: fs.createReadStream(filePath)
      }
    });

    return {
      id: response.data.id!,
      url: `https://www.youtube.com/watch?v=${response.data.id}`
    };
  }
}
```

### 3. Data Collection Workflow

**File**: `lib/youtube/data-collector.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { YouTubeService } from './service';

export async function collectYouTubeData(userId: string) {
  const supabase = createClient();
  const youtube = await YouTubeService.create(userId);

  // Get channel info
  const channel = await youtube.getChannelInfo();

  // Get analytics for last 30 days
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const analytics = await youtube.getAnalytics(
    thirtyDaysAgo,
    today,
    channel.id
  );

  // Store in database
  await supabase.from('platform_metrics').insert({
    user_id: userId,
    platform: 'youtube',
    metric_date: today,
    followers: channel.subscriberCount,
    total_views: channel.viewCount,
    total_content: channel.videoCount,
    metadata: {
      channel,
      analytics
    }
  });

  return { channel, analytics };
}
```

---

## Troubleshooting

### "Redirect URI mismatch"

**Problem**: OAuth fails with redirect URI error.

**Solutions**:
1. Verify redirect URI in Google Cloud Console EXACTLY matches your callback URL
2. Check for trailing slashes (don't use them)
3. Ensure `NEXT_PUBLIC_APP_URL` is set correctly
4. Verify protocol (http vs https) matches
5. Restart dev server after changing env vars

**Example**:
```
✅ Correct: http://localhost:3000/api/auth/callback/youtube
❌ Wrong:   http://localhost:3000/api/auth/callback/youtube/
❌ Wrong:   https://localhost:3000/api/auth/callback/youtube (protocol mismatch)
```

---

### "Access Not Configured"

**Problem**: API calls fail with "Access Not Configured" error.

**Solutions**:
1. Verify you enabled the API in Google Cloud Console
2. Wait 1-2 minutes after enabling (propagation delay)
3. Check you're using the correct project
4. Verify API is enabled for your credentials

---

### "Invalid Client"

**Problem**: OAuth fails with "invalid client" error.

**Solutions**:
1. Double-check Client ID is correct
2. Verify Client Secret is correct
3. Ensure no extra spaces in environment variables
4. Confirm you're using OAuth Client ID (not API key)
5. Restart dev server

---

### "This app isn't verified"

**Problem**: Warning screen during OAuth.

**For Testing**:
1. This is normal during development
2. Click "Advanced"
3. Click "Go to [Your App] (unsafe)"
4. Only you and test users can do this

**For Production**:
1. Submit app for verification (see "OAuth Verification Process")
2. Required before public launch

---

### Token Expired Errors

**Problem**: API calls fail with token expired.

**Solutions**:
1. Use `getValidToken()` which auto-refreshes
2. Verify refresh token is stored
3. Check token expiry is being tracked
4. Ensure refresh logic is working

**Code Check**:
```typescript
// ✅ Good: Automatically refreshes
const token = await getValidToken(userId, 'youtube');

// ❌ Bad: Uses expired token
const { access_token } = await supabase
  .from('oauth_tokens')
  .select('access_token')
  .single();
```

---

### Quota Exceeded

**Problem**: "Quota exceeded" error.

**Solutions**:
1. Check quota usage in Google Cloud Console
2. Optimize API calls (batch requests)
3. Cache data to reduce calls
4. Request quota increase (for production)

**Optimization Tips**:
- Cache channel info (changes rarely)
- Batch video stat requests
- Use analytics API for time-series data (lower quota cost)
- Implement rate limiting in your app

---

### "Insufficient Permission"

**Problem**: API calls fail with permission errors.

**Solutions**:
1. Verify required scope is added to OAuth consent screen
2. Have user reconnect (to get new scopes)
3. Check scope is included in authorization URL
4. Verify token has correct scopes

**Scope Check**:
```typescript
// Verify token includes required scope
const tokenInfo = await oauth2Client.getTokenInfo(accessToken);
console.log('Scopes:', tokenInfo.scopes);
```

---

### Channel ID Not Found

**Problem**: Analytics API requires channel ID.

**Solution**:
```typescript
// Get channel ID first
const channelResponse = await youtube.channels.list({
  part: ['id'],
  mine: true
});
const channelId = channelResponse.data.items?.[0]?.id;

// Then use in analytics
const analytics = await youtubeAnalytics.reports.query({
  ids: `channel==${channelId}`,
  // ... other params
});
```

---

## Production Checklist

Before launching:

- [ ] OAuth consent screen configured with proper branding
- [ ] Privacy policy and ToS published
- [ ] All redirect URIs added (including production domains)
- [ ] Test users added for team testing
- [ ] Verification submitted (if going public)
- [ ] Environment variables set in production
- [ ] Token refresh cron job set up
- [ ] Error monitoring configured
- [ ] Quota alerts configured
- [ ] Rate limiting implemented
- [ ] Data collection tested end-to-end

---

## Resources

### Official Documentation
- YouTube Data API v3: https://developers.google.com/youtube/v3
- YouTube Analytics API: https://developers.google.com/youtube/analytics
- OAuth 2.0: https://developers.google.com/identity/protocols/oauth2
- Google API Client (Node.js): https://github.com/googleapis/google-api-nodejs-client

### Quota Information
- Quota Calculator: https://developers.google.com/youtube/v3/determine_quota_cost
- Quota Compliance: https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits

### Support
- Google Cloud Support: https://console.cloud.google.com/support
- YouTube API Forums: https://stackoverflow.com/questions/tagged/youtube-api

---

## Next Steps

1. **Complete this setup guide** - Follow all steps above
2. **Test OAuth flow** - Verify authentication works
3. **Implement data collection** - Use YouTubeService class
4. **Build UI components** - Display analytics in dashboard
5. **Submit for verification** - When ready for production
6. **Launch to users** - Start helping musicians grow!

---

**Questions?** Refer to the troubleshooting section or check Google's official documentation.
