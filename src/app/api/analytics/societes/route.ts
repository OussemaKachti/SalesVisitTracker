import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function GET() {
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

    // Client authentifié
    const supabaseDb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    console.log('Societes endpoint - fetching data...');
    
    // Récupérer les entreprises uniques
    const { data: visites, error } = await supabaseDb
      .from('visites')
      .select('entreprise')
      .not('entreprise', 'is', null);

    if (error) {
      console.error('Erreur Supabase societes:', error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    const societes = Array.from(new Set(visites?.map((v) => v.entreprise) || [])).filter(Boolean);
    console.log('Societes fetched:', societes);

    return NextResponse.json({ data: societes });
  } catch (error) {
    console.error('Erreur API analytics/societes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
