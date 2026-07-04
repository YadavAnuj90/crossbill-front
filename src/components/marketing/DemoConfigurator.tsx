'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

type Opt = { id: string; label: string; emoji: string };

const SECTORS: Opt[] = [
  { id: 'it', label: 'IT / SaaS', emoji: '💻' },
  { id: 'agency', label: 'Agency / Studio', emoji: '🎨' },
  { id: 'freelancer', label: 'Freelancer', emoji: '🧑‍💻' },
  { id: 'consulting', label: 'Consulting', emoji: '🤝' },
  { id: 'manufacturing', label: 'Manufacturing', emoji: '🏭' },
  { id: 'retail', label: 'Retail / D2C', emoji: '🛍️' },
  { id: 'ecommerce', label: 'E-commerce', emoji: '🛒' },
  { id: 'media', label: 'Media / Creative', emoji: '🎬' },
  { id: 'education', label: 'Education', emoji: '🎓' },
  { id: 'healthcare', label: 'Healthcare', emoji: '🏥' },
  { id: 'logistics', label: 'Logistics', emoji: '🚚' },
  { id: 'professional', label: 'Professional', emoji: '⚖️' },
];

const SIZES: Opt[] = [
  { id: 'solo', label: 'Just me', emoji: '🧍' },
  { id: 'small', label: '2–10', emoji: '👥' },
  { id: 'mid', label: '11–50', emoji: '👨‍👩‍👧' },
  { id: 'large', label: '51–200', emoji: '🏢' },
  { id: 'xl', label: '200+', emoji: '🌐' },
];

const GOALS: Opt[] = [
  { id: 'invoicing', label: 'Compliant invoicing & GST/FEMA', emoji: '🧾' },
  { id: 'payments', label: 'Get paid faster', emoji: '💸' },
  { id: 'esign', label: 'Contracts & eSign', emoji: '✍️' },
  { id: 'hr', label: 'Run HR & payroll', emoji: '👔' },
  { id: 'all', label: 'All of it — one platform', emoji: '✨' },
];

const STEPS = [
  { label: 'Organization sector', lead: ['Select your', 'industry.'], desc: 'Tell us your business so we can tailor your personalized Crossbill workspace.' },
  { label: 'Team size', lead: ['Size up your', 'team.'], desc: 'How many people will work out of Crossbill? We’ll shape the plan to fit.' },
  { label: 'Primary goal', lead: ['Choose your', 'priority.'], desc: 'What do you most want to put on autopilot first?' },
];

const MODULES: Record<string, { title: string; desc: string }[]> = {
  invoicing: [
    { title: 'Export & domestic invoicing', desc: 'LUT 0% IGST exports or CGST/SGST/IGST — auto-computed, gapless.' },
    { title: 'FEMA realisation tracker', desc: 'Never miss the 1-year export realisation deadline.' },
    { title: 'e-Invoicing (IRN + QR)', desc: 'IRN + signed QR the moment you raise a B2B invoice.' },
    { title: 'GSTR-1 & CA bundle', desc: 'Filing-ready statements and a tidy ZIP for your accountant.' },
  ],
  payments: [
    { title: 'Razorpay payment links', desc: 'UPI, card & netbanking on any invoice.' },
    { title: 'Auto-reconciliation', desc: 'Invoices mark themselves paid via verified webhooks.' },
    { title: 'Live FX capture', desc: 'Reference rates captured on every export invoice.' },
  ],
  esign: [
    { title: 'Native eSign + audit trail', desc: 'Email-OTP, drawn signature, tamper-evident trail.' },
    { title: 'Geo + selfie fraud checks', desc: 'Geofencing and selfie evidence on signing.' },
    { title: 'Public verifier', desc: 'Anyone can confirm a document is authentic by its code.' },
  ],
  hr: [
    { title: 'Employees, attendance & leave', desc: 'A clean team directory with daily attendance.' },
    { title: 'Payroll & salary slips', desc: 'Run payroll with watermarked, tamper-evident slips.' },
    { title: 'Assets & onboarding/exit', desc: 'Track allocations; guided joining and clearance.' },
  ],
  all: [
    { title: 'Invoicing + GST/FEMA + e-Invoicing', desc: 'The full compliance-first billing engine.' },
    { title: 'Payments & auto-reconciliation', desc: 'Get paid and reconcile without lifting a finger.' },
    { title: 'Agreements & eSign', desc: 'Sign, verify and track every contract.' },
    { title: 'People, payroll & assets', desc: 'Run the whole team from the same workspace.' },
  ],
};

function score(sector: string, size: string, goal: string): number {
  const sizeW: Record<string, number> = { solo: 10, small: 16, mid: 22, large: 28, xl: 33 };
  const goalW: Record<string, number> = { invoicing: 16, payments: 12, esign: 14, hr: 18, all: 24 };
  const sectorW = sector === 'it' || sector === 'agency' || sector === 'freelancer' ? 8 : 6;
  return Math.min(94, 46 + (sizeW[size] ?? 16) + (goalW[goal] ?? 16) + sectorW);
}

const OUTLINE = { WebkitTextStroke: '1.5px rgba(255,255,255,0.85)', color: 'transparent' } as const;

export function DemoConfigurator() {
  const [step, setStep] = useState(0);
  const [sector, setSector] = useState('');
  const [size, setSize] = useState('');
  const [goal, setGoal] = useState('');
  const [done, setDone] = useState(false);

  const opts = step === 0 ? SECTORS : step === 1 ? SIZES : GOALS;
  const current = step === 0 ? sector : step === 1 ? size : goal;
  const setCurrent = (v: string) => { if (step === 0) setSector(v); else if (step === 1) setSize(v); else setGoal(v); };
  const proceed = () => { if (!current) return; if (step < 2) setStep(step + 1); else setDone(true); };
  const back = () => { if (done) setDone(false); else if (step > 0) setStep(step - 1); };
  const reset = () => { setStep(0); setSector(''); setSize(''); setGoal(''); setDone(false); };

  const meta = STEPS[step];
  const s = score(sector, size, goal);
  const mods = MODULES[goal] ?? MODULES.all;

  return (
    <section className="relative overflow-hidden bg-[#080b12] py-24 text-white">
      <span className="pointer-events-none absolute -left-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-brand-500/12 blur-[130px]" />
      <span className="pointer-events-none absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.15fr]">
        {/* ── LEFT ── */}
        <div>
          {!done ? (
            <>
              <div className="mb-8 flex items-center gap-4 font-mono text-sm text-white/45">
                <span className="text-white">0{step + 1}</span>
                <span className="relative h-px w-28 bg-white/15">
                  <span className="absolute inset-y-0 left-0 bg-white transition-all duration-300" style={{ width: `${((step + 1) / 3) * 100}%` }} />
                </span>
                <span>03</span>
              </div>
              <h2 className="text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
                {meta.lead[0]}<br />
                <span style={OUTLINE}>{meta.lead[1]}</span>
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/55">{meta.desc}</p>
            </>
          ) : (
            <>
              <div className="mb-8 font-mono text-sm text-white/45">READY</div>
              <h2 className="text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
                Here’s your<br /><span style={OUTLINE}>blueprint.</span>
              </h2>
              <div className="mt-8 inline-flex items-baseline gap-3 rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-700 px-6 py-4">
                <span className="text-5xl font-extrabold tabular-nums">{s}%</span>
                <span className="text-sm text-white/85">automation<br />potential</span>
              </div>
              <p className="mt-6 max-w-md text-xs text-white/40">An operational-effort estimate for your billing &amp; people admin — not a financial projection.</p>
            </>
          )}
        </div>

        {/* ── RIGHT ── */}
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm sm:p-8">
          {!done ? (
            <div key={step} className="animate-pop-in">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">{meta.label}</p>
              <div className={cn('grid gap-3', step === 2 ? 'grid-cols-1 sm:grid-cols-2' : step === 1 ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-3 sm:grid-cols-4')}>
                {opts.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setCurrent(o.id)}
                    className={cn(
                      'group flex items-center gap-2.5 rounded-2xl border p-3.5 text-left transition-all duration-200 sm:flex-col sm:items-center sm:gap-2 sm:text-center',
                      current === o.id
                        ? 'border-brand-400/60 bg-brand-500/12 ring-1 ring-brand-400/40'
                        : 'border-white/10 bg-white/[0.02] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06]',
                    )}
                  >
                    <span className="text-2xl">{o.emoji}</span>
                    <span className="text-[13px] font-medium leading-tight text-white/85">{o.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-7 flex items-center justify-between">
                {step > 0 ? (
                  <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-white/55 hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : <span />}
                <button
                  onClick={proceed}
                  disabled={!current}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0a0d15] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {step < 2 ? 'Continue' : 'Generate blueprint'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-pop-in">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">Your recommended Crossbill setup</p>
              <div className="space-y-2.5">
                {mods.map((m) => (
                  <div key={m.title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/20 text-brand-300"><Check className="h-3.5 w-3.5" /></span>
                    <div>
                      <p className="text-sm font-semibold text-white">{m.title}</p>
                      <p className="text-xs leading-snug text-white/50">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex items-center justify-between">
                <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-medium text-white/55 hover:text-white transition-colors">
                  <RotateCcw className="h-4 w-4" /> Start over
                </button>
                <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-400 to-emerald-500 px-6 py-3 text-sm font-semibold text-[#0a0d15] transition-all hover:-translate-y-0.5">
                  Start free with this setup <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
