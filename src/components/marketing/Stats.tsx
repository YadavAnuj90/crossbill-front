import { AnimatedCounter } from '@/components/motion/AnimatedCounter';
import { Reveal } from '@/components/motion/Reveal';

const STATS = [
  { v: 60, suffix: 's', label: 'To a compliant invoice' },
  { v: 2, prefix: '', suffix: '-in-1', label: 'Export + domestic GST' },
  { v: 12, suffix: 'mo', label: 'FEMA window, auto-tracked' },
  { v: 100, suffix: '%', label: 'Gapless FY numbering' },
];

export function Stats() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-paper-card px-6 py-12 shadow-card ring-1 ring-black/[0.02] sm:px-12 dark:border-white/[0.08] dark:bg-gradient-to-b dark:from-white/[0.06] dark:to-white/[0.02] dark:ring-white/[0.04]">
            <div className="absolute inset-0 bg-grid mask-fade-b opacity-[0.04]" />
            {/* brand glow blooms + top accent */}
            <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-brand-400/20 blur-[90px]" />
            <div className="pointer-events-none absolute -right-20 -bottom-24 h-56 w-56 rounded-full bg-cyan-400/15 blur-[90px]" />
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />
            <div className="relative grid grid-cols-2 gap-y-8 md:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={s.label} className={[
                  'text-center',
                  i % 2 === 1 ? 'border-l border-black/[0.06] dark:border-white/10' : '',
                  i > 0 ? 'md:border-l md:border-black/[0.06] md:dark:border-white/10' : '',
                ].join(' ')}>
                  <span className="mx-auto mb-3 block h-1 w-7 rounded-full bg-gradient-to-r from-brand-400 to-emerald-600" />
                  <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient-brand tabular-nums">
                    <AnimatedCounter value={s.v} suffix={s.suffix} prefix={s.prefix} />
                  </div>
                  <p className="mt-2 text-sm text-ink-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
