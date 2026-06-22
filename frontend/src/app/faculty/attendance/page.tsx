'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import PortalShell from '@/components/portal/PortalShell';
import { FACULTY_NAV } from '@/components/portal/facultyNav';
import { fieldCls } from '@/components/portal/adminUI';
import { AttendanceStatus, RosterRow, getAttendanceRoster, markAttendance } from '@/lib/portal';

const STATUSES: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];
const statusStyle: Record<AttendanceStatus, string> = {
  PRESENT: 'bg-green text-white',
  ABSENT: 'bg-error text-white',
  LATE: 'bg-gold text-gold-foreground',
  EXCUSED: 'bg-primary text-white',
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function AttendanceInner() {
  const sp = useSearchParams();
  const classId = sp.get('classId') || '';
  const subjectId = sp.get('subjectId') || '';
  const cn = sp.get('cn') || 'Class';
  const sn = sp.get('sn') || 'Subject';

  const [date, setDate] = useState(todayStr());
  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    setMsg('');
    try {
      setRoster(await getAttendanceRoster(classId, subjectId, date));
    } catch (e: any) {
      setMsg(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { if (classId && subjectId) load(); }, [date]); // eslint-disable-line

  const setStatus = (studentId: string, status: AttendanceStatus) =>
    setRoster((r) => r.map((row) => (row.studentId === studentId ? { ...row, status } : row)));
  const allPresent = () => setRoster((r) => r.map((row) => ({ ...row, status: 'PRESENT' })));

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const entries = roster.filter((r) => r.status).map((r) => ({ studentId: r.studentId, status: r.status as AttendanceStatus }));
      if (entries.length === 0) { setMsg('Mark at least one student'); setSaving(false); return; }
      await markAttendance({ classId, subjectId, date, entries });
      setMsg('Attendance saved ✓');
    } catch (e: any) {
      setMsg(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link href="/faculty/dashboard" className="text-sm text-text-secondary hover:text-navy" data-cursor="hover">← My Classes</Link>
      <div className="flex items-center justify-between flex-wrap gap-3 mt-2 mb-6">
        <div>
          <p className="eyebrow mb-1">Attendance</p>
          <h1 className="font-display text-display-sm text-navy">{sn}</h1>
          <p className="text-text-secondary text-sm">{cn}</p>
        </div>
        <div className="flex items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-navy mb-1">Date</label>
            <input type="date" value={date} max={todayStr()} onChange={(e) => setDate(e.target.value)} className={fieldCls} />
          </div>
          <Button variant="secondary" size="md" onClick={allPresent}>Mark all present</Button>
        </div>
      </div>

      {msg && <div className="mb-4 p-3 rounded-xl bg-surface border border-border text-navy text-sm">{msg}</div>}

      <div className="bg-white border border-border rounded-2xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-text-secondary">Loading roster…</div>
        ) : roster.length === 0 ? (
          <div className="p-10 text-center text-text-secondary">No students in this class.</div>
        ) : (
          <div className="divide-y divide-border">
            {roster.map((r) => (
              <div key={r.studentId} className="flex items-center justify-between gap-4 px-4 py-3 flex-wrap">
                <div>
                  <p className="text-navy font-medium">{r.name}</p>
                  <p className="text-xs text-text-faint">{r.idNumber}</p>
                </div>
                <div className="flex gap-1.5">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(r.studentId, s)}
                      data-cursor="hover"
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                        r.status === s ? statusStyle[s] + ' border-transparent' : 'bg-white text-text-secondary border-border hover:text-navy'
                      }`}
                    >
                      {s[0] + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {roster.length > 0 && (
        <div className="mt-5 flex justify-end">
          <Button variant="gold" size="lg" onClick={save} disabled={saving}>
            <Icon name="CheckCircleIcon" className="w-5 h-5" /> {saving ? 'Saving…' : 'Save attendance'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function FacultyAttendancePage() {
  return (
    <PortalShell requiredRole="FACULTY" brand="Vertex Faculty" navItems={FACULTY_NAV} accent="gold">
      <Suspense fallback={<div className="text-text-secondary">Loading…</div>}>
        <AttendanceInner />
      </Suspense>
    </PortalShell>
  );
}
