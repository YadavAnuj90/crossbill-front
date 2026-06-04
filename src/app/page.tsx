import Link from 'next/link';
import {
  ArrowRight, ShieldCheck, FileText, Clock, FileBarChart, Check, Globe, Zap,
} from 'lucide-react';

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
          <path d="M9 11.5L16 16L9 20.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M23 11.5L16 16L23 20.5" stroke="#6ee7b7" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-semibold text-ink tracking-tight">Crossbill</span>
    </span>
  );
}

const FEATURES = [
  { icon: ShieldCheck, title: 'Auto-correct invoices', body: 'Export declaration, place of supply, SAC code, currency and INR equivalent — filled in automatically. You never have to know the rules exist.' },
  { icon: Clock, title: 'FEMA aging tracker', body: 'Unpaid invoices are watched against the one-year realisation deadline, with nudges at 9, 10 and 11 months so nothing slips.' },
  { icon: FileBarChart, title: 'One-click filing', body: 'Generate a GSTR-1 Table 6A statement and a clean document bundle — invoices, FIRC and LUT reference — ready for your CA.' },
];

const STEPS = [
  { n: '01', t: 'Add your foreign client', d: 'Name, country and address. That is the whole setup.' },
  { n: '02', t: 'Create an export invoice', d: 'Compliance fields fill themselves; numbering stays gapless per financial year.' },
  { n: '03', t: 'Mark paid + attach FIRC', d: 'Capture the bank remittance proof against the invoice as export evidence.' },
  { n: '04', t: 'Export for filing', d: 'A clean GSTR-1 6A statement and document bundle for your CA.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link href="/register" className="btn-primary text-sm">Get started <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-20 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge bg-brand-50 text-brand-700 mb-5">
            <Zap className="h-3.5 w-3.5" /> Updated for the Finance Act 2026
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.1]">
            Invoice foreign clients correctly.
            <span className="text-brand-600"> Stay GST &amp; FEMA compliant.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-muted leading-relaxed">
            The dead-simple layer between “I did the work and got paid in USD” and “my GST and FEMA
            paperwork is clean and audit-ready.” Built for Indian developers and small agencies — not
            a heavyweight accounting suite.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/register" className="btn-primary px-5 py-3 text-[15px]">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="btn-secondary px-5 py-3 text-[15px]">Sign in</Link>
          </div>
          <p className="mt-4 text-xs text-ink-faint">No card required · Free tier up to ~10 invoices</p>
        </div>

        {/* Hero card mock */}
        <div className="mx-auto mt-14 max-w-3xl">
          <div className="card overflow-hidden shadow-lift">
            <div className="flex items-center gap-1.5 border-b border-paper-border px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-300" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-brand-300" />
              <span className="ml-3 text-xs text-ink-faint">Invoice CB/2026-27/0001</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 p-6">
              <div className="space-y-3 text-sm">
                <div><p className="text-ink-faint text-xs">Export declaration</p><p className="text-ink-soft">Supply under LUT, without payment of IGST</p></div>
                <div><p className="text-ink-faint text-xs">Place of supply</p><p className="text-ink-soft">Outside India (export of services)</p></div>
                <div><p className="text-ink-faint text-xs">SAC code</p><p className="text-ink-soft font-mono">998314</p></div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-ink-muted">Amount</span><span className="font-medium">USD 1,000.00</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">FX (CBIC)</span><span className="font-mono text-ink-soft">83.50</span></div>
                <div className="flex justify-between border-t border-paper-border pt-3"><span className="text-ink-muted">INR equivalent</span><span className="font-semibold text-ink">₹83,500.00</span></div>
                <div className="flex items-center gap-2 text-xs text-brand-700 bg-brand-50 rounded-lg px-2.5 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> FEMA realisation due 02 Jun 2027
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-paper-border bg-paper-card/50">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-ink">A compliance brain, not just an invoice generator</h2>
            <p className="mt-3 text-ink-muted">Three things a plain template can’t do — each one quietly keeps you audit-ready.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="badge bg-paper text-ink-muted border border-paper-border mb-4"><Globe className="h-3.5 w-3.5" /> One core loop</span>
            <h2 className="text-3xl font-semibold tracking-tight text-ink">From “got paid in USD” to “filed and clean” in under a minute</h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Crossbill does one job — export invoicing and its compliance trail — and does it better
              than Excel, a generic invoice generator, or a tool that was never built for this niche.
            </p>
            <Link href="/register" className="btn-primary mt-7 px-5 py-3 text-[15px]">Create your first invoice <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="space-y-3">
            {STEPS.map((s) => (
              <div key={s.n} className="card flex items-start gap-4 p-5">
                <span className="font-mono text-sm font-semibold text-brand-600 mt-0.5">{s.n}</span>
                <div>
                  <h3 className="font-medium text-ink">{s.t}</h3>
                  <p className="text-sm text-ink-muted mt-0.5">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="rounded-2xl bg-ink px-8 py-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Stop babysitting export paperwork</h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">
            A huge group of Indian service exporters just became eligible for tax-free foreign revenue.
            Claim it correctly — without hiring a CA to check every invoice.
          </p>
          <Link href="/register" className="btn-primary mt-7 px-5 py-3 text-[15px] bg-brand-500 hover:bg-brand-400">
            Get started free <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-6 flex items-center justify-center gap-5 text-xs text-white/60">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-400" /> Gapless numbering</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-400" /> FIRC tracking</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-400" /> CA-ready exports</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-paper-border">
        <div className="mx-auto max-w-6xl px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-ink-faint text-center max-w-md">
            Crossbill assists with documentation and calculation. It is not a substitute for professional
            tax advice. Compliance templates should be reviewed by a practising Chartered Accountant.
          </p>
        </div>
      </footer>
    </div>
  );
}
