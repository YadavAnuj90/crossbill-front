import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card', className)} {...rest}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-paper-border">
      <div>
        <h3 className="font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}
