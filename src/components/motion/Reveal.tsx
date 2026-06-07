'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Scroll-reveal wrapper using IntersectionObserver — no animation library needed. */
export function Reveal({
  children, className, delay = 0, as: Tag = 'div',
}: { children: ReactNode; className?: string; delay?: number; as?: any }) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as any}
      className={cn('reveal', visible && 'is-visible', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
