'use client';

import Icon from '../../../components/ui/AppIcon';

interface SocialLoginButtonProps {
  provider: 'google' | 'microsoft' | 'apple';
  onClick: () => void;
}

export default function SocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
  const configs = {
    google: {
      icon: 'GlobeAltIcon',
      label: 'Google',
      gradient: 'from-red-500 to-yellow-500',
    },
    microsoft: {
      icon: 'WindowIcon',
      label: 'Microsoft',
      gradient: 'from-blue-500 to-cyan-500',
    },
    apple: {
      icon: 'DevicePhoneMobileIcon',
      label: 'Apple',
      gradient: 'from-slate-700 to-slate-900',
    },
  };

  const config = configs[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex items-center justify-center gap-3 w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
    >
      <div
        className={`w-5 h-5 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}
      >
        <Icon name={config.icon as any} size={12} className="text-white" />
      </div>
      <span className="text-sm font-medium">{config.label}</span>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}