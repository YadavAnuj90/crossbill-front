/** Animated aurora blobs for dark hero/CTA backgrounds. Pure CSS, decorative. */
export function Aurora({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute -top-40 left-1/4 h-[34rem] w-[34rem] rounded-full bg-brand-500/30 blur-[120px] animate-aurora" />
      <div className="absolute top-10 right-0 h-[26rem] w-[26rem] rounded-full bg-emerald-400/20 blur-[110px] animate-aurora" style={{ animationDelay: '-6s' }} />
      <div className="absolute -bottom-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-teal-500/20 blur-[120px] animate-aurora" style={{ animationDelay: '-12s' }} />
    </div>
  );
}
