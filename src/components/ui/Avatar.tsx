import { initials } from '@/lib/format';
import { cn } from '@/lib/cn';

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div className={cn('grid place-items-center rounded-full bg-brand-100 text-brand-700 font-semibold text-xs h-8 w-8 shrink-0', className)}>
      {initials(name)}
    </div>
  );
}
