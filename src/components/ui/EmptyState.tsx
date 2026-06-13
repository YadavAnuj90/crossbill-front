import { ReactNode } from 'react';

export function EmptyState({ icon, title, description, action, children }: {
  icon?: ReactNode; title: string; description?: string; action?: ReactNode; children?: ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center text-center py-20 px-6 overflow-hidden">
      {/* decorative backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-6 -translate-x-1/2 h-44 w-80 rounded-full bg-brand-300/30 blur-3xl" />
        <div className="absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(circle_at_50%_30%,#000,transparent_70%)]" />
      </div>

      {icon && (
        <div className="relative mb-5">
          <span className="absolute inset-0 rounded-2xl bg-brand-400/40 blur-lg" />
          <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow ring-1 ring-white/20 [&>*]:h-7 [&>*]:w-7">
            {icon}
          </span>
        </div>
      )}
      <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-ink-muted max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
      {children}
    </div>
  );
}
