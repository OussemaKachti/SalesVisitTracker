import { NextResponse } from 'next/server';
import type { StatsVisites } from '@/types/database';
import { getAuthenticatedClient, attachAuthCookies } from '@/utils/supabase';

export async function GET(request: Request) {
  try {
    const { supabase: supabaseDb, user, errorResponse, newTokens } = await getAuthenticatedClient();

    if (errorResponse || !supabaseDb || !user) {
      return errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

    // Use authenticated client
    let baseQuery = supabaseDb
      .from('visites')
      .select(
        'id, statut_visite, statut_action, montant, probabilite',
        { count: 'exact' }
      )
      .eq('commercial_id', user.id);

    if (fromDate) {
      baseQuery = baseQuery.gte('date_visite', fromDate);
    }

    if (toDate) {
      baseQuery = baseQuery.lte('date_visite', toDate);
    }

    const { data, error } = await baseQuery;

    if (error) {
      console.error('Erreur lors du calcul des statistiques de visites:', error);
      return NextResponse.json(
        { error: 'Impossible de calculer les statistiques.' },
        { status: 500 }
      );
    }

    const stats: StatsVisites = {
      total_visites: 0,
      visites_a_faire: 0,
      visites_en_cours: 0,
      visites_terminees: 0,
      visites_acceptees: 0,
      visites_refusees: 0,
      montant_total: 0,
      probabilite_moyenne: 0,
    };

    if (!data || data.length === 0) {
      const response = NextResponse.json(stats, { status: 200 });
      if (newTokens) attachAuthCookies(response, newTokens);
      return response;
    }

    let sommeProbabilite = 0;
    let nombreProbabilites = 0;

    for (const visite of data as any[]) {
      stats.total_visites += 1;

      if (visite.statut_visite === 'a_faire') stats.visites_a_faire += 1;
      if (visite.statut_visite === 'en_cours') stats.visites_en_cours += 1;
      if (visite.statut_visite === 'termine') stats.visites_terminees += 1;

      if (visite.statut_action === 'accepte') stats.visites_acceptees += 1;
      if (visite.statut_action === 'refuse') stats.visites_refusees += 1;

      if (typeof visite.montant === 'number') {
        stats.montant_total += visite.montant;
      }

      if (typeof visite.probabilite === 'number') {
        sommeProbabilite += visite.probabilite;
        nombreProbabilites += 1;
      }
    }

    stats.probabilite_moyenne =
      nombreProbabilites > 0 ? Number((sommeProbabilite / nombreProbabilites).toFixed(1)) : 0;

    const response = NextResponse.json(stats, { status: 200 });
    if (newTokens) attachAuthCookies(response, newTokens);
    return response;
  } catch (error) {
    console.error('Erreur inattendue lors du calcul des statistiques de visites:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
