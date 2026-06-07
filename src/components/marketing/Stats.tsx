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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink to-[#0f1620] px-6 py-12 sm:px-12 bg-noise">
            <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-40" />
            <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient-vivid tabular-nums">
                    <AnimatedCounter value={s.v} suffix={s.suffix} prefix={s.prefix} />
                  </div>
                  <p className="mt-2 text-sm text-white/55">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
