import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/profile';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      console.log('✅ Email confirmed successfully - redirecting to:', next);
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error('❌ Error confirming email:', error);
      return NextResponse.redirect(`${origin}/login?error=Could not verify email`);
    }
  }

  // No code provided - redirect to login
  console.log('⚠️ No confirmation code provided');
  return NextResponse.redirect(`${origin}/login`);
}
