import Link from 'next/link';
import { ReactNode } from 'react';
import { ShieldCheck, Check } from 'lucide-react';
import { Aurora } from '@/components/motion/Aurora';
import { Logo } from '@/components/marketing/Logo';

export function AuthShell({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: ReactNode; footer: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link href="/"><Logo /></Link>
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto py-10">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <div className="mt-6 text-sm text-ink-muted text-center">{footer}</div>
        </div>
        <p className="text-center text-xs text-ink-faint">Built by Anujali Technologies</p>
      </div>

      {/* Right: brand panel */}
      <div className="relative hidden lg:flex flex-col justify-center overflow-hidden bg-ink px-12">
        <Aurora />
        <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-30" />
        <div className="relative max-w-md">
          <span className="badge bg-white/10 text-brand-200 mb-6"><ShieldCheck className="h-3.5 w-3.5" /> Export-compliant invoicing</span>
          <blockquote className="text-3xl font-semibold text-white leading-tight tracking-tight">
            Invoice correctly, claim zero-rated export benefits, and stay compliant —
            <span className="text-gradient-brand"> in under a minute.</span>
          </blockquote>
          <ul className="mt-8 space-y-3">
            {['Auto-filled GST & FEMA compliance', 'Gapless invoice numbering', 'FEMA realisation tracking', 'GSTR-1 6A export for your CA'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-white/75">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500/20 text-brand-300"><Check className="h-3 w-3" /></span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
