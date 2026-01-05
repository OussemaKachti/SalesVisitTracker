import Icon from '../../../components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  image: string;
  alt: string;
}

interface UploadedFile {
  id: number;
  name: string;
  type: string;
  size: string;
  url: string;
  alt?: string;
}

interface ReviewSubmitCardProps {
  selectedClient: Client | null;
  formData: {
    visitType: string;
    visitDate: string;
    visitTime: string;
    duration: string;
    location: string;
    objective: string;
    notes: string;
  };
  uploadedFiles: UploadedFile[];
}

const ReviewSubmitCard = ({ selectedClient, formData, uploadedFiles }: ReviewSubmitCardProps) => {
  const visitTypeLabels: Record<string, string> = {
    presentation: 'Présentation Produit',
    negotiation: 'Négociation',
    followup: 'Suivi Client',
    support: 'Support Technique',
    demo: 'Démonstration',
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifié';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border-2 border-primary/30">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
          <Icon name="CheckCircleIcon" size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Vérification Finale
        </h2>
        <p className="text-sm text-muted-foreground font-body">
          Veuillez vérifier toutes les informations avant de soumettre
        </p>
      </div>

      {/* Client Information */}
      {selectedClient && (
        <div className="p-6 bg-card border-2 border-border rounded-xl">
          <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Icon name="UserIcon" size={22} className="text-primary" />
            Informations Client
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary/20">
              <AppImage
                src={selectedClient.image}
                alt={selectedClient.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-display font-bold text-foreground">
                {selectedClient.name}
              </h4>
              <p className="text-sm text-muted-foreground font-body">{selectedClient.company}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                  <Icon name="EnvelopeIcon" size={14} />
                  {selectedClient.email}
                </span>
                <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                  <Icon name="PhoneIcon" size={14} />
                  {selectedClient.phone}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visit Details */}
      <div className="p-6 bg-card border-2 border-border rounded-xl">
        <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
          <Icon name="CalendarIcon" size={22} className="text-secondary" />
          Détails de la Visite
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="TagIcon" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-body">Type de Visite</p>
              <p className="text-sm font-cta font-semibold text-foreground">
                {visitTypeLabels[formData.visitType] || 'Non spécifié'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="CalendarDaysIcon" size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-body">Date</p>
              <p className="text-sm font-cta font-semibold text-foreground">
                {formatDate(formData.visitDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="ClockIcon" size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-body">Heure</p>
              <p className="text-sm font-cta font-semibold text-foreground">
                {formData.visitTime || 'Non spécifié'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="ClockIcon" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-body">Durée</p>
              <p className="text-sm font-cta font-semibold text-foreground">
                {formData.duration ? `${formData.duration} minutes` : 'Non spécifié'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:col-span-2">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="MapPinIcon" size={20} className="text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-body">Lieu</p>
              <p className="text-sm font-cta font-semibold text-foreground">
                {formData.location || 'Non spécifié'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Objective and Notes */}
      <div className="p-6 bg-card border-2 border-border rounded-xl">
        <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
          <Icon name="DocumentTextIcon" size={22} className="text-accent" />
          Objectif et Notes
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground font-body mb-2">Objectif</p>
            <p className="text-sm text-foreground font-body leading-relaxed">
              {formData.objective || 'Aucun objectif spécifié'}
            </p>
          </div>
          {formData.notes && (
            <div>
              <p className="text-xs text-muted-foreground font-body mb-2">Notes Additionnelles</p>
              <p className="text-sm text-foreground font-body leading-relaxed">{formData.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="p-6 bg-card border-2 border-border rounded-xl">
          <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Icon name="PaperClipIcon" size={22} className="text-primary" />
            Fichiers Joints ({uploadedFiles.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="p-3 bg-muted/50 border border-border rounded-lg hover:border-accent transition-all duration-300"
              >
                {file.type === 'image' ? (
                  <div className="w-full h-20 rounded overflow-hidden mb-2">
                    <AppImage
                      src={file.url}
                      alt={file.alt || 'Uploaded file preview'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded flex items-center justify-center mb-2">
                    <Icon name="DocumentTextIcon" size={32} className="text-primary" />
                  </div>
                )}
                <p className="text-xs font-cta font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground font-body">{file.size}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Message */}
      <div className="p-4 bg-accent/10 border-2 border-accent/30 rounded-xl flex items-start gap-3">
        <Icon name="InformationCircleIcon" size={24} className="text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-cta font-semibold text-foreground mb-1">
            Vérification Importante
          </p>
          <p className="text-xs text-muted-foreground font-body">
            Une fois soumise, cette visite sera enregistrée dans le système et ne pourra pas être
            modifiée. Assurez-vous que toutes les informations sont correctes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmitCard;