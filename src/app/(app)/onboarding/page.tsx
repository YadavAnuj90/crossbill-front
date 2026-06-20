'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardCheck, Check, Users, BadgeCheck } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Employee, Onboarding } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Reveal } from '@/components/motion/Reveal';

export default function OnboardingPage() {
  const { notify } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selected, setSelected] = useState('');
  const [ob, setOb] = useState<Onboarding | null>(null);

  useEffect(() => { api.employees.list('', '', '').then((p) => setEmployees(p.items)).catch(() => {}); }, []);
  useEffect(() => {
    if (!selected) { setOb(null); return; }
    api.onboarding.get(selected).then(setOb).catch(() => setOb(null));
  }, [selected]);

  async function toggle(itemId: string, done: boolean) {
    if (!selected) return;
    try { setOb(await api.onboarding.toggle(selected, itemId, done)); }
    catch (e) { notify('error', e instanceof Error ? e.message : 'Failed'); }
  }

  const doneCount = ob?.checklist.filter((c) => c.done).length ?? 0;
  const total = ob?.checklist.length ?? 0;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div>
      <PageHeader
        eyebrow="People & HR"
        title="Onboarding"
        subtitle="Track each new hire's joining checklist and documents."
        icon={<ClipboardCheck className="h-5 w-5" />}
      />

      {employees.length === 0 ? (
        <Card><EmptyState icon={<Users className="h-6 w-6" />} title="No employees yet" description="Add employees to start onboarding them.">
          <Link href="/employees" className="btn-primary mt-6">Go to employees</Link>
        </EmptyState></Card>
      ) : (
        <>
          <div className="mb-5 max-w-sm">
            <Select label="Employee" value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="">Select an employee…</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} · {e.empCode}</option>)}
            </Select>
          </div>

          {!ob ? (
            <Card><CardBody className="text-sm text-ink-muted">Pick an employee to view their onboarding checklist.</CardBody></Card>
          ) : (
            <Reveal>
              <Card>
                <CardHeader
                  title="Joining checklist"
                  subtitle={`${doneCount} of ${total} complete`}
                  action={ob.status === 'complete' ? <Badge tone="green"><BadgeCheck className="h-3.5 w-3.5" /> Onboarded</Badge> : <Badge tone="amber">In progress</Badge>}
                />
                <CardBody>
                  <div className="h-2 rounded-full bg-paper overflow-hidden mb-5"><div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all" style={{ width: `${pct}%` }} /></div>
                  <div className="space-y-2">
                    {ob.checklist.map((c) => {
                      const id = (c.id ?? c._id) as string;
                      return (
                        <div key={id} className="flex items-center gap-3 rounded-lg border border-paper-border px-3 py-2.5">
                          <button onClick={() => toggle(id, !c.done)} className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${c.done ? 'bg-brand-500 border-brand-500 text-white' : 'border-paper-border'}`}>{c.done && <Check className="h-3.5 w-3.5" />}</button>
                          <div className="flex-1">
                            <p className={`text-sm ${c.done ? 'text-ink-faint line-through' : 'text-ink'}`}>{c.label}</p>
                          </div>
                          {c.required ? <span className="text-[11px] text-ink-faint">Required</span> : <span className="text-[11px] text-ink-faint">Optional</span>}
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </Reveal>
          )}
        </>
      )}
    </div>
  );
}
