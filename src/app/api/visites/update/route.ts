import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import type { VisiteFormData } from '@/types/database';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.'
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function PUT(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { id?: string; data?: VisiteFormData }
      | null;

    if (!body?.id || !body?.data) {
      return NextResponse.json(
        { error: 'ID et données de visite sont requis.' },
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

    // Créer un client Supabase authentifié
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
      .eq('id', body.id)
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
        { error: 'Vous n\'avez pas la permission de modifier cette visite.' },
        { status: 403 }
      );
    }

    const form = body.data;

    // Préparation des données pour la mise à jour
    const updatePayload = {
      entreprise: form.entreprise,
      personne_rencontree: form.personne_rencontree,
      fonction_poste: form.fonction_poste || null,
      ville: form.ville || null,
      adresse: form.adresse || null,
      tel_fixe: form.tel_fixe || null,
      mobile: form.mobile || null,
      email: form.email || null,
      date_visite: form.date_visite,
      objet_visite: form.objet_visite,
      provenance_contact: form.provenance_contact || null,
      interet_client: form.interet_client || null,
      actions_a_entreprendre: form.actions_a_entreprendre || null,
      montant:
        typeof form.montant === 'number' && !Number.isNaN(form.montant)
          ? form.montant
          : null,
      date_prochaine_action: form.date_prochaine_action || null,
      remarques: form.remarques || null,
      probabilite:
        typeof form.probabilite === 'number' && !Number.isNaN(form.probabilite)
          ? form.probabilite
          : null,
      statut_visite: form.statut_visite,
      statut_action: form.statut_action ?? 'en_attente',
      updated_at: new Date().toISOString(),
    };

    // Mettre à jour la visite
    const { error: updateError } = await supabaseDb
      .from('visites')
      .update(updatePayload)
      .eq('id', body.id);

    if (updateError) {
      console.error('Erreur lors de la mise à jour de la visite:', updateError);
      return NextResponse.json(
        { error: 'Impossible de mettre à jour la visite.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Visite mise à jour avec succès.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur inattendue lors de la mise à jour de la visite:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
