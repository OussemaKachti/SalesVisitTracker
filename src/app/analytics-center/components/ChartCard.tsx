import { ReactNode } from 'react';
import Icon from '../../../components/ui/AppIcon';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  loading?: boolean;
}

export default function ChartCard({ title, subtitle, children, actions, loading }: ChartCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-elevated border border-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-bold text-foreground mb-1">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground font-body">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      <div className="w-full">
        {loading ? (
          <div className="flex items-center justify-center h-80 gap-2">
            <div className="animate-spin">
              <Icon name="ArrowPathIcon" size={24} />
            </div>
            <span className="text-sm text-muted-foreground font-body">Chargement des données...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}