'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; color: string; delay: number; left: number }[]>([]);

  useEffect(() => {
    if (!active) return;

    const colors = ['#22C55E', '#EF4444', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'];
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      left: Math.random() * 100,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: p.color,
            top: '-20px',
            left: `${p.left}%`,
            animation: `confetti-fall ${2 + Math.random()}s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}