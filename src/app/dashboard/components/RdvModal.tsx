'use client';

import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';
import type { RendezVousFormData, StatutRdv, PrioriteRdv } from '@/types/database';

interface RdvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RendezVousFormData) => Promise<void>;
  visiteId?: string;
  initialData?: Partial<RendezVousFormData>;
  mode?: 'create' | 'edit';
  isAdmin?: boolean;
}

export default function RdvModal({
  isOpen,
  onClose,
  onSubmit,
  visiteId,
  initialData,
  mode = 'create',
  isAdmin = false,
}: RdvModalProps) {
  const [formData, setFormData] = useState<RendezVousFormData>({
    entreprise: '',
    personne_contact: '',
    fonction_contact: '',
    tel_contact: '',
    email_contact: '',
    date_rdv: '',
    heure_debut: '',
    heure_fin: '',
    lieu: '',
    objet: '',
    description: '',
    statut_rdv: 'planifie',
    priorite: 'normale',
    rappel_avant: 60,
    visite_id: visiteId,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mettre à jour le formulaire quand initialData change
  useEffect(() => {
    if (initialData) {
      setFormData({
        entreprise: initialData.entreprise || '',
        personne_contact: initialData.personne_contact || '',
        fonction_contact: initialData.fonction_contact || '',
        tel_contact: initialData.tel_contact || '',
        email_contact: initialData.email_contact || '',
        date_rdv: initialData.date_rdv || '',
        heure_debut: initialData.heure_debut || '',
        heure_fin: initialData.heure_fin || '',
        lieu: initialData.lieu || '',
        objet: initialData.objet || '',
        description: initialData.description || '',
        statut_rdv: initialData.statut_rdv || 'planifie',
        priorite: initialData.priorite || 'normale',
        rappel_avant: initialData.rappel_avant ?? 60,
        visite_id: visiteId || initialData.visite_id,
      });
    } else {
      // Reset si pas d'initialData
      setFormData({
        entreprise: '',
        personne_contact: '',
        fonction_contact: '',
        tel_contact: '',
        email_contact: '',
        date_rdv: '',
        heure_debut: '',
        heure_fin: '',
        lieu: '',
        objet: '',
        description: '',
        statut_rdv: 'planifie',
        priorite: 'normale',
        rappel_avant: 60,
        visite_id: visiteId,
      });
    }
  }, [initialData, visiteId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rappel_avant' ? (value ? Number(value) : null) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.entreprise || !formData.date_rdv || !formData.heure_debut) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        entreprise: '',
        personne_contact: '',
        fonction_contact: '',
        tel_contact: '',
        email_contact: '',
        date_rdv: '',
        heure_debut: '',
        heure_fin: '',
        lieu: '',
        objet: '',
        description: '',
        statut_rdv: 'planifie',
        priorite: 'normale',
        rappel_avant: 60,
        visite_id: undefined,
      });
    } catch (error) {
      console.error('Erreur lors de la soumission du RDV:', error);
      alert('Une erreur est survenue lors de la création du rendez-vous.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Icon name="CalendarIcon" size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">
                  {mode === 'edit' ? 'Modifier le rendez-vous' : 'Planifier un rendez-vous'}
                </h2>
                <p className="text-sm text-gray-500">
                  {mode === 'edit' ? 'Modifiez les informations du RDV' : 'Créez un nouveau rendez-vous client'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              <Icon name="XMarkIcon" size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Admin Assignment Info */}
            {isAdmin && visiteId && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Icon name="LinkIcon" size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Assignation à une visite</p>
                    <p className="text-xs text-blue-700">
                      Ce rendez-vous sera lié à la visite sélectionnée et attribué au commercial responsable.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section: Informations client */}
            <div className="space-y-4">
              <h3 className="text-sm font-cta font-bold text-gray-900 flex items-center gap-2">
                <Icon name="BuildingOffice2Icon" size={16} className="text-blue-600" />
                Informations client
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                    Entreprise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="entreprise"
                    value={formData.entreprise}
                    onChange={handleChange}
                    placeholder="Ex: ACME Corporation"
                    required
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                    Personne de contact
                  </label>
                  <input
                    type="text"
                    name="personne_contact"
                    value={formData.personne_contact}
                    onChange={handleChange}
                    placeholder="Ex: Jean Dupont"
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                    Fonction
                  </label>
                  <input
                    type="text"
                    name="fonction_contact"
                    value={formData.fonction_contact}
                    onChange={handleChange}
                    placeholder="Ex: Directeur commercial"
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="tel_contact"
                    value={formData.tel_contact}
                    onChange={handleChange}
                    placeholder="Ex: +216 XX XXX XXX"
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email_contact"
                    value={formData.email_contact}
                    onChange={handleChange}
                    placeholder="Ex: contact@entreprise.com"
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Section: Date et horaire */}
            <div className="space-y-4">
              <h3 className="text-sm font-cta font-bold text-gray-900 flex items-center gap-2">
                <Icon name="ClockIcon" size={16} className="text-blue-600" />
                Date et horaire
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_rdv"
                    value={formData.date_rdv}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                    Heure début <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="heure_debut"
                    value={formData.heure_debut}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                    Heure fin
                  </label>
                  <input
                    type="time"
                    name="heure_fin"
                    value={formData.heure_fin}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                  Lieu
                </label>
                <input
                  type="text"
                  name="lieu"
                  value={formData.lieu}
                  onChange={handleChange}
                  placeholder="Ex: Bureau client, 123 Rue de la République, Tunis"
                  className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Section: Détails du RDV */}
            <div className="space-y-4">
              <h3 className="text-sm font-cta font-bold text-gray-900 flex items-center gap-2">
                <Icon name="DocumentTextIcon" size={16} className="text-blue-600" />
                Détails du rendez-vous
              </h3>

              <div>
                <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                  Objet
                </label>
                <input
                  type="text"
                  name="objet"
                  value={formData.objet}
                  onChange={handleChange}
                  placeholder="Ex: Présentation de l'offre commerciale"
                  className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Détails supplémentaires sur le rendez-vous..."
                  className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Section: Paramètres */}
            <div className="space-y-4">
              <h3 className="text-sm font-cta font-bold text-gray-900 flex items-center gap-2">
                <Icon name="Cog6ToothIcon" size={16} className="text-blue-600" />
                Paramètres
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                    Statut
                  </label>
                  <select
                    name="statut_rdv"
                    value={formData.statut_rdv}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="planifie">Planifié</option>
                    <option value="confirme">Confirmé</option>
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                    <option value="annule">Annulé</option>
                    <option value="reporte">Reporté</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                    Priorité
                  </label>
                  <select
                    name="priorite"
                    value={formData.priorite}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="basse">Basse</option>
                    <option value="normale">Normale</option>
                    <option value="haute">Haute</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-cta font-semibold text-gray-900 mb-1.5">
                    Rappel avant (min)
                  </label>
                  <select
                    name="rappel_avant"
                    value={formData.rappel_avant || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Pas de rappel</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="120">2 heures</option>
                    <option value="1440">1 jour</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-cta text-sm transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-cta text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Icon name="CheckIcon" size={16} />
                    <span>{mode === 'edit' ? 'Modifier' : 'Créer le RDV'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
