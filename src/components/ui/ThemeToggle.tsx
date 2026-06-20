'use client';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/cn';

/**
 * Animated light/dark toggle. The icon morphs (rotate + fade) between sun and moon,
 * and clicking fires a circular "reveal" of the new theme from the cursor position
 * (via the View Transitions API; graceful colour cross-fade fallback).
 */
export function ThemeToggle({ className, variant = 'default' }: { className?: string; variant?: 'default' | 'glass' }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      onClick={(e) => toggle({ x: e.clientX, y: e.clientY })}
      className={cn(
        'group relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border transition-all duration-300 active:scale-90',
        variant === 'glass'
          ? 'border-white/15 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
          : 'border-paper-border bg-paper-card text-ink-muted hover:text-ink hover:border-ink-faint/40 shadow-sm',
        className,
      )}
    >
      {/* warm/cool glow that swaps with the theme */}
      <span
        className={cn(
          'pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          isDark ? 'bg-indigo-400/15' : 'bg-amber-300/20',
        )}
      />
      {/* Sun */}
      <Sun
        className={cn(
          'absolute h-[18px] w-[18px] text-amber-500 transition-all duration-500',
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
        )}
      />
      {/* Moon */}
      <Moon
        className={cn(
          'absolute h-[18px] w-[18px] transition-all duration-500',
          variant === 'glass' ? 'text-white' : 'text-indigo-300',
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
        )}
      />
    </button>
  );
}
