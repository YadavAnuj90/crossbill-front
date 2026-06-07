'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Download, CheckCircle2, ShieldCheck, Globe, CalendarClock, RefreshCw, Coins,
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Invoice } from '@/lib/types';
import { formatMoney, formatDate, daysUntil } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { notify } = useToast();
  const [inv, setInv] = useState<Invoice | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => { api.invoices.get(id).then(setInv).catch(() => notify('error', 'Invoice not found')); }, [id, notify]);
  useEffect(() => { load(); }, [load]);

  async function markPaid() {
    if (!inv) return;
    setBusy(true);
    try { const u = await api.invoices.updateStatus(inv.id, 'paid'); setInv(u); notify('success', 'Marked as paid'); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not update'); }
    finally { setBusy(false); }
  }

  async function getPdf() {
    if (!inv) return;
    setBusy(true);
    try { const { url } = await api.invoices.pdf(inv.id); window.open(url, '_blank'); }
    catch { notify('info', 'PDF is still generating — try again in a moment'); }
    finally { setBusy(false); }
  }

  if (!inv) return <PageLoader />;

  const d = daysUntil(inv.femaDueDate);
  const atRisk = inv.status !== 'paid' && d <= 90;

  return (
    <div>
      <Link href="/invoices" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4 transition-colors"><ArrowLeft className="h-4 w-4" /> Invoices</Link>
      <PageHeader
        eyebrow={`FY ${inv.financialYear}`}
        title={inv.number}
        subtitle={`Raised ${formatDate(inv.invoiceDate)}`}
        action={
          <div className="flex items-center gap-2">
            {inv.status !== 'paid' && <Button variant="secondary" onClick={markPaid} loading={busy}><CheckCircle2 className="h-4 w-4" /> Mark paid</Button>}
            <Button onClick={getPdf} loading={busy}><Download className="h-4 w-4" /> Download PDF</Button>
          </div>
        }
      />

      <div className="flex items-center gap-2 mb-6">
        <StatusBadge status={inv.status} />
        {atRisk && <Badge tone="red"><CalendarClock className="h-3.5 w-3.5" /> FEMA due in {d} days</Badge>}
        {!inv.pdfUrl && <Badge tone="amber"><RefreshCw className="h-3.5 w-3.5" /> PDF generating</Badge>}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <Card>
            <CardHeader title="Line items" />
            <Table>
              <THead><TH>Description</TH><TH>SAC</TH><TH className="text-right">Qty</TH><TH className="text-right">Unit</TH><TH className="text-right">Total</TH></THead>
              <tbody>
                {inv.items?.map((it, i) => (
                  <TR key={it.id ?? i}>
                    <TD className="text-ink">{it.description}</TD>
                    <TD><span className="font-mono text-xs">{it.sacCode}</span></TD>
                    <TD className="text-right">{it.quantity}</TD>
                    <TD className="text-right">{inv.currency} {parseFloat(it.unitAmount).toLocaleString()}</TD>
                    <TD className="text-right font-medium">{inv.currency} {parseFloat(it.lineTotal).toLocaleString()}</TD>
                  </TR>
                ))}
              </tbody>
            </Table>
            <CardBody className="border-t border-paper-border">
              <div className="ml-auto w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm"><span className="text-ink-muted">Subtotal</span><span className="font-medium">{inv.currency} {parseFloat(inv.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between text-sm"><span className="text-ink-muted">FX rate ({inv.fxRateSource})</span><span className="font-mono">{parseFloat(inv.fxRate).toFixed(4)}</span></div>
                <div className="flex justify-between border-t border-paper-border pt-2"><span className="text-ink-muted text-sm">INR equivalent</span><span className="font-semibold text-ink">{formatMoney(inv.inrEquivalent)}</span></div>
              </div>
            </CardBody>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card className="h-fit overflow-hidden">
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-4 flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-white" />
              <div><p className="text-sm font-semibold text-white">Compliance</p><p className="text-xs text-brand-100">Auto-filled &amp; locked on this invoice</p></div>
            </div>
            <CardBody className="space-y-4 text-sm">
              <div><p className="text-xs text-ink-faint flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Place of supply</p><p className="text-ink-soft mt-0.5">{inv.placeOfSupply}</p></div>
              <div><p className="text-xs text-ink-faint flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Export declaration</p><p className="text-ink-soft mt-0.5 leading-snug">{inv.declarationText}</p></div>
              <div><p className="text-xs text-ink-faint flex items-center gap-1.5"><Coins className="h-3.5 w-3.5" /> Rate captured</p><p className="text-ink-soft mt-0.5 font-mono">1 {inv.currency} = ₹{parseFloat(inv.fxRate).toFixed(4)} · {formatDate(inv.fxRateDate)}</p></div>
              <div><p className="text-xs text-ink-faint flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" /> FEMA realisation due</p><p className={`mt-0.5 ${atRisk ? 'text-red-600 font-medium' : 'text-ink-soft'}`}>{formatDate(inv.femaDueDate)}</p></div>
            </CardBody>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
