# Dream Suite Platform Data Schema

## Overview
This document defines what data we collect from each platform. Platforms marked "Ready" have OAuth configured. Others will have empty placeholders until APIs are available.

## Platform Status

### ✅ Ready (OAuth Configured)
- Instagram (Meta)
- Facebook (Meta)
- Spotify
- YouTube

### ⏸️ In Progress
- TikTok (OAuth started, needs completion)
- SoundCloud (App submitted, awaiting approval)
- Apple Music (Developer enrollment pending)

### 📋 Planned
- X/Twitter
- Deezer
- Amazon Music (limited data)
- Tidal (limited data)

---

## Data Schema by Platform

### Instagram (Meta Graph API)
**OAuth Scope:** `instagram_basic`, `instagram_manage_insights`, `pages_show_list`, `pages_read_engagement`

**Daily Metrics:**
```typescript
interface InstagramMetrics {
  platform: 'instagram';
  date: Date;
  user_id: string;

  // Follower Data
  follower_count: number;
  follower_change_24h: number;
  follower_change_7d: number;
  follower_change_30d: number;

  // Engagement
  likes_total: number;
  comments_total: number;
  engagement_rate: number; // (likes + comments) / followers

  // Content Performance
  posts_count: number;
  stories_count: number;
  reels_count: number;

  // Top Content
  top_post_id: string | null;
  top_post_likes: number | null;
  top_post_comments: number | null;

  // Insights (last 30 days)
  profile_views: number;
  reach: number;
  impressions: number;
  website_clicks: number;
}
```

### Facebook (Meta Graph API)
**OAuth Scope:** `public_profile`, `email`, `pages_show_list`, `pages_read_engagement`

**Daily Metrics:**
```typescript
interface FacebookMetrics {
  platform: 'facebook';
  date: Date;
  user_id: string;

  // Page Data
  page_followers: number;
  page_likes: number;

  // Engagement
  post_engagement: number;
  reactions_total: number;
  comments_total: number;
  shares_total: number;

  // Content
  posts_count: number;
  videos_count: number;

  // Insights
  page_views: number;
  page_reach: number;
  page_impressions: number;
}
```

### Spotify (Web API)
**OAuth Scope:** `user-read-private`, `user-read-email`, `user-top-read`, `user-library-read`, `user-follow-read`

**Daily Metrics:**
```typescript
interface SpotifyMetrics {
  platform: 'spotify';
  date: Date;
  user_id: string;

  // Artist Profile (if artist account)
  monthly_listeners: number | null;
  follower_count: number | null;

  // Streaming Stats (requires Spotify for Artists API - separate)
  total_streams: number | null;
  streams_change_24h: number | null;
  streams_change_7d: number | null;
  streams_change_30d: number | null;

  // Track Performance
  top_tracks: Array<{
    track_id: string;
    track_name: string;
    streams: number;
    saves: number;
    playlist_adds: number;
  }> | null;

  // Playlists
  playlist_placements: number | null;
  editorial_playlists: number | null;

  // Geography
  top_cities: string[] | null;
  top_countries: string[] | null;

  // User Data (for non-artists)
  saved_tracks_count: number;
  playlists_count: number;
  following_count: number;
}
```

### YouTube (Data API v3)
**OAuth Scope:** `youtube.readonly`, `youtube.force-ssl`, `youtubepartner`

**Daily Metrics:**
```typescript
interface YouTubeMetrics {
  platform: 'youtube';
  date: Date;
  user_id: string;

  // Channel Stats
  subscriber_count: number;
  subscriber_change_24h: number;
  subscriber_change_7d: number;
  subscriber_change_30d: number;

  // Video Performance
  total_views: number;
  views_change_24h: number;
  views_change_7d: number;
  views_change_30d: number;

  // Engagement
  likes_total: number;
  comments_total: number;
  shares_total: number;

  // Content
  videos_count: number;
  uploads_24h: number;

  // Top Videos (last 30 days)
  top_videos: Array<{
    video_id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    watch_time_hours: number;
  }>;

  // Analytics (requires YouTube Analytics API)
  watch_time_minutes: number | null;
  average_view_duration: number | null;
  click_through_rate: number | null;
}
```

### TikTok (TikTok API v2)
**OAuth Scope:** `user.info.basic`, `user.info.profile`, `user.info.stats`, `video.list`

**Daily Metrics:**
```typescript
interface TikTokMetrics {
  platform: 'tiktok';
  date: Date;
  user_id: string;

  // Profile Stats
  follower_count: number;
  follower_change_24h: number;
  following_count: number;

  // Video Performance
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;

  // Content
  video_count: number;
  videos_posted_24h: number;

  // Top Videos (last 7 days)
  top_videos: Array<{
    video_id: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    created_at: Date;
  }> | null;

  // Engagement
  engagement_rate: number;
  average_views_per_video: number;
}
```

### SoundCloud (API v2)
**OAuth Scope:** `non-expiring`

**Daily Metrics:**
```typescript
interface SoundCloudMetrics {
  platform: 'soundcloud';
  date: Date;
  user_id: string;

  // Profile
  follower_count: number;
  follower_change_24h: number;

  // Track Performance
  total_plays: number;
  plays_change_24h: number;
  plays_change_7d: number;
  plays_change_30d: number;

  // Engagement
  likes_total: number;
  reposts_total: number;
  comments_total: number;

  // Content
  tracks_count: number;
  tracks_uploaded_24h: number;

  // Top Tracks (all time)
  top_tracks: Array<{
    track_id: number;
    title: string;
    plays: number;
    likes: number;
    reposts: number;
    comments: number;
  }> | null;
}
```

### X/Twitter (API v2)
**OAuth Scope:** `users.read`, `tweet.read`, `follows.read`, `offline.access`

**Daily Metrics:**
```typescript
interface TwitterMetrics {
  platform: 'twitter';
  date: Date;
  user_id: string;

  // Profile
  follower_count: number;
  follower_change_24h: number;
  following_count: number;

  // Engagement
  tweets_count: number;
  tweets_24h: number;
  likes_received: number;
  retweets_received: number;
  replies_received: number;

  // Top Tweets (last 7 days)
  top_tweets: Array<{
    tweet_id: string;
    text: string;
    likes: number;
    retweets: number;
    replies: number;
    impressions: number | null;
  }> | null;

  // Profile Stats
  profile_views: number | null; // Requires Premium API
  link_clicks: number | null;
}
```

### Apple Music (MusicKit JS)
**Note:** Limited data available. Mostly for playlist/chart tracking.

**Daily Metrics:**
```typescript
interface AppleMusicMetrics {
  platform: 'apple_music';
  date: Date;
  user_id: string;

  // Limited Data (no streaming stats API)
  playlist_placements: number | null;
  editorial_placements: string[] | null; // Playlist names
  chart_positions: Array<{
    chart_name: string;
    position: number;
    country: string;
  }> | null;

  // User library (if personal account)
  library_songs_count: number | null;
  playlists_count: number | null;
}
```

### Deezer (API)
**OAuth Scope:** `basic_access`, `email`, `offline_access`, `listening_history`

**Daily Metrics:**
```typescript
interface DeezerMetrics {
  platform: 'deezer';
  date: Date;
  user_id: string;

  // Artist Data (if artist account)
  fans_count: number | null;

  // Track Performance
  album_count: number | null;
  track_count: number | null;

  // User Data
  favorite_tracks: number;
  playlists_count: number;

  // Limited stats (no streaming API)
  playlist_placements: number | null;
}
```

### Amazon Music (Limited/None)
**Note:** No public API for streaming stats. Placeholder only.

**Daily Metrics:**
```typescript
interface AmazonMusicMetrics {
  platform: 'amazon_music';
  date: Date;
  user_id: string;

  // Placeholder - No API available
  playlist_placements: number | null;
  editorial_features: string[] | null;
}
```

### Tidal (Limited API)
**Note:** Very limited public API access.

**Daily Metrics:**
```typescript
interface TidalMetrics {
  platform: 'tidal';
  date: Date;
  user_id: string;

  // Limited Data
  follower_count: number | null;

  // Placeholder - Limited API
  playlist_placements: number | null;
}
```

---

## Unified Daily Metrics Table

All platform metrics will be stored in a single `daily_metrics` table with JSON fields:

```sql
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'instagram', 'spotify', etc.
  date DATE NOT NULL,

  -- Core metrics (common across platforms)
  follower_count BIGINT,
  follower_change_24h INTEGER,
  engagement_total BIGINT,
  content_count INTEGER,

  -- Platform-specific data (JSON)
  metrics JSONB NOT NULL,

  -- Metadata
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, platform, date)
);

-- Indexes
CREATE INDEX idx_daily_metrics_user_platform ON daily_metrics(user_id, platform);
CREATE INDEX idx_daily_metrics_date ON daily_metrics(date DESC);
CREATE INDEX idx_daily_metrics_platform ON daily_metrics(platform);
```

---

## Data Collection Strategy

### Phase 1: OAuth Connected Platforms (Now)
1. Instagram - n8n workflow (daily cron)
2. Facebook - n8n workflow (daily cron)
3. Spotify - n8n workflow (daily cron)
4. YouTube - n8n workflow (daily cron)

### Phase 2: Pending Platforms (Later)
5. TikTok - Complete OAuth setup
6. SoundCloud - Awaiting API approval
7. Apple Music - Awaiting developer enrollment

### Phase 3: Future Platforms
8. X/Twitter
9. Deezer
10. Amazon Music (limited)
11. Tidal (limited)

---

## LangChain AI Agent Integration

The AI Career Agent will analyze all this data to provide:

1. **Growth Insights**
   - "Your Instagram followers grew 15% this week!"
   - "Your Spotify monthly listeners hit a new record"

2. **Content Recommendations**
   - "Post more Reels - they get 3x more engagement than photos"
   - "Your TikTok videos posted on Tuesdays perform 40% better"

3. **Cross-Platform Strategy**
   - "Your YouTube subscribers engage more on Instagram"
   - "Promote your new Spotify release on TikTok for maximum reach"

4. **Trend Detection**
   - "Your follower growth spiked after the collaboration post"
   - "Engagement drops on weekends - consider scheduling posts differently"

5. **Goal Tracking**
   - "You're 80% of the way to 10k Instagram followers!"
   - "5 more Spotify playlist placements needed to hit your monthly goal"

---

## Next Steps

1. ✅ Create Supabase `daily_metrics` table
2. ✅ Build n8n workflows for data collection
3. ✅ Set up LangChain AI agents for analysis
4. ✅ Build analytics dashboard UI
5. ⏸️ Add placeholder data for platforms without APIs yet
