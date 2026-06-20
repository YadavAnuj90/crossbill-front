'use client';
import { useEffect, useState, useCallback } from 'react';
import { FileMinus, FilePlus, Plus, Download, Trash2, Receipt } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Invoice, Note, NoteKind, CreateNoteItemInput } from '@/lib/types';
import { formatDate, formatMoney } from '@/lib/format';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { cn } from '@/lib/cn';

type Row = CreateNoteItemInput & { lineKey: string };

function rowsFromInvoice(inv: Invoice): Row[] {
  return (inv.items ?? []).map((it, i) => ({
    lineKey: it.id ?? String(i),
    description: it.description,
    sacCode: it.sacCode,
    quantity: parseFloat(it.quantity),
    unitAmount: parseFloat(it.unitAmount),
    gstRate: it.gstRate,
  }));
}

export function NotesPanel({ invoice }: { invoice: Invoice }) {
  const { notify } = useToast();
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<NoteKind>('credit');
  const [reason, setReason] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api.notes.listForInvoice(invoice.id).then(setNotes).catch(() => setNotes([]));
  }, [invoice.id]);
  useEffect(() => { load(); }, [load]);

  function openModal(k: NoteKind) {
    setKind(k);
    setReason('');
    setRows(rowsFromInvoice(invoice));
    setOpen(true);
  }

  function setRow(key: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.lineKey === key ? { ...r, ...patch } : r)));
  }
  function removeRow(key: string) {
    setRows((rs) => rs.filter((r) => r.lineKey !== key));
  }
  function addRow() {
    setRows((rs) => [...rs, { lineKey: `new-${rs.length}-${Date.now()}`, description: '', quantity: 1, unitAmount: 0, gstRate: invoice.type === 'domestic' ? 18 : 0 }]);
  }

  const domestic = invoice.type === 'domestic';
  const subtotal = rows.reduce((a, r) => a + (Number(r.quantity) || 0) * (Number(r.unitAmount) || 0), 0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) { notify('error', 'A reason is required (GST §34)'); return; }
    const items = rows.filter((r) => r.description.trim() && Number(r.quantity) > 0);
    if (items.length === 0) { notify('error', 'Add at least one line item'); return; }
    setSaving(true);
    try {
      await api.notes.create({
        invoiceId: invoice.id,
        kind,
        reason: reason.trim(),
        items: items.map((r) => ({
          description: r.description.trim(),
          sacCode: r.sacCode || undefined,
          quantity: Number(r.quantity),
          unitAmount: Number(r.unitAmount),
          gstRate: domestic ? Number(r.gstRate ?? 0) : 0,
        })),
      });
      notify('success', `${kind === 'credit' ? 'Credit' : 'Debit'} note created`);
      setOpen(false);
      load();
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Could not create note');
    } finally { setSaving(false); }
  }

  async function getPdf(n: Note) {
    try { const { url } = await api.notes.pdf(n.id); window.open(url, '_blank'); }
    catch { notify('info', 'PDF is still generating — try again in a moment'); }
  }

  return (
    <Card>
      <CardHeader
        title="Credit & Debit Notes"
        subtitle="Adjust this invoice under GST §34 — issues a numbered, PDF note."
        action={
          <div className="flex items-center gap-1.5">
            <button onClick={() => openModal('credit')} className="btn-ghost text-sm py-1.5"><FileMinus className="h-4 w-4" /> Credit note</button>
            <button onClick={() => openModal('debit')} className="btn-ghost text-sm py-1.5"><FilePlus className="h-4 w-4" /> Debit note</button>
          </div>
        }
      />
      {notes === null ? (
        <CardBody className="text-sm text-ink-muted">Loading…</CardBody>
      ) : notes.length === 0 ? (
        <CardBody className="text-center py-8">
          <span className="grid h-11 w-11 mx-auto place-items-center rounded-2xl bg-paper text-ink-faint mb-3"><Receipt className="h-5 w-5" /></span>
          <p className="text-sm text-ink-muted">No notes raised against this invoice.</p>
          <p className="text-xs text-ink-faint mt-1">Use a credit note to reduce, or a debit note to increase, the invoiced amount.</p>
        </CardBody>
      ) : (
        <Table>
          <THead><TH>Note</TH><TH>Type</TH><TH>Date</TH><TH>Reason</TH><TH className="text-right">Amount</TH><TH className="text-right">PDF</TH></THead>
          <tbody>
            {notes.map((n) => (
              <TR key={n.id}>
                <TD><span className="font-mono text-xs text-ink">{n.number}</span></TD>
                <TD>{n.kind === 'credit' ? <Badge tone="amber">Credit</Badge> : <Badge tone="blue">Debit</Badge>}</TD>
                <TD>{formatDate(n.noteDate)}</TD>
                <TD><span className="block max-w-[220px] truncate" title={n.reason}>{n.reason}</span></TD>
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
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`${kind === 'credit' ? 'Credit' : 'Debit'} note · against ${invoice.number}`}
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button form="note-form" type="submit" loading={saving}>Create {kind} note</Button>
        </>}
      >
        <form id="note-form" onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-paper border border-paper-border">
            {([['credit', 'Credit · reduce', FileMinus], ['debit', 'Debit · increase', FilePlus]] as [NoteKind, string, any][]).map(([k, lbl, Icon]) => (
              <button key={k} type="button" onClick={() => setKind(k)}
                className={cn('inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition', kind === k ? 'bg-paper-card shadow-card text-ink' : 'text-ink-muted hover:text-ink')}>
                <Icon className="h-4 w-4" /> {lbl}
              </button>
            ))}
          </div>

          <Input label="Reason" required value={reason} onChange={(e) => setReason(e.target.value)} placeholder={kind === 'credit' ? 'Post-sale discount / return' : 'Undercharged / additional scope'} hint="Printed on the note and reported in GSTR-1 (CDNR/CDNUR)." />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Line items</label>
              <button type="button" onClick={addRow} className="btn-ghost text-xs py-1"><Plus className="h-3.5 w-3.5" /> Add line</button>
            </div>
            <div className="space-y-2">
              {rows.map((r) => (
                <div key={r.lineKey} className="grid grid-cols-[1fr_56px_80px_56px_auto] gap-2 items-center">
                  <input className="field py-2 text-sm" value={r.description} onChange={(e) => setRow(r.lineKey, { description: e.target.value })} placeholder="Description" />
                  <input className="field py-2 text-sm text-right" type="number" min={0} step="0.01" value={r.quantity} onChange={(e) => setRow(r.lineKey, { quantity: parseFloat(e.target.value) })} placeholder="Qty" />
                  <input className="field py-2 text-sm text-right" type="number" min={0} step="0.01" value={r.unitAmount} onChange={(e) => setRow(r.lineKey, { unitAmount: parseFloat(e.target.value) })} placeholder="Unit" />
                  {domestic ? (
                    <select className="field py-2 text-sm" value={r.gstRate ?? 18} onChange={(e) => setRow(r.lineKey, { gstRate: parseInt(e.target.value, 10) })}>
                      {[0, 5, 12, 18, 28].map((g) => <option key={g} value={g}>{g}%</option>)}
                    </select>
                  ) : <span className="text-xs text-ink-faint text-center">0%</span>}
                  <button type="button" onClick={() => removeRow(r.lineKey)} className="btn-ghost p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-sm border-t border-paper-border pt-3">
              <span className="text-ink-muted">{domestic ? 'Taxable value' : 'Subtotal'}</span>
              <span className="font-semibold text-ink">{formatMoney(subtotal.toFixed(2), invoice.currency)}</span>
            </div>
            {!domestic && <p className="hint mt-1">FX rate {parseFloat(invoice.fxRate).toFixed(4)} is carried over from the original invoice.</p>}
          </div>
        </form>
      </Modal>
    </Card>
  );
}
