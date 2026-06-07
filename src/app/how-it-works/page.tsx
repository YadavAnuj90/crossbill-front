import Link from 'next/link';
import {
  ArrowRight, UserPlus, FileText, Wallet, FileBarChart, Globe, Building2, CheckCircle2,
} from 'lucide-react';
import { LandingNav } from '@/components/marketing/LandingNav';
import { LandingFooter } from '@/components/marketing/LandingFooter';
import { PageHero } from '@/components/marketing/PageHero';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = { title: 'How it works — Crossbill', description: 'From work done to filed & clean — the Crossbill core loop, step by step.' };

const STEPS = [
  { icon: UserPlus, n: '01', t: 'Add your client', d: 'Foreign (export) or Indian (domestic GST). For a foreign client it’s a name and country; for a domestic one, a GSTIN and state. That’s the whole setup.' },
  { icon: FileText, n: '02', t: 'Create the invoice', d: 'Crossbill detects the type and fills the compliance fields automatically — export declaration, place of supply, SAC/HSN, currency and the right tax (0% IGST under LUT, or CGST/SGST/IGST). Numbering stays gapless per financial year.' },
  { icon: Wallet, n: '03', t: 'Get paid &amp; capture proof', d: 'Mark the invoice paid. For exports, record the remittance and upload the FIRC / e-FIRA as evidence; for domestic, a simple paid status is enough.' },
  { icon: FileBarChart, n: '04', t: 'Export for filing', d: 'Generate GSTR-ready statements (Table 6A for exports, B2B/B2C for domestic) and a clean document bundle for your CA — in one click.' },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />
      <PageHero
        eyebrow={<><FileText className="h-3.5 w-3.5 text-brand-300" /> How it works</>}
        title="From “got paid” to"
        accent="“filed & clean”"
        intro="One simple loop handles both export and domestic invoicing — in under a minute, with no CA babysitting every invoice."
      >
        <Link href="/register" className="btn-primary px-6 py-3.5 text-[15px] shadow-glow">Try it free <ArrowRight className="h-4 w-4" /></Link>
      </PageHero>

      {/* Vertical steps */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-5">
          <div className="relative">
            <div className="absolute left-[27px] top-3 bottom-3 w-px bg-gradient-to-b from-brand-300 via-paper-border to-transparent hidden sm:block" />
            <div className="space-y-6">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 70}>
                  <div className="relative flex gap-5">
                    <div className="hidden sm:grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white border border-paper-border shadow-card text-brand-600 relative z-10">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <div className="card card-hover flex-1 p-6">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-sm font-semibold text-brand-600">{s.n}</span>
                        <h3 className="font-semibold text-ink text-lg" dangerouslySetInnerHTML={{ __html: s.t }} />
                      </div>
                      <p className="text-ink-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: s.d }} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two flows */}
      <section className="py-20 bg-white/50 border-y border-paper-border/70">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge bg-brand-50 text-brand-700 mb-4">Two flows, one app</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Whoever you’re billing, it’s handled</h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: Globe, tone: 'from-brand-400 to-emerald-600', title: 'Export (foreign client)', items: ['Export declaration under LUT', '0% IGST — zero-rated', 'FX rate captured to INR', 'FEMA realisation tracked', 'FIRC / e-FIRA evidence', 'GSTR-1 Table 6A'] },
              { icon: Building2, tone: 'from-cyan-400 to-teal-600', title: 'Domestic (Indian client)', items: ['CGST + SGST or IGST, auto', 'Per-line GST rate & HSN/SAC', 'B2B (GSTIN) or B2C', 'Place-of-supply state', 'Tax invoice PDF', 'GSTR-1 B2B / B2C'] },
            ].map((f) => (
              <Reveal key={f.title}>
                <div className="card card-hover relative h-full overflow-hidden p-7">
                  <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${f.tone}`} />
                  <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${f.tone} text-white shadow-lift`}><f.icon className="h-6 w-6" /></div>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{f.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {f.items.map((it) => (
                      <li key={it} className="flex items-center gap-2.5 text-sm text-ink-soft"><CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" /> {it}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center sm:px-12 bg-noise">
              <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-30" />
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[40rem] rounded-full bg-brand-500/20 blur-[120px]" />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">Your first invoice is a minute away</h2>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/register" className="btn-primary px-6 py-3.5 text-[15px] shadow-glow">Start free <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/features" className="btn-glass px-6 py-3.5 text-[15px]">Explore features</Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
