import React, { useState, useEffect } from 'react';
import type { VisiteNote, Urgence, StatutNote } from '@/types/visiteNote';
import Icon from '@/components/ui/AppIcon';

const URGENCE_COLORS: Record<Urgence, string> = {
  basse: 'bg-emerald-100 text-emerald-700',
  normale: 'bg-blue-100 text-blue-700',
  haute: 'bg-rose-100 text-rose-700',
};
const STATUT_COLORS: Record<StatutNote, string> = {
  'à faire': 'bg-amber-100 text-amber-700',
  'en cours': 'bg-blue-100 text-blue-700',
  'terminé': 'bg-emerald-100 text-emerald-700',
};

interface Props {
  visiteId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VisiteNotesModal({ visiteId, isOpen, onClose }: Props) {
  const [notes, setNotes] = useState<VisiteNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<VisiteNote | null>(null);
  const [form, setForm] = useState<Partial<VisiteNote>>({ content: '', urgence: 'normale', statut: 'à faire' });

  useEffect(() => {
    if (isOpen) fetchNotes();
  }, [isOpen, visiteId]);

  const fetchNotes = async () => {
    setLoading(true);
    const res = await fetch(`/api/visites/notes?visite_id=${visiteId}`);
    const json = await res.json();
    setNotes(json.data || []);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content) return;
    if (editingNote) {
      await fetch('/api/visites/notes', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...editingNote, ...form }) });
    } else {
      await fetch('/api/visites/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, visite_id: visiteId }) });
    }
    setForm({ content: '', urgence: 'normale', statut: 'à faire' });
    setEditingNote(null);
    fetchNotes();
  };

  const handleEdit = (note: VisiteNote) => {
    setEditingNote(note);
    setForm({ content: note.content, urgence: note.urgence, statut: note.statut });
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/visites/notes?id=${id}`, { method: 'DELETE' });
    fetchNotes();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200">
          <Icon name="XMarkIcon" size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="NotebookIcon" size={22} className="text-blue-500" />
          Notes de la visite
        </h2>
        <form onSubmit={handleSave} className="mb-6 space-y-3">
          <textarea
            className="w-full rounded-lg border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-blue-400"
            rows={3}
            placeholder="Ajouter une note..."
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            required
          />
          <div className="flex gap-2">
            <select className="rounded-lg border border-slate-200 p-2 text-sm" value={form.urgence} onChange={e => setForm(f => ({ ...f, urgence: e.target.value as Urgence }))}>
              <option value="basse">Basse urgence</option>
              <option value="normale">Normale</option>
              <option value="haute">Haute</option>
            </select>
            <select className="rounded-lg border border-slate-200 p-2 text-sm" value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value as StatutNote }))}>
              <option value="à faire">À faire</option>
              <option value="en cours">En cours</option>
              <option value="terminé">Terminé</option>
            </select>
            <button type="submit" className="ml-auto px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all">
              {editingNote ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
        <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
          {loading ? <div className="text-center text-slate-400">Chargement...</div> : notes.length === 0 ? <div className="text-center text-slate-400">Aucune note</div> : notes.map(note => (
            <div key={note.id} className="rounded-xl border border-slate-100 p-3 bg-slate-50 flex flex-col gap-1 relative group shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${URGENCE_COLORS[note.urgence]}`}>{note.urgence}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_COLORS[note.statut]}`}>{note.statut}</span>
                <span className="text-xs text-slate-400 ml-auto">{new Date(note.created_at).toLocaleString()}</span>
                <button onClick={() => handleEdit(note)} className="p-1 text-blue-500 hover:text-blue-700"><Icon name="PencilIcon" size={14} /></button>
                <button onClick={() => handleDelete(note.id)} className="p-1 text-rose-500 hover:text-rose-700"><Icon name="TrashIcon" size={14} /></button>
              </div>
              <div className="text-sm text-slate-700 whitespace-pre-line">{note.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
