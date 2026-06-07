'use client';
import { useEffect, useState } from 'react';
import { Users, Plus, Trash2, Pencil, Globe } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Client, CreateClientInput } from '@/lib/types';
import { countryName, flagEmoji, formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';

const emptyForm: CreateClientInput = { name: '', email: '', address: '', country: '' };

export default function ClientsPage() {
  const { notify } = useToast();
  const [clients, setClients] = useState<Client[] | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<CreateClientInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => api.clients.list().then((p) => setClients(p.items)).catch(() => setClients([]));
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setOpen(true); }
  function openEdit(c: Client) {
    setEditing(c);
    setForm({ name: c.name, email: c.email ?? '', address: c.address ?? '', country: c.country });
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.country.length !== 2) { notify('error', 'Use a 2-letter country code (e.g. US, GB)'); return; }
    setSaving(true);
    try {
      const payload = { ...form, email: form.email || undefined, address: form.address || undefined };
      if (editing) { await api.clients.update(editing.id, payload); notify('success', 'Client updated'); }
      else { await api.clients.create(payload); notify('success', 'Client added'); }
      setOpen(false);
      load();
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Could not save client');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(c: Client) {
    if (!confirm(`Delete ${c.name}? Invoices already raised are kept.`)) return;
    try { await api.clients.remove(c.id); notify('success', 'Client deleted'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not delete'); }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Clients"
        subtitle="The foreign clients you bill. Place of supply is always outside India."
        icon={<Users className="h-5 w-5" />}
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add client</Button>}
      />

      <Reveal>
        <Card>
          {clients === null ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : clients.length === 0 ? (
            <EmptyState icon={<Users className="h-6 w-6" />} title="No clients yet" description="Add a foreign client to start raising export invoices." action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add client</Button>} />
          ) : (
            <Table>
              <THead><TH>Client</TH><TH>Country</TH><TH>Email</TH><TH>Added</TH><TH /></THead>
              <tbody>
                {clients.map((c) => (
                  <TR key={c.id}>
                    <TD><div className="flex items-center gap-3"><Avatar name={c.name} /><span className="font-medium text-ink">{c.name}</span></div></TD>
                    <TD><span className="inline-flex items-center gap-1.5">{flagEmoji(c.country)} {countryName(c.country)}</span></TD>
                    <TD>{c.email || <span className="text-ink-faint">—</span>}</TD>
                    <TD>{formatDate(c.createdAt)}</TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="btn-ghost p-2"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => onDelete(c)} className="btn-ghost p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit client' : 'Add client'}
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button form="client-form" type="submit" loading={saving}>{editing ? 'Save' : 'Add client'}</Button>
        </>}
      >
        <form id="client-form" onSubmit={onSubmit} className="space-y-4">
          <Input label="Client name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Foo Inc." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Country code" required maxLength={2} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value.toUpperCase() })} placeholder="US" prefix={<Globe className="h-4 w-4" />} hint="ISO 2-letter" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ap@foo.com" />
          </div>
          <div>
            <label className="label">Address</label>
            <textarea className="field min-h-[72px] resize-y" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="1 Market St, San Francisco, CA" />
          </div>
        </form>
      </Modal>
    </div>
  );
}
