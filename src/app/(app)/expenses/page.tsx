'use client';
import { useEffect, useState } from 'react';
import {
  Wallet, Plus, Trash2, Receipt, Check, X, IndianRupee, Clock, BadgeCheck,
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Expense, CreateExpenseInput, Employee } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Drawer } from '@/components/ui/Drawer';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';

const STATUS_TONE: Record<string, 'gray' | 'blue' | 'amber' | 'green' | 'red'> = {
  submitted: 'amber', approved: 'blue', reimbursed: 'green', rejected: 'red',
};
const STATUS_LABEL: Record<string, string> = {
  submitted: 'Submitted', approved: 'Approved', reimbursed: 'Reimbursed', rejected: 'Rejected',
};
const CATEGORY_LABEL: Record<string, string> = {
  travel: 'Travel', meals: 'Meals', accommodation: 'Accommodation', software: 'Software',
  hardware: 'Hardware', office: 'Office', marketing: 'Marketing', other: 'Other',
};
const CATEGORIES = ['travel', 'meals', 'accommodation', 'software', 'hardware', 'office', 'marketing', 'other'];

function today() { return new Date().toISOString().slice(0, 10); }

const empty: CreateExpenseInput = {
  employeeId: '', category: 'travel', amount: '', currency: 'INR', spentOn: today(), description: '',
};

export default function ExpensesPage() {
  const { notify } = useToast();
  const [rows, setRows] = useState<Expense[] | null>(null);
  const [stats, setStats] = useState<{ total: number; submitted: number; approved: number; reimbursed: number; rejected: number; pendingAmount: string; reimbursedAmount: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateExpenseInput>(empty);
  const [saving, setSaving] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  function load() {
    api.expenses.list({ status: statusFilter, category: categoryFilter }).then(setRows).catch(() => setRows([]));
    api.expenses.stats().then(setStats).catch(() => {});
  }
  useEffect(() => { load(); api.employees.list('', '', '', 1, 100).then((p) => setEmployees(p.items)).catch(() => {}); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [statusFilter, categoryFilter]);

  function openCreate() { setForm(empty); setOpen(true); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeId) { notify('error', 'Pick an employee'); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { notify('error', 'Amount must be greater than 0'); return; }
    const payload: CreateExpenseInput = {
      employeeId: form.employeeId,
      category: form.category || undefined,
      amount: form.amount,
      currency: form.currency || undefined,
      spentOn: form.spentOn,
      description: form.description || undefined,
    };
    setSaving(true);
    try {
      await api.expenses.create(payload);
      notify('success', 'Expense submitted'); setOpen(false); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not submit'); }
    finally { setSaving(false); }
  }

  async function onApprove(x: Expense) {
    try { await api.expenses.decide(x.id, { status: 'approved' }); notify('success', 'Expense approved'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not approve'); }
  }

  async function onReject(x: Expense) {
    const note = window.prompt('Reason for rejection (optional):') ?? undefined;
    try { await api.expenses.decide(x.id, { status: 'rejected', note: note || undefined }); notify('success', 'Expense rejected'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not reject'); }
  }

  async function onReimburse(x: Expense) {
    const reference = window.prompt('Reimbursement reference (optional):') ?? undefined;
    try { await api.expenses.reimburse(x.id, { reference: reference || undefined }); notify('success', 'Expense reimbursed'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not reimburse'); }
  }

  async function onDelete(x: Expense) {
    if (!confirm('Delete this expense claim? This removes the record.')) return;
    try { await api.expenses.remove(x.id); notify('success', 'Expense deleted'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not delete'); }
  }

  function amountLabel(x: Expense) {
    return x.currency === 'INR' ? `₹${x.amount}` : `${x.currency} ${x.amount}`;
  }

  const STAT_CARDS = stats ? [
    { label: 'Total', value: stats.total, icon: <Receipt className="h-5 w-5" />, tone: 'text-ink bg-paper ring-paper-border' },
    { label: 'Pending', value: stats.submitted + stats.approved, icon: <Clock className="h-5 w-5" />, tone: 'text-amber-600 bg-amber-50 ring-amber-200' },
    { label: 'Pending ₹', value: `₹${stats.pendingAmount}`, icon: <IndianRupee className="h-5 w-5" />, tone: 'text-blue-600 bg-blue-50 ring-blue-200' },
    { label: 'Reimbursed ₹', value: `₹${stats.reimbursedAmount}`, icon: <BadgeCheck className="h-5 w-5" />, tone: 'text-brand-600 bg-brand-50 ring-brand-200' },
  ] : [];

  return (
    <div>
      <PageHeader
        eyebrow="People & HR"
        title="Expenses"
        subtitle="Employee expense claims — submit, approve and reimburse spend across your team."
        icon={<Wallet className="h-5 w-5" />}
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Submit expense</Button>}
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
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field max-w-[180px]">
          <option value="">All statuses</option>
          {['submitted', 'approved', 'rejected', 'reimbursed'].map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
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
            (statusFilter || categoryFilter) ? (
              <EmptyState icon={<Wallet className="h-6 w-6" />} title="No matching expenses" description="Try a different status or category filter." />
            ) : (
              <EmptyState icon={<Wallet className="h-6 w-6" />} title="No expenses yet — submit your first claim." description="Log travel, meals, software and more — then approve and reimburse.">
                <Button className="mt-6" onClick={openCreate}><Plus className="h-4 w-4" /> Submit expense</Button>
              </EmptyState>
            )
          ) : (
            <Table>
              <THead><TH>Employee</TH><TH>Category</TH><TH>Amount</TH><TH>Spent on</TH><TH>Status</TH><TH /></THead>
              <tbody>
                {rows.map((x) => (
                  <TR key={x.id}>
                    <TD>{x.employeeName ?? <span className="text-ink-faint">—</span>}</TD>
                    <TD><span className="text-sm text-ink-muted">{CATEGORY_LABEL[x.category] ?? x.category}</span></TD>
                    <TD><span className="font-medium text-ink">{amountLabel(x)}</span></TD>
                    <TD>{formatDate(x.spentOn)}</TD>
                    <TD><Badge tone={STATUS_TONE[x.status] ?? 'gray'}>{STATUS_LABEL[x.status] ?? x.status}</Badge></TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        {x.status === 'submitted' && (
                          <>
                            <button onClick={() => onApprove(x)} className="btn-ghost p-2 text-brand-600 hover:bg-brand-50" title="Approve"><Check className="h-4 w-4" /></button>
                            <button onClick={() => onReject(x)} className="btn-ghost p-2 text-red-500 hover:bg-red-50" title="Reject"><X className="h-4 w-4" /></button>
                            <button onClick={() => onDelete(x)} className="btn-ghost p-2 text-red-500 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                          </>
                        )}
                        {x.status === 'approved' && (
                          <>
                            <button onClick={() => onReimburse(x)} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"><IndianRupee className="h-3.5 w-3.5" /> Reimburse</button>
                            <button onClick={() => onDelete(x)} className="btn-ghost p-2 text-red-500 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                          </>
                        )}
                        {x.status === 'rejected' && (
                          <button onClick={() => onDelete(x)} className="btn-ghost p-2 text-red-500 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        )}
                        {x.status === 'reimbursed' && (
                          <span className="text-xs text-ink-faint">Locked</span>
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

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Submit expense"
        subtitle="Log a new expense claim for reimbursement."
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button form="expense-form" type="submit" loading={saving}>Submit expense</Button>
        </>}
      >
        <form id="expense-form" onSubmit={onSubmit} className="space-y-4">
          <Select label="Employee" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
            <option value="">— select employee —</option>
            {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName ?? ''} ({emp.empCode})</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
            </Select>
            <Input label="Spent on" type="date" value={form.spentOn} onChange={(e) => setForm({ ...form, spentOn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount" required inputMode="decimal" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="1500" maxLength={20} />
            <Input label="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} placeholder="INR" maxLength={3} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="field min-h-[64px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What was this expense for?" maxLength={300} />
          </div>
        </form>
      </Drawer>
    </div>
  );
}
