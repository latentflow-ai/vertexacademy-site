'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import RefreshButton from './RefreshButton';
import {
  AttendanceSummary,
  NoteItem,
  ReportCard,
  Slot,
  DAYS,
  getAttendanceSummary,
  getReportCard,
  getTimetable,
  listNotes,
  noteDownloadUrl,
} from '@/lib/portal';

type Tab = 'attendance' | 'marks' | 'timetable' | 'notes';
const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'attendance', label: 'Attendance', icon: 'ClipboardDocumentCheckIcon' },
  { key: 'marks', label: 'Marks', icon: 'DocumentChartBarIcon' },
  { key: 'timetable', label: 'Timetable', icon: 'CalendarDaysIcon' },
  { key: 'notes', label: 'Notes', icon: 'DocumentTextIcon' },
];

// Read-only academic views for a single student, reused by Student (own data)
// and Parent (approved ward). Accent tints the active tab.
export default function AcademicViews({
  studentId,
  classId,
  accent = 'primary',
}: {
  studentId: string;
  classId: string | null;
  accent?: 'primary' | 'green';
}) {
  const [tab, setTab] = useState<Tab>('attendance');
  const [reloadKey, setReloadKey] = useState(0);
  const activeCls = accent === 'green' ? 'bg-green text-white border-green' : 'bg-primary text-white border-primary';

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              data-cursor="hover"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                tab === t.key ? activeCls : 'bg-white text-text-secondary border-border hover:text-navy'
              }`}
            >
              <Icon name={t.icon} className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>
        <RefreshButton onClick={() => setReloadKey((k) => k + 1)} />
      </div>

      {tab === 'attendance' && <AttendanceView studentId={studentId} accent={accent} reloadKey={reloadKey} />}
      {tab === 'marks' && <MarksView studentId={studentId} reloadKey={reloadKey} />}
      {tab === 'timetable' && <TimetableView classId={classId} reloadKey={reloadKey} />}
      {tab === 'notes' && <NotesView classId={classId} reloadKey={reloadKey} />}
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border border-border rounded-2xl shadow-soft p-6">{children}</div>;
}

function AttendanceView({ studentId, accent, reloadKey }: { studentId: string; accent: 'primary' | 'green'; reloadKey: number }) {
  const [data, setData] = useState<AttendanceSummary | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { setData(null); getAttendanceSummary(studentId).then(setData).catch((e) => setErr(e.message)); }, [studentId, reloadKey]);
  if (err) return <Panel><p className="text-error text-sm">{err}</p></Panel>;
  if (!data) return <Panel><p className="text-text-secondary text-sm">Loading…</p></Panel>;
  const bar = accent === 'green' ? 'bg-green' : 'bg-primary';
  return (
    <Panel>
      <div className="flex items-center gap-3 mb-5">
        <div className="font-display text-3xl font-semibold text-navy">{data.overall}%</div>
        <p className="text-text-secondary text-sm">overall attendance</p>
      </div>
      {data.subjects.length === 0 ? (
        <p className="text-text-secondary text-sm">No attendance recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {data.subjects.map((s) => (
            <div key={s.subject}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-navy font-medium">{s.subject}</span>
                <span className="text-text-faint">{s.present}/{s.total} · {s.percentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full ${bar}`} style={{ width: `${s.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function MarksView({ studentId, reloadKey }: { studentId: string; reloadKey: number }) {
  const [data, setData] = useState<ReportCard | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { setData(null); getReportCard(studentId).then(setData).catch((e) => setErr(e.message)); }, [studentId, reloadKey]);
  if (err) return <Panel><p className="text-error text-sm">{err}</p></Panel>;
  if (!data) return <Panel><p className="text-text-secondary text-sm">Loading…</p></Panel>;
  if (data.subjects.length === 0) return <Panel><p className="text-text-secondary text-sm">No marks recorded yet.</p></Panel>;
  return (
    <Panel>
      <div className="flex items-center gap-3 mb-5">
        <div className="font-display text-3xl font-semibold text-navy">{data.overall}%</div>
        <p className="text-text-secondary text-sm">overall</p>
      </div>
      <div className="space-y-4">
        {data.subjects.map((s) => (
          <div key={s.subject} className="border border-border rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <span className="font-display text-heading-sm text-navy">{s.subject}</span>
              <span className="text-sm text-text-faint">{s.total}/{s.max} · {s.percentage}%</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {s.items.map((it, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-surface border border-border text-xs text-navy">
                  {it.assessment}: <strong>{it.score}</strong>/{it.maxScore}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function TimetableView({ classId, reloadKey }: { classId: string | null; reloadKey: number }) {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { setSlots(null); if (classId) getTimetable(classId).then(setSlots).catch((e) => setErr(e.message)); else setSlots([]); }, [classId, reloadKey]);
  if (err) return <Panel><p className="text-error text-sm">{err}</p></Panel>;
  if (!slots) return <Panel><p className="text-text-secondary text-sm">Loading…</p></Panel>;
  if (slots.length === 0) return <Panel><p className="text-text-secondary text-sm">No timetable published yet.</p></Panel>;
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {DAYS.map((d, i) => {
        const daySlots = slots.filter((s) => s.dayOfWeek === i + 1).sort((a, b) => a.period - b.period);
        if (daySlots.length === 0) return null;
        return (
          <div key={d} className="bg-white border border-border rounded-2xl shadow-soft p-4">
            <h3 className="font-display text-heading-sm text-navy mb-3">{d}</h3>
            <div className="space-y-2">
              {daySlots.map((s) => (
                <div key={s.id} className="px-3 py-2 rounded-xl bg-surface border border-border text-sm">
                  <p className="text-navy font-medium">P{s.period} · {s.subject?.name || '—'}</p>
                  <p className="text-xs text-text-faint">{s.startTime}–{s.endTime} · {s.faculty?.user.fullName || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NotesView({ classId, reloadKey }: { classId: string | null; reloadKey: number }) {
  const [notes, setNotes] = useState<NoteItem[] | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { setNotes(null); if (classId) listNotes(classId).then(setNotes).catch((e) => setErr(e.message)); else setNotes([]); }, [classId, reloadKey]);
  if (err) return <Panel><p className="text-error text-sm">{err}</p></Panel>;
  if (!notes) return <Panel><p className="text-text-secondary text-sm">Loading…</p></Panel>;
  if (notes.length === 0) return <Panel><p className="text-text-secondary text-sm">No notes shared yet.</p></Panel>;
  return (
    <div className="bg-white border border-border rounded-2xl shadow-soft divide-y divide-border">
      {notes.map((n) => (
        <div key={n.id} className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Icon name="DocumentTextIcon" className="w-6 h-6 text-green" />
            <div>
              <p className="text-navy font-medium">{n.title}</p>
              <p className="text-xs text-text-faint">{n.subject?.name ? `${n.subject.name} · ` : ''}{n.uploadedBy?.user.fullName}</p>
            </div>
          </div>
          <a href={noteDownloadUrl(n.id)} className="px-3 py-1.5 rounded-full text-sm font-medium border border-border text-navy hover:bg-surface" data-cursor="hover">Download</a>
        </div>
      ))}
    </div>
  );
}
