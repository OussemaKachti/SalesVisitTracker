import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const familleId = searchParams.get('famille_id');

    console.log('[CATEGORIES API] Fetching with params:', { familleId });

    let query = supabase
      .from('categories_produits')
      .select('*');

    if (familleId) {
      query = query.eq('famille_id', familleId);
    }

    const { data, error } = await query.order('nom', { ascending: true });

    console.log('[CATEGORIES API] Query result:', { count: data?.length, error: error?.message });

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
