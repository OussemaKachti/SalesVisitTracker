import AppImage from '@/components/ui/AppImage';

interface TeamMemberCardProps {
  name: string;
  role: string;
  avatar: string;
  avatarAlt: string;
  visitsToday: number;
  status: 'active' | 'away' | 'offline';
}

export default function TeamMemberCard({ 
  name, 
  role, 
  avatar, 
  avatarAlt, 
  visitsToday, 
  status 
}: TeamMemberCardProps) {
  const statusColors = {
    active: 'bg-success',
    away: 'bg-warning',
    offline: 'bg-muted-foreground'
  };

  return (
    <div className="flex items-center space-x-4 p-4 rounded-xl bg-card border border-border hover:border-primary transition-smooth group">
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary transition-smooth">
          <AppImage
            src={avatar}
            alt={avatarAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusColors[status]} ring-2 ring-card`}></div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-cta font-semibold text-foreground truncate">{name}</h4>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-display font-bold text-foreground">{visitsToday}</p>
        <p className="text-xs text-muted-foreground">visites</p>
      </div>
    </div>
  );
}