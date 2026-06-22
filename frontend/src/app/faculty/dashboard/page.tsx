'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import PortalShell, { usePortalUser } from '@/components/portal/PortalShell';
import { FACULTY_NAV } from '@/components/portal/facultyNav';
import RefreshButton from '@/components/portal/RefreshButton';
import { FacultyClass, getFacultyClasses } from '@/lib/portal';

function FacultyHome() {
  const user = usePortalUser();
  const [classes, setClasses] = useState<FacultyClass[] | null>(null);
  const [error, setError] = useState('');

  const load = () => getFacultyClasses().then(setClasses).catch((e) => { setError(e.message); setClasses([]); });
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Faculty Portal</p>
          <h1 className="font-display text-display-sm text-navy">Welcome, {user?.fullName}</h1>
          <p className="text-text-secondary text-sm">Your assigned classes and subjects.</p>
        </div>
        <RefreshButton onClick={load} />
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}

      {classes === null ? (
        <div className="text-text-secondary">Loading…</div>
      ) : classes.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl shadow-soft p-10 text-center text-text-secondary">
          No classes assigned yet. An admin assigns you when creating a class.
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map((c) => (
            <div key={c.classId} className="bg-white border border-border rounded-2xl shadow-soft p-5">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <h2 className="font-display text-heading-md text-navy">{c.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-primary-tint text-primary text-xs font-medium">{c.board}</span>
                {c.stream && <span className="px-2 py-0.5 rounded-full bg-gold-tint text-gold-strong text-xs font-medium">{c.stream}</span>}
                <span className="px-2 py-0.5 rounded-full bg-muted text-text-secondary text-xs">{c.academicYear}</span>
                {c.isClassTeacher && <span className="px-2 py-0.5 rounded-full bg-green-tint text-green text-xs font-medium">Class teacher</span>}
              </div>
              <div className="space-y-2">
                {c.subjects.map((s) => {
                  const q = `classId=${c.classId}&subjectId=${s.subjectId}&cn=${encodeURIComponent(c.name)}&sn=${encodeURIComponent(s.name)}`;
                  return (
                    <div key={s.subjectId} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-surface border border-border flex-wrap">
                      <span className="font-medium text-navy">{s.name}</span>
                      <div className="flex gap-2">
                        <Action href={`/faculty/attendance?${q}`} icon="ClipboardDocumentCheckIcon" label="Attendance" tone="gold" />
                        <Action href={`/faculty/marks?${q}`} icon="DocumentChartBarIcon" label="Marks" tone="primary" />
                        <Action href={`/faculty/notes?${q}`} icon="DocumentTextIcon" label="Notes" tone="green" />
                      </div>
                    </div>
                  );
                })}
                {c.subjects.length === 0 && <p className="text-text-faint text-sm">You're the class teacher (no subject assigned).</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Action({ href, icon, label, tone }: { href: string; icon: string; label: string; tone: 'gold' | 'primary' | 'green' }) {
  const cls = { gold: 'text-gold-strong hover:bg-gold-tint', primary: 'text-primary hover:bg-primary-tint', green: 'text-green hover:bg-green-tint' }[tone];
  return (
    <Link href={href} data-cursor="hover" className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-border bg-white transition-colors ${cls}`}>
      <Icon name={icon} className="w-4 h-4" /> {label}
    </Link>
  );
}

export default function FacultyDashboardPage() {
  return (
    <PortalShell requiredRole="FACULTY" brand="Vertex Faculty" navItems={FACULTY_NAV} accent="gold">
      <FacultyHome />
    </PortalShell>
  );
}
