/** Animated multi-color aurora blobs for dark hero/CTA backgrounds. Pure CSS, decorative. */
export function Aurora({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute -top-40 left-1/4 h-[36rem] w-[36rem] rounded-full bg-brand-500/30 blur-[130px] animate-aurora" />
      <div className="absolute top-0 right-0 h-[28rem] w-[28rem] rounded-full bg-teal-400/25 blur-[120px] animate-aurora" style={{ animationDelay: '-6s' }} />
      <div className="absolute -bottom-40 left-1/3 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-[130px] animate-aurora" style={{ animationDelay: '-12s' }} />
      <div className="absolute top-20 left-0 h-[22rem] w-[22rem] rounded-full bg-emerald-300/15 blur-[110px] animate-aurora" style={{ animationDelay: '-3s' }} />
    </div>
  );
}
