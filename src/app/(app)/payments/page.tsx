'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Wallet, Link2, Copy, Check, ExternalLink, AlertTriangle, RefreshCcw } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Invoice, Payment, Client } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';

function payableInr(inv: Invoice): string {
  return inv.type === 'domestic' ? inv.grandTotal : inv.inrEquivalent;
}

export default function PaymentsPage() {
  const { notify } = useToast();
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [links, setLinks] = useState<Record<string, Payment>>({});
  const [clients, setClients] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function load() {
    api.payments.status().then((s) => setConfigured(s.configured)).catch(() => setConfigured(false));
    api.invoices.list(1, 200).then((p) => setInvoices(p.items)).catch(() => setInvoices([]));
    api.payments.list(1, 200).then((p) => {
      const map: Record<string, Payment> = {};
      p.items.forEach((pay) => { if (pay.invoiceId && (!map[pay.invoiceId] || pay.status === 'paid')) map[pay.invoiceId] = pay; });
      setLinks(map);
    }).catch(() => {});
    api.clients.list(1, 200).then((p) => {
      const map: Record<string, string> = {};
      p.items.forEach((c: Client) => { map[c.id] = c.name; });
      setClients(map);
    }).catch(() => {});
  }
  useEffect(load, []);

  const rows = useMemo(() => (invoices ?? []).filter((i) => i.status !== 'draft'), [invoices]);

  async function createLink(inv: Invoice) {
    setBusy(inv.id);
    try {
      const pay = await api.payments.createLink(inv.id);
      setLinks((m) => ({ ...m, [inv.id]: pay }));
      await navigator.clipboard.writeText(pay.shortUrl).catch(() => {});
      notify('success', 'Payment link created & copied');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Could not create link');
    } finally { setBusy(null); }
  }

  async function copy(url: string, id: string) {
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Payments"
        subtitle="Send Razorpay payment links and reconcile paid invoices automatically."
        icon={<Wallet className="h-5 w-5" />}
        action={<Button variant="secondary" onClick={load}><RefreshCcw className="h-4 w-4" /> Refresh</Button>}
      />

      {configured === false && (
        <Reveal>
          <Card className="mb-5 border-amber-200 bg-amber-50/60 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-ink">Razorpay isn’t connected yet</p>
              <p className="text-ink-muted mt-0.5">Add <code className="font-mono text-xs bg-white px-1 py-0.5 rounded">RAZORPAY_KEY_ID</code> and <code className="font-mono text-xs bg-white px-1 py-0.5 rounded">RAZORPAY_KEY_SECRET</code> to the API <code className="font-mono text-xs bg-white px-1 py-0.5 rounded">.env</code> and restart the backend. Set the webhook to <code className="font-mono text-xs bg-white px-1 py-0.5 rounded">/api/v1/payments/webhook</code> for auto-reconcile.</p>
            </div>
          </Card>
        </Reveal>
      )}

      <Reveal>
        <Card>
          <CardHeader title="Invoices" subtitle="Generate a secure pay link; once paid, Crossbill marks the invoice paid for you." />
          {invoices === null ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={<Wallet className="h-6 w-6" />} title="No invoices to collect on yet" description="Send an invoice first — then raise a payment link here.">
              <Link href="/invoices" className="btn-primary mt-6">Go to invoices</Link>
            </EmptyState>
          ) : (
            <Table>
              <THead><TH>Invoice</TH><TH>Client</TH><TH className="text-right">Payable (INR)</TH><TH>Status</TH><TH className="text-right">Payment link</TH></THead>
              <tbody>
                {rows.map((inv) => {
                  const link = links[inv.id];
                  const paid = inv.status === 'paid' || link?.status === 'paid';
                  return (
                    <TR key={inv.id}>
                      <TD><Link href={`/invoices/${inv.id}`} className="font-mono text-xs text-brand-700 hover:underline">{inv.number}</Link></TD>
                      <TD className="text-ink">{clients[inv.clientId] ?? <span className="text-ink-faint">—</span>}</TD>
                      <TD className="text-right font-medium">₹{parseFloat(payableInr(inv)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TD>
                      <TD>{paid ? <Badge tone="green">Paid</Badge> : <StatusBadge status={inv.status} />}</TD>
                      <TD className="text-right">
                        {paid ? (
                          <span className="inline-flex items-center gap-1.5 text-sm text-brand-700"><Check className="h-4 w-4" /> Settled</span>
                        ) : link ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button onClick={() => copy(link.shortUrl, inv.id)} className="btn-ghost text-sm py-1.5">{copied === inv.id ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}</button>
                            <a href={link.shortUrl} target="_blank" rel="noreferrer" className="btn-ghost text-sm py-1.5"><ExternalLink className="h-4 w-4" /> Open</a>
                          </div>
                        ) : (
                          <Button variant="secondary" loading={busy === inv.id} onClick={() => createLink(inv)}><Link2 className="h-4 w-4" /> Create link</Button>
                        )}
                      </TD>
                    </TR>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>
    </div>
  );
}
