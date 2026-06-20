'use client';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

type Card = { name: string; sub: string; tone: 'bright' | 'dim'; pos: string; delay: string };

const CARDS: Card[] = [
  { name: 'Acme Inc · $2,400', sub: 'New York · 0% IGST export', tone: 'bright', pos: 'left-[4%] top-[26%]', delay: '0s' },
  { name: 'Stripe payout · $5,120', sub: 'London, UK', tone: 'bright', pos: 'right-[2%] top-[44%]', delay: '-1.4s' },
  { name: 'FIRC realised', sub: 'Mumbai, IN', tone: 'dim', pos: 'right-[12%] top-[14%]', delay: '-2.1s' },
  { name: 'Razorpay · ₹48,000 paid', sub: 'Pune, IN', tone: 'bright', pos: 'left-[10%] bottom-[14%]', delay: '-0.7s' },
  { name: 'GSTR-1 filed', sub: 'Bengaluru, IN', tone: 'dim', pos: 'right-[8%] bottom-[18%]', delay: '-2.8s' },
];

export function GlobeSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="chip-soft mb-4">🌐 Built for cross-border</span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.02em] text-ink">Bill clients anywhere — stay compliant everywhere</h2>
          <p className="mt-3 text-ink-muted text-lg">Foreign clients in USD, Indian clients in INR. Crossbill captures FX, tracks FEMA realisation and keeps every export filing-ready — live, around the globe.</p>
        </Reveal>

        <div className="relative mx-auto mt-10 h-[420px] max-w-4xl sm:h-[560px]">
          {/* atmosphere halo */}
          <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/25 blur-[90px] sm:h-[520px] sm:w-[520px]" />
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-[70px] sm:h-[470px] sm:w-[470px]" />

          {/* cross-border flight arcs */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="cb-arc-g" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#34d399" /><stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            {['M9 30 Q 26 16 41 47', 'M91 46 Q 78 30 61 50', 'M16 80 Q 30 74 45 61', 'M86 78 Q 74 70 58 58'].map((d, i) => (
              <g key={i}>
                <path id={`cb-arc-${i}`} d={d} fill="none" stroke="url(#cb-arc-g)" strokeWidth={1.2} strokeDasharray="3 4" vectorEffect="non-scaling-stroke" className="cb-flow" opacity={0.75} />
                <circle r={1.1} fill="#a7f3d0" vectorEffect="non-scaling-stroke">
                  <animateMotion dur="3s" begin={`${i * 0.6}s`} repeatCount="indefinite"><mpath href={`#cb-arc-${i}`} /></animateMotion>
                </circle>
              </g>
            ))}
          </svg>

          {/* orbit ring + satellites */}
          <div className="absolute left-1/2 top-1/2 hidden h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow sm:block sm:h-[500px] sm:w-[500px]">
            <span className="absolute inset-0 rounded-full border border-dashed border-brand-400/25" />
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-brand-400 shadow-[0_0_10px] shadow-brand-400" />
            <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-400/80" />
          </div>

          {/* the globe */}
          <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full sm:h-[400px] sm:w-[400px]"
            style={{
              background: 'radial-gradient(circle at 50% 36%, #5eead4 0%, #14b8a6 26%, #0f766e 48%, #0b3b46 72%, #07212e 100%)',
              boxShadow: '0 30px 120px -20px rgba(16,185,129,0.5), inset 0 0 80px rgba(0,0,0,0.35)',
            }}>
            {/* specular highlight */}
            <span className="absolute left-[24%] top-[18%] h-24 w-24 rounded-full bg-white/30 blur-2xl" />
            {/* radar sweep */}
            <span className="absolute inset-0 animate-spin-slow" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(167,243,208,0.28) 36deg, transparent 76deg)' }} />
            {/* inner shadow for sphere depth */}
            <span className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset -28px -34px 70px rgba(0,0,0,0.55), inset 22px 18px 60px rgba(94,234,212,0.25)' }} />
            {/* wireframe */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-white/15">
              <g fill="none" stroke="currentColor" strokeWidth={0.5} vectorEffect="non-scaling-stroke">
                <circle cx="50" cy="50" r="49.5" />
                <ellipse cx="50" cy="50" rx="38" ry="49.5" />
                <ellipse cx="50" cy="50" rx="24" ry="49.5" />
                <ellipse cx="50" cy="50" rx="10" ry="49.5" />
                <line x1="50" y1="0.5" x2="50" y2="99.5" />
                <ellipse cx="50" cy="32" rx="46" ry="2.6" />
                <ellipse cx="50" cy="68" rx="46" ry="2.6" />
                <ellipse cx="50" cy="18" rx="37" ry="2.2" />
                <ellipse cx="50" cy="82" rx="37" ry="2.2" />
                <line x1="0.5" y1="50" x2="99.5" y2="50" />
              </g>
              {/* live city pulses */}
              {[[34, 40], [62, 30], [56, 64], [40, 70], [70, 52]].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="1.3" fill="#a7f3d0">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </svg>
          </div>

          {/* floating live activity cards */}
          {CARDS.map((c) => (
            <div key={c.name} className={cn('absolute z-20 animate-float-tiny', c.pos, c.tone === 'dim' && 'opacity-60')} style={{ animationDelay: c.delay }}>
              <div className="flex items-center gap-2.5 rounded-2xl border border-paper-border bg-paper-card/90 px-3 py-2.5 shadow-lift backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06]">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-[11px] font-bold text-white">
                  {c.name.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-ink leading-tight">{c.name}</p>
                  <p className="text-[11px] text-ink-muted">{c.sub}</p>
                </div>
                <span className="ml-1 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand-500/15 font-mono text-[11px] font-bold text-brand-600 dark:text-brand-300">›_</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
