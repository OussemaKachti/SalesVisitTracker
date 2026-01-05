'use client';

import { useEffect, useState } from 'react';

interface Orb {
  id: number;
  size: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
}

export default function FloatingOrbs() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [orbs] = useState<Orb[]>([
    { id: 1, size: 300, left: '10%', top: '20%', delay: 0, duration: 20 },
    { id: 2, size: 400, left: '70%', top: '60%', delay: 5, duration: 25 },
    { id: 3, size: 250, left: '80%', top: '10%', delay: 10, duration: 18 },
    { id: 4, size: 350, left: '20%', top: '70%', delay: 3, duration: 22 },
  ]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full blur-3xl opacity-20 animate-float"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: orb.left,
            top: orb.top,
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%)',
            animationDelay: `${orb.delay}s`,
            animationDuration: `${orb.duration}s`,
          }}
        />
      ))}
    </div>
  );
}