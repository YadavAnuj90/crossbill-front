'use client';
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="gborder-form relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-lg shadow-lift animate-fade-in">
          <div className="card flex min-h-0 w-full flex-col overflow-hidden border-transparent">
            <div className="flex shrink-0 items-center justify-between px-5 py-4 border-b border-paper-border">
              <h3 className="font-semibold text-ink">{title}</h3>
              <button onClick={onClose} className="text-ink-faint hover:text-ink p-1 rounded-lg hover:bg-paper">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-5">{children}</div>
            {footer && <div className="flex shrink-0 justify-end gap-2 px-5 py-4 border-t border-paper-border bg-paper/50">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
