'use client';

import { useState } from 'react';
import Icon from '../../../components/ui/AppIcon';

interface ExportButtonProps {
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
}

export default function ExportButton({ onExport }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportOptions = [
    { format: 'pdf' as const, label: 'Exporter en PDF', icon: 'DocumentTextIcon' },
    { format: 'excel' as const, label: 'Exporter en Excel', icon: 'TableCellsIcon' },
    { format: 'csv' as const, label: 'Exporter en CSV', icon: 'DocumentChartBarIcon' },
  ];

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth font-cta font-medium text-sm"
      >
        <Icon name="ArrowDownTrayIcon" size={18} />
        <span>Exporter</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl shadow-elevated border border-border z-50 overflow-hidden animate-slide-in-from-top">
            {exportOptions.map((option) => (
              <button
                key={option.format}
                onClick={() => handleExport(option.format)}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-muted transition-smooth text-left"
              >
                <Icon name={option.icon as any} size={20} className="text-secondary" />
                <span className="text-sm font-body text-foreground">{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}