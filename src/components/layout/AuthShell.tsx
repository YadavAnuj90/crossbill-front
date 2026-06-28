import Link from 'next/link';
import { ReactNode } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { LogoMark } from '@/components/brand/Logo';
import { AuthShowcase } from '@/components/layout/AuthShowcase';

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

        <AuthShowcase />
      </div>
    </div>
  );
}
