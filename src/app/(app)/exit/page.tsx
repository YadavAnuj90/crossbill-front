'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, Plus, Check, X, Users, ShieldCheck, Lock } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Employee, Exit, CreateExitInput } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Reveal } from '@/components/motion/Reveal';

const STATUS_TONE: Record<string, 'gray' | 'blue' | 'amber' | 'green'> = { initiated: 'gray', notice: 'amber', cleared: 'blue', settled: 'green' };

export default function ExitPage() {
  const { notify } = useToast();
  const [rows, setRows] = useState<Exit[] | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateExitInput>({ employeeId: '', resignationDate: new Date().toISOString().slice(0, 10), noticeDays: 30, reason: '' });
  const [saving, setSaving] = useState(false);
  const [active, setActive] = useState<Exit | null>(null);

  function load() { api.exits.list().then(setRows).catch(() => setRows([])); }
  useEffect(() => { load(); api.employees.list('', '', 'active').then((p) => setEmployees(p.items)).catch(() => {}); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeId) { notify('error', 'Pick an employee'); return; }
    setSaving(true);
    try { await api.exits.create({ ...form, reason: form.reason || undefined }); notify('success', 'Exit initiated'); setOpen(false); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
    finally { setSaving(false); }
  }

  async function patch(id: string, input: Parameters<typeof api.exits.update>[1]) {
    try { const updated = await api.exits.update(id, input); setActive(updated); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
  }

  return (
    <div>
      <PageHeader
        eyebrow="People & HR"
        title="Exit management"
        subtitle="Resignations, notice periods, asset clearance and final settlement."
        icon={<LogOut className="h-5 w-5" />}
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Initiate exit</Button>}
      />

      <Reveal>
        <Card>
          {rows === null ? (
            <div className="p-5 space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={<LogOut className="h-6 w-6" />} title="No exits in progress" description="Initiate an exit to track notice period, asset return and final settlement.">
              {employees.length === 0
                ? <Link href="/employees" className="btn-primary mt-6"><Users className="h-4 w-4" /> Add employees first</Link>
                : <Button className="mt-6" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Initiate exit</Button>}
            </EmptyState>
          ) : (
            <div className="divide-y divide-paper-border">
              {rows.map((x) => (
                <button key={x.id} onClick={() => setActive(x)} className="w-full text-left px-5 py-4 hover:bg-paper/50 transition flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-ink">{x.employeeName}</p>
                    <p className="text-xs text-ink-faint">Resigned {formatDate(x.resignationDate)} · LWD {x.lastWorkingDate ? formatDate(x.lastWorkingDate) : '—'} · {x.noticeDays}d notice</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {x.status === 'settled' && <span className="text-sm font-medium text-brand-700">₹{parseFloat(x.finalSettlement).toLocaleString('en-IN')}</span>}
                    <Badge tone={STATUS_TONE[x.status] ?? 'gray'}>{x.status}</Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </Reveal>

      {/* Initiate */}
      <Modal open={open} onClose={() => setOpen(false)} title="Initiate exit"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button form="exit-form" type="submit" loading={saving}>Initiate</Button></>}>
        <form id="exit-form" onSubmit={create} className="space-y-4">
          <Select label="Employee" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
            <option value="">Select…</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Resignation date" type="date" value={form.resignationDate} onChange={(e) => setForm({ ...form, resignationDate: e.target.value })} />
            <Input label="Notice (days)" type="number" value={String(form.noticeDays ?? 30)} onChange={(e) => setForm({ ...form, noticeDays: parseInt(e.target.value || '0', 10) })} />
          </div>
          <div><label className="label">Reason</label><textarea className="field min-h-[64px] resize-y" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Optional" maxLength={500} /></div>
        </form>
      </Modal>

      {/* Manage clearance */}
      <Modal open={!!active} onClose={() => setActive(null)} title={active ? `Exit · ${active.employeeName}` : ''}
        footer={<Button variant="secondary" onClick={() => setActive(null)}>Close</Button>}>
        {active && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-ink-faint text-xs">Resignation</p><p className="text-ink">{formatDate(active.resignationDate)}</p></div>
              <div><p className="text-ink-faint text-xs">Last working day</p><p className="text-ink">{active.lastWorkingDate ? formatDate(active.lastWorkingDate) : '—'}</p></div>
            </div>

            <div>
              <p className="label">Asset return</p>
              <div className="space-y-2">
                {active.assets.map((a, i) => (
                  <label key={i} className="flex items-center gap-3 rounded-lg border border-paper-border px-3 py-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={a.returned} onChange={(e) => patch(active.id, { assets: active.assets.map((x, j) => j === i ? { asset: x.asset, returned: e.target.checked } : { asset: x.asset, returned: x.returned }) })} className="h-4 w-4 rounded border-paper-border text-brand-600" />
                    <span className={a.returned ? 'line-through text-ink-faint' : 'text-ink'}>{a.asset}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => patch(active.id, { managerApproved: !active.managerApproved })} className={`rounded-lg border px-3 py-2.5 text-sm flex items-center justify-center gap-2 ${active.managerApproved ? 'border-brand-300 bg-brand-50 text-brand-700' : 'border-paper-border text-ink-muted'}`}>{active.managerApproved ? <Check className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />} Manager approval</button>
              <button onClick={() => patch(active.id, { hrApproved: !active.hrApproved })} className={`rounded-lg border px-3 py-2.5 text-sm flex items-center justify-center gap-2 ${active.hrApproved ? 'border-brand-300 bg-brand-50 text-brand-700' : 'border-paper-border text-ink-muted'}`}>{active.hrApproved ? <Check className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />} HR approval</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Final settlement (₹)" value={active.finalSettlement} onChange={(e) => setActive({ ...active, finalSettlement: e.target.value })} onBlur={() => patch(active.id, { finalSettlement: active.finalSettlement })} />
              <div className="flex items-end">
                <span className="text-sm text-ink-muted">Status: <Badge tone={STATUS_TONE[active.status] ?? 'gray'}>{active.status}</Badge></span>
              </div>
            </div>

            {active.status !== 'settled' && (
              <Button className="w-full" onClick={() => patch(active.id, { status: 'settled' })}><Lock className="h-4 w-4" /> Complete final settlement &amp; exit</Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
