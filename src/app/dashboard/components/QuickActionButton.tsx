import Icon from '../../../components/ui/AppIcon';

interface QuickActionButtonProps {
  icon: string;
  label: string;
  color: string;
  onClick: () => void;
}

export default function QuickActionButton({ icon, label, color, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border hover:border-primary shadow-elevated hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
    >
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
        <Icon name={icon as any} size={32} className="text-white" />
      </div>
      <span className="text-sm font-cta font-semibold text-foreground">{label}</span>
    </button>
  );
}