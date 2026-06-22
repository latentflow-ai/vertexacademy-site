'use client';

import { useEffect, useState } from 'react';
import PortalShell, { usePortalUser } from '@/components/portal/PortalShell';
import { STUDENT_NAV } from '@/components/portal/studentNav';
import AcademicViews from '@/components/portal/AcademicViews';
import { StudentSummary, getStudentSummary } from '@/lib/portal';

function StudentHome() {
  const user = usePortalUser();
  const [me, setMe] = useState<StudentSummary | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => { getStudentSummary().then(setMe).catch((e) => setErr(e.message)); }, []);

  return (
    <div>
      <div className="mb-6">
        <p className="eyebrow mb-1">Student Portal</p>
        <h1 className="font-display text-display-sm text-navy">Hi, {user?.fullName}</h1>
        <p className="text-text-secondary text-sm">
          {me?.class ? `${me.class.name} · ${me.class.board}${me.class.stream ? ` · ${me.class.stream}` : ''}` : 'Your academic overview'}
          {me?.user.idNumber ? ` · ${me.user.idNumber}` : ''}
        </p>
      </div>

      {err && <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{err}</div>}

      {me && <AcademicViews studentId={me.id} classId={me.class?.id || null} accent="primary" />}
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <PortalShell requiredRole="STUDENT" brand="Vertex Student" navItems={STUDENT_NAV} accent="primary">
      <StudentHome />
    </PortalShell>
  );
}
