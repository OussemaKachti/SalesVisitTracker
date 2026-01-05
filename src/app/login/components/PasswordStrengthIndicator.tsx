'use client';

import { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StrengthLevel {
  label: string;
  color: string;
  width: string;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    return Math.min(score, 4);
  }, [password]);

  const levels: StrengthLevel[] = [
    { label: 'Très faible', color: 'bg-red-500', width: 'w-1/4' },
    { label: 'Faible', color: 'bg-orange-500', width: 'w-2/4' },
    { label: 'Moyen', color: 'bg-yellow-500', width: 'w-3/4' },
    { label: 'Fort', color: 'bg-green-500', width: 'w-full' },
  ];

  if (!password) return null;

  const currentLevel = levels[strength - 1];

  return (
    <div className="mt-2 space-y-2">
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${currentLevel?.color || 'bg-red-500'} transition-all duration-500 ${
            currentLevel?.width || 'w-1/4'
          }`}
        />
      </div>
      {currentLevel && (
        <p className="text-xs text-slate-400">
          Force du mot de passe: <span className="text-white">{currentLevel.label}</span>
        </p>
      )}
    </div>
  );
}