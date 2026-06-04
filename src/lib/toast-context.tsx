'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { cn } from './cn';

type ToastKind = 'success' | 'error' | 'info';
interface Toast { id: number; kind: ToastKind; message: string; }

const ToastContext = createContext<{ notify: (kind: ToastKind, message: string) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 w-[min(92vw,360px)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'card flex items-start gap-3 p-3.5 pr-3 shadow-lift animate-fade-in',
              t.kind === 'success' && 'border-brand-200',
              t.kind === 'error' && 'border-red-200',
            )}
          >
            {t.kind === 'success' && <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />}
            {t.kind === 'error' && <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />}
            {t.kind === 'info' && <Info className="h-5 w-5 text-ink-muted shrink-0 mt-0.5" />}
            <p className="text-sm text-ink-soft flex-1 leading-snug">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-ink-faint hover:text-ink p-0.5">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
