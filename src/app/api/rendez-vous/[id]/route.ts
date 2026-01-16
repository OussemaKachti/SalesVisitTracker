import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import type { RendezVousFormData } from '@/types/database';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.'
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * GET /api/rendez-vous/[id]
 * Récupère un rendez-vous spécifique
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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

    const supabaseDb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const { data, error } = await supabaseDb
      .from('rendez_vous')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/rendez-vous/[id]
 * Met à jour un rendez-vous
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { data?: Partial<RendezVousFormData> }
      | null;

    if (!body?.data) {
      return NextResponse.json(
        { error: 'Données de rendez-vous requises.' },
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

    const supabaseDb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Vérifier que le RDV existe et que l'utilisateur a le droit de le modifier
    const { data: rdv, error: rdvError } = await supabaseDb
      .from('rendez_vous')
      .select('id, commercial_id')
      .eq('id', params.id)
      .single();

    if (rdvError || !rdv) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé.' },
        { status: 404 }
      );
    }

    // Vérifier les permissions
    const { data: profileData } = await supabaseDb
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single();

    const isAdmin = profileData?.role === 'admin';
    const isOwner = rdv.commercial_id === userData.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Vous n'avez pas la permission de modifier ce rendez-vous." },
        { status: 403 }
      );
    }

    const form = body.data;
    const updatePayload: any = {};

    // Mettre à jour seulement les champs fournis
    if (form.entreprise !== undefined) updatePayload.entreprise = form.entreprise;
    if (form.personne_contact !== undefined)
      updatePayload.personne_contact = form.personne_contact || null;
    if (form.tel_contact !== undefined)
      updatePayload.telephone = form.tel_contact || null;
    if (form.email_contact !== undefined)
      updatePayload.email = form.email_contact || null;
    if (form.lieu !== undefined) updatePayload.adresse = form.lieu || null;
    if (form.objet !== undefined) updatePayload.objet = form.objet || null;
    if (form.description !== undefined)
      updatePayload.description = form.description || null;
    if (form.statut_rdv !== undefined) updatePayload.statut = form.statut_rdv;
    if (form.priorite !== undefined) updatePayload.priorite = form.priorite;

    // Mettre à jour date_rdv si date et/ou heure changent
    if (form.date_rdv && form.heure_debut) {
      updatePayload.date_rdv = `${form.date_rdv}T${form.heure_debut}:00`;
    }

    // Calculer durée si heures fournies
    if (form.heure_debut && form.heure_fin) {
      updatePayload.duree_estimee = calculateDuration(
        form.heure_debut,
        form.heure_fin
      );
    }

    // Mettre à jour rappel
    if (form.rappel_avant !== undefined) {
      if (form.rappel_avant && updatePayload.date_rdv) {
        updatePayload.rappel_date = calculateRappelDate(
          updatePayload.date_rdv,
          form.rappel_avant
        );
      } else {
        updatePayload.rappel_date = null;
      }
    }

    const { error } = await supabaseDb
      .from('rendez_vous')
      .update(updatePayload)
      .eq('id', params.id);

    if (error) {
      console.error('Erreur lors de la mise à jour du RDV:', error);
      return NextResponse.json(
        { error: 'Impossible de mettre à jour le rendez-vous.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Rendez-vous mis à jour avec succès.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur inattendue lors de la mise à jour du RDV:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/rendez-vous/[id]
 * Supprime un rendez-vous
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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

    const supabaseDb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Vérifier que le RDV existe et que l'utilisateur a le droit de le supprimer
    const { data: rdv, error: rdvError } = await supabaseDb
      .from('rendez_vous')
      .select('id, commercial_id')
      .eq('id', params.id)
      .single();

    if (rdvError || !rdv) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé.' },
        { status: 404 }
      );
    }

    // Vérifier les permissions
    const { data: profileData } = await supabaseDb
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single();

    const isAdmin = profileData?.role === 'admin';
    const isOwner = rdv.commercial_id === userData.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Vous n'avez pas la permission de supprimer ce rendez-vous." },
        { status: 403 }
      );
    }

    const { error } = await supabaseDb
      .from('rendez_vous')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Erreur lors de la suppression du RDV:', error);
      return NextResponse.json(
        { error: 'Impossible de supprimer le rendez-vous.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Rendez-vous supprimé avec succès.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur inattendue lors de la suppression du RDV:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}

// Helper: Calculer la durée en minutes
function calculateDuration(heureDebut: string, heureFin: string): number {
  const [hd, md] = heureDebut.split(':').map(Number);
  const [hf, mf] = heureFin.split(':').map(Number);
  const debut = hd * 60 + md;
  const fin = hf * 60 + mf;
  return fin - debut;
}

// Helper: Calculer la date de rappel
function calculateRappelDate(dateRdv: string, minutesAvant: number): string {
  const date = new Date(dateRdv);
  date.setMinutes(date.getMinutes() - minutesAvant);
  return date.toISOString();
}
