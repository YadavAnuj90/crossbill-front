import {
  ShieldCheck, Clock, FileBarChart, Hash, Coins, FileCheck2, ArrowUpRight, Globe as Globe2,
} from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-700 dark:border-brand-400/25 dark:text-brand-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
            </span>
            Compliance brain
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-[-0.02em] text-ink">Not just an invoice generator</h2>
          <p className="mt-3 text-ink-muted text-lg">Each feature quietly keeps you audit-ready — the rules work for you, invisibly.</p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2 md:auto-rows-fr">
          <Reveal className="md:col-span-2 md:row-span-2">
            <div className="group relative h-full overflow-hidden rounded-3xl border border-black/[0.06] bg-paper-card p-7 shadow-card ring-1 ring-black/[0.02] transition-all hover:shadow-lift dark:border-white/[0.08] dark:bg-white/[0.03] dark:ring-white/[0.04]">
              <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-brand-400/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
              <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* gradient hairline on top edge */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />
              <div className="relative flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_10px_24px_-8px_rgba(5,150,105,0.5)]"><ShieldCheck className="h-6 w-6" /></div>
                <span className="rounded-full border border-brand-500/20 bg-brand-500/10 px-2.5 py-1 text-[11px] font-semibold text-brand-700 dark:border-brand-400/25 dark:text-brand-300">Core</span>
              </div>
              <h3 className="relative mt-5 text-xl font-semibold text-ink">One engine, every tax rule</h3>
              <p className="relative mt-2 text-ink-muted max-w-md">Export or domestic, the right fields fill themselves — LUT export declaration and 0% IGST for foreign clients, or CGST / SGST / IGST for Indian ones — with currency, SAC/HSN and totals computed automatically.</p>
              <div className="relative mt-6 grid grid-cols-2 gap-3 max-w-md">
                {[
                  { i: Hash, t: 'Gapless FY numbering' },
                  { i: Coins, t: 'CGST / SGST / IGST' },
                  { i: Globe2, t: 'Export & domestic' },
                  { i: FileCheck2, t: 'LUT & GST declarations' },
                ].map((x) => (
                  <div key={x.t} className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-paper px-3 py-2.5 transition-colors hover:border-brand-400/40 hover:bg-brand-50/50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:border-brand-400/30 dark:hover:bg-brand-500/[0.08]">
                    <x.i className="h-4 w-4 text-brand-600 dark:text-brand-300" /><span className="text-sm text-ink-soft">{x.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <FeatureTile icon={<Clock className="h-5 w-5" />} title="FEMA aging tracker" body="Unpaid exports are watched against the one-year realisation deadline, with nudges at 9, 10 and 11 months." stat="9 · 10 · 11 mo" />
          </Reveal>
          <Reveal delay={160}>
            <FeatureTile icon={<FileBarChart className="h-5 w-5" />} title="One-click filing" body="GSTR-ready statements and a clean document bundle, ready for your CA." stat="GSTR-1 ready" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeatureTile({ icon, title, body, stat }: { icon: React.ReactNode; title: string; body: string; stat?: string }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-paper-card p-6 shadow-card ring-1 ring-black/[0.02] transition-all hover:-translate-y-1 hover:border-brand-400/30 hover:shadow-lift dark:border-white/[0.08] dark:bg-white/[0.03] dark:ring-white/[0.04] dark:hover:border-brand-400/25">
      <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-400/25 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200 transition-transform duration-300 group-hover:scale-110 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-400/25">{icon}</div>
      <h3 className="mt-4 font-semibold text-ink flex items-center gap-1">{title}<ArrowUpRight className="h-4 w-4 text-brand-500 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" /></h3>
      <p className="mt-2 text-sm text-ink-muted leading-relaxed">{body}</p>
      {stat && <span className="mt-auto pt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-paper px-2.5 py-1 font-mono text-[11px] font-semibold text-brand-700 dark:bg-white/[0.05] dark:text-brand-300">{stat}</span>}
    </div>
  );
}
