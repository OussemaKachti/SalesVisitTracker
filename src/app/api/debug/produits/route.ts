import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function GET() {
  try {
    // Compter les produits
    const { data: produits, error: prodError } = await supabase
      .from('produits')
      .select('*', { count: 'exact' });

    if (prodError) {
      return NextResponse.json({ error: prodError.message }, { status: 500 });
    }

    // Compter les familles
    const { data: familles, error: famError } = await supabase
      .from('familles_produits')
      .select('*', { count: 'exact' });

    if (famError) {
      return NextResponse.json({ error: famError.message }, { status: 500 });
    }

    // Compter les catégories
    const { data: categories, error: catError } = await supabase
      .from('categories_produits')
      .select('*', { count: 'exact' });

    if (catError) {
      return NextResponse.json({ error: catError.message }, { status: 500 });
    }

    // Afficher les premières données
    const { data: firstProduits } = await supabase
      .from('produits')
      .select('id, designation, reference, famille_id, categorie_id, actif')
      .limit(5);

    return NextResponse.json({
      counts: {
        produits: produits?.length || 0,
        familles: familles?.length || 0,
        categories: categories?.length || 0,
      },
      firstProducts: firstProduits,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 }
    );
  }
}
