import { NextResponse } from 'next/server';
import type { Profile, EquipeMember } from '@/types/database';
import { getAuthenticatedClient, attachAuthCookies } from '@/utils/supabase';

// Helper: Get current week range (Monday to Saturday)
function getCurrentWeekRange(): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate Monday of current week
  const monday = new Date(now);
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  
  // Calculate Saturday of current week
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);
  saturday.setHours(23, 59, 59, 999);
  
  return {
    start: monday.toISOString(),
    end: saturday.toISOString()
  };
}

// Helper: Get current month range
function getCurrentMonthRange(): { start: string; end: string } {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  firstDay.setHours(0, 0, 0, 0);
  
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  lastDay.setHours(23, 59, 59, 999);
  
  return {
    start: firstDay.toISOString(),
    end: lastDay.toISOString()
  };
}

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

    // Get date ranges
    const weekRange = getCurrentWeekRange();
    const monthRange = getCurrentMonthRange();

    // Fetch all visits with date_visite
    const { data: visitesData, error: visitesError } = await supabaseDb
      .from('visites')
      .select('id, commercial_id, date_visite');

    if (visitesError) {
      console.error('Erreur lors de la récupération des visites pour le calcul équipe:', visitesError);
      return NextResponse.json(
        { error: "Impossible de récupérer les visites pour l'équipe." },
        { status: 500 }
      );
    }

    // Calculate counts per commercial
    const totalCounts: Record<string, number> = {};
    const weekCounts: Record<string, number> = {};
    const monthCounts: Record<string, number> = {};

    for (const visite of visitesData ?? []) {
      const commercialId = (visite as { commercial_id?: string; date_visite?: string }).commercial_id;
      const dateVisite = (visite as { date_visite?: string }).date_visite;
      
      if (!commercialId) continue;
      
      // Total count
      totalCounts[commercialId] = (totalCounts[commercialId] ?? 0) + 1;
      
      if (dateVisite) {
        const visitDate = new Date(dateVisite);
        
        // Week count (Monday to Saturday of current week)
        if (visitDate >= new Date(weekRange.start) && visitDate <= new Date(weekRange.end)) {
          weekCounts[commercialId] = (weekCounts[commercialId] ?? 0) + 1;
        }
        
        // Month count
        if (visitDate >= new Date(monthRange.start) && visitDate <= new Date(monthRange.end)) {
          monthCounts[commercialId] = (monthCounts[commercialId] ?? 0) + 1;
        }
      }
    }

    const profiles = (profilesData ?? []) as Profile[];
    const equipe: EquipeMember[] = profiles.map((profile) => ({
      ...profile,
      total_visites: totalCounts[profile.id] ?? 0,
      visites_semaine: weekCounts[profile.id] ?? 0,
      visites_mois: monthCounts[profile.id] ?? 0,
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
