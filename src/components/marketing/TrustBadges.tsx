'use client';
import { ShieldCheck, Lock, FileCheck2, ScrollText, Hash, MapPin } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

const BADGES = [
  { icon: ShieldCheck, label: 'GST & FEMA compliant', sub: 'Export + domestic, by design' },
  { icon: FileCheck2, label: 'DPDP-ready', sub: 'Consent register built in' },
  { icon: Lock, label: 'Encrypted', sub: 'In transit & at rest' },
  { icon: ScrollText, label: 'Tamper-evident audit', sub: 'Every action logged' },
  { icon: Hash, label: 'Gapless FY numbering', sub: 'No missing invoice numbers' },
  { icon: MapPin, label: 'Made in India', sub: 'GSTIN · SAC/HSN · RBI codes' },
];

export function TrustBadges() {
  return (
    <section className="relative border-y border-black/[0.05] bg-paper-card/40 py-8 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Compliance &amp; security, built in — not bolted on
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
            {BADGES.map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 text-center">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-200/70 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-400/25">
                  <b.icon className="h-5 w-5" />
                </span>
                <span className="text-[13px] font-semibold text-ink leading-tight">{b.label}</span>
                <span className="text-[11px] text-ink-muted leading-tight">{b.sub}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
