import { ReactNode } from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import { LandingNav } from './LandingNav';
import { LandingFooter } from './LandingFooter';
import { Reveal } from '@/components/motion/Reveal';

export interface LegalSection { id: string; title: string; content: ReactNode; }

export function LegalShell({
  eyebrow, title, updated, intro, sections, note,
}: {
  eyebrow: string; title: string; updated: string; intro: string;
  sections: LegalSection[]; note?: string;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />

      {/* Header */}
      <header className="relative overflow-hidden bg-ink text-white bg-noise">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-brand-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-[0.12]" />
        <div className="relative mx-auto max-w-6xl px-5 pt-32 pb-14">
          <span className="glow-chip"><FileText className="h-3.5 w-3.5 text-brand-300" /> {eyebrow}</span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-4 max-w-2xl text-white/60 leading-relaxed">{intro}</p>
          <p className="mt-5 text-xs text-white/40">Last updated: {updated} · Anujali Technologies Pvt. Ltd.</p>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-5 py-14 grid lg:grid-cols-[230px_1fr] gap-10">
        {/* Sticky TOC */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24">
            <p className="eyebrow mb-3">On this page</p>
            <ul className="space-y-1.5 border-l border-paper-border">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="block border-l-2 border-transparent -ml-px pl-3 py-1 text-sm text-ink-muted hover:text-ink hover:border-brand-400 transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <article className="min-w-0">
          {note && (
            <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900 leading-relaxed">{note}</p>
            </div>
          )}
          <div className="space-y-12">
            {sections.map((s, i) => (
              <Reveal key={s.id} delay={Math.min(i, 4) * 40}>
                <section id={s.id} className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight text-ink mb-3 flex items-center gap-3">
                    <span className="text-sm font-mono text-brand-500/70">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </h2>
                  <div className="legal">{s.content}</div>
                </section>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-paper-border bg-paper/60 px-5 py-4 text-sm text-ink-muted">
            Questions? Email us at <a href="mailto:legal@anujali.tech" className="text-brand-700 hover:underline">legal@anujali.tech</a>.
          </div>
        </article>
      </div>

      <LandingFooter />
    </div>
  );
}
