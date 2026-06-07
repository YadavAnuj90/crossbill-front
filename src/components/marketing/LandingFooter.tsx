'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Github, Twitter, Linkedin, ShieldCheck, MapPin, Mail } from 'lucide-react';

const COLS: { h: string; items: [string, string][] }[] = [
  { h: 'Product', items: [['Features', '/features'], ['How it works', '/how-it-works'], ['Pricing', '/#pricing']] },
  { h: 'Company', items: [['About', '/about'], ['Blog', '#'], ['Contact', '/contact']] },
  { h: 'Legal', items: [['Privacy', '/privacy'], ['Terms', '/terms'], ['Compliance', '/compliance']] },
];

export function LandingFooter() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
      <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-brand-500/20 blur-[110px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 pt-12 pb-6">
        {/* Top: brand + links + newsletter */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr_1.1fr]">
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
              Invoicing &amp; GST/FEMA compliance for Indian devs and agencies — foreign clients in USD,
              Indian clients in INR.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/65 hover:text-white hover:bg-white/10 transition" aria-label="social">
                  <Icon className="h-4 w-4" />
                </a>
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
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-500/15 border border-brand-400/30 px-3 py-2 text-sm text-brand-200">
                <ShieldCheck className="h-4 w-4" /> You're on the list!
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setDone(true); }} className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com"
                    className="w-full rounded-lg border border-white/15 bg-white/5 pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-400/60 focus:bg-white/10 outline-none transition" />
                </div>
                <button type="submit" className="btn-primary px-3.5 py-2 text-sm shrink-0"><ArrowRight className="h-4 w-4" /></button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-white/10 text-xs text-white/45">
          <div className="flex items-center gap-4">
            <span>© {year} Anujali Technologies Pvt. Ltd.</span>
            <span className="hidden sm:inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Made in India 🇮🇳</span>
          </div>
          <span className="inline-flex items-center gap-2 text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            All systems operational
          </span>
        </div>
      </div>

      {/* Slim gradient wordmark accent (clipped, compact) */}
      <div aria-hidden className="relative h-10 sm:h-14 overflow-hidden select-none pointer-events-none">
        <p className="absolute inset-x-0 -bottom-[2.2vw] text-center font-semibold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.06] to-transparent text-[13vw]">
          Crossbill
        </p>
      </div>
    </footer>
  );
}
