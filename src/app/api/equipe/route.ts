import { NextResponse } from 'next/server';
import type { Profile, EquipeMember } from '@/types/database';
import { getAuthenticatedClient, attachAuthCookies } from '@/utils/supabase';

export async function GET(request: Request) {
  try {
    const { supabase: supabaseDb, errorResponse, newTokens } = await getAuthenticatedClient();

    if (errorResponse || !supabaseDb) {
      return errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profilesData, error: profilesError } = await supabaseDb
      .from('profiles')
      .select('id, email, nom, prenom, role, telephone')
      .order('nom', { ascending: true });

    if (profilesError) {
      console.error("Erreur lors de la récupération de l'équipe:", profilesError);
      return NextResponse.json(
        { error: "Impossible de récupérer les membres de l'équipe." },
        { status: 500 }
      );
    }

    const { data: visitesData, error: visitesError } = await supabaseDb
      .from('visites')
      .select('id, commercial_id');

    if (visitesError) {
      console.error('Erreur lors de la récupération des visites pour le calcul équipe:', visitesError);
      return NextResponse.json(
        { error: "Impossible de récupérer les visites pour l'équipe." },
        { status: 500 }
      );
    }

    const counts: Record<string, number> = {};
    for (const visite of visitesData ?? []) {
      const commercialId = (visite as { commercial_id?: string }).commercial_id;
      if (!commercialId) continue;
      counts[commercialId] = (counts[commercialId] ?? 0) + 1;
    }

    const profiles = (profilesData ?? []) as Profile[];
    const equipe: EquipeMember[] = profiles.map((profile) => ({
      ...profile,
      total_visites: counts[profile.id] ?? 0,
    }));

    const response = NextResponse.json({ data: equipe }, { status: 200 });

    if (newTokens) {
      attachAuthCookies(response, newTokens);
    }

    return response;
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération de l'équipe:", error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
