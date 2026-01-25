import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Props {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onNote: () => void;
}

export default function VisiteActionsDropdown({ onView, onEdit, onDelete, onNote }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2 rounded-full bg-slate-50 hover:bg-blue-100 shadow-sm border border-slate-200 transition-all"
        title="Actions"
      >
        <Icon name="EllipsisVerticalIcon" size={20} className="text-slate-500" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-xl bg-white/80 backdrop-blur shadow-2xl border border-slate-200 py-2 animate-fade-in">
          <button onClick={() => { setOpen(false); onView(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 rounded-lg transition-all">
            <Icon name="EyeIcon" size={16} /> Voir
          </button>
          <button onClick={() => { setOpen(false); onEdit(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 rounded-lg transition-all">
            <Icon name="PencilIcon" size={16} /> Modifier
          </button>
          <button onClick={() => { setOpen(false); onDelete(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
            <Icon name="TrashIcon" size={16} /> Supprimer
          </button>
          <button onClick={() => { setOpen(false); onNote(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
            <Icon name="NotebookIcon" size={16} /> Prendre une note
          </button>
        </div>
      )}
    </div>
  );
}
