'use client';
import { useEffect, useState, useCallback } from 'react';
import { Megaphone, FileText, Plus, Trash2, Pin, Users, CheckCircle2, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Announcement, Policy, PolicyCompliance, Department } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal } from '@/components/motion/Reveal';

export default function AnnouncementsPage() {
  const { notify } = useToast();
  const [anns, setAnns] = useState<Announcement[] | null>(null);
  const [pols, setPols] = useState<Policy[]>([]);
  const [depts, setDepts] = useState<Department[]>([]);
  const [busy, setBusy] = useState(false);
  const [annOpen, setAnnOpen] = useState(false);
  const [polOpen, setPolOpen] = useState(false);
  const [compliance, setCompliance] = useState<PolicyCompliance | null>(null);
  const [af, setAf] = useState({ title: '', body: '', audienceType: 'all', audienceValue: '', pinned: false });
  const [pf, setPf] = useState({ title: '', category: 'general', effectiveDate: '', body: '', documentUrl: '', requiresAck: true });

  const load = useCallback(() => {
    api.announcements.list().then(setAnns).catch((e) => { setAnns([]); notify('error', e instanceof Error ? e.message : 'Could not load'); });
    api.policies.list().then(setPols).catch(() => {});
    api.departments.list().then(setDepts).catch(() => {});
  }, [notify]);
  useEffect(() => { load(); }, [load]);

  async function createAnn(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try {
      await api.announcements.create({
        title: af.title.trim(), body: af.body, pinned: af.pinned,
        audienceType: af.audienceType as Announcement['audienceType'],
        audienceValue: af.audienceType === 'department' ? af.audienceValue : undefined,
      } as Partial<Announcement>);
      setAnnOpen(false); setAf({ title: '', body: '', audienceType: 'all', audienceValue: '', pinned: false });
      notify('success', 'Announcement posted'); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
    finally { setBusy(false); }
  }

  async function createPol(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try {
      await api.policies.create({
        title: pf.title.trim(), category: pf.category, effectiveDate: pf.effectiveDate || undefined,
        body: pf.body, documentUrl: pf.documentUrl || undefined, requiresAck: pf.requiresAck,
      } as Partial<Policy>);
      setPolOpen(false); setPf({ title: '', category: 'general', effectiveDate: '', body: '', documentUrl: '', requiresAck: true });
      notify('success', 'Policy published'); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
    finally { setBusy(false); }
  }

  async function delAnn(id: string) { if (!confirm('Delete announcement?')) return; try { await api.announcements.remove(id); load(); } catch (e) { notify('error', e instanceof Error ? e.message : 'Failed'); } }
  async function delPol(id: string) { if (!confirm('Delete policy? Acknowledgements are removed too.')) return; try { await api.policies.remove(id); load(); } catch (e) { notify('error', e instanceof Error ? e.message : 'Failed'); } }
  async function bump(p: Policy) { if (!confirm(`Publish a new version of "${p.title}"? Everyone must re-acknowledge.`)) return; try { await api.policies.update(p.id, { bumpVersion: true }); notify('success', 'New version published'); load(); } catch (e) { notify('error', e instanceof Error ? e.message : 'Failed'); } }
  async function openCompliance(p: Policy) { try { setCompliance(await api.policies.compliance(p.id)); } catch (e) { notify('error', e instanceof Error ? e.message : 'Failed'); } }

  if (anns === null) return <PageLoader />;

  return (
    <div>
      <PageHeader eyebrow="Communication" title="Announcements & policies" subtitle="Broadcast news and publish policies employees must acknowledge." icon={<Megaphone className="h-5 w-5" />} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Card>
            <CardHeader title="Announcements" action={<Button className="py-1.5" onClick={() => setAnnOpen(true)}><Plus className="h-4 w-4" /> Post</Button>} />
            <CardBody className="space-y-3">
              {anns.length === 0 ? <p className="text-sm text-ink-muted">No announcements yet.</p> : anns.map((a) => (
                <div key={a.id} className="rounded-xl border border-paper-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-ink flex items-center gap-1.5">{a.pinned && <Pin className="h-3.5 w-3.5 text-brand-600" />}{a.title}</p>
                      {a.body && <p className="mt-0.5 text-xs text-ink-muted line-clamp-2">{a.body}</p>}
                    </div>
                    <button onClick={() => delAnn(a.id)} className="text-red-500 hover:text-red-600 shrink-0"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-ink-faint">
                    <Badge tone={a.audienceType === 'all' ? 'gray' : 'blue'}>{a.audienceType === 'all' ? 'Everyone' : a.audienceValue}</Badge>
                    <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {a.readCount ?? 0} read</span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card>
            <CardHeader title="Policies" action={<Button className="py-1.5" onClick={() => setPolOpen(true)}><Plus className="h-4 w-4" /> Publish</Button>} />
            <CardBody className="space-y-3">
              {pols.length === 0 ? <p className="text-sm text-ink-muted">No policies yet.</p> : pols.map((p) => (
                <div key={p.id} className="rounded-xl border border-paper-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-ink flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-ink-faint" />{p.title} <span className="text-xs text-ink-faint">v{p.version}</span></p>
                      <p className="mt-0.5 text-xs text-ink-faint capitalize">{p.category}{p.effectiveDate ? ` · eff. ${p.effectiveDate}` : ''}</p>
                    </div>
                    <button onClick={() => delPol(p.id)} className="text-red-500 hover:text-red-600 shrink-0"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  {p.requiresAck && (
                    <div className="mt-2 flex items-center gap-2">
                      <Badge tone={p.pendingCount === 0 ? 'green' : 'amber'}>{p.ackedCount ?? 0}/{p.headcount ?? 0} acknowledged</Badge>
                      <button onClick={() => openCompliance(p)} className="text-xs text-brand-700 hover:underline">Who's pending?</button>
                      <button onClick={() => bump(p)} className="text-xs text-ink-muted hover:underline ml-auto">New version</button>
                    </div>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>
        </Reveal>
      </div>

      <Modal open={annOpen} onClose={() => setAnnOpen(false)} title="Post announcement"
        footer={<><Button variant="secondary" onClick={() => setAnnOpen(false)}>Cancel</Button><Button form="ann-form" type="submit" loading={busy}>Post</Button></>}>
        <form id="ann-form" onSubmit={createAnn} className="space-y-4">
          <Input label="Title" required value={af.title} onChange={(e) => setAf({ ...af, title: e.target.value })} placeholder="Diwali holiday on 21 Oct" />
          <div>
            <label className="label">Message</label>
            <textarea value={af.body} onChange={(e) => setAf({ ...af, body: e.target.value })} className="field min-h-[100px]" placeholder="Details…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Audience" value={af.audienceType} onChange={(e) => setAf({ ...af, audienceType: e.target.value })}>
              <option value="all">Everyone</option><option value="department">A department</option>
            </Select>
            {af.audienceType === 'department' && (
              <Select label="Department" value={af.audienceValue} onChange={(e) => setAf({ ...af, audienceValue: e.target.value })}>
                <option value="">— choose —</option>
                {depts.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
              </Select>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
            <input type="checkbox" checked={af.pinned} onChange={(e) => setAf({ ...af, pinned: e.target.checked })} className="h-4 w-4 rounded border-paper-border text-brand-600" /> Pin to top
          </label>
        </form>
      </Modal>

      <Modal open={polOpen} onClose={() => setPolOpen(false)} title="Publish policy"
        footer={<><Button variant="secondary" onClick={() => setPolOpen(false)}>Cancel</Button><Button form="pol-form" type="submit" loading={busy}>Publish</Button></>}>
        <form id="pol-form" onSubmit={createPol} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Title" required value={pf.title} onChange={(e) => setPf({ ...pf, title: e.target.value })} placeholder="Code of Conduct" />
            <Input label="Category" value={pf.category} onChange={(e) => setPf({ ...pf, category: e.target.value })} placeholder="compliance" />
          </div>
          <Input label="Effective date" type="date" value={pf.effectiveDate} onChange={(e) => setPf({ ...pf, effectiveDate: e.target.value })} />
          <div>
            <label className="label">Policy text</label>
            <textarea value={pf.body} onChange={(e) => setPf({ ...pf, body: e.target.value })} className="field min-h-[120px]" placeholder="Policy content…" />
          </div>
          <Input label="Document link (optional)" value={pf.documentUrl} onChange={(e) => setPf({ ...pf, documentUrl: e.target.value })} placeholder="https://…" />
          <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
            <input type="checkbox" checked={pf.requiresAck} onChange={(e) => setPf({ ...pf, requiresAck: e.target.checked })} className="h-4 w-4 rounded border-paper-border text-brand-600" /> Require acknowledgement
          </label>
        </form>
      </Modal>

      <Modal open={!!compliance} onClose={() => setCompliance(null)} title={`Acknowledgement — ${compliance?.policy.title ?? ''} v${compliance?.version ?? ''}`}
        footer={<Button variant="secondary" onClick={() => setCompliance(null)}>Close</Button>}>
        {compliance && (
          <div className="space-y-4 max-h-[60vh] overflow-auto">
            <div>
              <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mb-2"><Clock className="h-4 w-4" /> Pending ({compliance.pending.length})</p>
              {compliance.pending.length === 0 ? <p className="text-sm text-ink-muted">Everyone has acknowledged. 🎉</p> : (
                <div className="space-y-1">{compliance.pending.map((e) => <div key={e.employeeId} className="text-sm text-ink flex justify-between"><span>{e.name}</span><span className="text-xs text-ink-faint">{e.department ?? '—'}</span></div>)}</div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5 mb-2"><CheckCircle2 className="h-4 w-4" /> Acknowledged ({compliance.acknowledged.length})</p>
              <div className="space-y-1">{compliance.acknowledged.map((e) => <div key={e.employeeId} className="text-sm text-ink flex justify-between"><span>{e.name}</span><span className="text-xs text-ink-faint">{new Date(e.acknowledgedAt).toLocaleDateString()}</span></div>)}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
