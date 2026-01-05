import { useState } from 'react';
import Icon from '../../../components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface UploadedFile {
  id: number;
  name: string;
  type: string;
  size: string;
  url: string;
  alt?: string;
}

interface MediaUploadCardProps {
  uploadedFiles: UploadedFile[];
  onFileUpload: (files: UploadedFile[]) => void;
  onFileRemove: (id: number) => void;
}

const MediaUploadCard = ({ uploadedFiles, onFileUpload, onFileRemove }: MediaUploadCardProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      size: `${(file.size / 1024).toFixed(2)} KB`,
      url: URL.createObjectURL(file),
      alt: file.type.startsWith('image/')
        ? `Uploaded document image showing ${file.name.split('.')[0]}`
        : undefined,
    }));

    onFileUpload([...uploadedFiles, ...newFiles]);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return 'PhotoIcon';
      case 'document':
        return 'DocumentTextIcon';
      default:
        return 'DocumentIcon';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
          isDragging
            ? 'border-accent bg-accent/10 scale-[1.02]'
            : 'border-border bg-card hover:border-accent/50'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={(e) => handleFileSelection(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4">
            <Icon name="CloudArrowUpIcon" size={32} className="text-accent" />
          </div>
          <h3 className="text-lg font-display font-bold text-foreground mb-2">
            Télécharger des Fichiers
          </h3>
          <p className="text-sm text-muted-foreground font-body mb-4">
            Glissez-déposez vos fichiers ici ou cliquez pour parcourir
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground font-body">
            <span className="flex items-center gap-1">
              <Icon name="PhotoIcon" size={16} />
              Images
            </span>
            <span className="flex items-center gap-1">
              <Icon name="DocumentTextIcon" size={16} />
              Documents
            </span>
            <span className="flex items-center gap-1">
              <Icon name="DocumentIcon" size={16} />
              PDF
            </span>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-cta font-semibold text-foreground flex items-center gap-2">
            <Icon name="PaperClipIcon" size={18} className="text-accent" />
            Fichiers Téléchargés ({uploadedFiles.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="relative p-4 bg-card border-2 border-border rounded-xl hover:border-accent transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  {file.type === 'image' ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <AppImage
                        src={file.url}
                        alt={file.alt || 'Uploaded file preview'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon
                        name={getFileIcon(file.type) as any}
                        size={28}
                        className="text-primary"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-cta font-semibold text-foreground truncate">
                      {file.name}
                    </h5>
                    <p className="text-xs text-muted-foreground font-body mt-1">{file.size}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-cta font-medium rounded">
                        {file.type === 'image' ? 'Image' : 'Document'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onFileRemove(file.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-error hover:bg-error/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <Icon name="TrashIcon" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-card border-2 border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-accent transition-all duration-300 font-cta font-medium"
        >
          <Icon name="CameraIcon" size={20} />
          <span className="hidden sm:inline">Prendre une Photo</span>
          <span className="sm:hidden">Photo</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-card border-2 border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-accent transition-all duration-300 font-cta font-medium"
        >
          <Icon name="MicrophoneIcon" size={20} />
          <span className="hidden sm:inline">Note Vocale</span>
          <span className="sm:hidden">Audio</span>
        </button>
      </div>
    </div>
  );
};

export default MediaUploadCard;