import { Reveal } from '@/components/motion/Reveal';

const STEPS = [
  { n: '01', t: 'Add your client', d: 'Foreign (export) or Indian (domestic GST). A country, or a GSTIN & state. That’s the setup.' },
  { n: '02', t: 'Create the invoice', d: 'Export or GST is auto-detected; compliance fields fill themselves, numbering stays gapless.' },
  { n: '03', t: 'Mark paid + attach proof', d: 'FIRC evidence for exports, or a simple paid status for domestic.' },
  { n: '04', t: 'Export for filing', d: 'GSTR-ready statements and a clean document bundle for your CA.' },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 border-y border-black/[0.06]">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="chip-soft mb-4">One core loop</span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.02em] text-ink">From “got paid” to “filed &amp; clean”</h2>
          <p className="mt-3 text-ink-muted text-lg">Four steps. Under a minute. No CA babysitting every invoice.</p>
        </Reveal>

        <div className="relative mt-14 grid gap-5 md:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden md:block h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="relative">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-black/[0.06] bg-white shadow-card font-mono text-sm font-semibold text-brand-600">{s.n}</div>
                <h3 className="mt-5 text-center font-semibold text-ink">{s.t}</h3>
                <p className="mt-1.5 text-center text-sm text-ink-muted">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
