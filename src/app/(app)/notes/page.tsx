'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ScrollText, Download, FileMinus, FilePlus, ArrowUpRight } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Note, NoteKind, Client } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

type Filter = 'all' | NoteKind;

export default function NotesPage() {
  const { notify } = useToast();
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [clients, setClients] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    api.notes.list(1, 200).then((p) => setNotes(p.items)).catch(() => setNotes([]));
    api.clients.list(1, 200).then((p) => {
      const map: Record<string, string> = {};
      p.items.forEach((c: Client) => { map[c.id] = c.name; });
      setClients(map);
    }).catch(() => {});
  }, []);

  const counts = useMemo(() => {
    const all = notes ?? [];
    return {
      all: all.length,
      credit: all.filter((n) => n.kind === 'credit').length,
      debit: all.filter((n) => n.kind === 'debit').length,
    };
  }, [notes]);

  const shown = useMemo(() => {
    if (!notes) return [];
    return filter === 'all' ? notes : notes.filter((n) => n.kind === filter);
  }, [notes, filter]);

  async function getPdf(n: Note) {
    try { const { url } = await api.notes.pdf(n.id); window.open(url, '_blank'); }
    catch { notify('info', 'PDF is still generating — try again in a moment'); }
  }

  const TABS: { key: Filter; label: string; n: number }[] = [
    { key: 'all', label: 'All', n: counts.all },
    { key: 'credit', label: 'Credit', n: counts.credit },
    { key: 'debit', label: 'Debit', n: counts.debit },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Credit & Debit Notes"
        subtitle="Every adjustment raised against an invoice under GST §34 — reported in GSTR-1 (CDNR/CDNUR)."
        icon={<ScrollText className="h-5 w-5" />}
      />

      <Reveal>
        <Card>
          {notes === null ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : notes.length === 0 ? (
            <EmptyState
              icon={<ScrollText className="h-6 w-6" />}
              title="No notes yet"
              description="Credit and debit notes are raised from an invoice. Open any invoice and use the Credit / Debit Notes panel to issue one."
            >
              <Link href="/invoices" className="btn-primary mt-6"><ArrowUpRight className="h-4 w-4" /> Go to invoices</Link>
            </EmptyState>
          ) : (
            <>
              <div className="flex items-center gap-1 p-3 border-b border-paper-border">
                {TABS.map((t) => (
                  <button key={t.key} onClick={() => setFilter(t.key)}
                    className={cn('inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition',
                      filter === t.key ? 'bg-paper text-ink shadow-card' : 'text-ink-muted hover:text-ink')}>
                    {t.label}
                    <span className={cn('rounded-full px-1.5 text-[11px]', filter === t.key ? 'bg-white text-ink-muted' : 'bg-paper text-ink-faint')}>{t.n}</span>
                  </button>
                ))}
              </div>
              <Table>
                <THead><TH>Note</TH><TH>Type</TH><TH>Against invoice</TH><TH>Client</TH><TH>Date</TH><TH className="text-right">Amount</TH><TH className="text-right">PDF</TH></THead>
                <tbody>
                  {shown.map((n) => (
                    <TR key={n.id}>
                      <TD><span className="font-mono text-xs text-ink">{n.number}</span></TD>
                      <TD>{n.kind === 'credit'
                        ? <Badge tone="amber"><FileMinus className="h-3.5 w-3.5" /> Credit</Badge>
                        : <Badge tone="blue"><FilePlus className="h-3.5 w-3.5" /> Debit</Badge>}</TD>
                      <TD><Link href={`/invoices/${n.invoiceId}`} className="font-mono text-xs text-brand-700 hover:underline">{n.invoiceNumber}</Link></TD>
                      <TD className="text-ink">{clients[n.clientId] ?? <span className="text-ink-faint">—</span>}</TD>
                      <TD>{formatDate(n.noteDate)}</TD>
                      <TD className="text-right font-medium">{n.currency} {parseFloat(n.grandTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TD>
                      <TD className="text-right">
                        {n.pdfUrl
                          ? <button onClick={() => getPdf(n)} className="inline-flex items-center gap-1.5 text-sm text-brand-700 hover:underline"><Download className="h-4 w-4" /> View</button>
                          : <span className="text-xs text-ink-faint">generating…</span>}
                      </TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Card>
      </Reveal>
    </div>
  );
}
