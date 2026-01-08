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

    // Récupérer toutes les visites avec montant
    let query = supabaseDb
      .from('visites')
      .select('date_visite, statut_action, statut_visite, montant');

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
    const monthlyData: { [key: string]: { revenue: number; target: number } } = {};
    const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

    visites?.forEach((visite) => {
      if (!visite.date_visite) return;

      const date = new Date(visite.date_visite);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const monthKey = `${months[monthIndex]} ${year}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, target: 0 };
      }

      // Target = tous les montants (toutes les statuts)
      const montant = typeof visite.montant === 'number' ? visite.montant : 0;
      monthlyData[monthKey].target += montant;

      // Revenue = montants où statut_action='accepte' AND statut_visite='termine'
      if (visite.statut_action === 'accepte' && visite.statut_visite === 'termine') {
        monthlyData[monthKey].revenue += montant;
      }
    });

    // Convert to array and sort by date
    const data = Object.entries(monthlyData).map(([month, stats]) => ({
      month,
      revenue: stats.revenue,
      target: stats.target,
    }));

    console.log('Revenue data:', data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Erreur API analytics/revenue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
