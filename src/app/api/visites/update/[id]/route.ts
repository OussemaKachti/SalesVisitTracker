import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * PATCH /api/visites/update/[id]
 * Met à jour le statut_visite ou statut_action d'une visite
 * Accessible uniquement par l'admin ou le créateur de la visite
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const visiteId = params.id;

    if (!visiteId) {
      return NextResponse.json(
        { error: 'ID de visite manquant' },
        { status: 400 }
      );
    }

    // Récupérer le token d'accès depuis les cookies
    const cookieStore = cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Créer le client Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Récupérer l'utilisateur authentifié avec le token
    const { data: userData, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !userData?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = userData.user;

    // Récupérer le profil de l'utilisateur pour vérifier son rôle
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profil utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer la visite pour vérifier les permissions
    const { data: visite, error: visiteError } = await supabase
      .from('visites')
      .select('commercial_id')
      .eq('id', visiteId)
      .single();

    if (visiteError || !visite) {
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
    const updateData: any = {};
    if (statut_visite !== undefined) {
      updateData.statut_visite = statut_visite;
    }
    if (statut_action !== undefined) {
      updateData.statut_action = statut_action;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Aucune donnée à mettre à jour' },
        { status: 400 }
      );
    }

    // Mettre à jour la visite
    const { data: updatedVisite, error: updateError } = await supabase
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
    console.error('Erreur dans PATCH /api/visites/update/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
