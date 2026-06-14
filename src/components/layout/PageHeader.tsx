import { ReactNode } from 'react';

export function PageHeader({ title, subtitle, action, eyebrow, icon }: {
  title: string; subtitle?: string; action?: ReactNode; eyebrow?: string; icon?: ReactNode;
}) {
  return (
    <div className="animate-pop-in mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3.5">
        {icon && (
          <span className="relative hidden shrink-0 sm:grid">
            <span className="absolute -inset-1 rounded-2xl bg-brand-400/30 blur-md animate-glow-breathe" aria-hidden />
            <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow ring-1 ring-white/20 transition-transform duration-300 hover:scale-105 hover:-rotate-3">
              {icon}
            </span>
          </span>
        )}
        <div>
          {eyebrow && (
            <p className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
              <span className="accent-bar" /> {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem]">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
