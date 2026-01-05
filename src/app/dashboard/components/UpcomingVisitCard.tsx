import AppImage from '@/components/ui/AppImage';
import Icon from '../../../components/ui/AppIcon';

interface UpcomingVisitCardProps {
  clientName: string;
  clientImage: string;
  clientImageAlt: string;
  time: string;
  location: string;
  priority: 'high' | 'medium' | 'low';
}

export default function UpcomingVisitCard({ 
  clientName, 
  clientImage, 
  clientImageAlt, 
  time, 
  location, 
  priority 
}: UpcomingVisitCardProps) {
  const priorityColors = {
    high: 'bg-error text-error-foreground',
    medium: 'bg-warning text-warning-foreground',
    low: 'bg-success text-success-foreground'
  };

  return (
    <div className="bg-card rounded-xl p-4 border border-border hover:border-primary transition-smooth group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary transition-smooth">
            <AppImage
              src={clientImage}
              alt={clientImageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-cta font-semibold text-foreground">{clientName}</h4>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-cta font-semibold ${priorityColors[priority]}`}>
          {priority.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <Icon name="MapPinIcon" size={14} className="text-secondary" />
        <span className="truncate">{location}</span>
      </div>
    </div>
  );
}