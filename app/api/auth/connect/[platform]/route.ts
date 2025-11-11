// API Route: /api/auth/connect/[platform]
// Initiates OAuth flow for a given platform

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import {
  OAUTH_CONFIGS,
  buildAuthorizationUrl,
} from '@/lib/oauth/config';
import {
  generateState,
  generateCodeVerifier,
  generateCodeChallenge,
  createOAuthState,
} from '@/lib/oauth/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { platform } = params;

  try {
    // Verify user is authenticated
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - please sign in first' },
        { status: 401 }
      );
    }

    // Verify platform is supported
    const config = OAUTH_CONFIGS[platform];
    if (!config) {
      return NextResponse.json(
        { error: `Unsupported platform: ${platform}` },
        { status: 400 }
      );
    }

    // Get return URL from query params (optional)
    const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/profile/onboarding';

    // Generate OAuth state with user context
    const stateData = {
      userId: user.id,
      platform,
      returnUrl,
    };
    const state = createOAuthState(stateData);

    // Generate PKCE challenge if required
    let codeChallenge: string | undefined;
    let codeVerifier: string | undefined;

    if (config.requiresCodeChallenge) {
      codeVerifier = generateCodeVerifier();
      codeChallenge = generateCodeChallenge(codeVerifier);

      // Store code verifier in session/cookie for callback
      // For now, we'll use a simple approach with cookies
      const response = NextResponse.redirect(
        buildAuthorizationUrl(platform, state, codeChallenge)
      );

      response.cookies.set(`oauth_verifier_${platform}`, codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600, // 10 minutes
        path: '/',
      });

      return response;
    }

    // Build authorization URL and redirect
    const authUrl = buildAuthorizationUrl(platform, state);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error(`OAuth connect error for ${platform}:`, error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    );
  }
}

// Handle POST requests for programmatic OAuth initiation
export async function POST(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { platform } = params;

  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - please sign in first' },
        { status: 401 }
      );
    }

    const config = OAUTH_CONFIGS[platform];
    if (!config) {
      return NextResponse.json(
        { error: `Unsupported platform: ${platform}` },
        { status: 400 }
      );
    }

    const body = await request.json();
    const returnUrl = body.returnUrl || '/profile/onboarding';

    const stateData = {
      userId: user.id,
      platform,
      returnUrl,
    };
    const state = createOAuthState(stateData);

    let codeChallenge: string | undefined;
    let codeVerifier: string | undefined;

    if (config.requiresCodeChallenge) {
      codeVerifier = generateCodeVerifier();
      codeChallenge = generateCodeChallenge(codeVerifier);
    }

    const authUrl = buildAuthorizationUrl(platform, state, codeChallenge);

    // Return auth URL for client-side redirect
    return NextResponse.json({
      authUrl,
      state,
      ...(codeVerifier && { codeVerifier }), // Only for client-side PKCE
    });
  } catch (error) {
    console.error(`OAuth connect error for ${platform}:`, error);
    return NextResponse.json(
      { error: 'Failed to generate OAuth URL' },
      { status: 500 }
    );
  }
}