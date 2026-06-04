import { cn } from '@/lib/cn';
import type { InvoiceStatus } from '@/lib/types';

const tones: Record<string, string> = {
  gray: 'bg-paper text-ink-muted border border-paper-border',
  green: 'bg-brand-50 text-brand-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  blue: 'bg-blue-50 text-blue-700',
};

export function Badge({ tone = 'gray', children, className }: { tone?: keyof typeof tones; children: React.ReactNode; className?: string }) {
  return <span className={cn('badge', tones[tone], className)}>{children}</span>;
}

const statusTone: Record<InvoiceStatus, keyof typeof tones> = {
  draft: 'gray', sent: 'blue', paid: 'green', overdue: 'red',
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Badge tone={statusTone[status]}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      <span className="capitalize">{status}</span>
    </Badge>
  );
}
