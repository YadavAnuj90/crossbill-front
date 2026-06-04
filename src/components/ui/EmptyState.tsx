import { ReactNode } from 'react';

export function EmptyState({ icon, title, description, action }: {
  icon?: ReactNode; title: string; description?: string; action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && (
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          {icon}
        </div>
      )}
      <h3 className="font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-ink-muted max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
