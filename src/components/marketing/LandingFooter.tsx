'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowUp, Github, Twitter, Linkedin, ShieldCheck, MapPin, Mail, Sparkles, Check,
} from 'lucide-react';
import { LogoMark } from '@/components/brand/Logo';

const COLS: { h: string; items: [string, string][] }[] = [
  { h: 'Platform', items: [['Invoicing', '/features'], ['Payments', '/features'], ['e-Invoicing', '/features'], ['Purchases', '/features']] },
  { h: 'People & HR', items: [['Employees', '/features'], ['Payroll', '/features'], ['Attendance', '/features'], ['Self-service', '/register']] },
  { h: 'Company', items: [['About', '/about'], ['How it works', '/how-it-works'], ['Contact', '/contact'], ['Blog', '/blog']] },
  { h: 'Legal', items: [['Privacy', '/privacy'], ['Terms', '/terms'], ['Compliance', '/compliance']] },
];

const TRUST = ['GST & FEMA', 'DPDP-ready', 'Encrypted'];

const SOCIALS: { icon: typeof Twitter; label: string }[] = [
  { icon: Twitter, label: 'X' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Github, label: 'GitHub' },
];

export function LandingFooter() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-[#070b12] text-white">
      {/* top gradient hairline + ambient glows */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-400/70 to-transparent" />
      <div className="pointer-events-none absolute -top-32 right-[8%] h-96 w-96 rounded-full bg-brand-500/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05] [mask-image:radial-gradient(120%_80%_at_50%_0%,#000,transparent_75%)]" />

      <div className="relative mx-auto max-w-6xl px-5 pt-10 pb-4">
        {/* CTA band */}
        <div className="mb-12 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-brand-500/[0.14] via-white/[0.03] to-cyan-500/[0.1] p-6 sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-300"><Sparkles className="h-3.5 w-3.5" /> Get started in a minute</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Invoice the <span className="bg-gradient-to-r from-brand-300 to-cyan-300 bg-clip-text text-transparent">right way</span>, today.
              </h3>
              <p className="mt-1.5 text-sm text-white/50">Free to start · no card required · compliant from your very first invoice.</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-[#070b12] transition-transform hover:-translate-y-0.5">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10">
                Talk to us
              </Link>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-10 border-b border-white/[0.08] pb-10 lg:grid-cols-[1fr_2.2fr_1.15fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <LogoMark className="h-7 w-auto" />
              <span className="text-[1.05rem] font-semibold tracking-[-0.03em] text-white">Cross<span className="text-brand-400">bill</span></span>
            </Link>
            <p className="mt-3 max-w-xs text-[15px] font-semibold leading-snug text-white/85">
              Bill the world. Run your team. <span className="bg-gradient-to-r from-brand-300 to-cyan-300 bg-clip-text text-transparent">Stay compliant.</span>
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/45">
              One login for cross-border invoicing, GST &amp; FEMA, payroll and your whole team.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {TRUST.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70">
                  <Check className="h-3 w-3 text-brand-300" /> {t}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-white/[0.08] hover:text-white">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
            {COLS.map((c) => (
              <div key={c.h}>
                <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">{c.h}</p>
                <ul className="space-y-2.5">
                  {c.items.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="group inline-flex items-center whitespace-nowrap text-sm text-white/60 transition-colors hover:text-white">
                        <span className="mr-0 h-px w-0 bg-brand-400 transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-sm font-semibold text-white">Stay compliant, effortlessly</p>
            <p className="mt-1 text-xs text-white/45">GST, FEMA &amp; ITC updates + product news. No spam.</p>
            {done ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-brand-400/25 bg-brand-500/15 px-3.5 py-2.5 text-sm text-brand-300"><ShieldCheck className="h-4 w-4" /> You&apos;re on the list!</div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setDone(true); }} className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-brand-400/50 focus:bg-white/[0.07]" />
                </div>
                <button type="submit" aria-label="Subscribe" className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-emerald-600 text-[#04150f] transition-transform hover:-translate-y-0.5"><ArrowRight className="h-4 w-4" /></button>
              </form>
            )}
            <p className="mt-4 text-xs text-white/40">Trusted by exporters, agencies &amp; CAs across India.</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 pt-2 text-xs text-white/40 sm:flex-row">
          <div className="flex items-center gap-4">
            <span>© {year} Anujali Technologies Pvt. Ltd.</span>
            <span className="hidden items-center gap-1.5 sm:inline-flex"><MapPin className="h-3.5 w-3.5" /> Made in India 🇮🇳</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 text-white/60">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" /></span>
              All systems operational
            </span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
              className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition hover:-translate-y-0.5 hover:border-brand-400/40 hover:text-white"><ArrowUp className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>

      {/* Giant gradient wordmark — a subtle brand signature */}
      <div aria-hidden className="relative h-[7vw] select-none overflow-hidden">
        <p className="absolute inset-x-0 -bottom-[2.2vw] bg-gradient-to-b from-white/[0.06] to-transparent bg-clip-text text-center text-[15vw] font-bold leading-none tracking-tighter text-transparent">Crossbill</p>
      </div>
    </footer>
  );
}
