import { NextResponse } from 'next/server';
import { getAuthenticatedClient, attachAuthCookies } from '@/utils/supabase';

export async function GET(request: Request) {
  try {
    const { supabase: supabaseDb, user, errorResponse, newTokens } = await getAuthenticatedClient();

    if (errorResponse || !supabaseDb || !user) {
      return errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer le profil de l'utilisateur connecté
    const { data: profileData, error: profileError } = await supabaseDb
      .from('profiles')
      .select('id, email, nom, prenom, role, telephone')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Erreur lors de la récupération du profil:', profileError);
      return NextResponse.json(
        { error: 'Impossible de récupérer le profil.' },
        { status: 500 }
      );
    }

    const response = NextResponse.json(profileData, { status: 200 });

    if (newTokens) {
      attachAuthCookies(response, newTokens);
    }

    return response;
  } catch (error) {
    console.error('Erreur inattendue lors de la récupération du profil:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { supabase: supabaseDb, user, errorResponse, newTokens } = await getAuthenticatedClient();

    if (errorResponse || !supabaseDb || !user) {
      return errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone } = body;

    // Validation basique
    if (!firstName || !lastName) {
       return NextResponse.json({ error: 'Le prénom et le nom sont requis.' }, { status: 400 });
    }

    const { error: updateError } = await supabaseDb
      .from('profiles')
      .update({
        prenom: firstName,
        nom: lastName,
        telephone: phone
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Erreur update profil:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du profil.' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ success: true }, { status: 200 });

    if (newTokens) {
      attachAuthCookies(response, newTokens);
    }

    return response;

  } catch (error) {
    console.error('Erreur inattendue PUT profile:', error);
     return NextResponse.json(
      { error: 'Erreur interne.' },
      { status: 500 }
    );
  }
}
