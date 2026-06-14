import { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

type Tone = 'brand' | 'amber' | 'red' | 'gray' | 'blue';

const toneMap: Record<Tone, { tile: string; bar: string; glow: string }> = {
  brand: { tile: 'from-brand-400 to-brand-600', bar: 'from-brand-400 to-brand-600', glow: 'bg-brand-300/40' },
  amber: { tile: 'from-amber-400 to-amber-600', bar: 'from-amber-300 to-amber-500', glow: 'bg-amber-300/40' },
  red: { tile: 'from-red-400 to-red-600', bar: 'from-red-300 to-red-500', glow: 'bg-red-300/40' },
  blue: { tile: 'from-blue-400 to-blue-600', bar: 'from-blue-300 to-blue-500', glow: 'bg-blue-300/40' },
  gray: { tile: 'from-slate-400 to-slate-600', bar: 'from-slate-300 to-slate-500', glow: 'bg-slate-300/40' },
};

export function StatCard({ label, value, icon, tone = 'brand', hint }: {
  label: string; value: ReactNode; icon: ReactNode; tone?: Tone; hint?: string;
}) {
  const t = toneMap[tone];
  return (
    <SpotlightCard glow={tone}>
      {/* glowing tone accent bar */}
      <span className={cn('absolute inset-x-0 top-0 z-[2] h-[3px] bg-gradient-to-r', t.bar)} />
      {/* corner tone glow */}
      <span className={cn('pointer-events-none absolute -right-10 -top-10 z-0 h-28 w-28 rounded-full blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100', t.glow)} />

      <div className="relative z-[1] min-h-[132px] p-5">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-ink-muted">{label}</p>
          <span className={cn('grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 [&>*]:h-[18px] [&>*]:w-[18px]', t.tile)}>{icon}</span>
        </div>
        <p className="mt-4 text-[32px] leading-none font-bold tracking-tight text-ink tabular-nums">{value}</p>
        {hint && (
          <p className="mt-2.5 flex items-center gap-1.5 text-xs text-ink-faint">
            <span className={cn('h-1.5 w-1.5 rounded-full bg-gradient-to-br', t.tile)} /> {hint}
          </p>
        )}
      </div>
    </SpotlightCard>
  );
}
