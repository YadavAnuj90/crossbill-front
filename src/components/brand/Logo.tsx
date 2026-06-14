import { cn } from '@/lib/cn';

/**
 * Crossbill symbol — two interlocking circles (a fintech "exchange" / cross-border
 * lockup à la Mastercard) in the brand's emerald→cyan palette, with a blended
 * overlap lens. Wide aspect (≈11:7); size by height: `className="h-7 w-auto"`.
 */
export function LogoMark({
  className = 'h-7 w-auto', animate = true, flip = 'hover',
}: { className?: string; animate?: boolean; flip?: 'always' | 'hover' | 'none' }) {
  const showGlint = animate && flip !== 'none';
  const flipCls = !animate || flip === 'none' ? false : flip === 'always' ? 'cb-logo-flip' : 'cb-logo-flip-hover';
  const glintCls = flip === 'always' ? 'cb-logo-glint' : 'cb-logo-glint-hover';
  const svg = (
    <svg viewBox="0 0 44 28" className={cn('shrink-0', flipCls, className)} fill="none" role="img" aria-label="Crossbill">
      <defs>
        <linearGradient id="cb-a" x1="3" y1="1" x2="29" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6ee7b7" />
          <stop offset="0.5" stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="cb-b" x1="15" y1="1" x2="42" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5eead4" />
          <stop offset="0.5" stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="cb-lens" x1="22" y1="2" x2="22" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d9488" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="cb-glint" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="cb-clip">
          <circle cx="14" cy="14" r="13" />
          <circle cx="30" cy="14" r="13" />
        </clipPath>
      </defs>
      <g className={animate ? 'cb-logo-glow' : undefined}>
        <circle cx="14" cy="14" r="13" fill="url(#cb-a)" />
        <circle cx="30" cy="14" r="13" fill="url(#cb-b)" />
        {/* blended overlap lens */}
        <path d="M22 3.75 A13 13 0 0 1 22 24.25 A13 13 0 0 1 22 3.75 Z" fill="url(#cb-lens)" className={animate ? 'cb-logo-lens' : undefined} />
        {/* glint sweep, clipped to the mark */}
        {showGlint && (
          <g clipPath="url(#cb-clip)">
            <rect x="-8" y="-2" width="9" height="32" fill="url(#cb-glint)" className={glintCls} />
          </g>
        )}
      </g>
    </svg>
  );

  if (!animate) return svg;
  return <span className="cb-logo-3d shrink-0">{svg}</span>;
}

/** Full logo lockup: interlocking-circles symbol + "Crossbill" wordmark. */
export function Logo({
  light = false, className, markClassName = 'h-7 w-auto', wordClassName = 'text-[1.2rem]',
}: { light?: boolean; className?: string; markClassName?: string; wordClassName?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className={markClassName} />
      <span className={cn('font-semibold tracking-[-0.03em]', wordClassName, light ? 'text-white' : 'text-ink')}>
        Cross<span className="text-brand-600">bill</span>
      </span>
    </span>
  );
}
