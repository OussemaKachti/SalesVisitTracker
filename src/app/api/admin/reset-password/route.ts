import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedClient } from '@/utils/supabase';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase configuration');
}

export async function POST(request: Request) {
  try {
    // Verify that the requester is an admin
    const { supabase, user, errorResponse } = await getAuthenticatedClient();

    if (errorResponse || !supabase || !user) {
      return errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the profile to check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès refusé. Seuls les administrateurs peuvent réinitialiser les mots de passe.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json().catch(() => null);
    const targetUserId = body?.userId as string | undefined;

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'userId est requis.' },
        { status: 400 }
      );
    }

    // Get user's email from profiles table
    const { data: targetProfile, error: targetProfileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', targetUserId)
      .single();

    if (targetProfileError || !targetProfile?.email) {
      return NextResponse.json(
        { error: 'Impossible de trouver l\'utilisateur.' },
        { status: 404 }
      );
    }

    // Generate a secure temporary password
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    const tempPassword = Array(12)
      .fill(chars)
      .map(x => x[Math.floor(Math.random() * x.length)])
      .join('');

    // Call the SQL function to reset password
    console.log('[ADMIN RESET] Calling RPC with userId:', targetUserId);
    const { data: resetResult, error: resetError } = await supabase
      .rpc('admin_reset_user_password', {
        target_user_id: targetUserId,
        new_password: tempPassword
      });

    console.log('[ADMIN RESET] RPC Result:', resetResult);
    console.log('[ADMIN RESET] RPC Error:', resetError);

    if (resetError) {
      console.error('[ADMIN RESET] Error calling RPC:', resetError);
      return NextResponse.json(
        { error: `Impossible de réinitialiser le mot de passe: ${resetError.message}` },
        { status: 500 }
      );
    }

    if (resetResult && !resetResult.success) {
      console.error('[ADMIN RESET] Function returned error:', resetResult.error);
      return NextResponse.json(
        { error: resetResult.error || 'Erreur lors de la réinitialisation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tempPassword: tempPassword,
      email: targetProfile.email,
      message: 'Mot de passe réinitialisé avec succès.'
    });
  } catch (error) {
    console.error('Erreur inattendue lors de la réinitialisation du mot de passe:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
