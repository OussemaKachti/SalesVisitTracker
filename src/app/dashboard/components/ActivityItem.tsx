import AppImage from '@/components/ui/AppImage';

interface ActivityItemProps {
  user: string;
  action: string;
  time: string;
  avatar: string;
  avatarAlt: string;
  type: 'visit' | 'client' | 'report';
}

export default function ActivityItem({ user, action, time, avatar, avatarAlt, type }: ActivityItemProps) {
  const typeColors = {
    visit: 'from-primary to-secondary',
    client: 'from-secondary to-accent',
    report: 'from-accent to-primary'
  };

  return (
    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-muted transition-smooth group">
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary transition-smooth">
          <AppImage
            src={avatar}
            alt={avatarAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${typeColors[type]} flex items-center justify-center ring-2 ring-card`}>
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
            {type === 'visit' && <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
            {type === 'client' && <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
            {type === 'report' && <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
          </svg>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-body text-foreground">
          <span className="font-cta font-semibold">{user}</span> {action}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}