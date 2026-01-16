'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Building2, User, Calendar, Target, TrendingUp, 
  CheckCircle2, AlertCircle, ChevronRight, ChevronLeft,
  Sparkles, Phone, Mail, MapPin, DollarSign, Clock,
  FileText, Tag, Briefcase, Save, Trash2, ArrowLeft,
  Zap, Flame, Heart, Frown
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';

type Step = 'client' | 'visite' | 'suivi';

export default function ModernVisitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { toasts, removeToast, success, error } = useToast();
  
  const [currentStep, setCurrentStep] = useState<Step>('client');
  const [isLoading, setIsLoading] = useState(!!editId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    entreprise: '',
    personne_rencontree: '',
    fonction_poste: '',
    ville: '',
    zone: '',
    tel_fixe: '',
    mobile: '',
    email: '',
    date_visite: '',
    objet_visite: '',
    provenance_contact: '',
    interet_client: '',
    montant: '',
    probabilite: 50,
    statut_visite: 'a_faire',
    statut_action: 'en_attente'
  });

  const steps = [
    { id: 'client' as Step, title: 'Client', icon: Building2, color: 'blue' },
    { id: 'visite' as Step, title: 'Visite', icon: Calendar, color: 'purple' },
    { id: 'suivi' as Step, title: 'Suivi', icon: TrendingUp, color: 'green' }
  ];

  // Charger la visite si en mode édition
  useEffect(() => {
    if (!editId) {
      setIsLoading(false);
      return;
    }

    const loadVisite = async () => {
      try {
        const url = new URL('/api/visites', window.location.origin);
        url.searchParams.set('page', '1');
        url.searchParams.set('pageSize', '1000');
        
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Impossible de charger la visite');
        }

        const { data } = await response.json();
        const visite = data.find((v: any) => v.id === editId);

        if (visite) {
          setFormData({
            entreprise: visite.entreprise || '',
            personne_rencontree: visite.personne_rencontree || '',
            fonction_poste: visite.fonction_poste || '',
            ville: visite.ville || '',
            zone: visite.zone || '',
            tel_fixe: visite.tel_fixe || '',
            mobile: visite.mobile || '',
            email: visite.email || '',
            date_visite: visite.date_visite || '',
            objet_visite: visite.objet_visite || '',
            provenance_contact: visite.provenance_contact || '',
            interet_client: visite.interet_client || '',
            montant: visite.montant ? String(visite.montant) : '',
            probabilite: visite.probabilite || 50,
            statut_visite: visite.statut_visite || 'a_faire',
            statut_action: visite.statut_action || 'en_attente'
          });
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la visite:', err);
        error('Impossible de charger la visite');
      } finally {
        setIsLoading(false);
      }
    };

    loadVisite();
  }, [editId]);

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        entreprise: formData.entreprise,
        personne_rencontree: formData.personne_rencontree,
        date_visite: formData.date_visite,
        objet_visite: formData.objet_visite,
        statut_visite: formData.statut_visite,
        statut_action: formData.statut_action,
        fonction_poste: formData.fonction_poste || undefined,
        ville: formData.ville || undefined,
        zone: formData.zone || undefined,
        tel_fixe: formData.tel_fixe || undefined,
        mobile: formData.mobile || undefined,
        email: formData.email || undefined,
        provenance_contact: formData.provenance_contact || undefined,
        interet_client: formData.interet_client || undefined,
        montant: formData.montant !== '' ? Number(formData.montant) : undefined,
        probabilite: formData.probabilite,
      };

      if (editId) {
        // Mode édition
        const response = await fetch('/api/visites/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: editId, data: payload }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erreur lors de la mise à jour de la visite:', errorText);
          error("Impossible de mettre à jour la visite.");
          return;
        }

        success('Visite mise à jour avec succès.');
        setTimeout(() => router.push('/dashboard'), 500);
      } else {
        // Mode création
        const response = await fetch('/api/visites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: payload }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erreur lors de la création de la visite:', errorText);
          error("Impossible d'enregistrer la visite.");
          return;
        }

        setFormData({
          entreprise: '',
          personne_rencontree: '',
          fonction_poste: '',
          ville: '',
          zone: '',
          tel_fixe: '',
          mobile: '',
          email: '',
          date_visite: '',
          objet_visite: '',
          provenance_contact: '',
          interet_client: '',
          montant: '',
          probabilite: 50,
          statut_visite: 'a_faire',
          statut_action: 'en_attente',
        });
        setCurrentStep('client');
        success('Visite enregistrée avec succès.');
      }
    } catch (err) {
      console.error('Erreur inattendue lors de la création de la visite:', err);
      error("Erreur inattendue lors de l'enregistrement de la visite.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editId) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette visite ?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/visites/delete?id=${editId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        error(errorData.error || "Impossible de supprimer la visite.");
        return;
      }

      success('Visite supprimée avec succès.');
      setTimeout(() => router.push('/dashboard'), 500);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      error('Erreur lors de la suppression de la visite.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la visite...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header avec animation */}
        <div className="text-center mb-8 relative">
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-0 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Retour</span>
          </button>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-blue-100 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              {editId ? 'Modifier une visite' : 'Nouvelle visite'}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {editId ? 'Modifier la visite' : 'Créer une visite commerciale'}
          </h1>
          <p className="text-gray-600">
            {editId 
              ? 'Mettez à jour les informations de cette visite'
              : 'Suivez les étapes pour enregistrer votre visite client'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                        ${isActive 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-white border-2 border-gray-200 text-gray-400'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </button>
                    <span className={`mt-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      flex-1 h-1 mx-4 rounded-full transition-all duration-300
                      ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <form
            onSubmit={(e) => {
              // Empêche la soumission implicite du formulaire (touche Entrée, etc.)
              e.preventDefault();
            }}
          >
            
            {/* Step: Client */}
            {currentStep === 'client' && (
              <div className="p-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Informations Client</h2>
                    <p className="text-gray-600 text-sm">Qui allez-vous rencontrer ?</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom de l'entreprise *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.entreprise}
                        onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
                        placeholder="Ex: TechCorp Solutions"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Personne rencontrée *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.personne_rencontree}
                        onChange={(e) => setFormData({...formData, personne_rencontree: e.target.value})}
                        placeholder="Nom et prénom"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fonction / Poste
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.fonction_poste}
                        onChange={(e) => setFormData({...formData, fonction_poste: e.target.value})}
                        placeholder="Ex: Directeur Commercial"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ville
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.ville}
                        onChange={(e) => setFormData({...formData, ville: e.target.value})}
                        placeholder="Ex: Tunis"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Zone
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.zone}
                        onChange={(e) => setFormData({...formData, zone: e.target.value})}
                        placeholder="Ex: Douar Hicher, Centre-ville"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Téléphone fixe
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.tel_fixe}
                        onChange={(e) => setFormData({...formData, tel_fixe: e.target.value})}
                        placeholder="+216 71 000 000"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mobile
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        placeholder="+216 20 000 000"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="contact@entreprise.com"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step: Visite */}
            {currentStep === 'visite' && (
              <div className="p-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Détails de la Visite</h2>
                    <p className="text-gray-600 text-sm">Contexte et objectifs</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date de visite *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.date_visite}
                        onChange={(e) => setFormData({...formData, date_visite: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Provenance du contact
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={formData.provenance_contact}
                        onChange={(e) => setFormData({...formData, provenance_contact: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="">Sélectionner...</option>
                        <option>Prospection à froid</option>
                        <option>Recommandation</option>
                        <option>Salon / Événement</option>
                        <option>Site web</option>
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Objet de la visite *
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        value={formData.objet_visite}
                        onChange={(e) => setFormData({...formData, objet_visite: e.target.value})}
                        placeholder="Décrivez l'objectif principal de cette visite..."
                        rows={4}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Évaluer l'intérêt du client
                      </div>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { 
                          value: 'Très élevé', 
                          icon: Flame, 
                          label: 'Très élevé',
                          subtitle: 'Client très intéressé',
                          color: 'from-red-500 to-red-600',
                          lightColor: 'bg-red-50',
                          borderColor: 'border-red-200',
                          textColor: 'text-red-700',
                          hoverColor: 'hover:bg-red-100'
                        },
                        { 
                          value: 'Élevé', 
                          icon: Zap, 
                          label: 'Élevé',
                          subtitle: 'Intéressé',
                          color: 'from-orange-500 to-orange-600',
                          lightColor: 'bg-orange-50',
                          borderColor: 'border-orange-200',
                          textColor: 'text-orange-700',
                          hoverColor: 'hover:bg-orange-100'
                        },
                        { 
                          value: 'Moyen', 
                          icon: TrendingUp, 
                          label: 'Moyen',
                          subtitle: 'Modérément intéressé',
                          color: 'from-yellow-500 to-yellow-600',
                          lightColor: 'bg-yellow-50',
                          borderColor: 'border-yellow-200',
                          textColor: 'text-yellow-700',
                          hoverColor: 'hover:bg-yellow-100'
                        },
                        { 
                          value: 'Faible', 
                          icon: AlertCircle, 
                          label: 'Faible',
                          subtitle: 'Peu intéressé',
                          color: 'from-gray-400 to-gray-500',
                          lightColor: 'bg-gray-50',
                          borderColor: 'border-gray-200',
                          textColor: 'text-gray-600',
                          hoverColor: 'hover:bg-gray-100'
                        }
                      ].map((item) => {
                        const IconComponent = item.icon;
                        const isSelected = formData.interet_client === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setFormData({...formData, interet_client: item.value})}
                            className={`
                              relative p-4 rounded-xl border-2 transition-all duration-300 group
                              ${isSelected 
                                ? `${item.lightColor} ${item.borderColor} border-2 shadow-lg shadow-${item.textColor.split('-')[1]}-200 scale-105` 
                                : `bg-white border-gray-200 ${item.hoverColor}`
                              }
                            `}
                          >
                            {/* Gradient background pour sélection */}
                            {isSelected && (
                              <div className={`absolute inset-0 rounded-xl opacity-10 bg-gradient-to-br ${item.color}`}></div>
                            )}
                            
                            <div className="relative z-10 flex flex-col items-center gap-2">
                              <div className={`
                                p-2 rounded-lg transition-all duration-300
                                ${isSelected 
                                  ? `bg-gradient-to-br ${item.color} text-white shadow-lg` 
                                  : `${item.lightColor} ${item.textColor}`
                                }
                              `}>
                                <IconComponent className="w-6 h-6" />
                              </div>
                              
                              <div className="text-center">
                                <div className={`font-semibold text-sm ${isSelected ? item.textColor : 'text-gray-700'}`}>
                                  {item.label}
                                </div>
                                <div className={`text-xs mt-1 ${isSelected ? item.textColor : 'text-gray-500'}`}>
                                  {item.subtitle}
                                </div>
                              </div>
                            </div>

                            {/* Checkmark pour sélection */}
                            {isSelected && (
                              <div className={`absolute top-2 right-2 p-1 rounded-full bg-gradient-to-br ${item.color} text-white`}>
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Montant potentiel (DT)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.montant}
                        onChange={(e) => setFormData({...formData, montant: e.target.value})}
                        placeholder="5000"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step: Suivi */}
            {currentStep === 'suivi' && (
              <div className="p-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Suivi & Probabilité</h2>
                    <p className="text-gray-600 text-sm">Évaluez les chances de succès</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-gray-700">
                        Probabilité de conclusion
                      </label>
                      <span className="text-2xl font-bold text-green-600">
                        {formData.probabilite}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.probabilite}
                      onChange={(e) => setFormData({...formData, probabilite: Number(e.target.value)})}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Faible</span>
                      <span>Moyenne</span>
                      <span>Élevée</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Statut de la visite
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: 'a_faire', label: 'À faire', color: 'blue' },
                        { value: 'en_cours', label: 'En cours', color: 'yellow' },
                        { value: 'termine', label: 'Terminée', color: 'green' }
                      ].map(({ value, label, color }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData({...formData, statut_visite: value})}
                          className={`
                            px-6 py-3 rounded-xl font-semibold transition-all
                            ${formData.statut_visite === value
                              ? `bg-${color}-600 text-white shadow-lg scale-105`
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Résultat attendu
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: 'en_attente', label: 'En attente' },
                        { value: 'accepte', label: 'Acceptée' },
                        { value: 'refuse', label: 'Refusée' }
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData({...formData, statut_action: value})}
                          className={`
                            px-6 py-3 rounded-xl font-semibold transition-all
                            ${formData.statut_action === value
                              ? 'bg-green-600 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-100">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">Récapitulatif</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Entreprise:</strong> {formData.entreprise || 'Non renseigné'}</p>
                          <p><strong>Contact:</strong> {formData.personne_rencontree || 'Non renseigné'}</p>
                          <p><strong>Date:</strong> {formData.date_visite || 'Non planifiée'}</p>
                          <p><strong>Probabilité:</strong> {formData.probabilite}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Précédent
                </button>

                {currentStepIndex < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all"
                  >
                    Suivant
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {isSubmitting ? 'Enregistrement...' : editId ? 'Mettre à jour' : 'Enregistrer la visite'}
                  </button>
                )}
              </div>

              {editId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tips Card */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Astuce</h3>
              <p className="text-sm text-gray-600">
                Plus vous renseignez d'informations détaillées, plus vos statistiques et prévisions seront précises dans SalesTracker.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      </div>
    </>
  );
}