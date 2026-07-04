'use client';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/** Right-side slide-in panel — used for edit forms. The page stays visible (dimmed) on the left. */
export function Drawer({ open, onClose, title, subtitle, children, footer, width = 'max-w-xl' }: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
      <div className={`absolute right-0 top-0 flex h-full w-full ${width} animate-drawer-in flex-col border-l border-paper-border bg-paper-card shadow-[-24px_0_60px_-20px_rgba(0,0,0,0.35)]`}>
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-paper-border px-6 py-4">
          <div>
            <h3 className="text-[1.1rem] font-semibold text-ink">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="-mr-1 rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-paper hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && (
          <div className="flex shrink-0 justify-end gap-2 border-t border-paper-border bg-paper/50 px-6 py-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}
