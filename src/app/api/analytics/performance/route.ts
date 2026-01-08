import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
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
        { error: 'Impossible de récupérer l\'utilisateur courant.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const commercialId = searchParams.get('commercialId');
    const societe = searchParams.get('societe');

    // Client authentifié
    const supabaseDb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Récupérer toutes les visites
    let query = supabaseDb
      .from('visites')
      .select('date_visite, statut_action, statut_visite');

    if (commercialId) {
      query = query.eq('commercial_id', commercialId);
    }

    if (societe) {
      query = query.eq('entreprise', societe);
    }

    const { data: visites, error } = await query;

    if (error) {
      console.error('Error fetching visites:', error);
      return NextResponse.json({ data: [] });
    }

    // Group by month
    const monthlyData: { [key: string]: { visits: number; conversions: number; revenue: number } } = {};
    const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

    visites?.forEach((visite) => {
      if (!visite.date_visite) return;

      const date = new Date(visite.date_visite);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const monthKey = `${months[monthIndex]} ${year}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { visits: 0, conversions: 0, revenue: 0 };
      }

      monthlyData[monthKey].visits += 1;

      // Conversion = accepté + terminé
      if (visite.statut_action === 'accepte' && visite.statut_visite === 'termine') {
        monthlyData[monthKey].conversions += 1;
      }
    });

    // Convert to array and sort by date
    const data = Object.entries(monthlyData).map(([month, stats]) => ({
      month,
      visits: stats.visits,
      conversions: stats.conversions,
      revenue: stats.revenue,
    }));

    console.log('Performance data:', data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Erreur API analytics/performance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
