'use client';
import { useState } from 'react';
import {
  CalendarClock, ListChecks, Plus, Trash2, Save, ScanSearch, Check, AlertTriangle, Loader2,
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Agreement, ClauseReview } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function dateInput(iso: string | null): string {
  return iso ? iso.slice(0, 10) : '';
}

export function LifecyclePanel({ agreement, onChange }: { agreement: Agreement; onChange: (a: Agreement) => void }) {
  const { notify } = useToast();
  const [effective, setEffective] = useState(dateInput(agreement.effectiveDate));
  const [renewal, setRenewal] = useState(dateInput(agreement.renewalDate));
  const [expiry, setExpiry] = useState(dateInput(agreement.expiryDate));
  const [savingDates, setSavingDates] = useState(false);

  const [obTitle, setObTitle] = useState('');
  const [obOwner, setObOwner] = useState('');
  const [obDue, setObDue] = useState('');

  const [review, setReview] = useState<ClauseReview | null>(null);
  const [reviewing, setReviewing] = useState(false);

  async function saveDates() {
    setSavingDates(true);
    try {
      const a = await api.agreements.setLifecycle(agreement.id, {
        effectiveDate: effective || undefined,
        renewalDate: renewal || undefined,
        expiryDate: expiry || undefined,
      });
      onChange(a); notify('success', 'Lifecycle saved');
    } catch (e) { notify('error', e instanceof Error ? e.message : 'Could not save'); }
    finally { setSavingDates(false); }
  }

  async function addOb(e: React.FormEvent) {
    e.preventDefault();
    if (!obTitle.trim()) return;
    try {
      const a = await api.agreements.addObligation(agreement.id, { title: obTitle.trim(), owner: obOwner || undefined, dueDate: obDue || undefined });
      onChange(a); setObTitle(''); setObOwner(''); setObDue('');
    } catch (e) { notify('error', e instanceof Error ? e.message : 'Could not add'); }
  }

  async function toggle(obId: string) {
    try { onChange(await api.agreements.toggleObligation(agreement.id, obId)); }
    catch (e) { notify('error', e instanceof Error ? e.message : 'Failed'); }
  }
  async function removeOb(obId: string) {
    try { onChange(await api.agreements.removeObligation(agreement.id, obId)); }
    catch (e) { notify('error', e instanceof Error ? e.message : 'Failed'); }
  }

  async function runReview() {
    setReviewing(true);
    try { setReview(await api.agreements.clauseReview(agreement.id)); }
    catch (e) { notify('error', e instanceof Error ? e.message : 'Review failed'); }
    finally { setReviewing(false); }
  }

  const daysTo = (iso: string | null) => (iso ? Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000) : null);
  const renewIn = daysTo(agreement.renewalDate);
  const expIn = daysTo(agreement.expiryDate);

  return (
    <div className="space-y-6">
      {/* Lifecycle dates */}
      <Card>
        <CardHeader title="Lifecycle" subtitle="Renewal & expiry reminders are emailed at 30 / 7 / 1 days." />
        <CardBody className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Effective</label><input type="date" className="field" value={effective} onChange={(e) => setEffective(e.target.value)} /></div>
            <div><label className="label">Renewal</label><input type="date" className="field" value={renewal} onChange={(e) => setRenewal(e.target.value)} /></div>
            <div><label className="label">Expiry</label><input type="date" className="field" value={expiry} onChange={(e) => setExpiry(e.target.value)} /></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-xs">
              {renewIn != null && <span className={`rounded-full px-2 py-1 ${renewIn <= 30 ? 'bg-amber-50 text-amber-700' : 'bg-paper text-ink-muted'}`}>Renews in {renewIn}d</span>}
              {expIn != null && <span className={`rounded-full px-2 py-1 ${expIn <= 30 ? 'bg-red-50 text-red-600' : 'bg-paper text-ink-muted'}`}>Expires in {expIn}d</span>}
            </div>
            <Button variant="secondary" onClick={saveDates} loading={savingDates}><Save className="h-4 w-4" /> Save dates</Button>
          </div>
        </CardBody>
      </Card>

      {/* Obligations */}
      <Card>
        <CardHeader title="Obligations" subtitle="Track deliverables and commitments." />
        <CardBody className="space-y-2">
          {agreement.obligations.length === 0 ? (
            <p className="text-sm text-ink-muted">No obligations yet.</p>
          ) : agreement.obligations.map((o) => {
            const id = (o.id ?? o._id) as string;
            return (
              <div key={id} className="flex items-center gap-3 rounded-lg border border-paper-border px-3 py-2">
                <button onClick={() => toggle(id)} className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${o.done ? 'bg-brand-500 border-brand-500 text-white' : 'border-paper-border'}`}>{o.done && <Check className="h-3.5 w-3.5" />}</button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${o.done ? 'line-through text-ink-faint' : 'text-ink'}`}>{o.title}</p>
                  <p className="text-[11px] text-ink-faint">{o.owner ? `${o.owner} · ` : ''}{o.dueDate ? `due ${formatDate(o.dueDate)}` : 'no due date'}</p>
                </div>
                <button onClick={() => removeOb(id)} className="btn-ghost p-1.5 text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            );
          })}
          <form onSubmit={addOb} className="grid grid-cols-[1.4fr_1fr_1fr_auto] gap-2 pt-1">
            <input className="field py-2 text-sm" placeholder="Obligation" value={obTitle} onChange={(e) => setObTitle(e.target.value)} />
            <input className="field py-2 text-sm" placeholder="Owner" value={obOwner} onChange={(e) => setObOwner(e.target.value)} />
            <input className="field py-2 text-sm" type="date" value={obDue} onChange={(e) => setObDue(e.target.value)} />
            <button type="submit" className="btn-secondary"><Plus className="h-4 w-4" /></button>
          </form>
        </CardBody>
      </Card>

      {/* Clause review */}
      <Card>
        <CardHeader title="Clause review" subtitle="Heuristic check for standard contract clauses."
          action={<Button variant="secondary" onClick={runReview} loading={reviewing}>{reviewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />} Review</Button>} />
        <CardBody>
          {!review ? (
            <p className="text-sm text-ink-muted">Run a review to flag missing standard clauses (governing law, termination, confidentiality, etc.).</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-semibold ${review.score >= 70 ? 'text-brand-600' : review.score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>{review.score}%</span>
                <span className="text-sm text-ink-muted">standard clauses present</span>
              </div>
              <div className="space-y-1.5">
                {review.results.map((r) => (
                  <div key={r.clause} className="flex items-start gap-2 text-sm">
                    {r.present ? <Check className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" /> : <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />}
                    <span className={r.present ? 'text-ink-soft' : 'text-ink'}>{r.clause}{!r.present && <span className="text-ink-faint"> — {r.why}</span>}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-faint pt-1">Heuristic only — upgradeable to AI clause review with an LLM key.</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
