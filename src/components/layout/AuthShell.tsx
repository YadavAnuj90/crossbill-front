import Link from 'next/link';
import { ReactNode } from 'react';
import { ShieldCheck, Check, ArrowLeft, Star, Sparkles } from 'lucide-react';
import { LogoMark } from '@/components/brand/Logo';

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
            <LogoMark className="h-7 w-auto" />
            <span className="font-semibold text-ink text-[1.05rem] tracking-[-0.03em]">Cross<span className="text-brand-600">bill</span></span>
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

      {/* Right: brand showpiece — airy periwinkle sky */}
      <div className="relative hidden lg:flex flex-col justify-center overflow-hidden px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c8cdf4] via-[#a9b4ee] to-[#8e9cea]" />
        <div className="absolute left-1/3 top-1/4 h-[34rem] w-[40rem] -translate-x-1/2 rounded-full bg-[#e7eafb]/70 blur-[130px]" />
        <div className="absolute -right-16 bottom-10 h-[26rem] w-[28rem] rounded-full bg-[#7c8bff]/40 blur-[140px]" />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-[0.05]" />

        <div className="relative max-w-md">
          <span className="chip-soft"><ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> Export-compliant invoicing</span>
          <blockquote className="mt-6 text-[2rem] font-semibold text-[#11131c] leading-[1.15] tracking-tight">
            Invoice anyone, anywhere, and stay
            <span className="text-gradient-brand"> compliant</span> — in under a minute.
          </blockquote>

          <ul className="mt-8 space-y-3.5">
            {FEATURES.map((t) => (
              <li key={t} className="flex items-center gap-3 text-[#2a2d3d]/85 font-medium">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-brand-600 ring-1 ring-brand-200 shadow-sm"><Check className="h-3.5 w-3.5" /></span>
                {t}
              </li>
            ))}
          </ul>

          {/* mini stats */}
          <div className="mt-9 grid grid-cols-3 gap-3">
            {[['60s', 'to a compliant invoice'], ['2-in-1', 'export + domestic'], ['0%', 'IGST on exports']].map(([v, l]) => (
              <div key={l} className="rounded-2xl border border-black/[0.06] bg-white/80 px-3 py-3 shadow-card backdrop-blur-sm">
                <p className="text-xl font-semibold text-gradient-brand tabular-nums">{v}</p>
                <p className="mt-0.5 text-[11px] text-ink-muted leading-tight">{l}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 text-xs text-[#2a2d3d]/70">
            <span className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</span>
            <span>Loved by Indian devs &amp; agencies</span>
          </div>
        </div>
      </div>
    </div>
  );
}
