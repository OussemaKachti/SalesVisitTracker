'use client';

import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';
import type { RendezVous, Visite } from '@/types/database';
import RdvModal from './RdvModal';
import VisiteNoteListCard from './VisiteNoteListCard';

interface RdvListCardProps {
  visiteId: string;
  visiteName: string;
  visiteData?: Visite;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export default function RdvListCard({
  visiteId,
  visiteName,
  visiteData,
  isOpen,
  onClose,
  isAdmin = false,
}: RdvListCardProps) {
  const [rdvList, setRdvList] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [editingRdv, setEditingRdv] = useState<RendezVous | null>(null);

  useEffect(() => {
    if (isOpen && visiteId) {
      fetchRdvs();
    }
  }, [isOpen, visiteId]);

  const fetchRdvs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/rendez-vous?visite_id=${visiteId}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des rendez-vous');
      }
      const json = await response.json();
      setRdvList(json.data || []);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les rendez-vous.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRdv = async (data: any) => {
    try {
      const response = await fetch('/api/rendez-vous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { ...data, visite_id: visiteId } }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du rendez-vous');
      }

      await fetchRdvs();
      setIsModalOpen(false);
      // Notify other components (like CalendarView) that RDV list changed
      window.dispatchEvent(new CustomEvent('rdv-updated'));
    } catch (err) {
      console.error('Erreur:', err);
      alert('Impossible de créer le rendez-vous.');
    }
  };

  const handleUpdateRdv = async (data: any) => {
    if (!editingRdv) return;

    try {
      const response = await fetch(`/api/rendez-vous/${editingRdv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du rendez-vous');
      }

      await fetchRdvs();
      setIsModalOpen(false);
      setEditingRdv(null);
      // Notify other components (like CalendarView) that RDV list changed
      window.dispatchEvent(new CustomEvent('rdv-updated'));
    } catch (err) {
      console.error('Erreur:', err);
      alert('Impossible de modifier le rendez-vous.');
    }
  };

  const handleDeleteRdv = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/rendez-vous/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du rendez-vous');
      }

      await fetchRdvs();
      // Notify other components (like CalendarView) that RDV list changed
      window.dispatchEvent(new CustomEvent('rdv-updated'));
    } catch (err) {
      console.error('Erreur:', err);
      alert('Impossible de supprimer le rendez-vous.');
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatutBadge = (statut: string) => {
    const badges = {
      planifie: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        label: 'Planifié',
        icon: 'CalendarIcon',
      },
      confirme: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: 'Confirmé',
        icon: 'CheckCircleIcon',
      },
      reporte: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        label: 'Reporté',
        icon: 'ArrowPathIcon',
      },
      annule: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        label: 'Annulé',
        icon: 'XCircleIcon',
      },
      termine: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        label: 'Terminé',
        icon: 'CheckBadgeIcon',
      },
    };

    const badge = badges[statut as keyof typeof badges] || badges.planifie;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
      >
        <Icon name={badge.icon as any} size={14} />
        {badge.label}
      </span>
    );
  };

  const getPrioriteBadge = (priorite: string) => {
    const badges = {
      basse: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Basse' },
      normale: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Normale' },
      haute: { bg: 'bg-orange-100', text: 'text-orange-600', label: 'Haute' },
      urgente: { bg: 'bg-red-100', text: 'text-red-600', label: 'Urgente' },
    };

    const badge = badges[priorite as keyof typeof badges] || badges.normale;

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Card */}
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                <Icon name="CalendarDaysIcon" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  Rendez-vous
                </h2>
                <p className="text-sm text-blue-100">
                  {visiteName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNotesOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/25 bg-white/10 text-white text-xs font-medium hover:bg-white/15 hover:border-white/40 transition-colors"
              >
                <Icon name="NotebookIcon" size={16} className="text-white" />
                <span>Notes</span>
              </button>
              <button
                onClick={() => {
                  setEditingRdv(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors font-cta text-sm font-semibold"
              >
                <Icon name="PlusIcon" size={16} />
                Nouveau RDV
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Icon name="XMarkIcon" size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Chargement des rendez-vous...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <Icon name="ExclamationTriangleIcon" size={20} className="text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {!loading && !error && rdvList.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Icon name="CalendarIcon" size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-display font-bold text-gray-900 mb-2">
                  Aucun rendez-vous
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Aucun rendez-vous n'a été planifié pour cette visite.
                </p>
                <button
                  onClick={() => {
                    setEditingRdv(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-cta text-sm transition-colors"
                >
                  <Icon name="PlusIcon" size={16} />
                  Créer le premier RDV
                </button>
              </div>
            )}

            {!loading && !error && rdvList.length > 0 && (
              <div className="space-y-4">
                {rdvList.map((rdv) => (
                  <div
                    key={rdv.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <Icon name="BuildingOffice2Icon" size={20} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base font-display font-bold text-gray-900">
                              {rdv.entreprise}
                            </h3>
                            {rdv.personne_contact && (
                              <p className="text-sm text-gray-600">
                                {rdv.personne_contact}
                              </p>
                            )}
                          </div>
                        </div>

                        {rdv.objet && (
                          <p className="text-sm text-gray-700 mb-3 ml-11">
                            <span className="font-semibold">Objet:</span> {rdv.objet}
                          </p>
                        )}

                        {/* Informations de contact */}
                        {(rdv.telephone || rdv.email) && (
                          <div className="flex flex-wrap items-center gap-3 ml-11 mb-3">
                            {rdv.telephone && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                <Icon name="PhoneIcon" size={12} className="text-gray-400" />
                                <span>{rdv.telephone}</span>
                              </div>
                            )}
                            {rdv.email && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                <Icon name="EnvelopeIcon" size={12} className="text-gray-400" />
                                <span>{rdv.email}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 ml-11">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Icon name="CalendarIcon" size={14} className="text-gray-400" />
                            <span className="font-medium">{formatDate(rdv.date_rdv)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Icon name="ClockIcon" size={14} className="text-gray-400" />
                            <span className="font-medium">{formatTime(rdv.date_rdv)}</span>
                            {rdv.duree_estimee && (
                              <span className="text-gray-500">({rdv.duree_estimee} min)</span>
                            )}
                          </div>
                          {rdv.adresse && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Icon name="MapPinIcon" size={14} className="text-gray-400" />
                              <span className="truncate max-w-[200px]">{rdv.adresse}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          {getStatutBadge(rdv.statut)}
                          {getPrioriteBadge(rdv.priorite)}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingRdv(rdv);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Modifier"
                          >
                            <Icon name="PencilIcon" size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteRdv(rdv.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <Icon name="TrashIcon" size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {rdv.description && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 leading-relaxed ml-11">
                          {rdv.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RDV Modal */}
      <RdvModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRdv(null);
        }}
        onSubmit={editingRdv ? handleUpdateRdv : handleCreateRdv}
        visiteId={visiteId}
        initialData={
          editingRdv
            ? (() => {
                const rdvDate = new Date(editingRdv.date_rdv);
                const heureDebut = rdvDate.toTimeString().slice(0, 5);
                
                // Calculer heure_fin à partir de duree_estimee
                let heureFin = '';
                if (editingRdv.duree_estimee) {
                  const endDate = new Date(rdvDate.getTime() + editingRdv.duree_estimee * 60000);
                  heureFin = endDate.toTimeString().slice(0, 5);
                }
                
                // Calculer rappel_avant à partir de rappel_date
                let rappelAvant = 60; // Valeur par défaut
                if (editingRdv.rappel_date) {
                  const rappelDate = new Date(editingRdv.rappel_date);
                  const diffMinutes = Math.round((rdvDate.getTime() - rappelDate.getTime()) / 60000);
                  if (diffMinutes > 0) {
                    rappelAvant = diffMinutes;
                  }
                }
                
                // Construire l'adresse complète
                const lieu = [
                  editingRdv.adresse,
                  editingRdv.zone,
                  editingRdv.ville
                ].filter(Boolean).join(', ') || '';
                
                return {
                  entreprise: editingRdv.entreprise,
                  personne_contact: editingRdv.personne_contact || '',
                  fonction_contact: '', // Pas dans la base, reste vide
                  tel_contact: editingRdv.telephone || '',
                  email_contact: editingRdv.email || '',
                  date_rdv: rdvDate.toISOString().split('T')[0],
                  heure_debut: heureDebut,
                  heure_fin: heureFin,
                  lieu: lieu,
                  objet: editingRdv.objet || '',
                  description: editingRdv.description || '',
                  statut_rdv: editingRdv.statut,
                  priorite: editingRdv.priorite,
                  rappel_avant: rappelAvant,
                };
              })()
            : visiteData
            ? {
                entreprise: visiteData.entreprise,
                personne_contact: visiteData.personne_rencontree || '',
                tel_contact: visiteData.mobile || visiteData.tel_fixe || '',
                email_contact: visiteData.email || '',
                lieu: [visiteData.adresse, visiteData.zone, visiteData.ville]
                  .filter(Boolean)
                  .join(', ') || '',
                date_rdv: '',
                heure_debut: '',
              }
            : undefined
        }
        mode={editingRdv ? 'edit' : 'create'}
        isAdmin={isAdmin}
      />
      {isNotesOpen && (
        <VisiteNoteListCard
          visiteId={visiteId}
          visiteName={visiteName}
          isOpen={isNotesOpen}
          onClose={() => setIsNotesOpen(false)}
        />
      )}
    </>
  );
}