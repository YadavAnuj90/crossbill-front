import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'brand' | 'amber' | 'red' | 'gray' | 'blue';

const toneMap: Record<Tone, { icon: string; bar: string; glow: string }> = {
  brand: { icon: 'bg-brand-50 text-brand-600', bar: 'from-brand-400 to-brand-600', glow: 'bg-brand-200/40' },
  amber: { icon: 'bg-amber-50 text-amber-600', bar: 'from-amber-300 to-amber-500', glow: 'bg-amber-200/40' },
  red: { icon: 'bg-red-50 text-red-600', bar: 'from-red-300 to-red-500', glow: 'bg-red-200/40' },
  blue: { icon: 'bg-blue-50 text-blue-600', bar: 'from-blue-300 to-blue-500', glow: 'bg-blue-200/40' },
  gray: { icon: 'bg-paper text-ink-muted', bar: 'from-paper-border to-ink-faint/40', glow: 'bg-paper-border/40' },
};

export function StatCard({ label, value, icon, tone = 'brand', hint }: {
  label: string; value: ReactNode; icon: ReactNode; tone?: Tone; hint?: string;
}) {
  const t = toneMap[tone];
  return (
    <div className="card card-hover group relative overflow-hidden p-5">
      <span className={cn('absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r', t.bar)} />
      {/* soft corner glow on hover */}
      <span className={cn('absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100', t.glow)} />
      {/* watermark icon */}
      <span className="pointer-events-none absolute -right-3 bottom-[-1.25rem] opacity-[0.04] [&>*]:h-28 [&>*]:w-28">{icon}</span>
      <div className="relative flex items-start justify-between">
        <p className="text-sm font-medium text-ink-muted">{label}</p>
        <span className={cn('grid h-9 w-9 place-items-center rounded-xl ring-1 ring-black/5', t.icon)}>{icon}</span>
      </div>
      <p className="relative mt-3 text-[28px] leading-none font-semibold tracking-tight text-ink tabular-nums">{value}</p>
      {hint && <p className="relative mt-2 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
