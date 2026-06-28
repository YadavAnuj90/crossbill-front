'use client';
import { useEffect, useState } from 'react';
import { Check, ShieldCheck, Wallet, FileSignature, Users, Star, Sparkles } from 'lucide-react';
import type { ComponentType } from 'react';
import { cn } from '@/lib/cn';

type Slide = {
  icon: ComponentType<{ className?: string }>;
  chip: string;
  isNew?: boolean;
  head: [string, string, string]; // before · highlight · after
  features: string[];
  stats: [string, string][];
};

const SLIDES: Slide[] = [
  {
    icon: ShieldCheck, chip: 'Export-compliant invoicing',
    head: ['Invoice anyone, anywhere, and stay ', 'compliant', ' — in under a minute.'],
    features: [
      'Auto-filled GST & FEMA compliance',
      'Export + domestic invoicing in one app',
      'FEMA realisation tracking & reminders',
      'GSTR-ready exports for your CA',
    ],
    stats: [['60s', 'to a compliant invoice'], ['2-in-1', 'export + domestic'], ['0%', 'IGST on exports']],
  },
  {
    icon: Wallet, chip: 'Get paid faster',
    head: ['Send a link, get ', 'paid', ', let it reconcile itself.'],
    features: [
      'Razorpay pay links on any invoice',
      'Auto-reconciliation via verified webhooks',
      'UPI, cards & netbanking built in',
      'Subscription billing, fully handled',
    ],
    stats: [['1-tap', 'payment links'], ['Auto', 'reconciliation'], ['UPI', '+ cards']],
  },
  {
    icon: FileSignature, chip: 'Agreements & eSign',
    head: ['Sign, ', 'verify', ', and never lose a contract.'],
    features: [
      'Native eSign with tamper-evident audit trail',
      'Geofencing + selfie fraud checks',
      'Public verifier for any signed document',
      'Renewal reminders & obligation tracking',
    ],
    stats: [['OTP', 'verified signing'], ['Geo', '+ selfie proof'], ['1-click', 'verify']],
  },
  {
    icon: Users, chip: 'People & HR', isNew: true,
    head: ['Run your ', 'team', ', not just your billing.'],
    features: [
      'Employee records, attendance & leave',
      'Payroll with watermarked salary slips',
      'Offer, experience & relieving letters',
      'Aadhaar-verified onboarding',
    ],
    stats: [['Payroll', 'in a click'], ['Letters', 'eSigned'], ['Aadhaar', 'verified']],
  },
];

const ROTATE_MS = 2000;

export function AuthShowcase() {
  const [idx, setIdx] = useState(0);

  // Always auto-advance, ad-style. One stable interval; functional update keeps it
  // independent of the current index so it never stalls.
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const s = SLIDES[idx];

  return (
    <div className="relative max-w-md">
      {/* slide content (re-keyed so it re-animates on change) */}
      <div key={idx} className="animate-pop-in">
        <span className="chip-soft">
          {s.isNew
            ? <><Sparkles className="h-3.5 w-3.5 text-brand-600" /> New · {s.chip}</>
            : <><s.icon className="h-3.5 w-3.5 text-brand-600" /> {s.chip}</>}
        </span>

        <blockquote className="mt-6 text-[2rem] font-semibold text-[#11131c] leading-[1.15] tracking-tight">
          {s.head[0]}<span className="text-gradient-brand">{s.head[1]}</span>{s.head[2]}
        </blockquote>

        <ul className="mt-8 space-y-3.5">
          {s.features.map((t) => (
            <li key={t} className="flex items-center gap-3 text-[#2a2d3d]/85 font-medium">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-paper-card text-brand-600 ring-1 ring-brand-200 shadow-sm"><Check className="h-3.5 w-3.5" /></span>
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-9 grid grid-cols-3 gap-3">
          {s.stats.map(([v, l]) => (
            <div key={l} className="rounded-2xl border border-black/[0.06] bg-paper-card/80 px-3 py-3 shadow-card backdrop-blur-sm">
              <p className="text-xl font-semibold text-gradient-brand tabular-nums">{v}</p>
              <p className="mt-0.5 text-[11px] text-ink-muted leading-tight">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* controls */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[#2a2d3d]/70">
          <span className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</span>
          <span>Loved by Indian devs &amp; agencies</span>
        </div>

        {/* progress dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              className={cn('h-1.5 rounded-full transition-all duration-300', i === idx ? 'w-7 bg-[#11131c]/70' : 'w-1.5 bg-[#11131c]/25 hover:bg-[#11131c]/45')}
            >
              {i === idx && (
                <span key={idx} className="block h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-600 animate-cb-progress" style={{ animationDuration: `${ROTATE_MS}ms` }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
