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
          <div className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white px-6 py-12 shadow-card ring-1 ring-black/[0.02] sm:px-12">
            <div className="absolute inset-0 bg-grid mask-fade-b opacity-[0.04]" />
            <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
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
