# Platform API Comparison for Dream Suite

Quick comparison of all music platform APIs to help prioritize integration efforts.

---

## Quick Reference Table

| Platform | Setup Difficulty | Verification Required | Rate Limits | Cost | Data Quality | Priority |
|----------|-----------------|----------------------|-------------|------|--------------|----------|
| Spotify | Easy | No (for basic) | Generous | Free | Excellent | HIGH |
| YouTube | Medium | Yes (for production) | 10K units/day | Free | Excellent | HIGH |
| Instagram | Medium | Yes | Moderate | Free | Good | HIGH |
| Apple Music | Hard | Yes ($99/year) | Generous | $99/year | Excellent | MEDIUM |
| SoundCloud | Easy | No | Moderate | Free | Good | MEDIUM |
| TikTok | Hard | Yes (weeks to approve) | Strict | Free | Good | MEDIUM |
| Twitter/X | Medium | Yes | Strict | Free tier limited | Moderate | LOW |
| Facebook | Medium | Yes | Moderate | Free | Moderate | LOW |
| Amazon Music | Hard | Yes | Unknown | Free | Good | LOW |
| Deezer | Easy | No | Generous | Free | Good | LOW |
| Tidal | Very Hard | Contact required | Unknown | Unknown | Good | LOW |

---

## Detailed Breakdown

### High Priority Platforms

#### 1. Spotify
**Why musicians need it**: Primary music discovery platform, playlisting crucial for growth

**Setup Time**: 15 minutes

**What you get**:
- Artist profile data
- Song streams and listeners
- Playlist placements
- Follower count
- Top cities/countries
- Monthly listeners

**OAuth Scopes**:
```
user-read-private
user-read-email
user-top-read
user-library-read
```

**Rate Limits**: Very generous, rarely hit

**Verification**: No verification needed for basic scopes

**Cost**: FREE

**Difficulty**: Easy

**Code Example**: Available in Dream Suite

**Recommendation**: IMPLEMENT FIRST

---

#### 2. YouTube
**Why musicians need it**: Video is crucial, second-largest search engine, monetization potential

**Setup Time**: 15 minutes

**What you get**:
- Subscriber count
- Video views, likes, comments
- Watch time and retention
- Demographics (age, gender, location)
- Traffic sources
- Revenue data (if monetized)
- Upload capability

**OAuth Scopes**:
```
https://www.googleapis.com/auth/youtube.readonly
https://www.googleapis.com/auth/yt-analytics.readonly
```

**Rate Limits**: 10,000 units/day (supports 500+ artists)

**Verification**:
- Testing: No (up to 100 test users)
- Production: Yes (3-7 days for readonly)

**Cost**: FREE

**Difficulty**: Medium (Google Cloud setup)

**Code Example**: See `docs/setup/YOUTUBE-API-SETUP.md`

**Recommendation**: IMPLEMENT SECOND

---

#### 3. Instagram
**Why musicians need it**: Visual storytelling, fan engagement, behind-the-scenes content

**Setup Time**: 20 minutes

**What you get**:
- Follower count
- Post engagement (likes, comments, shares)
- Story views
- Reach and impressions
- Best posting times
- Audience demographics

**OAuth Scopes**:
```
instagram_basic
instagram_manage_insights
pages_show_list
pages_read_engagement
```

**Rate Limits**: Moderate (200 calls/hour per user)

**Verification**: Yes (requires Facebook App Review)

**Cost**: FREE

**Difficulty**: Medium (Facebook ecosystem)

**Code Example**: Available in Dream Suite

**Recommendation**: IMPLEMENT THIRD

---

### Medium Priority Platforms

#### 4. Apple Music
**Why musicians need it**: High-value audience, premium platform

**Setup Time**: 30-60 minutes

**What you get**:
- Song plays
- Library adds
- Playlist placements
- Listener counts
- Shazam data (if integrated)

**Prerequisites**:
- Apple Developer Account ($99/year)
- Service ID registration
- Private key (.p8 file)

**Rate Limits**: Generous

**Verification**: Yes (Apple Developer Program)

**Cost**: $99/year

**Difficulty**: Hard (Apple ecosystem complexity)

**Recommendation**: Add when revenue supports $99/year cost

---

#### 5. SoundCloud
**Why musicians need it**: Important for independent artists, remix culture

**Setup Time**: 15 minutes

**What you get**:
- Track plays
- Likes and reposts
- Comments
- Follower count
- Download stats (if enabled)

**OAuth Scopes**: Basic profile and stats access

**Rate Limits**: 15,000 requests/day

**Verification**: No

**Cost**: FREE

**Difficulty**: Easy

**Recommendation**: Good third-tier addition

---

#### 6. TikTok
**Why musicians need it**: Viral discovery, younger demographic

**Setup Time**: 5 minutes (after approval)

**Approval Time**: 2-8 weeks

**What you get**:
- Video views
- Follower count
- Engagement (likes, comments, shares)
- Profile data

**OAuth**: Requires PKCE

**Rate Limits**: Strict (varies by endpoint)

**Verification**: Yes (strict approval process)

**Cost**: FREE

**Difficulty**: Hard (approval required)

**Recommendation**: Apply for access, but don't wait to launch

---

### Lower Priority Platforms

#### 7. Twitter/X
**Why musicians need it**: Announcements, fan interaction

**What you get**:
- Tweet impressions
- Follower count
- Engagement metrics
- Mentions and replies

**Rate Limits**: Very strict on free tier

**Verification**: Yes

**Cost**:
- Free tier: Very limited
- Basic: $100/month
- Pro: $5,000/month

**Difficulty**: Medium

**Recommendation**: Low priority due to cost and strict limits

---

#### 8. Facebook
**Why musicians need it**: Older demographic, events, groups

**What you get**:
- Page likes
- Post reach and engagement
- Event RSVPs
- Video views

**Rate Limits**: Moderate

**Verification**: Yes (App Review)

**Cost**: FREE

**Difficulty**: Medium

**Recommendation**: Lower priority (overlap with Instagram)

---

#### 9. Amazon Music
**Why musicians need it**: Growing platform, Amazon ecosystem

**What you get**:
- Streams
- Listener data
- Playlist placements (if available)

**Prerequisites**: Contact Amazon for API access

**Rate Limits**: Unknown

**Verification**: Required

**Cost**: FREE (likely)

**Difficulty**: Hard (limited public API)

**Recommendation**: Monitor for public API availability

---

#### 10. Deezer
**Why musicians need it**: Strong in Europe and Latin America

**What you get**:
- Fan count
- Track listens
- Playlist adds

**Rate Limits**: Generous

**Verification**: No

**Cost**: FREE

**Difficulty**: Easy

**Recommendation**: Geographic-specific, add if expanding to EU/LATAM

---

#### 11. Tidal
**Why musicians need it**: High-fidelity audience, artist-friendly

**What you get**:
- Limited public information available

**Prerequisites**: Contact Tidal directly

**Rate Limits**: Unknown

**Verification**: Likely required

**Cost**: Unknown

**Difficulty**: Very Hard (no public API)

**Recommendation**: Lowest priority, wait for public API

---

## Implementation Roadmap

### Phase 1: MVP (Launch-Ready)
**Timeline**: Current - Week 2

1. Spotify (Already implemented?)
2. YouTube (This guide)
3. Instagram (Existing OAuth)

**Rationale**: These three cover 90% of musician needs

---

### Phase 2: Enhanced Platform Support
**Timeline**: Month 2-3

4. SoundCloud (Easy to add)
5. Apple Music (If budget allows)
6. TikTok (If approved by then)

**Rationale**: Broader platform coverage

---

### Phase 3: Comprehensive Coverage
**Timeline**: Month 4+

7. Deezer (European expansion)
8. Facebook (If users request)
9. Twitter/X (If they request and willing to pay)

**Rationale**: Niche platforms, user-driven

---

### Not Recommended
- Amazon Music (no public API)
- Tidal (no public API)

**Revisit**: If they launch public APIs

---

## Selection Criteria

### Must-Have
- Music-focused platform
- Public API available
- OAuth 2.0 support
- Free tier sufficient for 100+ artists
- Good documentation

### Nice-to-Have
- No verification required for testing
- Generous rate limits
- Webhook support for real-time updates
- Historical data access
- Multiple data points (not just follower count)

### Deal-Breakers
- Requires paid tier for basic access (Twitter)
- No public API (Amazon Music, Tidal)
- Unreasonable approval process
- Prohibitive rate limits

---

## Cost Summary

| Platform | Setup Cost | Recurring Cost | Verification Cost |
|----------|-----------|----------------|-------------------|
| Spotify | $0 | $0 | $0 |
| YouTube | $0 | $0 | $0 (time only) |
| Instagram | $0 | $0 | $0 (time only) |
| SoundCloud | $0 | $0 | $0 |
| Apple Music | $99 | $99/year | $0 |
| TikTok | $0 | $0 | $0 (time only) |
| Deezer | $0 | $0 | $0 |
| Twitter Free | $0 | $0 | $0 |
| Twitter Basic | $0 | $100/month | $0 |
| Facebook | $0 | $0 | $0 (time only) |

**Total for Phase 1**: $0
**Total for Phase 2**: $99/year (if adding Apple Music)

---

## Rate Limit Comparison

| Platform | Daily Limit | Per Artist Cost | Can Support |
|----------|------------|-----------------|-------------|
| Spotify | Very High | ~5 calls | Thousands |
| YouTube | 10,000 units | ~10 units | 500-700 |
| Instagram | 200/hour/user | ~10 calls | Hundreds |
| SoundCloud | 15,000/day | ~10 calls | 1,000+ |
| Apple Music | Very High | ~5 calls | Thousands |
| TikTok | Varies | ~20 calls | Hundreds |

**Note**: Numbers are estimates based on daily refresh of key metrics

---

## Data Quality Comparison

### Best Data (Most Actionable)
1. YouTube Analytics (demographics, retention, traffic sources)
2. Spotify for Artists (listener data, playlist analytics)
3. Instagram Insights (engagement, best times, demographics)

### Good Data
4. Apple Music (plays, library adds)
5. SoundCloud (plays, reposts)
6. TikTok (views, engagement)

### Limited Data
7. Facebook (basic engagement)
8. Twitter (impressions, engagement)
9. Deezer (plays, fans)

---

## Integration Effort Comparison

### Easy (1-2 hours)
- Spotify
- SoundCloud
- Deezer

### Medium (3-4 hours)
- YouTube
- Instagram
- Twitter/X

### Hard (1-2 days)
- Apple Music
- TikTok (after approval)
- Facebook (if not using Instagram Graph API)

### Very Hard (Unknown)
- Amazon Music
- Tidal

---

## Recommendation Summary

**For Dream Suite Launch**:

1. Implement Spotify (if not already done)
2. Implement YouTube (following this guide)
3. Ensure Instagram is working
4. Launch with these three

**Why these three?**:
- Cover 90% of musician platforms
- Free and relatively easy
- Excellent data quality
- No ongoing costs
- Broad appeal

**Post-Launch**:
- Add SoundCloud (easy win)
- Add TikTok when approved
- Consider Apple Music if revenue supports it

**Total Development Time**: 1-2 days for Phase 1 platforms

**Total Cost**: $0 (unless adding Apple Music)

---

## Questions to Consider

Before adding a platform, ask:

1. **Do users request it?**
   - Survey early adopters
   - Check feature requests

2. **Does it provide unique data?**
   - Avoid redundancy
   - Focus on actionable insights

3. **Is the effort justified?**
   - Easy integration = do it
   - Hard integration = prove demand first

4. **Can we afford rate limits?**
   - Calculate per-artist cost
   - Project to 100, 500, 1000 artists

5. **Is it free?**
   - Prioritize free platforms
   - Paid platforms need ROI justification

---

## Next Steps

1. Review this comparison
2. Confirm priority order
3. Complete YouTube integration (Phase 1)
4. Test all Phase 1 platforms end-to-end
5. Launch MVP
6. Gather user feedback
7. Prioritize Phase 2 based on requests

---

## Resources

- YouTube Setup: `docs/setup/YOUTUBE-API-SETUP.md`
- OAuth Guide: `docs/OAUTH_SETUP.md`
- Integration Setup: `docs/setup/INTEGRATIONS-SETUP.md`

---

**Last Updated**: November 2025
