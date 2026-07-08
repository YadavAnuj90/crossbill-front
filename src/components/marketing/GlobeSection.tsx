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

// deterministic pseudo-random starfield (no hydration mismatch)
const STARS = Array.from({ length: 46 }, (_, i) => {
  const x = (i * 97 + 13) % 100;
  const y = (i * 53 + 29) % 100;
  const s = 0.6 + ((i * 7) % 5) * 0.35;
  const d = 1.6 + ((i * 3) % 7) * 0.4;
  const delay = ((i * 11) % 9) * 0.3;
  return { x, y, s, d, delay };
});

const CITY_NODES: [number, number][] = [[34, 40], [62, 30], [56, 64], [40, 70], [70, 52], [48, 22]];

export function GlobeSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="chip-soft mb-4">🌐 Built for cross-border</span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.02em] text-ink">Bill clients anywhere — stay compliant everywhere</h2>
          <p className="mt-3 text-ink-muted text-lg">Foreign clients in USD, Indian clients in INR. Crossbill captures FX, tracks FEMA realisation and keeps every export filing-ready — live, around the globe.</p>
        </Reveal>

        <div className="relative mx-auto mt-10 h-[420px] max-w-4xl sm:h-[580px]">
          {/* starfield */}
          <div className="pointer-events-none absolute inset-0 z-0">
            {STARS.map((st, i) => (
              <span key={i} className="animate-cb-twinkle absolute rounded-full bg-white"
                style={{ left: `${st.x}%`, top: `${st.y}%`, height: `${st.s}px`, width: `${st.s}px`, animationDuration: `${st.d}s`, animationDelay: `${st.delay}s`, boxShadow: '0 0 4px rgba(255,255,255,0.6)' }} />
            ))}
          </div>

          {/* layered atmosphere halos */}
          <div className="animate-cb-atmos absolute left-1/2 top-1/2 h-[360px] w-[360px] rounded-full bg-brand-400/30 blur-[100px] sm:h-[560px] sm:w-[560px]" />
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-[80px] sm:h-[470px] sm:w-[470px]" />
          <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/25 blur-[60px] sm:h-[340px] sm:w-[340px]" />

          {/* cross-border flight arcs */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="cb-arc-g" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#34d399" /><stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
              <radialGradient id="cb-spark" cx="0.5" cy="0.5" r="0.5">
                <stop stopColor="#ecfeff" /><stop offset="1" stopColor="#34d399" stopOpacity="0" />
              </radialGradient>
            </defs>
            {['M9 30 Q 26 16 41 47', 'M91 46 Q 78 30 61 50', 'M16 80 Q 30 74 45 61', 'M86 78 Q 74 70 58 58', 'M50 6 Q 62 22 55 40'].map((d, i) => (
              <g key={i}>
                <path d={d} fill="none" stroke="url(#cb-arc-g)" strokeWidth={2.2} strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={0.12} />
                <path id={`cb-arc-${i}`} d={d} fill="none" stroke="url(#cb-arc-g)" strokeWidth={1.3} strokeDasharray="3 4" vectorEffect="non-scaling-stroke" className="cb-flow" opacity={0.85} />
                <circle r={2.4} fill="url(#cb-spark)" vectorEffect="non-scaling-stroke">
                  <animateMotion dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite"><mpath href={`#cb-arc-${i}`} /></animateMotion>
                </circle>
                <circle r={1} fill="#ecfeff" vectorEffect="non-scaling-stroke">
                  <animateMotion dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite"><mpath href={`#cb-arc-${i}`} /></animateMotion>
                </circle>
              </g>
            ))}
          </svg>

          {/* tilted orbit rings + satellites (outer = center+tilt, inner = spin) */}
          <div className="absolute left-1/2 top-1/2 hidden h-[380px] w-[380px] sm:block sm:h-[520px] sm:w-[520px]" style={{ transform: 'translate(-50%,-50%) rotateX(72deg)' }}>
            <div className="animate-spin-slow absolute inset-0">
              <span className="absolute inset-0 rounded-[50%] border border-dashed border-brand-400/30" />
              <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-brand-300 shadow-[0_0_14px_4px] shadow-brand-400/70" />
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 hidden h-[420px] w-[420px] sm:block sm:h-[560px] sm:w-[560px]" style={{ transform: 'translate(-50%,-50%) rotateX(70deg) rotateZ(60deg)' }}>
            <div className="animate-spin-rev-slow absolute inset-0">
              <span className="absolute inset-0 rounded-[50%] border border-dashed border-cyan-400/25" />
              <span className="absolute top-0 left-[15%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_3px] shadow-cyan-400/70" />
            </div>
          </div>

          {/* the globe */}
          <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full sm:h-[400px] sm:w-[400px]"
            style={{
              background: 'radial-gradient(circle at 50% 34%, #7ff2df 0%, #2ee6c0 18%, #14b8a6 38%, #0f766e 58%, #0b3b46 78%, #061a24 100%)',
              boxShadow: '0 40px 140px -20px rgba(16,185,129,0.55), inset 0 0 90px rgba(0,0,0,0.4)',
            }}>
            {/* rotating dotted surface — the "spin" */}
            <span className="animate-globe-rotate absolute inset-[-20%] opacity-[0.5]"
              style={{
                backgroundImage: 'radial-gradient(rgba(190,255,235,0.85) 1px, transparent 1.4px)',
                backgroundSize: '18px 18px',
                WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 55%, transparent 78%)',
                maskImage: 'radial-gradient(circle at 50% 50%, #000 55%, transparent 78%)',
              }} />
            {/* specular highlight */}
            <span className="absolute left-[22%] top-[16%] h-28 w-28 rounded-full bg-white/40 blur-2xl" />
            {/* drifting day/night terminator */}
            <span className="animate-cb-terminator absolute inset-[-25%]" style={{ background: 'linear-gradient(105deg, transparent 42%, rgba(3,10,16,0.55) 62%, rgba(3,10,16,0.8) 100%)' }} />
            {/* radar sweep */}
            <span className="absolute inset-0 animate-spin-slow" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(167,243,208,0.32) 34deg, transparent 74deg)' }} />
            {/* inner shadow for sphere depth */}
            <span className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset -30px -36px 78px rgba(0,0,0,0.6), inset 26px 20px 66px rgba(126,242,223,0.3)' }} />
            {/* rim light */}
            <span className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 0 2px 1px rgba(190,255,235,0.6), 0 0 1px 1px rgba(52,211,153,0.5)' }} />
            {/* wireframe cage */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-white/20">
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
              {/* live city nodes with sonar rings */}
              {CITY_NODES.map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="1" fill="none" stroke="#a7f3d0" strokeWidth="0.6" vectorEffect="non-scaling-stroke" style={{ transformOrigin: `${cx}px ${cy}px` }} className="animate-cb-sonar" opacity="0.7" />
                  <circle cx={cx} cy={cy} r="1.4" fill="#ecfeff">
                    <animate attributeName="opacity" values="0.35;1;0.35" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              ))}
            </svg>
          </div>

          {/* floating live activity cards */}
          {CARDS.map((c) => (
            <div key={c.name} className={cn('absolute z-20 animate-float-tiny', c.pos, c.tone === 'dim' && 'opacity-70')} style={{ animationDelay: c.delay }}>
              <div className="group flex items-center gap-2.5 rounded-2xl border border-paper-border bg-paper-card/90 px-3 py-2.5 shadow-lift backdrop-blur-md transition-transform hover:scale-[1.04] dark:border-white/10 dark:bg-white/[0.06]">
                <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-[11px] font-bold text-white">
                  {c.name.slice(0, 1)}
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-paper-card dark:ring-[#0e1420]">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70" />
                  </span>
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
