'use client';
import { HTMLAttributes, useRef } from 'react';
import { cn } from '@/lib/cn';

type Glow = 'brand' | 'amber' | 'red' | 'blue' | 'gray' | 'violet';

const GLOW: Record<Glow, string> = {
  brand: 'rgba(16,185,129,0.16)',
  amber: 'rgba(245,158,11,0.16)',
  red: 'rgba(239,68,68,0.15)',
  blue: 'rgba(59,130,246,0.15)',
  gray: 'rgba(100,116,139,0.12)',
  violet: 'rgba(139,92,246,0.16)',
};

/** A premium card that follows the cursor with a soft radial glow, lifts on hover,
 *  and sweeps a subtle sheen across its surface. Drop-in replacement for a div/Card. */
export function SpotlightCard({
  className, children, glow = 'brand', sheen = true, ...rest
}: HTMLAttributes<HTMLDivElement> & { glow?: Glow; sheen?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        'group surface lift',
        className,
      )}
      {...rest}
    >
      {/* cursor-following glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(440px circle at var(--mx, 50%) var(--my, 0%), ${GLOW[glow]}, transparent 65%)` }}
      />
      {/* hover sheen */}
      {sheen && <span aria-hidden className="sheen-on-hover z-0" />}
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}
