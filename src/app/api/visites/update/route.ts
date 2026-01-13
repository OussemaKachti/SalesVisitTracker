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

/**
 * PATCH /api/visites/update
 * Met à jour uniquement le statut_visite ou statut_action d'une visite
 * Utilisé pour les changements rapides depuis le dashboard
 */
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const visiteId = searchParams.get('id');

    if (!visiteId) {
      return NextResponse.json(
        { error: 'ID de visite manquant' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    const { data: userData, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !userData?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = userData.user;

    // Créer un client Supabase authentifié avec le token
    const supabaseDb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Récupérer le profil de l'utilisateur pour vérifier son rôle
    const { data: profile, error: profileError } = await supabaseDb
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Erreur profil:', profileError);
      return NextResponse.json(
        { error: 'Profil utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer la visite pour vérifier les permissions
    const { data: visite, error: visiteError } = await supabaseDb
      .from('visites')
      .select('commercial_id')
      .eq('id', visiteId)
      .single();

    if (visiteError || !visite) {
      console.error('Erreur visite:', visiteError);
      return NextResponse.json(
        { error: 'Visite non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier les permissions : admin ou propriétaire
    const isAdmin = profile.role === 'admin';
    const isOwner = visite.commercial_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Vous n\'avez pas la permission de modifier cette visite' },
        { status: 403 }
      );
    }

    // Récupérer les données du body
    const body = await request.json();
    const { statut_visite, statut_action } = body;

    // Valider les données
    const validStatutVisite = ['a_faire', 'en_cours', 'termine'];
    const validStatutAction = ['en_attente', 'accepte', 'refuse'];

    if (statut_visite && !validStatutVisite.includes(statut_visite)) {
      return NextResponse.json(
        { error: 'Statut de visite invalide' },
        { status: 400 }
      );
    }

    if (statut_action && !validStatutAction.includes(statut_action)) {
      return NextResponse.json(
        { error: 'Statut d\'action invalide' },
        { status: 400 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = { updated_at: new Date().toISOString() };
    if (statut_visite !== undefined) {
      updateData.statut_visite = statut_visite;
    }
    if (statut_action !== undefined) {
      updateData.statut_action = statut_action;
    }

    if (Object.keys(updateData).length === 1) { // Seulement updated_at
      return NextResponse.json(
        { error: 'Aucune donnée à mettre à jour' },
        { status: 400 }
      );
    }

    // Mettre à jour la visite
    const { data: updatedVisite, error: updateError } = await supabaseDb
      .from('visites')
      .update(updateData)
      .eq('id', visiteId)
      .select()
      .single();

    if (updateError) {
      console.error('Erreur lors de la mise à jour de la visite:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la visite' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedVisite,
      message: 'Visite mise à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur dans PATCH /api/visites/update:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
