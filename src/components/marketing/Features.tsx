import {
  ShieldCheck, Clock, FileBarChart, Hash, Coins, FileCheck2, ArrowUpRight, Globe as Globe2,
} from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="absolute inset-0 -z-10 spotlight opacity-60" />
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <span className="badge bg-brand-50 text-brand-700 mb-4">Compliance brain</span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Not just an invoice generator</h2>
          <p className="mt-3 text-ink-muted text-lg">Each feature quietly keeps you audit-ready — the rules work for you, invisibly.</p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2 md:auto-rows-fr">
          {/* Big tile with animated gradient border */}
          <Reveal className="md:col-span-2 md:row-span-2">
            <div className="gborder h-full shadow-glow">
              <div className="relative h-full overflow-hidden bg-ink text-white p-7 bg-noise">
                <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-500/30 blur-3xl" />
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-glow"><ShieldCheck className="h-6 w-6" /></div>
                <h3 className="mt-5 text-xl font-semibold">One engine, every tax rule</h3>
                <p className="mt-2 text-white/60 max-w-md">Export or domestic, the right fields fill themselves — LUT export declaration and 0% IGST for foreign clients, or CGST / SGST / IGST for Indian ones — with currency, SAC/HSN and totals computed automatically.</p>
                <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
                  {[
                    { i: Hash, t: 'Gapless FY numbering' },
                    { i: Coins, t: 'CGST / SGST / IGST' },
                    { i: Globe2, t: 'Export & domestic' },
                    { i: FileCheck2, t: 'LUT & GST declarations' },
                  ].map((x) => (
                    <div key={x.t} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                      <x.i className="h-4 w-4 text-brand-300" /><span className="text-sm text-white/80">{x.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <FeatureTile icon={<Clock className="h-5 w-5" />} title="FEMA aging tracker" body="Unpaid exports are watched against the one-year realisation deadline, with nudges at 9, 10 and 11 months." />
          </Reveal>
          <Reveal delay={160}>
            <FeatureTile icon={<FileBarChart className="h-5 w-5" />} title="One-click filing" body="GSTR-ready statements and a clean document bundle, ready for your CA." />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeatureTile({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card card-hover group relative h-full overflow-hidden p-6">
      <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-200/40 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 ring-1 ring-brand-200/50">{icon}</div>
      <h3 className="mt-4 font-semibold text-ink flex items-center gap-1">{title}<ArrowUpRight className="h-4 w-4 text-ink-faint opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" /></h3>
      <p className="mt-2 text-sm text-ink-muted leading-relaxed">{body}</p>
    </div>
  );
}
