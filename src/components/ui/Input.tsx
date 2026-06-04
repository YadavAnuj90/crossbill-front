'use client';
import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, hint, error, prefix, className, id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div>
        {label && <label htmlFor={inputId} className="label">{label}</label>}
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint text-sm">{prefix}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn('field', prefix && 'pl-9', error && 'border-red-300', className)}
            {...rest}
          />
        </div>
        {error ? <p className="text-xs text-red-600 mt-1.5">{error}</p> : hint && <p className="hint">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
