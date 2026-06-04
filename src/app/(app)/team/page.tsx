'use client';
import { useState } from 'react';
import { UsersRound, Mail, Crown, ShieldCheck, User, Calculator } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { Role } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

const ROLE_INFO: Record<Role, { icon: React.ReactNode; desc: string }> = {
  OWNER: { icon: <Crown className="h-3.5 w-3.5" />, desc: 'Full access incl. billing' },
  ADMIN: { icon: <ShieldCheck className="h-3.5 w-3.5" />, desc: 'Manage clients, invoices, members' },
  MEMBER: { icon: <User className="h-3.5 w-3.5" />, desc: 'Create & edit invoices, clients' },
  ACCOUNTANT: { icon: <Calculator className="h-3.5 w-3.5" />, desc: 'Read-only: invoices, FIRC, exports' },
};

export default function TeamPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('MEMBER');

  function invite(e: React.FormEvent) {
    e.preventDefault();
    notify('info', 'Team invites arrive with the Agency tier (v2)');
    setEmail('');
  }

  return (
    <div>
      <PageHeader title="Team" subtitle="Invite teammates, or give your CA scoped read-only access." />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader title="Members" />
          <CardBody className="space-y-1">
            <div className="flex items-center gap-3 py-3">
              <Avatar name={user?.legalName || user?.email || '?'} className="h-9 w-9" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink truncate">{user?.legalName || 'You'}</p>
                <p className="text-xs text-ink-muted truncate">{user?.email}</p>
              </div>
              <Badge tone="green">{ROLE_INFO[(user?.role as Role) || 'OWNER']?.icon}{user?.role || 'OWNER'}</Badge>
            </div>
            <p className="text-sm text-ink-faint pt-2 border-t border-paper-border">Additional members and CA invites unlock on the Agency plan.</p>
          </CardBody>
        </Card>

        <Card className="h-fit">
          <CardHeader title="Invite someone" />
          <CardBody>
            <form onSubmit={invite} className="space-y-4">
              <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@studio.com" prefix={<Mail className="h-4 w-4" />} />
              <Select label="Role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
                {(Object.keys(ROLE_INFO) as Role[]).filter((r) => r !== 'OWNER').map((r) => <option key={r} value={r}>{r} — {ROLE_INFO[r].desc}</option>)}
              </Select>
              <Button type="submit" className="w-full"><UsersRound className="h-4 w-4" /> Send invite</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
