'use client';

import { ReactNode } from 'react';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassmorphicCard({ children, className = '' }: GlassmorphicCardProps) {
  return (
    <div
      className={`relative w-full max-w-md mx-auto glassmorphism shadow-depth-layered ${className}`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}