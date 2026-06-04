import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand: emerald "crossbill" green + deep ink + warm paper neutrals.
        ink: {
          DEFAULT: '#0c1116',
          soft: '#1a222c',
          muted: '#5b6573',
          faint: '#8a93a0',
        },
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        paper: {
          DEFAULT: '#fbfbf9',
          card: '#ffffff',
          border: '#e9e8e3',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(12,17,22,0.04), 0 1px 3px rgba(12,17,22,0.06)',
        lift: '0 10px 30px -12px rgba(12,17,22,0.18)',
        focus: '0 0 0 3px rgba(16,185,129,0.25)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
