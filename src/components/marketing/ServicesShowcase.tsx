'use client';
import { useEffect, useState } from 'react';
import {
  FileText, ScrollText, CalendarClock, FileBarChart, Coins,
  Wallet, RefreshCcw, CreditCard,
  FileSignature, LayoutTemplate, ListChecks, PenLine,
  ShieldCheck, ScanFace, MapPin, Stamp,
  MessageCircle, Blocks, BadgeCheck, QrCode, ArrowUpRight,
  Users, CalendarCheck, Receipt, ClipboardList,
} from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { StagePreview } from '@/components/marketing/StagePreview';
import { cn } from '@/lib/cn';

type Tone = 'brand' | 'blue' | 'violet' | 'amber' | 'cyan' | 'rose';

const TONE: Record<Tone, { tab: string; stage: string; tile: string; soft: string; ring: string }> = {
  brand:  { tab: 'from-brand-500 to-emerald-600',  stage: 'from-brand-500 via-brand-600 to-emerald-700 dark:from-emerald-500 dark:via-emerald-600 dark:to-emerald-700',   tile: 'from-brand-400 to-brand-600',   soft: 'bg-brand-50 dark:bg-brand-500/15',  ring: 'ring-brand-200 dark:ring-brand-400/25' },
  blue:   { tab: 'from-blue-500 to-indigo-600',    stage: 'from-blue-600 via-indigo-600 to-indigo-800',    tile: 'from-blue-500 to-indigo-600',   soft: 'bg-blue-50 dark:bg-blue-500/15',   ring: 'ring-blue-200 dark:ring-blue-400/25' },
  violet: { tab: 'from-violet-500 to-purple-600',  stage: 'from-violet-600 via-purple-600 to-purple-800',  tile: 'from-violet-500 to-purple-600', soft: 'bg-violet-50 dark:bg-violet-500/15', ring: 'ring-violet-200 dark:ring-violet-400/25' },
  amber:  { tab: 'from-amber-500 to-orange-600',   stage: 'from-amber-500 via-orange-500 to-orange-700',   tile: 'from-amber-500 to-orange-600',  soft: 'bg-amber-50 dark:bg-amber-500/15',  ring: 'ring-amber-200 dark:ring-amber-400/25' },
  cyan:   { tab: 'from-cyan-500 to-teal-600',      stage: 'from-cyan-600 via-teal-600 to-teal-800',        tile: 'from-cyan-500 to-teal-600',     soft: 'bg-cyan-50 dark:bg-cyan-500/15',   ring: 'ring-cyan-200 dark:ring-cyan-400/25' },
  rose:   { tab: 'from-rose-500 to-pink-600',      stage: 'from-rose-600 via-pink-600 to-fuchsia-800',     tile: 'from-rose-500 to-pink-600',     soft: 'bg-rose-50 dark:bg-rose-500/15',   ring: 'ring-rose-200 dark:ring-rose-400/25' },
};

interface Service { icon: React.ReactNode; title: string; desc: string; soon?: boolean; isNew?: boolean; }
interface Group { label: string; short: string; tone: Tone; items: Service[]; }

const GROUPS: Group[] = [
  {
    label: 'Invoicing & compliance', short: 'Invoicing', tone: 'brand', items: [
      { icon: <FileText className="h-full w-full" />, title: 'Export & domestic invoicing', desc: 'One engine: LUT 0% IGST exports or CGST/SGST/IGST domestic — auto-computed on every invoice.' },
      { icon: <ScrollText className="h-full w-full" />, title: 'Credit & debit notes', desc: 'GST §34 notes with gapless numbering and a clean, compliant PDF every time.' },
      { icon: <CalendarClock className="h-full w-full" />, title: 'FEMA realisation tracker', desc: 'Watches unpaid exports against the 1-year deadline and nudges you at 9, 10 and 11 months.' },
      { icon: <FileBarChart className="h-full w-full" />, title: 'GSTR-1 & document bundle', desc: 'Filing-ready statements and a tidy ZIP your CA will love — one click.' },
      { icon: <Coins className="h-full w-full" />, title: 'Live FX rates', desc: 'ECB / CBIC reference rates captured automatically on every export invoice.' },
    ],
  },
  {
    label: 'Get paid', short: 'Payments', tone: 'blue', items: [
      { icon: <Wallet className="h-full w-full" />, title: 'Razorpay payment links', desc: 'Attach a secure pay link to any invoice — card, UPI and netbanking, instantly.' },
      { icon: <RefreshCcw className="h-full w-full" />, title: 'Auto-reconciliation', desc: 'Paid invoices mark themselves paid through verified webhooks — no manual matching.' },
      { icon: <CreditCard className="h-full w-full" />, title: 'Subscription billing', desc: 'Your own Crossbill plan, billed seamlessly through Razorpay.' },
    ],
  },
  {
    label: 'People & HR', short: 'HR', tone: 'rose', items: [
      { icon: <Users className="h-full w-full" />, title: 'Employee records', desc: 'A clean directory with roles, compensation and documents — the single source of truth for your team.', isNew: true },
      { icon: <CalendarCheck className="h-full w-full" />, title: 'Attendance & leave', desc: 'Daily attendance, monthly summaries and a leave workflow your managers actually use.', isNew: true },
      { icon: <Receipt className="h-full w-full" />, title: 'Payroll & salary slips', desc: 'Run payroll and generate watermarked, tamper-evident salary slips in a click.', isNew: true },
      { icon: <FileText className="h-full w-full" />, title: 'Offer, experience & relieving letters', desc: 'Branded HR letters generated from templates and eSigned — no Word docs.', isNew: true },
      { icon: <ClipboardList className="h-full w-full" />, title: 'Onboarding & exit', desc: 'Guided onboarding and exit checklists so nothing slips through the cracks.', isNew: true },
      { icon: <ScanFace className="h-full w-full" />, title: 'Aadhaar-verified onboarding', desc: 'Gate sensitive HR actions behind an Aadhaar OTP identity check.', isNew: true },
    ],
  },
  {
    label: 'Agreements & eSign', short: 'eSign', tone: 'violet', items: [
      { icon: <FileSignature className="h-full w-full" />, title: 'Native eSign + audit trail', desc: 'Email-OTP, drawn signature and a tamper-evident audit trail on every document.', isNew: true },
      { icon: <LayoutTemplate className="h-full w-full" />, title: 'Templates & bulk send', desc: 'Reusable templates with merge fields; send to many signers at once.', isNew: true },
      { icon: <ListChecks className="h-full w-full" />, title: 'Contract lifecycle', desc: 'Renewal reminders, obligations tracking and a searchable repository.', isNew: true },
      { icon: <PenLine className="h-full w-full" />, title: 'Aadhaar eSign / DSC', desc: 'Aadhaar-grade signing via a licensed GSP/ASP provider.', soon: true },
    ],
  },
  {
    label: 'Trust & security', short: 'Trust', tone: 'amber', items: [
      { icon: <MapPin className="h-full w-full" />, title: 'Geolocation & geofencing', desc: 'Flag signatures captured outside your allowed regions, automatically.', isNew: true },
      { icon: <ScanFace className="h-full w-full" />, title: 'Selfie & fraud checks', desc: 'Webcam selfie evidence with biometric Face Match ready to enable.', isNew: true },
      { icon: <BadgeCheck className="h-full w-full" />, title: 'Public eSign verifier', desc: 'Anyone can confirm a document is authentic by its verification code.', isNew: true },
      { icon: <ShieldCheck className="h-full w-full" />, title: 'DPDP consent register', desc: 'Record lawful basis and consent — fully audit-ready.' },
    ],
  },
  {
    label: 'Connect everything', short: 'Connect', tone: 'cyan', items: [
      { icon: <MessageCircle className="h-full w-full" />, title: 'WhatsApp delivery', desc: 'Share invoices, pay links and signing links over WhatsApp in a tap.' },
      { icon: <Stamp className="h-full w-full" />, title: 'Digital eStamping', desc: 'Pay state stamp duty and affix it to agreements without leaving Crossbill.', soon: true },
      { icon: <QrCode className="h-full w-full" />, title: 'e-Invoicing (IRN/QR)', desc: 'IRN registration and a signed QR for B2B invoices.', soon: true },
      { icon: <Blocks className="h-full w-full" />, title: 'Integrations', desc: 'Zoho Books, Tally, QuickBooks, Stripe, GST Portal and Email.', soon: true },
    ],
  },
];

export function ServicesShowcase() {
  const [tab, setTab] = useState(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const group = GROUPS[tab];
  const t = TONE[group.tone];
  const feature = group.items[active];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % group.items.length), 4200);
    return () => clearInterval(id);
  }, [tab, group.items.length, paused, active]);

  const selectTab = (i: number) => { setTab(i); setActive(0); };

  return (
    <section id="services" className="relative py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <span className="chip-soft mb-4">✨ Now with People &amp; HR</span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.02em] text-ink">One platform for billing, paperwork &amp; your team</h2>
          <p className="mt-3 text-ink-muted text-lg">From a compliant invoice to a signed contract to running payroll — Crossbill now covers the whole journey for Indian service businesses, people included.</p>
        </Reveal>

        {/* category tabs */}
        <Reveal delay={60}>
          <div className="mt-10 flex flex-wrap gap-2">
            {GROUPS.map((g, i) => (
              <button
                key={g.label}
                onClick={() => selectTab(i)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                  i === tab
                    ? cn('bg-gradient-to-r text-white shadow-sm', TONE[g.tone].tab)
                    : 'bg-paper-card text-ink-muted ring-1 ring-inset ring-black/[0.07] hover:text-ink hover:-translate-y-0.5 dark:bg-white/[0.04] dark:ring-white/[0.08]',
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* interactive showcase */}
        <Reveal delay={120}>
          <div
            className="mt-6 grid overflow-hidden rounded-3xl border border-black/[0.06] bg-paper-card shadow-card ring-1 ring-black/[0.02] lg:grid-cols-[0.92fr_1.08fr] dark:border-white/[0.08] dark:bg-white/[0.03] dark:ring-white/[0.04]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* left: feature list */}
            <div className="p-3 sm:p-4">
              {group.items.map((s, i) => {
                const on = i === active;
                return (
                  <button
                    key={s.title}
                    onClick={() => setActive(i)}
                    className={cn(
                      'group/item relative flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition-all duration-200',
                      on ? cn(t.soft, 'ring-1 ring-inset', t.ring) : 'hover:bg-paper',
                    )}
                  >
                    <span className={cn(
                      'grid h-10 w-10 shrink-0 place-items-center rounded-xl p-2.5 transition-all duration-300',
                      on ? cn('bg-gradient-to-br text-white shadow-sm', t.tile) : 'bg-paper text-ink-muted ring-1 ring-inset ring-black/[0.06] dark:bg-white/[0.04] dark:ring-white/[0.08] group-hover/item:scale-105',
                    )}>{s.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 font-semibold text-ink">
                        {s.title}
                        {s.isNew && <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-600 ring-1 ring-inset ring-emerald-500/30 dark:text-emerald-300">New</span>}
                        {s.soon && <span className="rounded-full bg-paper px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-ink-faint ring-1 ring-inset ring-black/[0.06] dark:bg-white/[0.06] dark:ring-white/[0.08]">Soon</span>}
                      </p>
                      <p className={cn('mt-0.5 text-xs text-ink-muted leading-relaxed', on ? '' : 'line-clamp-1')}>{s.desc}</p>
                      {on && !paused && (
                        <span className="mt-2 block h-0.5 w-full overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.1]">
                          <span key={`${tab}-${active}`} className={cn('block h-full rounded-full bg-gradient-to-r animate-cb-progress', t.tile)} />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* right: live stage */}
            <div key={`${tab}-${active}`} className={cn('relative overflow-hidden bg-gradient-to-br p-8 text-white sm:p-10', t.stage)}>
              {/* decorative */}
              <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-paper-card/15 blur-3xl animate-glow-breathe" />
              <span className="pointer-events-none absolute -left-12 bottom-0 h-48 w-48 rounded-full bg-black/10 blur-3xl" />
              <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-[0.14]" />

              <div className="animate-cb-stage relative">
                <div className="flex items-center gap-3">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/25 bg-paper-card/15 p-4 shadow-lg backdrop-blur">{feature.icon}</span>
                  {feature.isNew && <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ring-1 ring-inset ring-white/40 shadow-sm">✨ New</span>}
                  {feature.soon && <span className="inline-flex items-center rounded-full bg-paper-card/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ring-1 ring-inset ring-white/30">Coming soon</span>}
                </div>

                <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-[1.9rem]">{feature.title}</h3>
                <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-white/85">{feature.desc}</p>

                {/* live product preview */}
                <div className="mt-6">
                  <StagePreview title={feature.title} />
                </div>

                <div className="mt-7 flex items-center gap-4">
                  <a href="/register" className="inline-flex items-center gap-1.5 rounded-xl bg-paper-card px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-[#0d0f16]">
                    Try it free <ArrowUpRight className="h-4 w-4" />
                  </a>
                  {/* progress dots */}
                  <div className="flex items-center gap-1.5">
                    {group.items.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        aria-label={`Feature ${i + 1}`}
                        className={cn('h-1.5 rounded-full transition-all duration-300', i === active ? 'w-6 bg-paper-card' : 'w-1.5 bg-paper-card/40 hover:bg-paper-card/70')}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-8 text-center text-sm text-ink-faint">
            <span className="font-medium text-ink-muted">30+ capabilities</span> · Billing · eSign · People &amp; HR · GST &amp; FEMA compliant · DPDP-ready · Made in India 🇮🇳
          </p>
        </Reveal>
      </div>
    </section>
  );
}
