'use client';
import { ReactNode } from 'react';

/** Seamless infinite marquee (duplicates children for a continuous loop). */
export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mask-fade-x overflow-hidden ${className ?? ''}`}>
      <div className="flex w-max animate-marquee-track hover:[animation-play-state:paused]">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>{children}</div>
      </div>
    </div>
  );
}
