'use client';
import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, hint, className, id, children, ...rest }, ref) => {
    const selectId = id || rest.name;
    return (
      <div>
        {label && <label htmlFor={selectId} className="label">{label}</label>}
        <div className="relative">
          <select ref={ref} id={selectId} className={cn('field appearance-none pr-9 cursor-pointer', className)} {...rest}>
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
        </div>
        {hint && <p className="hint">{hint}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
