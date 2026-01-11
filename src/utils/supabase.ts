import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
}

export async function getAuthenticatedClient() {
  const cookieStore = cookies();
  let accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;

  const supabasePublic = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  
  let user = null;
  let newTokens = undefined;

  // 1. Try existing access token
  if (accessToken) {
    const { data: userData, error: userError } = await supabasePublic.auth.getUser(accessToken);
    if (!userError && userData.user) {
      user = userData.user;
    }
  }

  // 2. If no user, try refresh token
  if (!user && refreshToken) {
    const { data: refreshData, error: refreshError } = await supabasePublic.auth.refreshSession({ 
      refresh_token: refreshToken 
    });

    if (!refreshError && refreshData.session) {
      user = refreshData.user;
      accessToken = refreshData.session.access_token;
      newTokens = {
        access: refreshData.session.access_token,
        refresh: refreshData.session.refresh_token
      };
    }
  }

  // 3. Fallback: Unauthorized
  if (!user || !accessToken) {
    return {
      supabase: null,
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Session expirée ou invalide. Veuillez vous reconnecter.' },
        { status: 401 }
      )
    };
  }

  // 4. Return authenticated client
  const supabaseAuth = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  return { supabase: supabaseAuth, user, newTokens };
}

export function attachAuthCookies(response: NextResponse, tokens: { access: string; refresh: string }) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  response.cookies.set('sb-access-token', tokens.access, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  response.cookies.set('sb-refresh-token', tokens.refresh, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  
  return response;
}
