import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface TeamPerformance {
  id: string;
  name: string;
  visits: number;
  conversions: number;
  revenue: number;
  prévisionnel: number;
  performance: number;
}

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
    const societe = searchParams.get('societe');

    // Client authentifié
    const supabaseDb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Fetch all commercials
    const { data: profiles, error: profilesError } = await supabaseDb
      .from('profiles')
      .select('id, nom, prenom, email')
      .eq('role', 'commercial');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return NextResponse.json({ data: [] });
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // For each commercial, fetch their visits and calculate stats
    const teamData: TeamPerformance[] = [];

    for (const profile of profiles) {
      let visitsQuery = supabaseDb
        .from('visites')
        .select('statut_action, statut_visite, montant')
        .eq('commercial_id', profile.id);

      if (societe) {
        visitsQuery = visitsQuery.eq('entreprise', societe);
      }

      const { data: allVisites } = await visitsQuery;

      // Calculate metrics
      const totalVisits = allVisites?.length || 0;
      
      // Conversions = visites where statut_action='accepte' AND statut_visite='termine'
      const conversions = allVisites?.filter(
        (v) => v.statut_action === 'accepte' && v.statut_visite === 'termine'
      ).length || 0;
      
      // Revenue = sum of montant where statut_action='accepte' AND statut_visite='termine'
      const revenue = allVisites
        ?.filter((v) => v.statut_action === 'accepte' && v.statut_visite === 'termine')
        .reduce((sum, v) => sum + (typeof v.montant === 'number' ? v.montant : 0), 0) || 0;

      // Prévisionnel = sum of ALL montants (regardless of status)
      const prévisionnel = allVisites
        ?.reduce((sum, v) => sum + (typeof v.montant === 'number' ? v.montant : 0), 0) || 0;

      // Performance = (conversions / totalVisits) * 100
      const performance = totalVisits > 0 ? Math.round((conversions / totalVisits) * 100) : 0;

      teamData.push({
        id: profile.id,
        name: `${profile.prenom || ''} ${profile.nom || ''}`.trim() || profile.email,
        visits: totalVisits,
        conversions,
        revenue,
        prévisionnel,
        performance,
      });
    }

    // Sort by performance descending
    teamData.sort((a, b) => b.performance - a.performance);

    console.log('Team data:', teamData, 'Total profiles:', profiles?.length || 0);
    return NextResponse.json({ data: teamData });
  } catch (error) {
    console.error('Erreur API analytics/team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
