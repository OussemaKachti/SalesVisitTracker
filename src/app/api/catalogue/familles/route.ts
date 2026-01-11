import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export async function GET() {
  try {
    console.log('[FAMILLES API] Fetching familles_produits...');
    console.log('[FAMILLES API] SUPABASE_URL:', SUPABASE_URL);
    console.log('[FAMILLES API] ANON_KEY length:', SUPABASE_ANON_KEY?.length);
    
    // Créer un nouveau client pour chaque requête
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Test simple sans order
    const { data, error, count } = await supabase
      .from('familles_produits')
      .select('*', { count: 'exact' });

    console.log('[FAMILLES API] Raw response:', { data, error, count, dataLength: data?.length });
    console.log('[FAMILLES API] Data:', data);

    if (error) {
      console.error('[FAMILLES API] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
