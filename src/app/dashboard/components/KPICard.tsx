interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: string;
  trend: 'up' | 'down';
  color: string;
}

export default function KPICard({ title, value, change, icon, trend, color }: KPICardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-elevated border border-border hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d={icon} />
          </svg>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${trend === 'up' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {trend === 'up' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            )}
          </svg>
          <span className="text-sm font-cta font-semibold">{Math.abs(change)}%</span>
        </div>
      </div>
      <h3 className="text-sm font-body text-muted-foreground mb-2">{title}</h3>
      <p className="text-3xl font-display font-bold text-foreground">{value}</p>
    </div>
  );
}