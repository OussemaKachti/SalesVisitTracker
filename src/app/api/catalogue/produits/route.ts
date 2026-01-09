import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const familleId = searchParams.get('famille_id');
    const categorieId = searchParams.get('categorie_id');
    const search = searchParams.get('search');

    console.log('[API] Fetching produits with params:', { familleId, categorieId, search });

    let query = supabase
      .from('produits')
      .select('*');

    if (familleId) {
      query = query.eq('famille_id', familleId);
    }

    if (categorieId) {
      query = query.eq('categorie_id', categorieId);
    }

    if (search) {
      query = query.or(
        `designation.ilike.%${search}%,reference.ilike.%${search}%`
      );
    }

    const { data, error } = await query.order('designation', { ascending: true });

    console.log('[API] Query result:', { count: data?.length, error: error?.message });

    if (error) {
      console.error('[API] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (error) {
    console.error('[API] Server error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const supabaseDb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Vérifier le rôle
    const { data: userData } = await supabase.auth.getUser(accessToken);
    const { data: userProfile } = await supabaseDb
      .from('profiles')
      .select('role')
      .eq('id', userData?.user?.id)
      .single();

    if (userProfile?.role !== 'admin' && userProfile?.role !== 'consultant') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Calculer prix TTC si nécessaire
    const prixTtc = body.prix_ttc || body.prix_ht * (1 + (body.tva_pct || 20) / 100);

    const { data, error } = await supabaseDb
      .from('produits')
      .insert([
        {
          ...body,
          prix_ttc: prixTtc,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erreur:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
