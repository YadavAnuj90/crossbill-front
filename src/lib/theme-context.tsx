'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
interface ThemeCtx {
  theme: Theme;
  toggle: (coords?: { x: number; y: number }) => void;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  try { localStorage.setItem('theme', theme); } catch { /* ignore */ }
}

/**
 * Spawns a glowing wavefront ring + a quick sparkle burst at the click point,
 * synced to the theme reveal. Pure DOM (no deps); transforms/opacity only so it
 * stays buttery on the compositor. Cleans itself up.
 */
function spawnBurst(x: number, y: number, toDark: boolean) {
  const layer = document.createElement('div');
  layer.className = 'theme-fx-layer';
  // Warm gold radiating into the light theme; cool indigo sinking into the dark.
  const glow = toDark
    ? 'radial-gradient(circle, rgba(129,140,248,0.55), rgba(34,211,238,0.22) 45%, transparent 70%)'
    : 'radial-gradient(circle, rgba(253,224,71,0.65), rgba(16,185,129,0.28) 45%, transparent 70%)';

  const ring = document.createElement('div');
  ring.className = 'theme-fx-ring';
  ring.style.left = x + 'px';
  ring.style.top = y + 'px';
  ring.style.background = glow;
  layer.appendChild(ring);

  // Sparkles fan out from the origin.
  const sparkColor = toDark ? '#a5b4fc' : '#fde68a';
  const N = 24;
  for (let i = 0; i < N; i++) {
    const s = document.createElement('span');
    s.className = 'theme-fx-spark';
    const ang = (Math.PI * 2 * i) / N + Math.random() * 0.5;
    const dist = 130 + Math.random() * 170;
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.background = sparkColor;
    s.style.color = sparkColor;
    s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    s.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
    s.style.animationDelay = Math.random() * 110 + 'ms';
    layer.appendChild(s);
  }

  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 1900);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  // Sync from what the no-FOUC script already applied on <html>.
  useEffect(() => {
    setThemeState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback((t: Theme) => { apply(t); setThemeState(t); }, []);

  const toggle = useCallback((coords?: { x: number; y: number }) => {
    const next: Theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    const toDark = next === 'dark';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fallback colour cross-fade for browsers without the View Transitions API.
    const doSwitch = () => { apply(next); setThemeState(next); };

    // @ts-ignore - startViewTransition is not in all TS lib targets yet
    if (reduce || typeof document.startViewTransition !== 'function') {
      document.documentElement.classList.add('theming');
      doSwitch();
      window.setTimeout(() => document.documentElement.classList.remove('theming'), 500);
      return;
    }

    const x = coords?.x ?? window.innerWidth - 40;
    const y = coords?.y ?? 40;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    // @ts-ignore
    const transition = document.startViewTransition(doSwitch);
    transition.ready.then(() => {
      const root = document.documentElement;
      // New theme sweeps in as a circular reveal from the cursor…
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
        { duration: 620, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      );
      // …while the outgoing theme gently recedes for depth.
      root.animate(
        { transform: ['scale(1)', 'scale(1.04)'], opacity: [1, 0.6] },
        { duration: 620, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-old(root)' },
      );
    }).catch(() => {});

    // The live DOM is hidden behind the transition snapshots while the reveal
    // plays, so fire the glow/sparkle flourish the instant it settles.
    if (!reduce) {
      // @ts-ignore
      transition.finished.then(() => spawnBurst(x, y, toDark)).catch(() => {});
    }
  }, []);

  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) return { theme: 'light', toggle: () => {}, setTheme: () => {} };
  return ctx;
}
