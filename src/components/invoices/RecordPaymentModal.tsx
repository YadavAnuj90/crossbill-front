'use client';
import { useRef, useState } from 'react';
import { Upload, FileCheck2, X } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Invoice } from '@/lib/types';
import { PURPOSE_CODES, DEFAULT_PURPOSE_CODE } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export function RecordPaymentModal({ invoice, open, onClose, onRecorded }: {
  invoice: Invoice; open: boolean; onClose: () => void; onRecorded: () => void;
}) {
  const { notify } = useToast();
  const [amount, setAmount] = useState<string>(invoice.subtotal);
  const [currency, setCurrency] = useState(invoice.currency);
  const [receivedDate, setReceivedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [purposeCode, setPurposeCode] = useState(DEFAULT_PURPOSE_CODE);
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function pickFile(f: File | null) {
    if (f && f.size > 10 * 1024 * 1024) { notify('error', 'FIRC must be 10 MB or smaller'); return; }
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { notify('error', 'Enter the amount received'); return; }
    setSaving(true);
    try {
      const remittance = await api.remittances.create({
        invoiceId: invoice.id, amountReceived: amt, currency, receivedDate, purposeCode,
        notes: notes || undefined,
      });
      if (file) {
        try { await api.remittances.uploadFirc(remittance.id, file); }
        catch { notify('error', 'Payment saved, but the FIRC upload failed — you can add it again.'); }
      }
      notify('success', 'Payment recorded — invoice marked paid');
      onRecorded();
      onClose();
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Could not record payment');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record payment & FIRC"
      footer={<>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button form="remit-form" type="submit" loading={saving}>Record payment</Button>
      </>}
    >
      <form id="remit-form" onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Amount received" type="number" step="0.01" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Input label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} maxLength={3} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Received on" type="date" value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} />
          <Select label="Purpose code" value={purposeCode} onChange={(e) => setPurposeCode(e.target.value)} hint="RBI BoP code — confirm with your bank.">
            {PURPOSE_CODES.map((p) => <option key={p.code} value={p.code}>{p.code} — {p.description}</option>)}
          </Select>
        </div>

        {/* FIRC dropzone */}
        <div>
          <label className="label">FIRC / e-FIRA <span className="text-ink-faint font-normal">(optional, PDF or image)</span></label>
          {file ? (
            <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/60 px-3.5 py-3">
              <FileCheck2 className="h-5 w-5 text-brand-600 shrink-0" />
              <span className="text-sm text-ink-soft truncate flex-1">{file.name}</span>
              <span className="text-xs text-ink-faint">{(file.size / 1024).toFixed(0)} KB</span>
              <button type="button" onClick={() => setFile(null)} className="text-ink-faint hover:text-ink p-1"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-paper-border bg-paper/50 px-3.5 py-4 text-sm text-ink-muted hover:border-brand-300 hover:bg-brand-50/40 transition">
              <Upload className="h-4 w-4" /> Click to attach the bank&apos;s remittance proof
            </button>
          )}
          <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,image/*,application/pdf" className="hidden" onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
        </div>

        <div>
          <label className="label">Notes <span className="text-ink-faint font-normal">(optional)</span></label>
          <textarea className="field min-h-[64px] resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Bank ref, UTR, etc." maxLength={500} />
        </div>
      </form>
    </Modal>
  );
}
