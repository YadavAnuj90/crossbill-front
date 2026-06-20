/** Airy light canvas for the whole landing — continues the hero's daytime sky into a soft,
 *  Codex-style periwinkle wash with gentle colour blooms behind every section. */
export function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#e9ebf8] dark:bg-[#070b14]" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-[#eef0fb] via-[#e7eafa] to-[#eceefb] dark:from-[#0b1020] dark:via-[#080c16] dark:to-[#06090f]" />
      {/* faint grid */}
      <div className="absolute inset-0 bg-grid opacity-[0.04] dark:opacity-[0.06] [mask-image:radial-gradient(150%_100%_at_50%_0%,#000,transparent_75%)]" />
      {/* soft colour blooms */}
      <div className="absolute left-1/2 top-[-10rem] h-[40rem] w-[58rem] -translate-x-1/2 rounded-full bg-[#c7cffb]/50 blur-[150px] dark:bg-indigo-500/20" />
      <div className="absolute right-[-8rem] top-[26rem] h-[34rem] w-[34rem] rounded-full bg-brand-300/20 blur-[150px] dark:bg-emerald-500/15" />
      <div className="absolute left-[-8rem] top-[64rem] h-[34rem] w-[34rem] rounded-full bg-[#bcc6ff]/35 blur-[150px] dark:bg-cyan-500/12" />
      <div className="absolute right-[-6rem] top-[104rem] h-[30rem] w-[30rem] rounded-full bg-brand-200/30 blur-[150px] dark:bg-emerald-500/12" />
    </div>
  );
}
