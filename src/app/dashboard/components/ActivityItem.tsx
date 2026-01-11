import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface ActivityItemProps {
  user: string;
  action: string;
  time: string;
  avatar: string;
  avatarAlt: string;
  type: 'visit' | 'client' | 'report';
}

export default function ActivityItem({ user, action, time, avatar, avatarAlt, type }: ActivityItemProps) {
  const typeStyles = {
    visit: {
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      icon: 'MapPinIcon'
    },
    client: {
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      icon: 'UserPlusIcon'
    },
    report: {
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      icon: 'DocumentChartBarIcon'
    }
  };

  const style = typeStyles[type];

  return (
    <div className="relative pl-6 pb-6 last:pb-0 group">
      {/* Timeline Line */}
      <div className="absolute left-[11px] top-8 bottom-0 w-px bg-slate-100 group-last:hidden"></div>
      
      <div className="flex items-start gap-4">
        {/* Avatar with Status Indicator */}
        <div className="relative flex-shrink-0 z-10">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100 transition-transform duration-300 group-hover:scale-110">
            <AppImage
              src={avatar}
              alt={avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${style.bg} ${style.border} border-2 border-white flex items-center justify-center shadow-sm`}>
             <Icon name={style.icon} size={10} className={style.color} />
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 min-w-0 mt-0.5">
          <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all duration-300">
            <p className="text-sm text-slate-600 leading-snug">
              <span className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors block mb-0.5">
                {user}
              </span>
              {action}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Icon name="ClockIcon" size={12} className="text-slate-400" />
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}