'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  IndianRupee, Plus, Download, Trash2, Play, Lock, Users,
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Employee, SalarySlip, PayrollRun, CreateSlipInput } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';

const money = (s: string) => `₹${parseFloat(s || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
const num = (s?: string) => Math.round(parseFloat(s || '0') * 100);
const thisMonth = new Date().toISOString().slice(0, 7);

const emptySlip: CreateSlipInput = { employeeId: '', month: thisMonth, basic: '', hra: '', bonus: '', allowances: '', pf: '', esic: '', tds: '', otherDeductions: '' };

export default function PayrollPage() {
  const { notify } = useToast();
  const [month, setMonth] = useState(thisMonth);
  const [slips, setSlips] = useState<SalarySlip[] | null>(null);
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateSlipInput>(emptySlip);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);

  function load() {
    api.payroll.listSlips('', month).then(setSlips).catch(() => setSlips([]));
    api.payroll.listRuns().then(setRuns).catch(() => {});
  }
  useEffect(() => { api.employees.list('', '', 'active').then((p) => setEmployees(p.items)).catch(() => {}); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [month]);

  const live = useMemo(() => {
    const grossP = num(form.basic) + num(form.hra) + num(form.bonus) + num(form.allowances);
    const dedP = num(form.pf) + num(form.esic) + num(form.tds) + num(form.otherDeductions);
    return { gross: (grossP / 100).toFixed(2), deductions: (dedP / 100).toFixed(2), net: ((grossP - dedP) / 100).toFixed(2) };
  }, [form]);

  const run = runs.find((r) => r.period === month);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeId) { notify('error', 'Pick an employee'); return; }
    setSaving(true);
    try { await api.payroll.createSlip({ ...form, month }); notify('success', 'Salary slip generated'); setOpen(false); setForm(emptySlip); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not generate'); }
    finally { setSaving(false); }
  }
  async function removeSlip(s: SalarySlip) {
    if (!confirm(`Delete ${s.employeeName}'s slip for ${s.month}?`)) return;
    try { await api.payroll.removeSlip(s.id); notify('success', 'Deleted'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
  }
  async function openPdf(s: SalarySlip) {
    try { const fresh = await api.payroll.getSlip(s.id); if (fresh.pdfUrl) window.open(fresh.pdfUrl, '_blank'); else notify('info', 'PDF still generating'); }
    catch { notify('info', 'PDF still generating — try again'); }
  }
  async function generateRun() {
    setBusy(true);
    try { await api.payroll.run(month); notify('success', 'Payroll run updated'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
    finally { setBusy(false); }
  }
  async function finalise() {
    if (!confirm(`Finalise payroll for ${month}? Slips will be locked.`)) return;
    setBusy(true);
    try { await api.payroll.finalise(month); notify('success', 'Payroll finalised'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <PageHeader
        eyebrow="People & HR"
        title="Payroll"
        subtitle="Generate watermarked salary slips and run monthly payroll."
        icon={<IndianRupee className="h-5 w-5" />}
        action={<div className="flex items-center gap-2">
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="field max-w-[160px] py-1.5" />
          <Button onClick={() => { setForm({ ...emptySlip, month }); setOpen(true); }}><Plus className="h-4 w-4" /> New slip</Button>
        </div>}
      />

      {/* Run summary */}
      <Reveal>
        <Card className="mb-6 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="grid grid-cols-3 gap-6">
              <div><p className="text-xs text-ink-muted">Gross</p><p className="text-lg font-semibold text-ink">{money(run?.gross ?? '0')}</p></div>
              <div><p className="text-xs text-ink-muted">Deductions</p><p className="text-lg font-semibold text-ink">{money(run?.deductions ?? '0')}</p></div>
              <div><p className="text-xs text-ink-muted">Net payout</p><p className="text-lg font-semibold text-brand-700">{money(run?.net ?? '0')}</p></div>
            </div>
            <div className="flex items-center gap-2">
              {run?.status === 'finalised' ? <Badge tone="green"><Lock className="h-3.5 w-3.5" /> Finalised</Badge> : (
                <>
                  <Button variant="secondary" loading={busy} onClick={generateRun}><Play className="h-4 w-4" /> Run payroll</Button>
                  {run && <Button loading={busy} onClick={finalise}><Lock className="h-4 w-4" /> Finalise</Button>}
                </>
              )}
            </div>
          </div>
        </Card>
      </Reveal>

      <Reveal delay={60}>
        <Card>
          <CardHeader title={`Salary slips · ${month}`} subtitle="Each slip is a watermarked PDF, downloadable below." />
          {slips === null ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : slips.length === 0 ? (
            <EmptyState icon={<IndianRupee className="h-6 w-6" />} title={`No slips for ${month}`} description="Generate salary slips for your team, then run payroll.">
              {employees.length === 0
                ? <Link href="/employees" className="btn-primary mt-6"><Users className="h-4 w-4" /> Add employees first</Link>
                : <Button className="mt-6" onClick={() => { setForm({ ...emptySlip, month }); setOpen(true); }}><Plus className="h-4 w-4" /> New slip</Button>}
            </EmptyState>
          ) : (
            <Table>
              <THead><TH>Employee</TH><TH className="text-right">Gross</TH><TH className="text-right">Deductions</TH><TH className="text-right">Net</TH><TH>Status</TH><TH className="text-right">PDF</TH></THead>
              <tbody>
                {slips.map((s) => (
                  <TR key={s.id}>
                    <TD><p className="font-medium text-ink">{s.employeeName}</p><p className="text-xs text-ink-faint">{s.empCode} · {s.designation ?? '—'}</p></TD>
                    <TD className="text-right">{money(s.gross)}</TD>
                    <TD className="text-right">{money(s.totalDeductions)}</TD>
                    <TD className="text-right font-medium text-brand-700">{money(s.net)}</TD>
                    <TD>{s.status === 'finalised' ? <Badge tone="green">Finalised</Badge> : <Badge tone="gray">Draft</Badge>}</TD>
                    <TD className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => openPdf(s)} className="btn-ghost text-sm py-1.5 text-brand-700"><Download className="h-4 w-4" /> Slip</button>
                        {s.status !== 'finalised' && <button onClick={() => removeSlip(s)} className="btn-ghost p-2 text-red-500"><Trash2 className="h-4 w-4" /></button>}
                      </div>
                    </TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} title={`New salary slip · ${month}`}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button form="slip-form" type="submit" loading={saving}>Generate slip</Button></>}>
        <form id="slip-form" onSubmit={create} className="space-y-4">
          <Select label="Employee" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
            <option value="">Select…</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} · {e.empCode}</option>)}
          </Select>
          <div>
            <p className="label">Earnings (₹)</p>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Basic" value={form.basic} onChange={(e) => setForm({ ...form, basic: e.target.value })} placeholder="50000" />
              <Input label="HRA" value={form.hra} onChange={(e) => setForm({ ...form, hra: e.target.value })} placeholder="20000" />
              <Input label="Bonus" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: e.target.value })} placeholder="0" />
              <Input label="Allowances" value={form.allowances} onChange={(e) => setForm({ ...form, allowances: e.target.value })} placeholder="0" />
            </div>
          </div>
          <div>
            <p className="label">Deductions (₹)</p>
            <div className="grid grid-cols-2 gap-3">
              <Input label="PF" value={form.pf} onChange={(e) => setForm({ ...form, pf: e.target.value })} placeholder="1800" />
              <Input label="ESIC" value={form.esic} onChange={(e) => setForm({ ...form, esic: e.target.value })} placeholder="0" />
              <Input label="TDS" value={form.tds} onChange={(e) => setForm({ ...form, tds: e.target.value })} placeholder="0" />
              <Input label="Other" value={form.otherDeductions} onChange={(e) => setForm({ ...form, otherDeductions: e.target.value })} placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-paper p-3 text-center">
            <div><p className="text-[11px] text-ink-muted">Gross</p><p className="font-semibold text-ink">{money(live.gross)}</p></div>
            <div><p className="text-[11px] text-ink-muted">Deductions</p><p className="font-semibold text-ink">{money(live.deductions)}</p></div>
            <div><p className="text-[11px] text-ink-muted">Net pay</p><p className="font-semibold text-brand-700">{money(live.net)}</p></div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
