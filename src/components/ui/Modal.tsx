'use client';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type Size = 'md' | 'lg' | 'xl';
const WIDTH: Record<Size, string> = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' };

export function Modal({ open, onClose, title, children, footer, size = 'md' }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; size?: Size;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className={`gborder-form relative z-10 flex max-h-[calc(100dvh-2rem)] w-full ${WIDTH[size]} shadow-lift animate-fade-in`}>
          <div className="card flex min-h-0 w-full flex-col overflow-hidden border-transparent">
            <div className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-paper-border">
              <h3 className="text-[1.05rem] font-semibold text-ink">{title}</h3>
              <button onClick={onClose} className="text-ink-faint hover:text-ink p-1.5 rounded-lg hover:bg-paper transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="flex shrink-0 justify-end gap-2 px-6 py-4 border-t border-paper-border bg-paper/50">{footer}</div>}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
