import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0c1116', soft: '#1a222c', muted: '#5b6573', faint: '#8a93a0' },
        brand: {
          50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399',
          500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b',
        },
        paper: { DEFAULT: '#fbfbf9', card: '#ffffff', border: '#e9e8e3' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(12,17,22,0.04), 0 1px 3px rgba(12,17,22,0.06)',
        lift: '0 10px 30px -12px rgba(12,17,22,0.18)',
        glow: '0 0 0 1px rgba(16,185,129,0.18), 0 20px 60px -20px rgba(16,185,129,0.35)',
        focus: '0 0 0 3px rgba(16,185,129,0.25)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.08)',
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.125rem', '3xl': '1.5rem' },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'reveal-up': { from: { opacity: '0', transform: 'translateY(22px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'float-slow': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-16px)' } },
        aurora: {
          '0%': { transform: 'translate(0,0) rotate(0deg) scale(1)' },
          '33%': { transform: 'translate(4%,-6%) rotate(40deg) scale(1.15)' },
          '66%': { transform: 'translate(-4%,4%) rotate(80deg) scale(0.95)' },
          '100%': { transform: 'translate(0,0) rotate(120deg) scale(1)' },
        },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'gradient-x': { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        'pulse-ring': { '0%': { transform: 'scale(0.8)', opacity: '0.6' }, '80%,100%': { transform: 'scale(2)', opacity: '0' } },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'reveal-up': 'reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        aurora: 'aurora 18s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
      },
      backgroundImage: {
        'grid-ink': 'linear-gradient(to right, rgba(12,17,22,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(12,17,22,0.05) 1px, transparent 1px)',
        'grid-light': 'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
