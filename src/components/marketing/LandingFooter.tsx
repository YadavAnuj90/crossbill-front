'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowUp, Github, Twitter, Linkedin, ShieldCheck, MapPin, Mail, Sparkles, Check,
} from 'lucide-react';
import { LogoMark } from '@/components/brand/Logo';

const COLS: { h: string; items: [string, string][] }[] = [
  { h: 'Product', items: [['Features', '/features'], ['How it works', '/how-it-works'], ['Pricing', '/#pricing']] },
  { h: 'Company', items: [['About', '/about'], ['Blog', '#'], ['Contact', '/contact']] },
  { h: 'Legal', items: [['Privacy', '/privacy'], ['Terms', '/terms'], ['Compliance', '/compliance']] },
];

const TRUST = ['GST & FEMA', 'DPDP', 'Encrypted'];

const SOCIALS: { icon: typeof Twitter; label: string; hover: string }[] = [
  { icon: Twitter, label: 'X', hover: 'hover:text-sky-500 hover:border-sky-400/50' },
  { icon: Linkedin, label: 'LinkedIn', hover: 'hover:text-blue-600 hover:border-blue-400/50' },
  { icon: Github, label: 'GitHub', hover: 'hover:text-ink hover:border-ink/30' },
];

export function LandingFooter() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <footer className="relative overflow-hidden border-t border-black/[0.06] bg-white/70 text-ink backdrop-blur-xl">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />
      <div className="absolute -top-28 right-10 h-80 w-80 rounded-full bg-brand-300/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-[#bcc6ff]/30 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 pt-7 pb-3">
        {/* CTA band */}
        <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50/70 px-5 py-3.5 sm:px-7 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-card">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700"><Sparkles className="h-3.5 w-3.5" /> Get started in a minute</p>
            <h3 className="mt-1 text-lg sm:text-xl font-semibold tracking-tight text-ink">Invoice the <span className="text-gradient-brand">right way</span>, today.</h3>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/register" className="btn-primary px-5 py-3 text-[15px]">Start free <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/contact" className="btn-secondary px-5 py-3 text-[15px]">Talk to us</Link>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr_1.1fr] pb-5 border-b border-black/[0.06]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <LogoMark className="h-7 w-auto" />
              <span className="font-semibold text-ink text-[1.05rem] tracking-[-0.03em]">Cross<span className="text-brand-600">bill</span></span>
            </Link>
            <p className="mt-2.5 text-sm text-ink-muted leading-snug max-w-xs">
              Invoicing &amp; GST/FEMA compliance — foreign clients in USD, Indian clients in INR.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {TRUST.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full border border-black/[0.06] bg-white px-2 py-1 text-[11px] text-ink-muted shadow-sm">
                  <Check className="h-3 w-3 text-brand-600" /> {t}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, label, hover }) => (
                <a key={label} href="#" aria-label={label} className={`grid h-8 w-8 place-items-center rounded-lg border border-black/[0.06] bg-white text-ink-muted shadow-sm transition ${hover}`}><Icon className="h-4 w-4" /></a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-3 gap-6">
            {COLS.map((c) => (
              <div key={c.h}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint mb-3">{c.h}</p>
                <ul className="space-y-2.5">
                  {c.items.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="group inline-flex items-center text-sm text-ink-muted hover:text-ink transition-colors">
                        <span className="h-px w-0 bg-brand-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300" />
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
            <p className="text-sm font-medium text-ink">Stay compliant, effortlessly</p>
            <p className="mt-1 text-xs text-ink-faint">GST &amp; FEMA updates &amp; product news. No spam.</p>
            {done ? (
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-50 border border-brand-200 px-3 py-2 text-sm text-brand-700"><ShieldCheck className="h-4 w-4" /> You're on the list!</div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setDone(true); }} className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com"
                    className="w-full rounded-lg border border-paper-border bg-white pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand-400 focus:shadow-focus outline-none transition" />
                </div>
                <button type="submit" aria-label="Subscribe" className="btn-primary px-3.5 py-2 text-sm shrink-0"><ArrowRight className="h-4 w-4" /></button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-black/[0.06] text-xs text-ink-faint">
          <div className="flex items-center gap-4">
            <span>© {year} Anujali Technologies Pvt. Ltd.</span>
            <span className="hidden sm:inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Made in India 🇮🇳</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 text-ink-muted">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" /></span>
              All systems operational
            </span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
              className="grid h-7 w-7 place-items-center rounded-lg border border-black/[0.06] bg-white text-ink-muted shadow-sm hover:text-ink hover:border-ink/20 transition"><ArrowUp className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>

      {/* Giant gradient wordmark */}
      <div aria-hidden className="relative h-5 sm:h-7 overflow-hidden select-none pointer-events-none">
        <p className="absolute inset-x-0 -bottom-[1.5vw] text-center font-semibold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-ink/[0.08] to-transparent text-[10vw]">Crossbill</p>
      </div>
    </footer>
  );
}
