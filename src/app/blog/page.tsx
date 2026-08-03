'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Newspaper, ArrowUpRight, Clock, Sparkles, Mail, ArrowRight,
  FileText, ScrollText, Users, ShieldCheck, Coins, QrCode, Rocket,
} from 'lucide-react';
import { LandingNav } from '@/components/marketing/LandingNav';
import { LandingFooter } from '@/components/marketing/LandingFooter';
import { PageHero } from '@/components/marketing/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';
import { POSTS, BLOG_TONE, type BlogIcon } from '@/lib/blog';

const ICONS: Record<BlogIcon, typeof FileText> = {
  file: FileText, coins: Coins, users: Users, qr: QrCode, notes: ScrollText, shield: ShieldCheck, rocket: Rocket,
};

const FEATURED = POSTS[0];
const REST = POSTS.slice(1);
const CATS = ['All', 'Compliance', 'Product', 'Payroll & HR', 'Guides', 'Company'];

export default function BlogPage() {
  const [cat, setCat] = useState('All');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const shown = useMemo(() => (cat === 'All' ? REST : REST.filter((p) => p.category === cat)), [cat]);
  const FIcon = ICONS[FEATURED.icon];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />
      <PageHero
        eyebrow={<><Newspaper className="h-3.5 w-3.5 text-brand-300" /> The Crossbill Blog</>}
        title="Compliance,"
        accent="decoded"
        intro="Field notes on cross-border billing, GST & FEMA, payroll and building a modern service business in India."
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
          <Sparkles className="h-3.5 w-3.5 text-brand-300" /> New posts every week · no fluff
        </span>
      </PageHero>

      <main className="mx-auto max-w-6xl px-5 pb-24">
        {/* Featured */}
        <Reveal>
          <Link href={`/blog/${FEATURED.slug}`} className="group relative -mt-10 block overflow-hidden rounded-3xl border border-black/[0.06] bg-paper-card shadow-card ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-lift dark:border-white/[0.08] dark:bg-white/[0.03] dark:ring-white/[0.04]">
            <div className="grid lg:grid-cols-2">
              <div className={cn('relative min-h-[15rem] overflow-hidden bg-gradient-to-br p-8 text-white', BLOG_TONE[FEATURED.tone].grad)}>
                <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-3xl animate-glow-breathe" />
                <div className="absolute inset-0 bg-grid-light opacity-[0.14]" />
                <div className="relative flex h-full flex-col justify-between">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ring-white/30">✦ Featured</span>
                  <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur"><FIcon className="h-6 w-6" /></span>
                </div>
              </div>
              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-3 text-xs">
                  <span className={cn('rounded-full px-2.5 py-1 font-semibold ring-1 ring-inset', BLOG_TONE[FEATURED.tone].soft)}>{FEATURED.category}</span>
                  <span className="inline-flex items-center gap-1 text-ink-faint"><Clock className="h-3.5 w-3.5" /> {FEATURED.read} read</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem] leading-snug">{FEATURED.title}</h2>
                <p className="mt-3 text-ink-muted leading-relaxed">{FEATURED.excerpt}</p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={cn('grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br text-xs font-bold text-white', BLOG_TONE[FEATURED.tone].grad)}>{FEATURED.initials}</span>
                    <div><p className="text-sm font-medium text-ink">{FEATURED.author}</p><p className="text-xs text-ink-faint">{FEATURED.date}</p></div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">Read <ArrowUpRight className="h-4 w-4" /></span>
                </div>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Category filter */}
        <Reveal delay={60}>
          <div className="mt-12 flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                  c === cat
                    ? 'bg-gradient-to-r from-brand-500 to-emerald-600 text-white shadow-sm'
                    : 'bg-paper-card text-ink-muted ring-1 ring-inset ring-black/[0.07] hover:-translate-y-0.5 hover:text-ink dark:bg-white/[0.04] dark:ring-white/[0.08]',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => {
            const Icon = ICONS[p.icon];
            return (
              <Reveal key={p.slug} delay={i * 50}>
                <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-paper-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift dark:border-white/[0.08] dark:bg-white/[0.03]">
                  <div className={cn('relative h-36 overflow-hidden bg-gradient-to-br p-5 text-white', BLOG_TONE[p.tone].grad)}>
                    <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl transition-transform duration-500 group-hover:scale-125" />
                    <div className="absolute inset-0 bg-grid-light opacity-[0.12]" />
                    <span className="relative grid h-12 w-12 place-items-center rounded-xl border border-white/25 bg-white/15 backdrop-blur"><Icon className="h-6 w-6" /></span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className={cn('rounded-full px-2 py-0.5 font-semibold ring-1 ring-inset', BLOG_TONE[p.tone].soft)}>{p.category}</span>
                      <span className="inline-flex items-center gap-1 text-ink-faint"><Clock className="h-3 w-3" /> {p.read}</span>
                    </div>
                    <h3 className="mt-3 font-semibold text-ink leading-snug transition-colors group-hover:text-brand-600">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-ink-muted leading-relaxed line-clamp-3">{p.excerpt}</p>
                    <div className="mt-4 flex items-center gap-2.5 border-t border-black/[0.05] pt-4 dark:border-white/[0.06]">
                      <span className={cn('grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white', BLOG_TONE[p.tone].grad)}>{p.initials}</span>
                      <p className="text-xs text-ink-muted">{p.author}</p>
                      <p className="ml-auto text-xs text-ink-faint">{p.date}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Newsletter band */}
        <Reveal delay={80}>
          <div className="mt-16 overflow-hidden rounded-3xl border border-black/[0.06] bg-gradient-to-br from-brand-500/[0.1] via-transparent to-cyan-500/[0.1] p-8 sm:p-10 dark:border-white/[0.08]">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600"><Sparkles className="h-3.5 w-3.5" /> Stay sharp</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">GST, FEMA &amp; payroll, in your inbox.</h3>
                <p className="mt-1.5 text-sm text-ink-muted">One useful email a week. No spam, unsubscribe anytime.</p>
              </div>
              {done ? (
                <div className="inline-flex items-center gap-2 rounded-xl border border-brand-500/25 bg-brand-500/10 px-4 py-3 text-sm font-medium text-brand-700 dark:text-brand-300"><ShieldCheck className="h-4 w-4" /> You&apos;re subscribed!</div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setDone(true); }} className="flex w-full max-w-sm gap-2">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com"
                      className="w-full rounded-xl border border-black/[0.08] bg-paper-card py-3 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-brand-400/60 dark:border-white/[0.1] dark:bg-white/[0.04]" />
                  </div>
                  <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">Subscribe <ArrowRight className="h-4 w-4" /></button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </main>

      <LandingFooter />
    </div>
  );
}
