'use client';

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-cta font-medium transition-smooth ${
        active
          ? 'bg-primary text-primary-foreground shadow-lg'
          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}