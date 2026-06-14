import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full text-sm', className)}>{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-paper-border text-left text-xs font-medium uppercase tracking-wide text-ink-faint">
        {children}
      </tr>
    </thead>
  );
}

export function TH({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn('px-4 py-3 font-medium', className)}>{children}</th>;
}

export function TR({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b border-paper-border/70 last:border-0 transition-all duration-200',
        onClick && 'cursor-pointer hover:bg-brand-50/40 hover:shadow-[inset_2px_0_0_0_#34d399]',
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TD({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn('px-4 py-3.5 text-ink-soft align-middle', className)}>{children}</td>;
}
