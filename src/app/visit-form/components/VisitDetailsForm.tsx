import { useState } from 'react';
import Icon from '../../../components/ui/AppIcon';


interface VisitDetailsFormProps {
  formData: {
    visitType: string;
    visitDate: string;
    visitTime: string;
    duration: string;
    location: string;
    objective: string;
    notes: string;
  };
  onFormChange: (field: string, value: string) => void;
}

const VisitDetailsForm = ({ formData, onFormChange }: VisitDetailsFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const visitTypes = [
    { value: 'presentation', label: 'Présentation Produit', icon: 'PresentationChartLineIcon' },
    { value: 'negotiation', label: 'Négociation', icon: 'CurrencyEuroIcon' },
    { value: 'followup', label: 'Suivi Client', icon: 'UserGroupIcon' },
    { value: 'support', label: 'Support Technique', icon: 'WrenchScrewdriverIcon' },
    { value: 'demo', label: 'Démonstration', icon: 'ComputerDesktopIcon' },
  ];

  const durations = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 heure' },
    { value: '90', label: '1h 30min' },
    { value: '120', label: '2 heures' },
    { value: '180', label: '3 heures' },
  ];

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'visitDate':
        if (!value) {
          newErrors[field] = 'La date est obligatoire';
        } else {
          delete newErrors[field];
        }
        break;
      case 'visitTime':
        if (!value) {
          newErrors[field] = "L'heure est obligatoire";
        } else {
          delete newErrors[field];
        }
        break;
      case 'location':
        if (!value || value.length < 3) {
          newErrors[field] = 'Le lieu doit contenir au moins 3 caractères';
        } else {
          delete newErrors[field];
        }
        break;
      case 'objective':
        if (!value || value.length < 10) {
          newErrors[field] = "L'objectif doit contenir au moins 10 caractères";
        } else {
          delete newErrors[field];
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (field: string, value: string) => {
    onFormChange(field, value);
    validateField(field, value);
  };

  return (
    <div className="space-y-6">
      {/* Visit Type Selection */}
      <div>
        <label className="block text-sm font-cta font-semibold text-foreground mb-3">
          Type de Visite *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {visitTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleChange('visitType', type.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                formData.visitType === type.value
                  ? 'bg-gradient-to-br from-primary to-secondary border-primary text-white shadow-glow'
                  : 'bg-card border-border text-muted-foreground hover:border-accent'
              }`}
            >
              <Icon
                name={type.icon as any}
                size={24}
                className={`mx-auto mb-2 ${
                  formData.visitType === type.value ? 'text-white' : 'text-accent'
                }`}
              />
              <p className="text-xs font-cta font-medium text-center">{type.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Date and Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-cta font-semibold text-foreground mb-2">
            Date de Visite *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="CalendarIcon" size={20} className="text-muted-foreground" />
            </div>
            <input
              type="date"
              value={formData.visitDate}
              onChange={(e) => handleChange('visitDate', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 bg-card border-2 rounded-xl text-foreground font-body transition-all duration-300 ${
                errors.visitDate
                  ? 'border-error focus:ring-error/20' :'border-border focus:border-accent focus:ring-accent/20'
              } focus:ring-4`}
            />
          </div>
          {errors.visitDate && (
            <p className="mt-2 text-sm text-error font-body flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.visitDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-cta font-semibold text-foreground mb-2">
            Heure de Visite *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="ClockIcon" size={20} className="text-muted-foreground" />
            </div>
            <input
              type="time"
              value={formData.visitTime}
              onChange={(e) => handleChange('visitTime', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 bg-card border-2 rounded-xl text-foreground font-body transition-all duration-300 ${
                errors.visitTime
                  ? 'border-error focus:ring-error/20' :'border-border focus:border-accent focus:ring-accent/20'
              } focus:ring-4`}
            />
          </div>
          {errors.visitTime && (
            <p className="mt-2 text-sm text-error font-body flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.visitTime}
            </p>
          )}
        </div>
      </div>

      {/* Duration Selection */}
      <div>
        <label className="block text-sm font-cta font-semibold text-foreground mb-3">
          Durée Estimée
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {durations.map((duration) => (
            <button
              key={duration.value}
              type="button"
              onClick={() => handleChange('duration', duration.value)}
              className={`py-3 px-4 rounded-xl border-2 transition-all duration-300 font-cta font-medium ${
                formData.duration === duration.value
                  ? 'bg-gradient-to-r from-secondary to-accent border-secondary text-white shadow-glow'
                  : 'bg-card border-border text-muted-foreground hover:border-accent'
              }`}
            >
              {duration.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-cta font-semibold text-foreground mb-2">
          Lieu de Visite *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="MapPinIcon" size={20} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Ex: 123 Avenue des Champs-Élysées, Paris"
            className={`w-full pl-12 pr-4 py-3 bg-card border-2 rounded-xl text-foreground placeholder-muted-foreground font-body transition-all duration-300 ${
              errors.location
                ? 'border-error focus:ring-error/20' :'border-border focus:border-accent focus:ring-accent/20'
            } focus:ring-4`}
          />
        </div>
        {errors.location && (
          <p className="mt-2 text-sm text-error font-body flex items-center gap-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            {errors.location}
          </p>
        )}
      </div>

      {/* Objective */}
      <div>
        <label className="block text-sm font-cta font-semibold text-foreground mb-2">
          Objectif de la Visite *
        </label>
        <div className="relative">
          <div className="absolute top-3 left-4 pointer-events-none">
            <Icon name="FlagIcon" size={20} className="text-muted-foreground" />
          </div>
          <textarea
            value={formData.objective}
            onChange={(e) => handleChange('objective', e.target.value)}
            placeholder="Décrivez l'objectif principal de cette visite..."
            rows={3}
            className={`w-full pl-12 pr-4 py-3 bg-card border-2 rounded-xl text-foreground placeholder-muted-foreground font-body transition-all duration-300 resize-none ${
              errors.objective
                ? 'border-error focus:ring-error/20' :'border-border focus:border-accent focus:ring-accent/20'
            } focus:ring-4`}
          />
        </div>
        {errors.objective && (
          <p className="mt-2 text-sm text-error font-body flex items-center gap-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            {errors.objective}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-cta font-semibold text-foreground mb-2">
          Notes Additionnelles
        </label>
        <div className="relative">
          <div className="absolute top-3 left-4 pointer-events-none">
            <Icon name="DocumentTextIcon" size={20} className="text-muted-foreground" />
          </div>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Ajoutez des notes ou informations supplémentaires..."
            rows={4}
            className="w-full pl-12 pr-4 py-3 bg-card border-2 border-border rounded-xl text-foreground placeholder-muted-foreground font-body focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all duration-300 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default VisitDetailsForm;