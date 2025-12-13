import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { getSpotifyData } from '@/lib/dream-suite/spotify';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // 1. Fetch Data from Spotify
        console.log('🎵 Fetching Spotify data for user:', user.id);
        const spotifyMetrics = await getSpotifyData(user.id);
        console.log('✅ Spotify Data:', spotifyMetrics);

        // 2. Save to daily_metrics
        const serviceSupabase = createServiceRoleClient();
        const today = new Date().toISOString();

        const metricsToSave = [
            {
                artist_id: user.id,
                platform: 'spotify',
                metric_type: 'followers',
                metric_value: spotifyMetrics.followers,
                collected_at: today
            },
            {
                artist_id: user.id,
                platform: 'spotify',
                metric_type: 'popularity',
                metric_value: spotifyMetrics.popularity,
                collected_at: today
            },
            {
                artist_id: user.id,
                platform: 'spotify',
                metric_type: 'top_tracks_popularity',
                metric_value: spotifyMetrics.top_tracks_popularity,
                collected_at: today
            }
        ];

        const { error: dbError } = await serviceSupabase
            .from('daily_metrics')
            .insert(metricsToSave);

        if (dbError) {
            console.error('❌ Database Error:', dbError);
            return NextResponse.json({
                success: false,
                message: 'Failed to save metrics. Tables might not exist.',
                error: dbError
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully collected and saved Spotify metrics',
            data: spotifyMetrics
        });

    } catch (error) {
        console.error('❌ Collection Error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
