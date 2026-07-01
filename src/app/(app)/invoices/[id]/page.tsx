'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Download, CheckCircle2, ShieldCheck, Globe, CalendarClock, RefreshCw, Coins,
  Wallet, FileCheck2, Plus, Building2, MapPin, Receipt, QrCode, Ban,
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Invoice, Remittance, EInvoice } from '@/lib/types';
import { stateNameOf } from '@/lib/types';
import { formatMoney, formatDate, daysUntil } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';
import { RecordPaymentModal } from '@/components/invoices/RecordPaymentModal';
import { NotesPanel } from '@/components/invoices/NotesPanel';
import { PaymentLinkButton } from '@/components/invoices/PaymentLinkButton';

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { notify } = useToast();
  const [inv, setInv] = useState<Invoice | null>(null);
  const [remittances, setRemittances] = useState<Remittance[]>([]);
  const [einv, setEinv] = useState<EInvoice | null>(null);
  const [busy, setBusy] = useState(false);
  const [eBusy, setEBusy] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const load = useCallback(() => {
    api.invoices.get(id).then(setInv).catch(() => notify('error', 'Invoice not found'));
    api.remittances.listForInvoice(id).then(setRemittances).catch(() => {});
    api.einvoice.get(id).then(setEinv).catch(() => {});
  }, [id, notify]);
  useEffect(() => { load(); }, [load]);

  async function getPdf() {
    if (!inv) return;
    setBusy(true);
    try { const { url } = await api.invoices.pdf(inv.id); window.open(url, '_blank'); }
    catch { notify('info', 'PDF is still generating — try again in a moment'); }
    finally { setBusy(false); }
  }

  async function markPaid() {
    if (!inv) return;
    setBusy(true);
    try { const u = await api.invoices.updateStatus(inv.id, 'paid'); setInv(u); notify('success', 'Marked as paid'); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not update'); }
    finally { setBusy(false); }
  }

  async function generateIrn() {
    setEBusy(true);
    try { const e = await api.einvoice.generate(id); setEinv(e); notify('success', 'IRN generated'); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not generate IRN'); }
    finally { setEBusy(false); }
  }

  async function cancelIrn() {
    const reason = window.prompt('Reason for cancelling this IRN?');
    if (!reason || !reason.trim()) return;
    setEBusy(true);
    try { const e = await api.einvoice.cancel(id, reason.trim()); setEinv(e); notify('success', 'IRN cancelled'); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not cancel IRN'); }
    finally { setEBusy(false); }
  }

  if (!inv) return <PageLoader />;

  const domestic = inv.type === 'domestic';
  const d = inv.femaDueDate ? daysUntil(inv.femaDueDate) : 0;
  const atRisk = !domestic && inv.status !== 'paid' && d <= 90;

  return (
    <div>
      <Link href="/invoices" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4 transition-colors"><ArrowLeft className="h-4 w-4" /> Invoices</Link>
      <PageHeader
        eyebrow={`FY ${inv.financialYear} · ${domestic ? 'Domestic GST' : 'Export'}`}
        title={inv.number}
        subtitle={`Raised ${formatDate(inv.invoiceDate)}`}
        action={
          <div className="flex items-center gap-2">
            {inv.status !== 'paid' && (domestic
              ? <Button variant="secondary" onClick={markPaid} loading={busy}><CheckCircle2 className="h-4 w-4" /> Mark paid</Button>
              : <Button variant="secondary" onClick={() => setPayOpen(true)}><Wallet className="h-4 w-4" /> Record payment</Button>)}
            <PaymentLinkButton invoice={inv} />
            <Button onClick={getPdf} loading={busy}><Download className="h-4 w-4" /> Download PDF</Button>
          </div>
        }
      />

      <div className="flex items-center gap-2 mb-6">
        <StatusBadge status={inv.status} />
        {domestic ? <Badge tone="blue"><Building2 className="h-3.5 w-3.5" /> {inv.taxType === 'CGST_SGST' ? 'CGST + SGST' : 'IGST'}</Badge> : <Badge tone="green"><Globe className="h-3.5 w-3.5" /> Export · 0% IGST</Badge>}
        {atRisk && <Badge tone="red"><CalendarClock className="h-3.5 w-3.5" /> FEMA due in {d} days</Badge>}
        {!inv.pdfUrl && <Badge tone="amber"><RefreshCw className="h-3.5 w-3.5" /> PDF generating</Badge>}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Reveal>
            <Card>
              <CardHeader title="Line items" />
              <Table>
                <THead><TH>Description</TH><TH>{domestic ? 'HSN/SAC' : 'SAC'}</TH><TH className="text-right">Qty</TH><TH className="text-right">Unit</TH>{domestic && <TH className="text-right">GST</TH>}<TH className="text-right">Total</TH></THead>
                <tbody>
                  {inv.items?.map((it, i) => (
                    <TR key={it.id ?? i}>
                      <TD className="text-ink">{it.description}</TD>
                      <TD><span className="font-mono text-xs">{it.sacCode}</span></TD>
                      <TD className="text-right">{it.quantity}</TD>
                      <TD className="text-right">{inv.currency} {parseFloat(it.unitAmount).toLocaleString()}</TD>
                      {domestic && <TD className="text-right">{it.gstRate}%</TD>}
                      <TD className="text-right font-medium">{inv.currency} {parseFloat(it.lineTotal).toLocaleString()}</TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
              <CardBody className="border-t border-paper-border">
                <div className="ml-auto w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-ink-muted">{domestic ? 'Taxable value' : 'Subtotal'}</span><span className="font-medium">{inv.currency} {parseFloat(inv.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  {domestic ? (
                    <>
                      {inv.taxType === 'CGST_SGST' ? (
                        <>
                          <div className="flex justify-between text-sm"><span className="text-ink-muted">CGST</span><span className="font-mono">₹{parseFloat(inv.cgstAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-ink-muted">SGST</span><span className="font-mono">₹{parseFloat(inv.sgstAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        </>
                      ) : (
                        <div className="flex justify-between text-sm"><span className="text-ink-muted">IGST</span><span className="font-mono">₹{parseFloat(inv.igstAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                      )}
                      <div className="flex justify-between border-t border-paper-border pt-2"><span className="text-ink-muted text-sm">Grand total</span><span className="font-semibold text-ink">{formatMoney(inv.grandTotal)}</span></div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm"><span className="text-ink-muted">FX rate ({inv.fxRateSource})</span><span className="font-mono">{parseFloat(inv.fxRate).toFixed(4)}</span></div>
                      <div className="flex justify-between border-t border-paper-border pt-2"><span className="text-ink-muted text-sm">INR equivalent</span><span className="font-semibold text-ink">{formatMoney(inv.inrEquivalent)}</span></div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </Reveal>

          {/* Payments (export only — FIRC evidence) */}
          {!domestic && (
            <Reveal delay={60}>
              <Card>
                <CardHeader title="Payments & FIRC" subtitle="Foreign inward remittances recorded against this invoice."
                  action={inv.status !== 'paid' ? <button onClick={() => setPayOpen(true)} className="btn-ghost text-sm py-1.5"><Plus className="h-4 w-4" /> Record</button> : undefined} />
                {remittances.length === 0 ? (
                  <CardBody className="text-center py-8">
                    <span className="grid h-11 w-11 mx-auto place-items-center rounded-2xl bg-paper text-ink-faint mb-3"><Wallet className="h-5 w-5" /></span>
                    <p className="text-sm text-ink-muted">No payment recorded yet.</p>
                    {inv.status !== 'paid' && <Button variant="secondary" className="mt-4" onClick={() => setPayOpen(true)}><Wallet className="h-4 w-4" /> Record payment</Button>}
                  </CardBody>
                ) : (
                  <Table>
                    <THead><TH>Received</TH><TH>Amount</TH><TH>Purpose</TH><TH className="text-right">FIRC</TH></THead>
                    <tbody>
                      {remittances.map((r) => (
                        <TR key={r.id}>
                          <TD>{formatDate(r.receivedDate)}</TD>
                          <TD className="font-medium">{r.currency} {parseFloat(r.amountReceived).toLocaleString()}</TD>
                          <TD><span className="font-mono text-xs">{r.purposeCode}</span></TD>
                          <TD className="text-right">{r.fircDocUrl ? <a href={api.remittances.fircUrl(r.id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-brand-700 hover:underline"><FileCheck2 className="h-4 w-4" /> View</a> : <span className="text-xs text-ink-faint">—</span>}</TD>
                        </TR>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card>
            </Reveal>
          )}

          <Reveal delay={domestic ? 60 : 120}>
            <NotesPanel invoice={inv} />
          </Reveal>
        </div>

        {/* Compliance side card */}
        <Reveal delay={80}>
          <Card className="h-fit overflow-hidden">
            <div className={`px-5 py-4 flex items-center gap-2.5 ${domestic ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-brand-600 to-brand-700'}`}>
              {domestic ? <Receipt className="h-5 w-5 text-white" /> : <ShieldCheck className="h-5 w-5 text-white" />}
              <div><p className="text-sm font-semibold text-white">{domestic ? 'GST details' : 'Export compliance'}</p><p className="text-xs text-white/70">Auto-filled &amp; locked</p></div>
            </div>
            <CardBody className="space-y-4 text-sm">
              {domestic ? (
                <>
                  <div><p className="text-xs text-ink-faint flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Place of supply</p><p className="text-ink-soft mt-0.5">{stateNameOf(inv.placeOfSupplyState)} ({inv.placeOfSupplyState})</p></div>
                  <div><p className="text-xs text-ink-faint flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Supply type</p><p className="text-ink-soft mt-0.5">{inv.taxType === 'CGST_SGST' ? 'Intra-state — CGST + SGST' : 'Inter-state — IGST'}</p></div>
                  <div><p className="text-xs text-ink-faint flex items-center gap-1.5"><Coins className="h-3.5 w-3.5" /> Total GST</p><p className="text-ink-soft mt-0.5 font-mono">₹{parseFloat(inv.taxTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                  <div><p className="text-xs text-ink-faint">Note</p><p className="text-ink-soft mt-0.5 leading-snug">{inv.declarationText}</p></div>
                </>
              ) : (
                <>
                  <div><p className="text-xs text-ink-faint flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Place of supply</p><p className="text-ink-soft mt-0.5">{inv.placeOfSupply}</p></div>
                  <div><p className="text-xs text-ink-faint flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Export declaration</p><p className="text-ink-soft mt-0.5 leading-snug">{inv.declarationText}</p></div>
                  <div><p className="text-xs text-ink-faint flex items-center gap-1.5"><Coins className="h-3.5 w-3.5" /> Rate captured</p><p className="text-ink-soft mt-0.5 font-mono">1 {inv.currency} = ₹{parseFloat(inv.fxRate).toFixed(4)} · {formatDate(inv.fxRateDate)}</p></div>
                  <div><p className="text-xs text-ink-faint flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" /> FEMA realisation due</p><p className={`mt-0.5 ${atRisk ? 'text-red-600 font-medium' : 'text-ink-soft'}`}>{inv.femaDueDate ? formatDate(inv.femaDueDate) : '—'}{inv.status !== 'paid' && inv.femaDueDate && <span className="text-ink-faint"> · {d > 0 ? `${d} days left` : 'overdue'}</span>}</p></div>
                </>
              )}
            </CardBody>
          </Card>
        </Reveal>

        <Reveal delay={140}>
          <Card className="h-fit">
            <CardHeader title="E-Invoice (IRN)" subtitle="GST IRP registration & signed QR." />
            <CardBody className="space-y-4">
              {!einv || einv.status === 'cancelled' ? (
                <>
                  {einv?.status === 'cancelled' && <Badge tone="red"><Ban className="h-3.5 w-3.5" /> Previous IRN cancelled</Badge>}
                  <p className="text-sm text-ink-muted leading-snug">Register this invoice on the IRP to get a GST-valid IRN + signed QR.</p>
                  <Button onClick={generateIrn} loading={eBusy}><QrCode className="h-4 w-4" /> Generate IRN</Button>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="green"><ShieldCheck className="h-3.5 w-3.5" /> Generated</Badge>
                    {einv.sandbox && <span className="rounded-full bg-paper px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-ink-faint ring-1 ring-inset ring-paper-border">Sandbox</span>}
                  </div>
                  <div>
                    <p className="text-xs text-ink-faint">IRN</p>
                    <p className="mt-0.5 font-mono text-xs text-ink-soft break-all">{einv.irn}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-xs text-ink-faint">Ack No</p><p className="mt-0.5 font-mono text-xs text-ink-soft">{einv.ackNo ?? '—'}</p></div>
                    <div><p className="text-xs text-ink-faint">Ack Date</p><p className="mt-0.5 text-ink-soft">{einv.ackDate ? formatDate(einv.ackDate) : '—'}</p></div>
                  </div>
                  {einv.qrImage ? (
                    <img src={einv.qrImage} alt="e-invoice QR" className="h-36 w-36 rounded-lg border border-paper-border bg-white p-1" />
                  ) : (
                    <p className="text-xs text-ink-muted">QR image unavailable — run <code>npm install qrcode</code> in the API.</p>
                  )}
                  <button onClick={cancelIrn} disabled={eBusy} className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:underline disabled:opacity-50"><Ban className="h-3.5 w-3.5" /> Cancel IRN</button>
                </>
              )}
            </CardBody>
          </Card>
        </Reveal>
      </div>

      {!domestic && <RecordPaymentModal invoice={inv} open={payOpen} onClose={() => setPayOpen(false)} onRecorded={load} />}
    </div>
  );
}
