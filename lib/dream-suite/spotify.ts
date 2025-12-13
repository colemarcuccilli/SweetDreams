import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { refreshOAuthToken, calculateExpiresAt } from '@/lib/oauth/utils';
import { OAUTH_CONFIGS } from '@/lib/oauth/config';

export interface SpotifyMetrics {
    followers: number;
    popularity: number;
    top_tracks_popularity: number;
    genres: string[];
}

export async function getSpotifyData(userId: string) {
    const supabase = await createClient();
    const serviceSupabase = createServiceRoleClient();

    // 1. Get Token
    const { data: token, error: tokenError } = await serviceSupabase
        .from('oauth_tokens')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', 'spotify')
        .single();

    if (tokenError || !token) {
        throw new Error('No Spotify token found');
    }

    let accessToken = token.access_token;

    // 2. Check Expiry & Refresh
    const expiresAt = new Date(token.expires_at);
    if (expiresAt <= new Date(Date.now() + 5 * 60000)) {
        console.log('🔄 Refreshing Spotify token for data fetch...');
        const config = OAUTH_CONFIGS['spotify'];
        const refreshData = await refreshOAuthToken(
            'spotify',
            token.refresh_token,
            config.clientId,
            config.clientSecret,
            config.refreshUrl!
        );

        accessToken = refreshData.access_token;
        const newExpiresAt = calculateExpiresAt(refreshData.expires_in || 3600);

        await serviceSupabase
            .from('oauth_tokens')
            .update({
                access_token: accessToken,
                expires_at: newExpiresAt.toISOString(),
                last_refresh_at: new Date().toISOString(),
                ...(refreshData.refresh_token ? { refresh_token: refreshData.refresh_token } : {})
            })
            .eq('id', token.id);
    }

    // 3. Fetch Profile Data (Followers, Popularity)
    const profileRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!profileRes.ok) throw new Error('Failed to fetch Spotify profile');
    const profile = await profileRes.json();

    // 4. Fetch Top Tracks (for average popularity)
    const topTracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    let avgTrackPopularity = 0;
    if (topTracksRes.ok) {
        const topTracks = await topTracksRes.json();
        if (topTracks.items.length > 0) {
            const sum = topTracks.items.reduce((acc: number, track: any) => acc + track.popularity, 0);
            avgTrackPopularity = Math.round(sum / topTracks.items.length);
        }
    }

    return {
        followers: profile.followers.total,
        popularity: profile.popularity,
        top_tracks_popularity: avgTrackPopularity,
        genres: profile.genres || [],
        profile_image: profile.images?.[0]?.url
    };
}
