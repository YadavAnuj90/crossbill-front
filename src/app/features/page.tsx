import Link from 'next/link';
import {
  ArrowRight, ShieldCheck, Building2, Globe, Clock, FileCheck2, FileBarChart, Hash, Coins,
  CalendarClock, Lock, Bell, Receipt, Wallet, Check,
} from 'lucide-react';
import { LandingNav } from '@/components/marketing/LandingNav';
import { LandingFooter } from '@/components/marketing/LandingFooter';
import { PageHero } from '@/components/marketing/PageHero';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = { title: 'Features — Crossbill', description: 'Everything Crossbill does to make export & domestic invoicing correct and compliant.' };

const GROUPS = [
  {
    badge: 'Invoicing engine', icon: Globe,
    title: 'One engine, every tax rule',
    body: 'Export or domestic, the right fields fill themselves — LUT export declaration and 0% IGST for foreign clients, or CGST / SGST / IGST for Indian ones. Currency, SAC/HSN and totals are computed for you.',
    points: [
      { i: Globe, t: 'Export invoices', d: 'Foreign client, USD/EUR/GBP, place of supply outside India.' },
      { i: Building2, t: 'Domestic GST invoices', d: 'Auto CGST+SGST vs IGST from supplier & client state.' },
      { i: Hash, t: 'Gapless FY numbering', d: 'Sequential, gapless per financial year — enforced, not hoped for.' },
      { i: Coins, t: 'FX captured & locked', d: 'Rate, source and date stored immutably on the invoice.' },
    ],
  },
  {
    badge: 'Compliance brain', icon: ShieldCheck,
    title: 'The part that is the product',
    body: 'The compliance trail no spreadsheet can give you — deadlines watched, evidence captured, nothing slips.',
    points: [
      { i: CalendarClock, t: 'FEMA aging tracker', d: 'Unpaid exports watched against the 1-year realisation deadline.' },
      { i: Bell, t: 'Smart reminders', d: 'Nudges at 9, 10 and 11 months — they have legal consequences, so they never silently fail.' },
      { i: Wallet, t: 'Record payments', d: 'Mark paid and capture remittance details against the invoice.' },
      { i: FileCheck2, t: 'FIRC / e-FIRA capture', d: 'Upload the bank’s remittance proof as export evidence.' },
    ],
  },
  {
    badge: 'Filing & reports', icon: FileBarChart,
    title: 'Audit-ready output for your CA',
    body: 'Turn everything you’ve captured into a clean, filing-ready deliverable in one click.',
    points: [
      { i: FileBarChart, t: 'GSTR-1 statements', d: 'Table 6A for exports; B2B/B2C for domestic supplies.' },
      { i: Receipt, t: 'Document bundle', d: 'Invoices + FIRC + LUT reference, packaged for your accountant.' },
      { i: Clock, t: 'LUT renewal reminder', d: 'A nudge each April to refile Form RFD-11 for the new FY.' },
      { i: FileCheck2, t: 'PDF invoices', d: 'Polished, compliant PDFs for export and domestic alike.' },
    ],
  },
  {
    badge: 'Built for trust', icon: Lock,
    title: 'Security &amp; correctness, by design',
    body: 'Your money data deserves more than a spreadsheet. We treat it that way.',
    points: [
      { i: Lock, t: 'Encrypted &amp; scoped', d: 'Sensitive fields encrypted; documents served via scoped access.' },
      { i: ShieldCheck, t: 'CA sign-off gate', d: 'Declaration wording, rate basis and export formats are CA-reviewed.' },
      { i: Hash, t: 'Audit trail', d: 'Security-relevant actions logged — sign-ins, exports, billing.' },
      { i: Check, t: 'Multi-tenant isolation', d: 'Every record scoped to your organisation. No cross-tenant leakage.' },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />
      <PageHero
        eyebrow={<><ShieldCheck className="h-3.5 w-3.5 text-brand-300" /> Features</>}
        title="Everything you need to invoice &"
        accent="stay compliant"
        intro="From the first invoice to the final filing — export and domestic — Crossbill encodes the rules so you don’t have to."
      >
        <Link href="/register" className="btn-primary px-6 py-3.5 text-[15px] shadow-glow">Start free <ArrowRight className="h-4 w-4" /></Link>
      </PageHero>

      {GROUPS.map((g, gi) => (
        <section key={g.badge} className={gi % 2 === 1 ? 'py-20 bg-white/50 border-y border-paper-border/70' : 'py-20'}>
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <Reveal className={gi % 2 === 1 ? 'lg:order-2' : ''}>
                <span className="badge bg-brand-50 text-brand-700 mb-4 inline-flex"><g.icon className="h-3.5 w-3.5" /> {g.badge}</span>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink" dangerouslySetInnerHTML={{ __html: g.title }} />
                <p className="mt-3 text-ink-muted text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: g.body }} />
                <Link href="/register" className="btn-secondary mt-6 inline-flex">Get started <ArrowRight className="h-4 w-4" /></Link>
              </Reveal>
              <Reveal delay={80} className={gi % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="grid sm:grid-cols-2 gap-3">
                  {g.points.map((p) => (
                    <div key={p.t} className="card card-hover p-5">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 ring-1 ring-brand-200/50"><p.i className="h-5 w-5" /></div>
                      <h3 className="mt-3 font-semibold text-ink text-[15px]" dangerouslySetInnerHTML={{ __html: p.t }} />
                      <p className="mt-1 text-sm text-ink-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: p.d }} />
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center sm:px-12 bg-noise">
              <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-30" />
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[40rem] rounded-full bg-brand-500/20 blur-[120px]" />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">See it on your own invoices</h2>
                <p className="mt-4 text-white/65 text-lg">Free to start. No card required.</p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/register" className="btn-primary px-6 py-3.5 text-[15px] shadow-glow">Start free <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/how-it-works" className="btn-glass px-6 py-3.5 text-[15px]">See how it works</Link>
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
