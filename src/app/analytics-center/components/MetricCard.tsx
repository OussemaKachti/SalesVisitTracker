interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: string;
  trend: 'up' | 'down';
}

export default function MetricCard({ title, value, change, icon, trend }: MetricCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-elevated border border-border hover:shadow-2xl transition-smooth group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center transform transition-smooth group-hover:scale-110 group-hover:rotate-3">
          <svg className="w-6 h-6 text-primary-foreground" viewBox="0 0 24 24" fill="none">
            <path d={icon} fill="currentColor" />
          </svg>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
          trend === 'up' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
        }`}>
          <span className="text-sm font-cta font-semibold">{change > 0 ? '+' : ''}{change}%</span>
          <svg className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      </div>
      <h3 className="text-sm font-body text-muted-foreground mb-2">{title}</h3>
      <p className="text-3xl font-display font-bold text-foreground">{value}</p>
    </div>
  );
}