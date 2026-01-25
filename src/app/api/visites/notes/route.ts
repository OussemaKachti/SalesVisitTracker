import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import type { VisiteNote } from '@/types/visiteNote';

// In-memory mock DB (à remplacer par une vraie DB/Supabase)
let notes: VisiteNote[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const visite_id = searchParams.get('visite_id');
  if (!visite_id) return NextResponse.json({ data: [] });
  return NextResponse.json({ data: notes.filter(n => n.visite_id === visite_id) });
}

export async function POST(request: Request) {
  const body = await request.json();
  const note: VisiteNote = {
    ...body,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  notes.push(note);
  return NextResponse.json({ data: note });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const idx = notes.findIndex(n => n.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  notes[idx] = { ...notes[idx], ...body, updated_at: new Date().toISOString() };
  return NextResponse.json({ data: notes[idx] });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  notes = notes.filter(n => n.id !== id);
  return NextResponse.json({ success: true });
}
