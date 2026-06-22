'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import PortalShell, { usePortalUser } from '@/components/portal/PortalShell';
import { ADMIN_NAV } from '@/components/portal/adminNav';
import { listFaculty, listStudents, listClasses } from '@/lib/admin';
import RefreshButton from '@/components/portal/RefreshButton';

type Accent = 'primary' | 'gold' | 'green' | 'navy';

function Overview() {
  const user = usePortalUser();
  const [counts, setCounts] = useState<{ faculty?: number; students?: number; classes?: number }>({});

  const load = () => {
    listFaculty().then((f) => setCounts((c) => ({ ...c, faculty: f.length }))).catch(() => {});
    listStudents().then((s) => setCounts((c) => ({ ...c, students: s.length }))).catch(() => {});
    listClasses().then((cl) => setCounts((c) => ({ ...c, classes: cl.length }))).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="font-display text-display-sm text-navy">Welcome back, {user?.fullName}</h1>
          <p className="text-text-secondary text-sm">Vertex Academy administration</p>
        </div>
        <RefreshButton onClick={load} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard icon="AcademicCapIcon" label="Faculty" value={counts.faculty} accent="gold" href="/admin/faculty" />
        <StatCard icon="UserGroupIcon" label="Students" value={counts.students} accent="primary" href="/admin/students" />
        <StatCard icon="BookOpenIcon" label="Classes" value={counts.classes} accent="green" href="/admin/classes" />
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-soft p-6">
        <h2 className="font-display text-heading-md text-navy mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <QuickLink href="/admin/faculty" icon="AcademicCapIcon" label="Manage Faculty" />
          <QuickLink href="/admin/students" icon="UserGroupIcon" label="Manage Students" />
          <QuickLink href="/admin/classes" icon="BookOpenIcon" label="Manage Classes" />
          <QuickLink href="/admin/timetable" icon="CalendarDaysIcon" label="Timetable" />
        </div>
      </div>
    </div>
  );
}

const chip: Record<Accent, string> = {
  primary: 'bg-primary-tint text-primary',
  gold: 'bg-gold-tint text-gold-strong',
  green: 'bg-green-tint text-green',
  navy: 'bg-navy/10 text-navy',
};

function StatCard({
  icon,
  label,
  value,
  accent,
  href,
}: {
  icon: string;
  label: string;
  value: number | undefined;
  accent: Accent;
  href: string;
}) {
  return (
    <Link href={href} data-cursor="hover" className="bg-white border border-border rounded-2xl shadow-soft p-6 hover-lift block">
      <div className={`p-3 rounded-xl inline-flex mb-4 ${chip[accent]}`}>
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <p className="text-text-secondary text-sm mb-1">{label}</p>
      <p className="font-display text-3xl font-semibold text-navy">{value === undefined ? '…' : value}</p>
    </Link>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      data-cursor="hover"
      className="flex items-center gap-2 px-4 py-2.5 bg-navy hover:bg-primary-strong text-white rounded-full text-sm font-semibold transition-colors"
    >
      <Icon name={icon} className="w-5 h-5" />
      {label}
    </Link>
  );
}

export default function AdminDashboardPage() {
  return (
    <PortalShell requiredRole="ADMIN" brand="Vertex Admin" navItems={ADMIN_NAV} accent="primary">
      <Overview />
    </PortalShell>
  );
}
