'use client';
import { ReactNode, useEffect, useState } from 'react';
import { AlertTriangle, FileText, ShieldCheck, Mail, ArrowUp, Check } from 'lucide-react';
import { LandingNav } from './LandingNav';
import { LandingFooter } from './LandingFooter';
import { cn } from '@/lib/cn';

export interface LegalSection { id: string; title: string; content: ReactNode; }

export function LegalShell({
  eyebrow, title, updated, intro, sections, note, summary,
}: {
  eyebrow: string; title: string; updated: string; intro: string;
  sections: LegalSection[]; note?: string; summary?: string[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveId((e.target as HTMLElement).id); }),
      { rootMargin: '-18% 0px -72% 0px' },
    );
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Reading progress */}
      <div className="fixed top-0 left-0 z-[60] h-[3px] w-full bg-transparent">
        <div className="h-full origin-left bg-gradient-to-r from-brand-400 via-emerald-400 to-cyan-400 transition-transform duration-75" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <LandingNav />

      {/* Header */}
      <header className="relative overflow-hidden bg-ink text-white bg-noise">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-brand-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-[0.12]" />
        <div className="relative mx-auto max-w-6xl px-5 pt-32 pb-16">
          <span className="glow-chip"><FileText className="h-3.5 w-3.5 text-brand-300" /> {eyebrow}</span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-4 max-w-2xl text-white/60 leading-relaxed">{intro}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-paper-card/5 px-3 py-1.5 text-white/70">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-300" /> Last updated {updated}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-paper-card/5 px-3 py-1.5 text-white/70">
              Anujali Technologies Pvt. Ltd.
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-5 py-14 grid lg:grid-cols-[250px_1fr] gap-12">
        {/* Sticky TOC */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24">
            <p className="eyebrow mb-3">On this page</p>
            <ul className="space-y-0.5 border-l border-paper-border">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}
                    className={cn(
                      '-ml-px flex items-center gap-2 border-l-2 pl-3 py-1.5 text-sm transition-colors',
                      activeId === s.id ? 'border-brand-500 text-brand-700 font-medium' : 'border-transparent text-ink-muted hover:text-ink hover:border-ink-faint/40',
                    )}>
                    <span className="font-mono text-[11px] opacity-60">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="mt-5 inline-flex items-center gap-1.5 text-xs text-ink-faint hover:text-ink transition-colors">
              <ArrowUp className="h-3.5 w-3.5" /> Back to top
            </a>
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

          {/* At a glance */}
          {summary && summary.length > 0 && (
            <div className="mb-10 gborder shadow-glow">
              <div className="rounded-3xl bg-gradient-to-br from-ink to-[#0f1620] text-white p-6 sm:p-7 bg-noise">
                <p className="text-sm font-semibold tracking-tight">At a glance</p>
                <p className="text-xs text-white/45 mb-4">A plain-English summary. The full terms below govern.</p>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {summary.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-white/80">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-500/20 text-brand-300"><Check className="h-3 w-3" /></span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="space-y-10">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-700 font-mono text-xs font-semibold ring-1 ring-brand-200/50">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="text-xl font-semibold tracking-tight text-ink">{s.title}</h2>
                </div>
                <div className="legal pl-0 sm:pl-11">{s.content}</div>
              </section>
            ))}
          </div>

          <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-paper-border bg-paper/60 px-5 py-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><Mail className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-medium text-ink">Questions about this document?</p>
                <p className="text-sm text-ink-muted">We’re happy to clarify anything.</p>
              </div>
            </div>
            <a href="mailto:ay6258147@gmail.com" className="btn-secondary text-sm shrink-0">Contact us</a>
          </div>
        </article>
      </div>

      <LandingFooter />
    </div>
  );
}
