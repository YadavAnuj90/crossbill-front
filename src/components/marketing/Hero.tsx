'use client';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Star, Sparkles, Globe, CalendarClock, Coins } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      {/* Background: soft grid + glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-[0.5]" />
        <div className="absolute left-1/2 top-0 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand-300/25 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-5xl px-5 text-center">
        <Reveal>
          <a href="#features" className="group inline-flex items-center gap-2 rounded-full border border-paper-border bg-white/80 backdrop-blur px-3.5 py-1.5 text-xs font-medium text-ink-soft shadow-sm">
            <span className="badge bg-brand-50 text-brand-700 -ml-1.5"><Sparkles className="h-3 w-3" /> New</span>
            Updated for the Finance Act 2026
            <ArrowRight className="h-3.5 w-3.5 text-ink-faint transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 text-[2.6rem] sm:text-6xl font-semibold tracking-tight leading-[1.05] text-ink">
            Invoice foreign clients
            <br className="hidden sm:block" />{' '}
            <span className="text-gradient-brand animate-gradient-x">correctly &amp; compliantly</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted leading-relaxed">
            The dead-simple layer between “I did the work and got paid in USD” and “my GST &amp; FEMA
            paperwork is clean and audit-ready.” Built for Indian developers and agencies — in under a minute.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="btn-primary px-6 py-3.5 text-[15px]">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="btn-secondary px-6 py-3.5 text-[15px]">See how it works</a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-ink-faint">
            <span className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
            </span>
            <span>Loved by Indian devs &amp; agencies · No card required</span>
          </div>
        </Reveal>
      </div>

      {/* Floating product mock */}
      <Reveal delay={300} className="mx-auto mt-16 max-w-4xl px-5">
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-brand-400/30 to-emerald-300/10 blur-2xl" />
          <div className="card overflow-hidden shadow-glow ring-1 ring-black/5">
            <div className="flex items-center gap-1.5 border-b border-paper-border bg-paper/60 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-300" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-brand-300" />
              <span className="ml-3 text-xs text-ink-faint font-mono">CB/2026-27/0001 · Export invoice</span>
            </div>
            <div className="grid gap-6 p-6 sm:grid-cols-2">
              <div className="space-y-3.5">
                {[
                  { icon: ShieldCheck, l: 'Export declaration', v: 'Under LUT, without payment of IGST' },
                  { icon: Globe, l: 'Place of supply', v: 'Outside India (export of services)' },
                  { icon: Coins, l: 'SAC code', v: '998314 · IT design & development' },
                ].map((r) => (
                  <div key={r.l} className="flex items-start gap-2.5">
                    <r.icon className="mt-0.5 h-4 w-4 text-brand-600" />
                    <div><p className="text-[11px] text-ink-faint">{r.l}</p><p className="text-sm text-ink-soft">{r.v}</p></div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-paper-border bg-paper/50 p-4 space-y-2.5">
                <div className="flex justify-between text-sm"><span className="text-ink-muted">Amount</span><span className="font-medium">USD 1,000.00</span></div>
                <div className="flex justify-between text-sm"><span className="text-ink-muted">FX (CBIC)</span><span className="font-mono text-ink-soft">83.50</span></div>
                <div className="flex justify-between border-t border-paper-border pt-2.5"><span className="text-ink-muted">INR equivalent</span><span className="font-semibold text-ink">₹83,500.00</span></div>
                <div className="flex items-center gap-2 rounded-lg bg-brand-50 px-2.5 py-2 text-xs text-brand-700">
                  <CalendarClock className="h-3.5 w-3.5" /> FEMA realisation due 02 Jun 2027
                </div>
              </div>
            </div>
          </div>
          {/* floating chips */}
          <div className="absolute -left-6 top-16 hidden lg:flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-lift ring-1 ring-black/5 animate-float">
            <ShieldCheck className="h-4 w-4 text-brand-600" /><span className="text-xs font-medium">Auto-compliant</span>
          </div>
          <div className="absolute -right-6 bottom-16 hidden lg:flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-lift ring-1 ring-black/5 animate-float-slow">
            <CalendarClock className="h-4 w-4 text-amber-500" /><span className="text-xs font-medium">FEMA tracked</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
