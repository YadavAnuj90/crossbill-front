import { Building2, FilePlus2, ShieldCheck, FileDown } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

const STEPS = [
  { n: '01', icon: Building2, t: 'Add your client', d: 'Foreign (export) or Indian (domestic GST). A country, or a GSTIN & state. That’s the setup.' },
  { n: '02', icon: FilePlus2, t: 'Create the invoice', d: 'Export or GST is auto-detected; compliance fields fill themselves, numbering stays gapless.' },
  { n: '03', icon: ShieldCheck, t: 'Mark paid + attach proof', d: 'FIRC evidence for exports, or a simple paid status for domestic.' },
  { n: '04', icon: FileDown, t: 'Export for filing', d: 'GSTR-ready statements and a clean document bundle for your CA.' },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 border-y border-black/[0.06] dark:border-white/[0.08]">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="chip-soft mb-4">One core loop</span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.02em] text-ink">From “got paid” to “filed &amp; clean”</h2>
          <p className="mt-3 text-ink-muted text-lg">Four steps. Under a minute. No CA babysitting every invoice.</p>
        </Reveal>

        <div className="relative mt-16 grid gap-6 md:grid-cols-4">
          {/* animated connector behind the badges (desktop) */}
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden md:block">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-400/50 to-transparent dark:via-brand-300/40" />
            <span className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-brand-400 shadow-[0_0_12px_2px_rgba(16,185,129,0.8)] animate-flow-x" />
          </div>

          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <div className="group relative flex flex-col items-center">
                {/* gradient badge with icon + number */}
                <div className="relative">
                  <span className="absolute inset-0 rounded-2xl bg-brand-400/40 blur-xl opacity-50 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute -inset-1 rounded-[1.25rem] border border-brand-400/30 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:animate-ping" />
                  <div className="relative grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-emerald-700 text-white shadow-[0_16px_34px_-12px_rgba(5,150,105,0.7)] ring-1 ring-white/25 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:rotate-3">
                    <s.icon className="h-8 w-8" />
                    <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-ink font-mono text-[11px] font-bold text-paper ring-2 ring-[#eceefb] dark:bg-white dark:text-[#0d0f16] dark:ring-[#0b1020]">{s.n}</span>
                  </div>
                </div>

                {/* glass card */}
                <div className="mt-6 w-full rounded-3xl border border-paper-border bg-paper-card/70 px-5 py-6 text-center shadow-card backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand-300/50 group-hover:shadow-lift dark:border-white/[0.08] dark:bg-white/[0.03]">
                  <h3 className="font-semibold text-ink">{s.t}</h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed">{s.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
