'use client';
import { useState, type ComponentType } from 'react';
import {
  Wallet, IndianRupee, CreditCard, Smartphone, DollarSign, Send, Landmark,
  ShieldCheck, QrCode, Lock, FileCheck2, ScanFace,
  Calculator, BookOpen, Sheet, Table2, CircleDollarSign, BadgeDollarSign,
  MessageCircle, Mail, MessageSquare, Hash, Webhook, Zap,
} from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { LogoMark } from '@/components/brand/Logo';
import { cn } from '@/lib/cn';

type Node = { label: string; icon: ComponentType<{ className?: string }>; tint: string };

const CATS: { key: string; icon: ComponentType<{ className?: string }>; nodes: Node[] }[] = [
  {
    key: 'Payments', icon: Wallet, nodes: [
      { label: 'Razorpay', icon: IndianRupee, tint: '#3b82f6' },
      { label: 'Stripe', icon: CreditCard, tint: '#6366f1' },
      { label: 'UPI', icon: Smartphone, tint: '#22c55e' },
      { label: 'PayPal', icon: DollarSign, tint: '#2563eb' },
      { label: 'Wise', icon: Send, tint: '#16a34a' },
      { label: 'Netbanking', icon: Landmark, tint: '#0ea5e9' },
    ],
  },
  {
    key: 'Compliance', icon: ShieldCheck, nodes: [
      { label: 'GST Portal', icon: Landmark, tint: '#0d9488' },
      { label: 'e-Invoice IRP', icon: QrCode, tint: '#7c3aed' },
      { label: 'RBI · FEMA', icon: ShieldCheck, tint: '#0891b2' },
      { label: 'DPDP', icon: Lock, tint: '#16a34a' },
      { label: 'LUT · Customs', icon: FileCheck2, tint: '#ca8a04' },
      { label: 'Aadhaar', icon: ScanFace, tint: '#db2777' },
    ],
  },
  {
    key: 'Accounting', icon: Calculator, nodes: [
      { label: 'Zoho Books', icon: BookOpen, tint: '#dc2626' },
      { label: 'Tally', icon: Calculator, tint: '#2563eb' },
      { label: 'QuickBooks', icon: BadgeDollarSign, tint: '#16a34a' },
      { label: 'Google Sheets', icon: Sheet, tint: '#15803d' },
      { label: 'Excel', icon: Table2, tint: '#047857' },
      { label: 'Xero', icon: CircleDollarSign, tint: '#0ea5e9' },
    ],
  },
  {
    key: 'Comms', icon: MessageCircle, nodes: [
      { label: 'WhatsApp', icon: MessageCircle, tint: '#22c55e' },
      { label: 'Email', icon: Mail, tint: '#2563eb' },
      { label: 'SMS', icon: MessageSquare, tint: '#0ea5e9' },
      { label: 'Slack', icon: Hash, tint: '#7c3aed' },
      { label: 'Webhooks', icon: Webhook, tint: '#16a34a' },
      { label: 'Zapier', icon: Zap, tint: '#ea580c' },
    ],
  },
];

// Fixed hexagonal slots around the centre (percent of container).
const SLOTS = [
  { x: 88, y: 50 }, { x: 70, y: 80 }, { x: 30, y: 80 },
  { x: 12, y: 50 }, { x: 30, y: 20 }, { x: 70, y: 20 },
];

export function IntegrationConstellation() {
  const [tab, setTab] = useState(0);
  const cat = CATS[tab];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="chip-soft mb-4">Connect your stack</span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.02em] text-ink">Crossbill sits at the centre of your money &amp; paperwork</h2>
          <p className="mt-3 text-ink-muted text-lg">Payments in, compliance filed, books in sync, clients notified — Crossbill wires your whole stack together.</p>
        </Reveal>

        {/* category tabs */}
        <Reveal delay={60}>
          <div className="mt-9 flex flex-wrap justify-center gap-2">
            {CATS.map((c, i) => (
              <button
                key={c.key}
                onClick={() => setTab(i)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                  i === tab
                    ? 'bg-ink text-paper shadow-sm dark:bg-white dark:text-[#0d0f16]'
                    : 'bg-paper-card text-ink-muted ring-1 ring-inset ring-black/[0.07] hover:text-ink hover:-translate-y-0.5 dark:bg-white/[0.04] dark:ring-white/[0.08]',
                )}
              >
                <c.icon className="h-4 w-4" /> {c.key}
              </button>
            ))}
          </div>
        </Reveal>

        {/* constellation */}
        <Reveal delay={120}>
          <div className="relative mx-auto mt-8 h-[400px] max-w-3xl sm:h-[460px]">
            {/* ambient glow behind the hub */}
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/20 blur-[80px]" />

            {/* connecting lines + flowing data dots */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <linearGradient id="cb-line-g" x1="0" y1="0" x2="1" y2="0">
                  <stop stopColor="#10b981" stopOpacity="0.25" /><stop offset="1" stopColor="#22d3ee" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              {SLOTS.map((s, i) => (
                <g key={i}>
                  <path id={`cb-line-${i}`} d={`M50 50 L${s.x} ${s.y}`} fill="none"
                    stroke="url(#cb-line-g)" strokeWidth={1.2} strokeDasharray="2.5 3.5"
                    vectorEffect="non-scaling-stroke" className="cb-flow" style={{ filter: 'drop-shadow(0 0 2px rgba(34,211,238,0.5))' }} />
                  <circle r={1.6} fill="#a7f3d0" vectorEffect="non-scaling-stroke" style={{ filter: 'drop-shadow(0 0 3px rgba(16,185,129,0.9))' }}>
                    <animateMotion dur="2.6s" begin={`${i * 0.35}s`} repeatCount="indefinite">
                      <mpath href={`#cb-line-${i}`} />
                    </animateMotion>
                  </circle>
                </g>
              ))}
            </svg>

            {/* orbiting nodes */}
            {cat.nodes.map((n, i) => {
              const s = SLOTS[i];
              return (
                <div key={n.label} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
                  <div className="animate-float-tiny" style={{ animationDelay: `${i * -0.6}s` }}>
                    <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-paper-card shadow-card ring-1 ring-inset ring-black/[0.05] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lift dark:bg-white/[0.06] dark:ring-white/10 sm:h-16 sm:w-16"
                      style={{ color: n.tint }}>
                      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-2 transition-opacity duration-300 group-hover:opacity-100" style={{ color: n.tint, boxShadow: `0 0 22px -2px ${n.tint}` }} />
                      <n.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                  </div>
                  <p className="mt-1.5 hidden text-center text-[11px] font-medium text-ink-muted transition-colors group-hover:text-ink sm:block">{n.label}</p>
                </div>
              );
            })}

            {/* centre — Crossbill */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-400/30 animate-ping" style={{ animationDuration: '3s' }} />
              <span className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/30 blur-2xl animate-glow-breathe" />
              {/* rotating gradient halo */}
              <span className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full opacity-80" style={{ background: 'conic-gradient(from 0deg, transparent, rgba(16,185,129,0.55), rgba(34,211,238,0.55), transparent 75%)', mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))', WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))' }} />
              <div className="relative grid h-24 w-24 place-items-center rounded-full bg-paper-card shadow-lift ring-1 ring-black/[0.06] dark:bg-white/[0.07] dark:ring-white/15">
                <LogoMark className="h-10 w-auto" flip="always" />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-6 text-center text-sm text-ink-faint">One hub · zero copy-paste · everything stays in sync.</p>
        </Reveal>
      </div>
    </section>
  );
}
