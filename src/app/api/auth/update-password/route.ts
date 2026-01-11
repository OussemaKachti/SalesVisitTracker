import { NextResponse } from 'next/server';
import { getAuthenticatedClient, attachAuthCookies } from '@/utils/supabase';

export async function POST(request: Request) {
  try {
    const { supabase, user, newTokens, errorResponse } = await getAuthenticatedClient();

    if (errorResponse || !supabase || !user) {
      return errorResponse || NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { currentPassword, password } = await request.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel est requis.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' },
        { status: 400 }
      );
    }

    // Verify current password by attempting to sign in
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Verify the current password
    const { error: signInError } = await supabaseAuth.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (signInError) {
      return NextResponse.json(
        { error: 'Mot de passe actuel incorrect.' },
        { status: 401 }
      );
    }

    // Update to new password
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('Erreur mise à jour mot de passe:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const response = NextResponse.json(
      { success: true, message: 'Mot de passe mis à jour avec succès.' },
      { status: 200 }
    );

    if (newTokens) {
      attachAuthCookies(response, newTokens);
    }

    return response;

  } catch (error) {
    console.error('Erreur interne update-password:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}
