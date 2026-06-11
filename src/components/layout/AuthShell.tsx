import Link from 'next/link';
import { ReactNode } from 'react';
import { ShieldCheck, Check, ArrowLeft, Star, Sparkles } from 'lucide-react';
import { Aurora } from '@/components/motion/Aurora';

const FEATURES = [
  'Auto-filled GST & FEMA compliance',
  'Export + domestic invoicing in one app',
  'FEMA realisation tracking & reminders',
  'GSTR-ready exports for your CA',
];

export function AuthShell({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: ReactNode; footer: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: form */}
      <div className="relative flex flex-col px-6 py-7 sm:px-12">
        {/* faint ambient wash */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-brand-200/30 blur-[110px]" />
        <div className="relative flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <path d="M9 11.5L16 16L9 20.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23 11.5L16 16L23 20.5" stroke="#6ee7b7" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="font-semibold text-ink tracking-tight">Crossbill</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>

        <div className="relative flex-1 flex flex-col justify-center max-w-sm w-full mx-auto py-10">
          <span className="badge bg-brand-50 text-brand-700 mb-4 self-start"><Sparkles className="h-3.5 w-3.5" /> Free to start</span>
          <h1 className="text-[1.7rem] font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <div className="mt-6 text-sm text-ink-muted text-center">{footer}</div>
        </div>

        <p className="relative text-center text-xs text-ink-faint">Built by Anujali Technologies · Made in India 🇮🇳</p>
      </div>

      {/* Right: brand showpiece */}
      <div className="relative hidden lg:flex flex-col justify-center overflow-hidden bg-ink px-12 bg-noise">
        <Aurora className="opacity-80" />
        <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-[0.12]" />
        <div className="absolute inset-0 spotlight" />

        <div className="relative max-w-md">
          <span className="glow-chip"><ShieldCheck className="h-3.5 w-3.5 text-brand-300" /> Export-compliant invoicing</span>
          <blockquote className="mt-6 text-[2rem] font-semibold text-white leading-[1.15] tracking-tight">
            Invoice anyone, anywhere, and stay
            <span className="text-gradient-vivid animate-gradient-x"> compliant</span> — in under a minute.
          </blockquote>

          <ul className="mt-8 space-y-3.5">
            {FEATURES.map((t) => (
              <li key={t} className="flex items-center gap-3 text-white/80">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500/20 text-brand-300 ring-1 ring-brand-400/20"><Check className="h-3.5 w-3.5" /></span>
                {t}
              </li>
            ))}
          </ul>

          {/* mini stats */}
          <div className="mt-9 grid grid-cols-3 gap-3">
            {[['60s', 'to a compliant invoice'], ['2-in-1', 'export + domestic'], ['0%', 'IGST on exports']].map(([v, l]) => (
              <div key={l} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-xl font-semibold text-gradient-vivid tabular-nums">{v}</p>
                <p className="mt-0.5 text-[11px] text-white/45 leading-tight">{l}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 text-xs text-white/45">
            <span className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</span>
            <span>Loved by Indian devs &amp; agencies</span>
          </div>
        </div>
      </div>
    </div>
  );
}
