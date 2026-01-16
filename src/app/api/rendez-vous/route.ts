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
 * GET /api/rendez-vous
 * Récupère la liste des rendez-vous
 */
export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const visiteId = searchParams.get('visite_id');
    const statutRdv = searchParams.get('statut');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Client Supabase authentifié pour appliquer les policies RLS
    const supabaseDb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Récupérer le profil utilisateur pour connaître son rôle
    const { data: userProfile } = await supabaseDb
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single();

    const userRole = userProfile?.role;

    let query = supabaseDb
      .from('rendez_vous')
      .select('*')
      .order('date_rdv', { ascending: true });

    // Filtrer par visite si spécifié
    if (visiteId) {
      query = query.eq('visite_id', visiteId);
    }

    // Filtrer par statut
    if (statutRdv) {
      query = query.eq('statut', statutRdv);
    }

    // Filtrer par plage de dates
    if (from) {
      query = query.gte('date_rdv', from);
    }

    if (to) {
      query = query.lte('date_rdv', to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des RDV:', error);
      return NextResponse.json(
        { error: 'Impossible de récupérer les rendez-vous.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rendez-vous
 * Crée un nouveau rendez-vous
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { data?: RendezVousFormData }
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

    const form = body.data;

    // Validation
    if (!form.entreprise || !form.date_rdv || !form.heure_debut) {
      return NextResponse.json(
        { error: 'Entreprise, date et heure de début sont obligatoires.' },
        { status: 400 }
      );
    }

    // Combiner date et heure pour créer un timestamp
    const dateRdvTimestamp = `${form.date_rdv}T${form.heure_debut}:00`;

    // Préparer les données pour l'insertion
    const insertPayload = {
      commercial_id: userData.user.id,
      entreprise: form.entreprise,
      personne_contact: form.personne_contact || null,
      telephone: form.tel_contact || null,
      email: form.email_contact || null,
      ville: null,
      zone: null,
      adresse: form.lieu || null,
      date_rdv: dateRdvTimestamp,
      duree_estimee: form.heure_fin
        ? calculateDuration(form.heure_debut, form.heure_fin)
        : 60,
      objet: form.objet || null,
      description: form.description || null,
      statut: form.statut_rdv || 'planifie',
      priorite: form.priorite || 'normale',
      rappel_envoye: false,
      rappel_date: form.rappel_avant
        ? calculateRappelDate(dateRdvTimestamp, form.rappel_avant)
        : null,
      compte_rendu: null,
      visite_id: form.visite_id || null,
    };

    // Client Supabase authentifié
    const supabaseDb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const { data, error } = await supabaseDb
      .from('rendez_vous')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du RDV:', error);
      return NextResponse.json(
        { error: 'Impossible de créer le rendez-vous.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Rendez-vous créé avec succès.', data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inattendue lors de la création du RDV:', error);
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
