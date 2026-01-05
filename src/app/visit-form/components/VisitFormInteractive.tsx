'use client';

import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';
import StepIndicator from './StepIndicator';
import ClientSearchCard from './ClientSearchCard';
import VisitDetailsForm from './VisitDetailsForm';
import MediaUploadCard from './MediaUploadCard';
import ReviewSubmitCard from './ReviewSubmitCard';

interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  image: string;
  alt: string;
  lastVisit: string;
  totalVisits: number;
}

interface UploadedFile {
  id: number;
  name: string;
  type: string;
  size: string;
  url: string;
  alt?: string;
}

interface FormData {
  visitType: string;
  visitDate: string;
  visitTime: string;
  duration: string;
  location: string;
  objective: string;
  notes: string;
}

const VisitFormInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    visitType: 'presentation',
    visitDate: '',
    visitTime: '',
    duration: '60',
    location: '',
    objective: '',
    notes: '',
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const steps = [
    { id: 1, title: 'Client', icon: 'UserIcon' },
    { id: 2, title: 'Détails', icon: 'DocumentTextIcon' },
    { id: 3, title: 'Médias', icon: 'PhotoIcon' },
    { id: 4, title: 'Révision', icon: 'CheckCircleIcon' },
  ];

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const handleFileRemove = (id: number) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedClient !== null;
      case 2:
        return (
          formData.visitDate &&
          formData.visitTime &&
          formData.location.length >= 3 &&
          formData.objective.length >= 10
        );
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setCurrentStep(1);
        setSelectedClient(null);
        setUploadedFiles([]);
        setFormData({
          visitType: 'presentation',
          visitDate: '',
          visitTime: '',
          duration: '60',
          location: '',
          objective: '',
          notes: '',
        });
      }, 3000);
    }, 2000);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded-xl w-3/4 mx-auto"></div>
            <div className="h-64 bg-muted rounded-xl"></div>
            <div className="h-96 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-card border-2 border-primary rounded-2xl p-8 max-w-md mx-4 shadow-elevated animate-scale-in">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6 animate-bounce-subtle">
                  <Icon name="CheckCircleIcon" size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                  Visite Enregistrée !
                </h2>
                <p className="text-muted-foreground font-body mb-6">
                  Votre visite a été enregistrée avec succès dans le système.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-body">
                  <Icon name="ClockIcon" size={16} />
                  <span>Redirection automatique...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-full mb-6">
            <Icon name="PlusCircleIcon" size={24} className="text-primary" />
            <span className="text-sm font-cta font-semibold text-foreground">
              Nouvelle Visite Client
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Créer une Visite
          </h1>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Documentez vos interactions clients avec notre système de suivi avancé
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <StepIndicator currentStep={currentStep} totalSteps={4} steps={steps} />
        </div>

        {/* Form Content */}
        <div className="bg-card border-2 border-border rounded-2xl p-6 md:p-8 shadow-elevated mb-8">
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Sélectionner un Client
                </h2>
                <p className="text-muted-foreground font-body">
                  Recherchez et sélectionnez le client pour cette visite
                </p>
              </div>
              <ClientSearchCard
                onClientSelect={setSelectedClient}
                selectedClient={selectedClient}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Détails de la Visite
                </h2>
                <p className="text-muted-foreground font-body">
                  Remplissez les informations concernant votre visite
                </p>
              </div>
              <VisitDetailsForm formData={formData} onFormChange={handleFormChange} />
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Documents et Médias
                </h2>
                <p className="text-muted-foreground font-body">
                  Ajoutez des photos, documents ou notes vocales
                </p>
              </div>
              <MediaUploadCard
                uploadedFiles={uploadedFiles}
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <ReviewSubmitCard
                selectedClient={selectedClient}
                formData={formData}
                uploadedFiles={uploadedFiles}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 bg-card border-2 border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-accent transition-all duration-300 font-cta font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-muted-foreground"
          >
            <Icon name="ChevronLeftIcon" size={20} />
            <span className="hidden sm:inline">Précédent</span>
          </button>

          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    step.id === currentStep
                      ? 'w-8 bg-gradient-to-r from-primary to-accent'
                      : step.id < currentStep
                      ? 'bg-primary' :'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceedToNextStep()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white hover:shadow-glow transition-all duration-300 font-cta font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transform hover:scale-105 disabled:hover:scale-100"
            >
              <span className="hidden sm:inline">Suivant</span>
              <Icon name="ChevronRightIcon" size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-secondary to-accent rounded-xl text-white hover:shadow-glow-lg transition-all duration-300 font-cta font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Icon name="CheckIcon" size={20} />
                  <span>Soumettre la Visite</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="QuestionMarkCircleIcon" size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-display font-bold text-foreground mb-2">
                Besoin d'aide ?
              </h3>
              <p className="text-sm text-muted-foreground font-body mb-4">
                Consultez notre guide de création de visite ou contactez le support pour toute
                question.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-cta font-medium text-foreground hover:border-accent transition-all duration-300">
                  Guide d'utilisation
                </button>
                <button className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-cta font-medium text-foreground hover:border-accent transition-all duration-300">
                  Contacter le support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitFormInteractive;