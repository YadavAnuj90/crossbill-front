import {
  ShieldCheck, Clock, FileBarChart, Hash, Coins, FileCheck2, ArrowUpRight, Globe as Globe2,
} from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <span className="badge bg-brand-50 text-brand-700 mb-4">Compliance brain</span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Not just an invoice generator</h2>
          <p className="mt-3 text-ink-muted text-lg">Each feature quietly keeps you audit-ready — the rules work for you, invisibly.</p>
        </Reveal>

        {/* Bento grid */}
        <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2 md:auto-rows-fr">
          {/* Big tile */}
          <Reveal className="md:col-span-2 md:row-span-2">
            <div className="card card-hover relative h-full overflow-hidden p-7">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-200/40 blur-3xl" />
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white shadow-sm"><ShieldCheck className="h-6 w-6" /></div>
              <h3 className="mt-5 text-xl font-semibold text-ink">Auto-correct invoices</h3>
              <p className="mt-2 text-ink-muted max-w-md">The export declaration, place of supply, SAC code, currency and INR equivalent (at the captured rate) are filled in automatically. You never have to know the rules exist.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
                {[
                  { i: Hash, t: 'Gapless FY numbering' },
                  { i: Coins, t: 'FX captured + locked' },
                  { i: Globe2, t: 'Place of supply' },
                  { i: FileCheck2, t: 'LUT declaration' },
                ].map((x) => (
                  <div key={x.t} className="flex items-center gap-2 rounded-xl border border-paper-border bg-paper/50 px-3 py-2.5">
                    <x.i className="h-4 w-4 text-brand-600" /><span className="text-sm text-ink-soft">{x.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <FeatureTile icon={<Clock className="h-5 w-5" />} title="FEMA aging tracker" body="Unpaid invoices are watched against the one-year realisation deadline, with nudges at 9, 10 and 11 months." />
          </Reveal>
          <Reveal delay={160}>
            <FeatureTile icon={<FileBarChart className="h-5 w-5" />} title="One-click filing" body="A GSTR-1 Table 6A statement and a clean document bundle, ready for your CA." />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeatureTile({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card card-hover group h-full p-6">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">{icon}</div>
      <h3 className="mt-4 font-semibold text-ink flex items-center gap-1">{title}<ArrowUpRight className="h-4 w-4 text-ink-faint opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" /></h3>
      <p className="mt-2 text-sm text-ink-muted leading-relaxed">{body}</p>
    </div>
  );
}

