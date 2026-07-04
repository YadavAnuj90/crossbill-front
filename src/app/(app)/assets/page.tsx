'use client';
import { useEffect, useState } from 'react';
import {
  Laptop, Plus, Search, Trash2, Archive, UserPlus, Undo2, Package, PackageCheck, PackageX,
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Asset, CreateAssetInput, Employee } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';

const STATUS_TONE: Record<string, 'gray' | 'blue' | 'amber' | 'green' | 'red'> = {
  in_stock: 'green', allocated: 'blue', retired: 'gray', lost: 'gray',
};
const STATUS_LABEL: Record<string, string> = {
  in_stock: 'In stock', allocated: 'Allocated', retired: 'Retired', lost: 'Lost',
};
const CATEGORY_LABEL: Record<string, string> = {
  laptop: 'Laptop', desktop: 'Desktop', phone: 'Phone', monitor: 'Monitor',
  sim: 'SIM', id_card: 'ID card', access_card: 'Access card', other: 'Other',
};
const CATEGORIES = ['laptop', 'desktop', 'phone', 'monitor', 'sim', 'id_card', 'access_card', 'other'];
const CONDITIONS = ['new', 'good', 'fair', 'poor'];
const CONDITION_LABEL: Record<string, string> = { new: 'New', good: 'Good', fair: 'Fair', poor: 'Poor' };

const empty: CreateAssetInput = {
  tag: '', name: '', category: 'laptop', serialNo: '', purchaseDate: '', cost: '', condition: 'good', notes: '',
};

export default function AssetsPage() {
  const { notify } = useToast();
  const [rows, setRows] = useState<Asset[] | null>(null);
  const [stats, setStats] = useState<{ total: number; inStock: number; allocated: number; retired: number; lost: number } | null>(null);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateAssetInput>(empty);
  const [saving, setSaving] = useState(false);

  const [assignTarget, setAssignTarget] = useState<Asset | null>(null);
  const [assignEmployeeId, setAssignEmployeeId] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [returnTarget, setReturnTarget] = useState<Asset | null>(null);
  const [returnCondition, setReturnCondition] = useState('good');
  const [returnNotes, setReturnNotes] = useState('');

  function load() {
    api.assets.list({ status: statusFilter, category: categoryFilter, q: q.trim() }).then(setRows).catch(() => setRows([]));
    api.assets.stats().then(setStats).catch(() => {});
  }
  useEffect(() => { load(); api.employees.list('', '', '', 1, 100).then((p) => setEmployees(p.items)).catch(() => {}); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [q, statusFilter, categoryFilter]);

  function openCreate() { setForm(empty); setOpen(true); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.tag.trim() || !form.name.trim()) { notify('error', 'Tag and name are required'); return; }
    const payload: CreateAssetInput = {
      tag: form.tag.trim(),
      name: form.name.trim(),
      category: form.category || undefined,
      serialNo: form.serialNo || undefined,
      purchaseDate: form.purchaseDate || undefined,
      cost: form.cost || undefined,
      condition: form.condition || undefined,
      notes: form.notes || undefined,
    };
    setSaving(true);
    try {
      await api.assets.create(payload);
      notify('success', 'Asset added'); setOpen(false); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not save'); }
    finally { setSaving(false); }
  }

  function openAssign(a: Asset) { setAssignTarget(a); setAssignEmployeeId(''); }
  async function onAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!assignTarget) return;
    if (!assignEmployeeId) { notify('error', 'Pick an employee'); return; }
    setSaving(true);
    try {
      await api.assets.assign(assignTarget.id, assignEmployeeId);
      notify('success', 'Asset assigned'); setAssignTarget(null); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not assign'); }
    finally { setSaving(false); }
  }

  function openReturn(a: Asset) { setReturnTarget(a); setReturnCondition(a.condition || 'good'); setReturnNotes(''); }
  async function onReturn(e: React.FormEvent) {
    e.preventDefault();
    if (!returnTarget) return;
    setSaving(true);
    try {
      await api.assets.returnAsset(returnTarget.id, { condition: returnCondition || undefined, notes: returnNotes || undefined });
      notify('success', 'Asset returned'); setReturnTarget(null); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not return'); }
    finally { setSaving(false); }
  }

  async function onRetire(a: Asset) {
    if (!confirm(`Retire "${a.name}" (${a.tag})? It will be marked out of service.`)) return;
    try { await api.assets.retire(a.id); notify('success', 'Asset retired'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not retire'); }
  }

  async function onDelete(a: Asset) {
    if (!confirm(`Delete "${a.name}" (${a.tag})? This removes the asset record.`)) return;
    try { await api.assets.remove(a.id); notify('success', 'Asset deleted'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not delete'); }
  }

  const STAT_CARDS = stats ? [
    { label: 'Total', value: stats.total, icon: <Package className="h-5 w-5" />, tone: 'text-ink bg-paper ring-paper-border' },
    { label: 'In stock', value: stats.inStock, icon: <PackageCheck className="h-5 w-5" />, tone: 'text-brand-600 bg-brand-50 ring-brand-200' },
    { label: 'Allocated', value: stats.allocated, icon: <Laptop className="h-5 w-5" />, tone: 'text-blue-600 bg-blue-50 ring-blue-200' },
    { label: 'Retired / lost', value: stats.retired + stats.lost, icon: <PackageX className="h-5 w-5" />, tone: 'text-ink-muted bg-paper ring-paper-border' },
  ] : [];

  return (
    <div>
      <PageHeader
        eyebrow="People & HR"
        title="Assets"
        subtitle="Track company hardware and access cards — allocate, return and retire across your team."
        icon={<Laptop className="h-5 w-5" />}
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add asset</Button>}
      />

      {stats && (
        <Reveal>
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STAT_CARDS.map((s) => (
              <Card key={s.label} className="p-4 flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ring-inset ${s.tone}`}>{s.icon}</span>
                <div><p className="text-xl font-semibold text-ink leading-none">{s.value}</p><p className="text-xs text-ink-muted mt-1">{s.label}</p></div>
              </Card>
            ))}
          </div>
        </Reveal>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tag, name, serial…" className="field pl-9" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field max-w-[180px]">
          <option value="">All statuses</option>
          {['in_stock', 'allocated', 'retired', 'lost'].map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="field max-w-[180px]">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
        </select>
      </div>

      <Reveal>
        <Card>
          {rows === null ? (
            <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : rows.length === 0 ? (
            (q.trim() || statusFilter || categoryFilter) ? (
              <EmptyState icon={<Search className="h-6 w-6" />} title="No matching assets" description="Try a different search, status or category filter." />
            ) : (
              <EmptyState icon={<Laptop className="h-6 w-6" />} title="No assets yet" description="Add your first company asset — laptops, phones, SIMs and access cards.">
                <Button className="mt-6" onClick={openCreate}><Plus className="h-4 w-4" /> Add asset</Button>
              </EmptyState>
            )
          ) : (
            <Table>
              <THead><TH>Tag</TH><TH>Name</TH><TH>Category</TH><TH>Status</TH><TH>Assigned to</TH><TH /></THead>
              <tbody>
                {rows.map((a) => (
                  <TR key={a.id}>
                    <TD><span className="font-mono text-xs">{a.tag}</span></TD>
                    <TD><p className="font-medium text-ink">{a.name}</p>{a.serialNo && <p className="text-xs text-ink-faint">{a.serialNo}</p>}</TD>
                    <TD><span className="text-sm text-ink-muted">{CATEGORY_LABEL[a.category] ?? a.category}</span></TD>
                    <TD><Badge tone={STATUS_TONE[a.status] ?? 'gray'}>{STATUS_LABEL[a.status] ?? a.status}</Badge></TD>
                    <TD>{a.assignedToName ?? <span className="text-ink-faint">—</span>}</TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        {a.status === 'in_stock' && (
                          <>
                            <button onClick={() => openAssign(a)} className="btn-ghost p-2" title="Assign"><UserPlus className="h-4 w-4" /></button>
                            <button onClick={() => onRetire(a)} className="btn-ghost p-2" title="Retire"><Archive className="h-4 w-4" /></button>
                            <button onClick={() => onDelete(a)} className="btn-ghost p-2 text-red-500 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                          </>
                        )}
                        {a.status === 'allocated' && (
                          <button onClick={() => openReturn(a)} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"><Undo2 className="h-3.5 w-3.5" /> Return</button>
                        )}
                        {(a.status === 'retired' || a.status === 'lost') && (
                          <button onClick={() => onDelete(a)} className="btn-ghost p-2 text-red-500 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        )}
                      </div>
                    </TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>

      {/* Add asset */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add asset"
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button form="asset-form" type="submit" loading={saving}>Add asset</Button>
        </>}
      >
        <form id="asset-form" onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tag" required value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="LAP-001" maxLength={60} />
            <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="MacBook Pro 14" maxLength={120} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
            </Select>
            <Select label="Condition" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABEL[c]}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Serial no." value={form.serialNo} onChange={(e) => setForm({ ...form, serialNo: e.target.value })} placeholder="C02X…" maxLength={80} />
            <Input label="Purchase date" type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} />
            <Input label="Cost (₹)" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} placeholder="120000" maxLength={20} />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="field min-h-[64px] resize-y" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Warranty, accessories, remarks…" maxLength={500} />
          </div>
        </form>
      </Modal>

      {/* Assign */}
      <Modal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title={assignTarget ? `Assign ${assignTarget.name}` : 'Assign asset'}
        footer={<>
          <Button variant="secondary" onClick={() => setAssignTarget(null)}>Cancel</Button>
          <Button form="assign-form" type="submit" loading={saving}>Assign</Button>
        </>}
      >
        <form id="assign-form" onSubmit={onAssign} className="space-y-4">
          <Select label="Employee" value={assignEmployeeId} onChange={(e) => setAssignEmployeeId(e.target.value)}>
            <option value="">— select employee —</option>
            {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName ?? ''} ({emp.empCode})</option>)}
          </Select>
        </form>
      </Modal>

      {/* Return */}
      <Modal
        open={!!returnTarget}
        onClose={() => setReturnTarget(null)}
        title={returnTarget ? `Return ${returnTarget.name}` : 'Return asset'}
        footer={<>
          <Button variant="secondary" onClick={() => setReturnTarget(null)}>Cancel</Button>
          <Button form="return-form" type="submit" loading={saving}>Mark returned</Button>
        </>}
      >
        <form id="return-form" onSubmit={onReturn} className="space-y-4">
          <Select label="Condition on return" value={returnCondition} onChange={(e) => setReturnCondition(e.target.value)}>
            {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABEL[c]}</option>)}
          </Select>
          <div>
            <label className="label">Notes</label>
            <textarea className="field min-h-[64px] resize-y" value={returnNotes} onChange={(e) => setReturnNotes(e.target.value)} placeholder="Any damage, missing accessories…" maxLength={500} />
          </div>
        </form>
      </Modal>
    </div>
  );
}
