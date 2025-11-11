// API Route: /api/auth/callback/[platform]
// Handles OAuth callback and stores tokens

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  OAUTH_CONFIGS,
  getRedirectUri,
} from '@/lib/oauth/config';
import {
  parseOAuthState,
  exchangeCodeForToken,
  fetchPlatformUserInfo,
  normalizeUserInfo,
  calculateExpiresAt,
} from '@/lib/oauth/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error(`OAuth error for ${platform}:`, error, errorDescription);
    return NextResponse.redirect(
      new URL(
        `/profile/onboarding?error=${encodeURIComponent(error)}&platform=${platform}`,
        request.url
      )
    );
  }

  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(
      new URL(
        `/profile/onboarding?error=missing_parameters&platform=${platform}`,
        request.url
      )
    );
  }

  try {
    // Parse and validate state
    const stateData = parseOAuthState(state);
    if (!stateData || stateData.platform !== platform) {
      throw new Error('Invalid OAuth state');
    }

    // Get platform config
    const config = OAUTH_CONFIGS[platform];
    if (!config) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    // Get code verifier from cookie if PKCE was used
    let codeVerifier: string | undefined;
    if (config.requiresCodeChallenge) {
      codeVerifier = request.cookies.get(`oauth_verifier_${platform}`)?.value;
      if (!codeVerifier) {
        throw new Error('Missing PKCE code verifier');
      }
    }

    // Exchange authorization code for tokens
    const tokenData = await exchangeCodeForToken(
      platform,
      code,
      getRedirectUri(platform),
      config.clientId,
      config.clientSecret,
      config.tokenUrl,
      codeVerifier
    );

    // Fetch user info from platform
    let platformUserInfo: any = {};
    if (config.userInfoUrl) {
      const rawUserInfo = await fetchPlatformUserInfo(
        platform,
        tokenData.access_token,
        config.userInfoUrl
      );
      platformUserInfo = normalizeUserInfo(platform, rawUserInfo);
    }

    // Calculate token expiration
    const expiresAt = tokenData.expires_in
      ? calculateExpiresAt(tokenData.expires_in)
      : config.tokenExpiresIn
      ? calculateExpiresAt(config.tokenExpiresIn)
      : null;

    // Store tokens in database
    const supabase: SupabaseClient = await createClient();

    // Upsert token record (insert or update if exists)
    const { error: dbError } = await supabase
      .from('oauth_tokens')
      .upsert(
        {
          user_id: stateData.userId,
          platform,
          platform_user_id: platformUserInfo.id,
          platform_username: platformUserInfo.username || platformUserInfo.displayName,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          token_type: tokenData.token_type || 'Bearer',
          expires_at: expiresAt?.toISOString() || null,
          scopes: tokenData.scope?.split(' ') || config.scopes,
          metadata: {
            displayName: platformUserInfo.displayName,
            email: platformUserInfo.email,
            profilePictureUrl: platformUserInfo.profilePictureUrl,
            connectedAt: new Date().toISOString(),
          },
          is_active: true,
          last_used_at: new Date().toISOString(),
          error_count: 0,
          last_error: null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,platform',
        }
      );

    if (dbError) {
      console.error('Failed to store OAuth tokens:', dbError);
      throw new Error('Failed to save authentication');
    }

    // Update connected_platforms array in profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('connected_platforms')
      .eq('user_id', stateData.userId)
      .single();

    const currentPlatforms = profile?.connected_platforms || [];
    if (!currentPlatforms.includes(platform)) {
      const updatedPlatforms = [...currentPlatforms, platform];

      await supabase
        .from('profiles')
        .update({
          connected_platforms: updatedPlatforms,
        })
        .eq('user_id', stateData.userId);
    }

    // Clear PKCE cookie if it was used
    const response = NextResponse.redirect(
      new URL(
        `${stateData.returnUrl}?connected=${platform}`,
        request.url
      )
    );

    if (config.requiresCodeChallenge) {
      response.cookies.delete(`oauth_verifier_${platform}`);
    }

    return response;
  } catch (error) {
    console.error(`OAuth callback error for ${platform}:`, error);

    // Redirect back with error
    return NextResponse.redirect(
      new URL(
        `/profile/onboarding?error=connection_failed&platform=${platform}&message=${encodeURIComponent(
          error instanceof Error ? error.message : 'Unknown error'
        )}`,
        request.url
      )
    );
  }
}