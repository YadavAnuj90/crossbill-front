import { ReactNode } from 'react';

export function PageHeader({ title, subtitle, action, eyebrow, icon }: {
  title: string; subtitle?: string; action?: ReactNode; eyebrow?: string; icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex items-start gap-3.5">
        {icon && (
          <span className="hidden sm:grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-black/5 shrink-0">
            {icon}
          </span>
        )}
        <div>
          {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
