'use client';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Star, Sparkles, Globe, CalendarClock, Coins, Building2 } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { Aurora } from '@/components/motion/Aurora';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white bg-noise">
      <Aurora className="opacity-80" />
      <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-[0.18]" />
      <div className="absolute inset-0 spotlight" />

      <div className="relative mx-auto max-w-5xl px-5 pt-36 pb-24 text-center">
        <Reveal>
          <a href="#features" className="glow-chip group">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" />
            Now with domestic GST invoicing
            <ArrowRight className="h-3.5 w-3.5 text-white/50 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-7 text-[2.7rem] sm:text-[4.2rem] font-semibold tracking-tight leading-[1.04]">
            Invoice foreign &amp; Indian clients
            <br className="hidden sm:block" />{' '}
            <span className="text-gradient-vivid animate-gradient-x">correctly &amp; compliantly</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 leading-relaxed">
            One app for every invoice you raise — export billing in USD with FEMA &amp; LUT handled, and
            domestic GST invoices with CGST/SGST/IGST computed automatically. Built for Indian developers and agencies.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="btn-primary px-6 py-3.5 text-[15px] shadow-glow">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="btn-glass px-6 py-3.5 text-[15px]">See how it works</a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-white/45">
            <span className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</span>
            <span>Loved by Indian devs &amp; agencies · No card required</span>
          </div>
        </Reveal>
      </div>

      {/* Floating product mock with animated gradient border */}
      <Reveal delay={300} className="relative mx-auto max-w-4xl px-5 pb-28">
        <div className="gborder shadow-glow">
          <div className="overflow-hidden bg-[#0f1620]">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-brand-400/80" />
              <span className="ml-3 text-xs text-white/40 font-mono">CB/2026-27/0001 · Export invoice</span>
              <span className="ml-auto glow-chip !py-1 !text-[10px]"><Globe className="h-3 w-3 text-brand-300" /> 0% IGST</span>
            </div>
            <div className="grid gap-6 p-6 sm:grid-cols-2">
              <div className="space-y-3.5">
                {[
                  { icon: ShieldCheck, l: 'Export declaration', v: 'Under LUT, without payment of IGST' },
                  { icon: Globe, l: 'Place of supply', v: 'Outside India (export of services)' },
                  { icon: Building2, l: 'Or domestic', v: 'CGST/SGST/IGST auto-computed' },
                ].map((r) => (
                  <div key={r.l} className="flex items-start gap-2.5">
                    <r.icon className="mt-0.5 h-4 w-4 text-brand-300" />
                    <div><p className="text-[11px] text-white/40">{r.l}</p><p className="text-sm text-white/80">{r.v}</p></div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2.5">
                <div className="flex justify-between text-sm"><span className="text-white/50">Amount</span><span className="font-medium">USD 1,000.00</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/50">FX (CBIC)</span><span className="font-mono text-white/70">83.50</span></div>
                <div className="flex justify-between border-t border-white/10 pt-2.5"><span className="text-white/50">INR equivalent</span><span className="font-semibold text-white">₹83,500.00</span></div>
                <div className="flex items-center gap-2 rounded-lg bg-brand-500/15 border border-brand-400/20 px-2.5 py-2 text-xs text-brand-200">
                  <CalendarClock className="h-3.5 w-3.5" /> FEMA realisation due 02 Jun 2027
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* floating chips */}
        <div className="absolute -left-5 top-20 hidden lg:flex glow-chip animate-float text-white"><ShieldCheck className="h-4 w-4 text-brand-300" /> Auto-compliant</div>
        <div className="absolute -right-5 bottom-10 hidden lg:flex glow-chip animate-float-slow text-white"><Coins className="h-4 w-4 text-cyan-300" /> GST &amp; FEMA</div>
      </Reveal>

    </section>
  );
}
