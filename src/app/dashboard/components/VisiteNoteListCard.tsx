import React, { useState, useEffect } from 'react';
import VisiteNotesModal from './VisiteNotesModal';
import Icon from '@/components/ui/AppIcon';
import type { VisiteNote } from '@/types/visiteNote';

interface Props {
  visiteId: string;
  visiteName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VisiteNoteListCard({ visiteId, visiteName, isOpen, onClose }: Props) {
  const [notes, setNotes] = useState<VisiteNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/visites/notes?visite_id=${visiteId}`);
      const json = await res.json();
      setNotes(json.data || []);
    } catch (err) {
      setError('Impossible de charger les notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && visiteId) fetchNotes();
  }, [isOpen, visiteId]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40 animate-in fade-in duration-200" onClick={onClose} />
      {/* Card */}
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200 flex flex-col" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                <Icon name="NotebookIcon" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-white">Notes</h2>
                <p className="text-sm text-blue-100">{visiteName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-indigo-600 hover:bg-indigo-50 transition-colors font-cta text-sm font-semibold shadow">
                <Icon name="PlusIcon" size={16} />
                Ajouter Note
              </button>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Icon name="XMarkIcon" size={20} className="text-white" />
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 to-white">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Chargement des notes...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <Icon name="ExclamationTriangleIcon" size={20} className="text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            {!loading && !error && notes.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Icon name="NotebookIcon" size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-display font-bold text-gray-900 mb-2">Aucune note</h3>
                <p className="text-sm text-gray-600 mb-6">Aucune note n'a été ajoutée pour cette visite.</p>
                <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-cta text-sm transition-colors">
                  <Icon name="PlusIcon" size={16} />
                  Ajouter la première note
                </button>
              </div>
            )}
            {!loading && !error && notes.length > 0 && (
              <div className="space-y-4">
                {notes.map(note => (
                  <div key={note.id} className="bg-white border border-indigo-100 rounded-xl p-5 shadow group hover:shadow-lg transition-all relative">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${note.urgence === 'haute' ? 'bg-rose-100 text-rose-700' : note.urgence === 'basse' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{note.urgence}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${note.statut === 'à faire' ? 'bg-amber-100 text-amber-700' : note.statut === 'en cours' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{note.statut}</span>
                      <span className="text-xs text-gray-400 ml-2">{new Date(note.created_at).toLocaleString()}</span>
                      <div className="flex gap-1 ml-auto">
                        <button title="Modifier" className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors" onClick={() => setModalOpen(true)}>
                          <Icon name="PencilIcon" size={16} />
                        </button>
                        <button title="Supprimer" className="p-1.5 rounded hover:bg-rose-50 text-rose-600 transition-colors" onClick={async () => { await fetch(`/api/visites/notes?id=${note.id}`, { method: 'DELETE' }); fetchNotes(); }}>
                          <Icon name="TrashIcon" size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-800 whitespace-pre-line pl-1">{note.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal d'ajout/édition de note */}
      {modalOpen && (
        <VisiteNotesModal
          visiteId={visiteId}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            fetchNotes();
          }}
        />
      )}
    </>
  );
}
