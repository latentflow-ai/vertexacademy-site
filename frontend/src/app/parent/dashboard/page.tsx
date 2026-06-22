'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import PortalShell, { usePortalUser } from '@/components/portal/PortalShell';
import { PARENT_NAV } from '@/components/portal/parentNav';
import AcademicViews from '@/components/portal/AcademicViews';
import RefreshButton from '@/components/portal/RefreshButton';
import { Ward, getParentWards } from '@/lib/portal';

function ParentHome() {
  const user = usePortalUser();
  const [wards, setWards] = useState<Ward[] | null>(null);
  const [activeId, setActiveId] = useState('');
  const [err, setErr] = useState('');

  const load = () =>
    getParentWards().then((w) => { setWards(w); setActiveId((prev) => prev || w[0]?.id || ''); }).catch((e) => { setErr(e.message); setWards([]); });
  useEffect(() => { load(); }, []);

  const active = wards?.find((w) => w.id === activeId);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Parent Portal</p>
          <h1 className="font-display text-display-sm text-navy">Welcome, {user?.fullName}</h1>
          <p className="text-text-secondary text-sm">Follow your ward's attendance, marks, timetable and notes.</p>
        </div>
        <RefreshButton onClick={load} />
      </div>

      {err && <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{err}</div>}

      {wards === null ? (
        <div className="text-text-secondary">Loading…</div>
      ) : wards.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl shadow-soft p-10 text-center">
          <Icon name="ClockIcon" className="w-10 h-10 text-gold-strong mx-auto mb-3" />
          <p className="text-navy font-medium mb-1">Awaiting approval</p>
          <p className="text-text-secondary text-sm">
            Your registration request is pending admin approval. Once approved, your ward's data appears here. Need to add another ward?{' '}
            <Link href="/parentregister" className="text-green font-semibold hover:underline" data-cursor="hover">Submit a request</Link>.
          </p>
        </div>
      ) : (
        <>
          {wards.length > 1 && (
            <div className="flex gap-2 mb-5 flex-wrap">
              {wards.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setActiveId(w.id)}
                  data-cursor="hover"
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    activeId === w.id ? 'bg-green text-white border-green' : 'bg-white text-text-secondary border-border hover:text-navy'
                  }`}
                >
                  {w.user.fullName}
                </button>
              ))}
            </div>
          )}
          {active && (
            <>
              <div className="bg-white border border-border rounded-2xl shadow-soft p-4 mb-5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-green-tint text-green flex items-center justify-center">
                  <Icon name="UserGroupIcon" className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-navy">{active.user.fullName}</p>
                  <p className="text-xs text-text-faint">
                    {active.user.idNumber} · {active.class ? `${active.class.name} · ${active.class.board}${active.class.stream ? ` · ${active.class.stream}` : ''}` : 'No class'}
                  </p>
                </div>
              </div>
              <AcademicViews studentId={active.id} classId={active.class?.id || null} accent="green" />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function ParentDashboardPage() {
  return (
    <PortalShell requiredRole="PARENT" brand="Vertex Parent" navItems={PARENT_NAV} accent="green">
      <ParentHome />
    </PortalShell>
  );
}
