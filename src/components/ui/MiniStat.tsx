import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Compact inline metric used in summary strips above tables. */
export function MiniStat({ label, value, icon, tone = 'brand' }: {
  label: string; value: ReactNode; icon?: ReactNode; tone?: 'brand' | 'amber' | 'red' | 'blue' | 'gray';
}) {
  const tones = {
    brand: 'text-brand-600 bg-brand-50', amber: 'text-amber-600 bg-amber-50',
    red: 'text-red-600 bg-red-50', blue: 'text-blue-600 bg-blue-50', gray: 'text-ink-muted bg-paper',
  };
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {icon && <span className={cn('grid h-9 w-9 place-items-center rounded-xl', tones[tone])}>{icon}</span>}
      <div>
        <p className="text-[11px] uppercase tracking-wide text-ink-faint font-medium">{label}</p>
        <p className="text-lg font-semibold tracking-tight text-ink tabular-nums leading-tight">{value}</p>
      </div>
    </div>
  );
}
