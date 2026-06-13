/** Decorative animated layer for the hero: drifting clouds, twinkling stars, fluttering butterflies. */

const CLOUDS = [
  { top: '12%', scale: 1.0, dur: 70, delay: 0, o: 0.92 },
  { top: '26%', scale: 1.5, dur: 105, delay: -40, o: 0.8 },
  { top: '48%', scale: 0.8, dur: 55, delay: -15, o: 0.7 },
  { top: '62%', scale: 1.25, dur: 88, delay: -60, o: 0.6 },
  { top: '38%', scale: 0.65, dur: 48, delay: -25, o: 0.55 },
];

// scattered stars (x%, y%, size px, animation duration s, delay s)
const STARS = [
  [8, 22, 3, 3.2, 0], [18, 12, 2, 2.4, 0.6], [27, 40, 2, 3.8, 1.1], [34, 18, 3, 2.9, 0.3],
  [44, 30, 2, 3.4, 0.9], [56, 16, 3, 2.6, 0.2], [63, 44, 2, 4.0, 1.4], [72, 24, 3, 3.1, 0.7],
  [82, 14, 2, 2.8, 0.4], [88, 38, 3, 3.6, 1.0], [12, 56, 2, 3.0, 1.2], [48, 62, 2, 2.7, 0.5],
  [78, 58, 3, 3.9, 0.8], [92, 60, 2, 2.5, 0.1], [22, 70, 2, 3.3, 1.3], [66, 70, 3, 2.9, 0.6],
];

const BUTTERFLIES = [
  { left: '12%', top: '30%', dur: 22, delay: 0, scale: 1, hue: '#34d399', hue2: '#22d3ee' },
  { left: '70%', top: '22%', dur: 28, delay: -6, scale: 0.8, hue: '#f472b6', hue2: '#a78bfa' },
  { left: '46%', top: '46%', dur: 25, delay: -12, scale: 0.65, hue: '#fbbf24', hue2: '#fb7185' },
];

/** A soft, fluffy cloud built from overlapping puffs with gentle top-light / bottom-shadow. */
function Cloud() {
  return (
    <svg width="260" height="130" viewBox="0 0 260 130" fill="none" className="overflow-visible">
      <defs>
        <radialGradient id="puff" cx="50%" cy="36%" r="68%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="62%" stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#dfe4f6" stopOpacity="0.85" />
        </radialGradient>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <g filter="url(#soft)" fill="url(#puff)">
        {/* flat base */}
        <rect x="34" y="78" width="196" height="30" rx="15" />
        {/* stacked puffs */}
        <circle cx="78" cy="80" r="34" />
        <circle cx="120" cy="62" r="44" />
        <circle cx="166" cy="70" r="38" />
        <circle cx="200" cy="84" r="26" />
        <circle cx="52" cy="90" r="24" />
      </g>
    </svg>
  );
}

function Butterfly({ a, b }: { a: string; b: string }) {
  return (
    <svg width="44" height="36" viewBox="0 0 44 36" fill="none" className="drop-shadow-[0_4px_8px_rgba(40,40,80,0.25)]">
      <defs>
        <linearGradient id={`w-${a.slice(1)}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      {/* left wings — flap together as a group */}
      <g className="animate-wing-flap" style={{ transformOrigin: '22px 18px' }}>
        <path d="M21 18C13 6 3 4 2 10c-1 6 4 9 10 10 4 0.6 7 0 9-2z" fill={`url(#w-${a.slice(1)})`} opacity="0.92" />
        <path d="M21 18C13 30 4 32 3 26c-0.8-5 4-7 9-8 4-0.6 7 0 9 0z" fill={`url(#w-${a.slice(1)})`} opacity="0.8" />
      </g>
      {/* right wings */}
      <g className="animate-wing-flap" style={{ transformOrigin: '22px 18px', animationDelay: '0.04s' }}>
        <path d="M23 18C31 6 41 4 42 10c1 6-4 9-10 10-4 0.6-7 0-9-2z" fill={`url(#w-${a.slice(1)})`} opacity="0.92" />
        <path d="M23 18C31 30 40 32 41 26c0.8-5-4-7-9-8-4-0.6-7 0-9 0z" fill={`url(#w-${a.slice(1)})`} opacity="0.8" />
      </g>
      {/* body */}
      <rect x="21" y="9" width="2" height="18" rx="1" fill="#3a3a55" />
      <circle cx="22" cy="9" r="1.6" fill="#3a3a55" />
    </svg>
  );
}

export function HeroAmbience() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden>
      {/* Stars */}
      {STARS.map(([x, y, s, dur, delay], i) => (
        <span
          key={`star-${i}`}
          className="animate-twinkle absolute rounded-full bg-white"
          style={{
            left: `${x}%`, top: `${y}%`, width: s, height: s,
            boxShadow: '0 0 6px 1px rgba(255,255,255,0.8)',
            animationDuration: `${dur}s`, animationDelay: `${delay}s`,
          }}
        />
      ))}

      {/* Clouds — fluffy, slowly drifting */}
      {CLOUDS.map((c, i) => (
        <div
          key={`cloud-${i}`}
          className="animate-cloud-drift absolute left-0"
          style={{
            top: c.top, opacity: c.o,
            animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`,
          }}
        >
          <div style={{ transform: `scale(${c.scale})` }}>
            <Cloud />
          </div>
        </div>
      ))}

      {/* Butterflies */}
      {BUTTERFLIES.map((bf, i) => (
        <div
          key={`bf-${i}`}
          className="animate-flutter absolute"
          style={{ left: bf.left, top: bf.top, animationDuration: `${bf.dur}s`, animationDelay: `${bf.delay}s` }}
        >
          <div style={{ transform: `scale(${bf.scale})` }}>
            <Butterfly a={bf.hue} b={bf.hue2} />
          </div>
        </div>
      ))}
    </div>
  );
}
