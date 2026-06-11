'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowUp, Github, Twitter, Linkedin, ShieldCheck, MapPin, Mail, Sparkles, Check,
} from 'lucide-react';

const COLS: { h: string; items: [string, string][] }[] = [
  { h: 'Product', items: [['Features', '/features'], ['How it works', '/how-it-works'], ['Pricing', '/#pricing']] },
  { h: 'Company', items: [['About', '/about'], ['Blog', '#'], ['Contact', '/contact']] },
  { h: 'Legal', items: [['Privacy', '/privacy'], ['Terms', '/terms'], ['Compliance', '/compliance']] },
];

const TRUST = ['GST & FEMA ready', 'DPDP-aligned', 'Encrypted'];

const SOCIALS: { icon: typeof Twitter; label: string; hover: string }[] = [
  { icon: Twitter, label: 'X', hover: 'hover:text-sky-400 hover:border-sky-400/40' },
  { icon: Linkedin, label: 'LinkedIn', hover: 'hover:text-blue-400 hover:border-blue-400/40' },
  { icon: Github, label: 'GitHub', hover: 'hover:text-white hover:border-white/40' },
];

export function LandingFooter() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-ink text-white bg-noise">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
      <div className="absolute -top-28 right-10 h-80 w-80 rounded-full bg-brand-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 pt-10 pb-5">
        {/* CTA band */}
        <div className="gborder shadow-glow mb-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#0f1620] to-ink px-5 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-300"><Sparkles className="h-3.5 w-3.5" /> Get started in a minute</p>
              <h3 className="mt-1.5 text-xl sm:text-2xl font-semibold tracking-tight">Invoice the <span className="text-gradient-vivid animate-gradient-x">right way</span>, today.</h3>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/register" className="btn-primary px-5 py-3 text-[15px] shadow-glow">Start free <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/contact" className="btn-glass px-5 py-3 text-[15px]">Talk to us</Link>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr_1.1fr] pb-8 border-b border-white/10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow">
                <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                  <path d="M9 11.5L16 16L9 20.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M23 11.5L16 16L23 20.5" stroke="#a7f3d0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="font-semibold tracking-tight">Crossbill</span>
            </Link>
            <p className="mt-3 text-sm text-white/55 leading-relaxed max-w-xs">
              Invoicing &amp; GST/FEMA compliance for Indian devs and agencies — foreign clients in USD, Indian clients in INR.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {TRUST.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/60">
                  <Check className="h-3 w-3 text-brand-300" /> {t}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, label, hover }) => (
                <a key={label} href="#" aria-label={label} className={`grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/65 transition ${hover}`}><Icon className="h-4 w-4" /></a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-3 gap-6">
            {COLS.map((c) => (
              <div key={c.h}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40 mb-3">{c.h}</p>
                <ul className="space-y-2.5">
                  {c.items.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="group inline-flex items-center text-sm text-white/65 hover:text-white transition-colors">
                        <span className="h-px w-0 bg-brand-400 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300" />
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
            <p className="text-sm font-medium text-white/90">Stay compliant, effortlessly</p>
            <p className="mt-1 text-xs text-white/45">GST &amp; FEMA updates &amp; product news. No spam.</p>
            {done ? (
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-500/15 border border-brand-400/30 px-3 py-2 text-sm text-brand-200"><ShieldCheck className="h-4 w-4" /> You're on the list!</div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setDone(true); }} className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com"
                    className="w-full rounded-lg border border-white/15 bg-white/5 pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-400/60 focus:bg-white/10 outline-none transition" />
                </div>
                <button type="submit" aria-label="Subscribe" className="btn-primary px-3.5 py-2 text-sm shrink-0"><ArrowRight className="h-4 w-4" /></button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs text-white/45">
          <div className="flex items-center gap-4">
            <span>© {year} Anujali Technologies Pvt. Ltd.</span>
            <span className="hidden sm:inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Made in India 🇮🇳</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 text-white/60">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" /></span>
              All systems operational
            </span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
              className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30 transition"><ArrowUp className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>

      {/* Giant gradient wordmark */}
      <div aria-hidden className="relative h-8 sm:h-12 overflow-hidden select-none pointer-events-none">
        <p className="absolute inset-x-0 -bottom-[2.2vw] text-center font-semibold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.08] to-transparent text-[13vw]">Crossbill</p>
      </div>
    </footer>
  );
}
