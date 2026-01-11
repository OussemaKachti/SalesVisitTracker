import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const familleId = searchParams.get('famille_id');

    console.log('[CATEGORIES API] Fetching with params:', { familleId });
    console.log('[CATEGORIES API] SUPABASE_URL:', SUPABASE_URL);
    console.log('[CATEGORIES API] ANON_KEY length:', SUPABASE_ANON_KEY?.length);

    // Créer un nouveau client pour chaque requête
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let query = supabase
      .from('categories_produits')
      .select('*', { count: 'exact' });

    if (familleId) {
      query = query.eq('famille_id', familleId);
    }

    const { data, error, count } = await query;

    console.log('[CATEGORIES API] Raw response:', { data, error, count, dataLength: data?.length });

    if (error) {
      console.error('[CATEGORIES API] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('[CATEGORIES API] Returning data:', data);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('[CATEGORIES API] Server error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
