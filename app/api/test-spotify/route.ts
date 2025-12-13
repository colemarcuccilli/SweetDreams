import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { refreshOAuthToken, calculateExpiresAt } from '@/lib/oauth/utils';
import { OAUTH_CONFIGS } from '@/lib/oauth/config';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: tokens, error: tokenError } = await supabase
      .from('oauth_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', 'spotify')
      .single();

    if (tokenError || !tokens) {
      return NextResponse.json({
        success: false,
        message: 'No Spotify token found in database',
        error: tokenError
      });
    }

    let accessToken = tokens.access_token;
    let refreshed = false;

    // Check if expired
    const expiresAt = new Date(tokens.expires_at);
    const now = new Date();

    // If expired or expiring in next 5 mins
    if (expiresAt <= new Date(now.getTime() + 5 * 60000)) {
      console.log('🔄 Token expired, refreshing...');
      try {
        const config = OAUTH_CONFIGS['spotify'];
        const refreshData = await refreshOAuthToken(
          'spotify',
          tokens.refresh_token,
          config.clientId,
          config.clientSecret,
          config.refreshUrl!
        );

        accessToken = refreshData.access_token;
        const newExpiresAt = calculateExpiresAt(refreshData.expires_in || 3600);

        // Update DB
        const serviceSupabase = createServiceRoleClient();
        await serviceSupabase
          .from('oauth_tokens')
          .update({
            access_token: accessToken,
            expires_at: newExpiresAt.toISOString(),
            last_refresh_at: new Date().toISOString(),
            // Update refresh token if a new one was returned
            ...(refreshData.refresh_token ? { refresh_token: refreshData.refresh_token } : {})
          })
          .eq('id', tokens.id);

        refreshed = true;
        console.log('✅ Token refreshed successfully');
      } catch (refreshError) {
        return NextResponse.json({
          success: false,
          message: 'Failed to refresh token',
          error: refreshError instanceof Error ? refreshError.message : String(refreshError)
        });
      }
    }

    // Try to use the token
    const spotifyResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!spotifyResponse.ok) {
      const errorData = await spotifyResponse.json();
      return NextResponse.json({
        success: false,
        message: 'Spotify API request failed even after refresh check',
        spotify_error: errorData
      });
    }

    const spotifyData = await spotifyResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Spotify Token is VALID!',
      was_refreshed: refreshed,
      platform_user: spotifyData.display_name,
      token_id: tokens.id
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
