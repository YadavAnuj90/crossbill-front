'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, ArrowUpRight, Clock, Check, Link2, Twitter, Linkedin, Newspaper,
  FileText, ScrollText, Users, ShieldCheck, Coins, QrCode, Rocket,
} from 'lucide-react';
import { LandingNav } from '@/components/marketing/LandingNav';
import { LandingFooter } from '@/components/marketing/LandingFooter';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';
import { getPost, relatedPosts, BLOG_TONE, type BlogIcon, type BlogBlock } from '@/lib/blog';

const ICONS: Record<BlogIcon, typeof FileText> = {
  file: FileText, coins: Coins, users: Users, qr: QrCode, notes: ScrollText, shield: ShieldCheck, rocket: Rocket,
};

function Block({ block }: { block: BlogBlock }) {
  if (block.type === 'h2') return <h2 className="mt-10 mb-3 text-xl font-semibold tracking-tight text-ink sm:text-2xl">{block.text}</h2>;
  if (block.type === 'quote') return (
    <blockquote className="my-6 rounded-r-xl border-l-[3px] border-brand-500 bg-brand-500/[0.06] px-5 py-4 text-lg font-medium italic text-ink-soft">{block.text}</blockquote>
  );
  if (block.type === 'ul') return (
    <ul className="my-5 space-y-2.5">
      {block.items?.map((it, i) => (
        <li key={i} className="flex items-start gap-2.5 text-ink-soft leading-relaxed">
          <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-600"><Check className="h-3 w-3" /></span>
          {it}
        </li>
      ))}
    </ul>
  );
  return <p className="mb-4 text-[1.02rem] leading-relaxed text-ink-soft">{block.text}</p>;
}

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const post = getPost(params.slug);
  const [copied, setCopied] = useState(false);

  if (!post) {
    return (
      <div className="min-h-screen">
        <LandingNav />
        <div className="mx-auto max-w-2xl px-5 pt-40 pb-32 text-center">
          <Newspaper className="mx-auto h-10 w-10 text-ink-faint" />
          <h1 className="mt-4 text-2xl font-semibold text-ink">Article not found</h1>
          <p className="mt-2 text-ink-muted">This post may have moved. Head back to the blog to find it.</p>
          <Link href="/blog" className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"><ArrowLeft className="h-4 w-4" /> Back to blog</Link>
        </div>
        <LandingFooter />
      </div>
    );
  }

  const Icon = ICONS[post.icon];
  const related = relatedPosts(post.slug, 3);

  const copy = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />

      {/* Dark article hero */}
      <header className="relative overflow-hidden bg-[#070b14] bg-gradient-to-b from-[#0b1020] via-[#080c16] to-[#06090f] text-white bg-noise">
        <span className={cn('pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br opacity-30 blur-[120px]', BLOG_TONE[post.tone].grad)} />
        <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-[0.12]" />
        <div className="relative mx-auto max-w-3xl px-5 pt-36 pb-14">
          <Reveal>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"><ArrowLeft className="h-4 w-4" /> All articles</Link>
          </Reveal>
          <Reveal delay={60}>
            <div className="mt-6 flex items-center gap-3 text-xs">
              <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1 font-semibold text-white', BLOG_TONE[post.tone].grad)}><Icon className="h-3.5 w-3.5" /> {post.category}</span>
              <span className="inline-flex items-center gap-1 text-white/50"><Clock className="h-3.5 w-3.5" /> {post.read} read</span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-5 text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.75rem]">{post.title}</h1>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-7 flex items-center gap-3">
              <span className={cn('grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white', BLOG_TONE[post.tone].grad)}>{post.initials}</span>
              <div><p className="text-sm font-medium text-white">{post.author}</p><p className="text-xs text-white/50">{post.date}</p></div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* Article body */}
      <main className="mx-auto max-w-3xl px-5 py-14">
        <Reveal>
          <p className="mb-8 text-lg leading-relaxed text-ink-muted">{post.excerpt}</p>
          <article>
            {post.body.map((b, i) => <Block key={i} block={b} />)}
          </article>
        </Reveal>

        {/* Share */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.06] pt-6 dark:border-white/[0.08]">
          <p className="text-sm text-ink-muted">Found this useful? Share it.</p>
          <div className="flex items-center gap-2">
            <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-black/[0.04] dark:border-white/[0.1] dark:hover:bg-white/[0.06]">
              {copied ? <><Check className="h-4 w-4 text-brand-600" /> Copied</> : <><Link2 className="h-4 w-4" /> Copy link</>}
            </button>
            <a href="#" aria-label="Share on X" className="grid h-8 w-8 place-items-center rounded-lg border border-black/[0.08] text-ink-muted transition-colors hover:text-ink dark:border-white/[0.1]"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="Share on LinkedIn" className="grid h-8 w-8 place-items-center rounded-lg border border-black/[0.08] text-ink-muted transition-colors hover:text-ink dark:border-white/[0.1]"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-600 p-6 text-white sm:p-8">
          <h3 className="text-xl font-semibold">Put this into practice.</h3>
          <p className="mt-1.5 text-sm text-white/85">Bill the world, run your team, stay compliant — start free, no card required.</p>
          <Link href="/register" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0d1117] transition-transform hover:-translate-y-0.5">Get started <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </main>

      {/* Related */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <h2 className="mb-6 text-xl font-semibold text-ink">Keep reading</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {related.map((p, i) => {
            const RIcon = ICONS[p.icon];
            return (
              <Reveal key={p.slug} delay={i * 50}>
                <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-paper-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift dark:border-white/[0.08] dark:bg-white/[0.03]">
                  <div className={cn('relative h-24 overflow-hidden bg-gradient-to-br p-4 text-white', BLOG_TONE[p.tone].grad)}>
                    <div className="absolute inset-0 bg-grid-light opacity-[0.12]" />
                    <span className="relative grid h-10 w-10 place-items-center rounded-lg border border-white/25 bg-white/15 backdrop-blur"><RIcon className="h-5 w-5" /></span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className={cn('w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset', BLOG_TONE[p.tone].soft)}>{p.category}</span>
                    <h3 className="mt-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-brand-600">{p.title}</h3>
                    <p className="mt-auto pt-3 text-xs text-ink-faint">{p.date} · {p.read}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
