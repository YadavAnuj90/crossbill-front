import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function StatCard({ label, value, icon, tone = 'brand', hint }: {
  label: string; value: ReactNode; icon: ReactNode; tone?: 'brand' | 'amber' | 'red' | 'gray'; hint?: string;
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    gray: 'bg-paper text-ink-muted',
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{label}</p>
        <span className={cn('grid h-9 w-9 place-items-center rounded-xl', tones[tone])}>{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
