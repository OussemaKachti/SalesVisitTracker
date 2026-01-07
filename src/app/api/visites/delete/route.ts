import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.'
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const visiteId = url.searchParams.get('id');

    if (!visiteId) {
      return NextResponse.json(
        { error: 'ID de visite requis.' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié.' },
        { status: 401 }
      );
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "Impossible de récupérer l'utilisateur courant." },
        { status: 401 }
      );
    }

    // Créer un client Supabase authentifié pour respecter les RLS
    const supabaseDb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Récupérer la visite pour vérifier les permissions
    const { data: visite, error: visiteError } = await supabaseDb
      .from('visites')
      .select('id, commercial_id')
      .eq('id', visiteId)
      .single();

    if (visiteError || !visite) {
      return NextResponse.json(
        { error: 'Visite non trouvée.' },
        { status: 404 }
      );
    }

    // Vérifier les permissions (admin ou propriétaire)
    const { data: profileData } = await supabaseDb
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single();

    const isAdmin = profileData?.role === 'admin';
    const isOwner = visite.commercial_id === userData.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Vous n\'avez pas la permission de supprimer cette visite.' },
        { status: 403 }
      );
    }

    // Supprimer la visite
    const { error: deleteError } = await supabaseDb
      .from('visites')
      .delete()
      .eq('id', visiteId);

    if (deleteError) {
      console.error('Erreur lors de la suppression de la visite:', deleteError);
      return NextResponse.json(
        { error: 'Impossible de supprimer la visite.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Visite supprimée avec succès.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur inattendue lors de la suppression de la visite:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
