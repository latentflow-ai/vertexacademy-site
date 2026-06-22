'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import PortalShell from '@/components/portal/PortalShell';
import { ADMIN_NAV } from '@/components/portal/adminNav';
import { fieldCls } from '@/components/portal/adminUI';
import RefreshButton from '@/components/portal/RefreshButton';
import { ClassRec, TimetableSlot, classLabel, deleteSlot, listClasses, listTimetable, saveSlot } from '@/lib/admin';
import { DAYS } from '@/lib/portal';

function TimetableManager() {
  const [classes, setClasses] = useState<ClassRec[]>([]);
  const [classId, setClassId] = useState('');
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // add-slot form
  const [days, setDays] = useState<number[]>([1]);
  const [period, setPeriod] = useState(1);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');
  const [subjectId, setSubjectId] = useState('');

  useEffect(() => {
    listClasses().then((c) => { setClasses(c); if (c[0]) setClassId(c[0].id); }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const current = classes.find((c) => c.id === classId);

  const loadSlots = async (cid: string) => {
    if (!cid) return;
    try { setSlots(await listTimetable(cid)); } catch (e: any) { setError(e.message); }
  };
  useEffect(() => { if (classId) loadSlots(classId); }, [classId]);
  useEffect(() => { if (current?.subjects[0]) setSubjectId(current.subjects[0].id); }, [classId]); // eslint-disable-line

  const toggleDay = (d: number) => setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (days.length === 0) { setError('Select at least one day'); return; }
    const subj = current?.subjects.find((s) => s.id === subjectId);
    const facultyId = subj?.assignments[0]?.faculty.id || null;
    try {
      // One slot per selected day (same period/time/subject) — e.g. Mon, Wed, Fri.
      for (const d of [...days].sort((a, b) => a - b)) {
        await saveSlot({ classId, dayOfWeek: d, period, startTime: start, endTime: end, subjectId: subjectId || null, facultyId });
      }
      await loadSlots(classId);
    } catch (e: any) {
      setError(e.message || 'Could not save slot');
    }
  };
  const removeSlot = async (id: string) => { await deleteSlot(id); loadSlots(classId); };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="font-display text-display-sm text-navy">Timetable</h1>
          <p className="text-text-secondary text-sm">Set the weekly schedule per class. Faculty & students view it read-only.</p>
        </div>
        {classId && <RefreshButton onClick={() => loadSlots(classId)} />}
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}

      {loading ? (
        <div className="text-text-secondary">Loading…</div>
      ) : classes.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl shadow-soft p-10 text-center text-text-secondary">Create a class first.</div>
      ) : (
        <>
          <div className="mb-5 max-w-sm">
            <select value={classId} onChange={(e) => setClassId(e.target.value)} className={fieldCls}>
              {classes.map((c) => <option key={c.id} value={c.id}>{classLabel(c)}</option>)}
            </select>
          </div>

          <form onSubmit={add} className="bg-white border border-border rounded-2xl shadow-soft p-5 mb-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-navy mb-1.5">Days <span className="text-text-faint font-normal">(select one or more — e.g. Mon, Wed, Fri)</span></label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d, i) => {
                  const active = days.includes(i + 1);
                  return (
                    <button
                      type="button"
                      key={d}
                      onClick={() => toggleDay(i + 1)}
                      data-cursor="hover"
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        active ? 'bg-primary text-white border-primary' : 'bg-surface text-text-secondary border-border hover:text-navy'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid sm:grid-cols-5 gap-3 items-end">
              <Sel label="Period" value={String(period)} onChange={(v) => setPeriod(Number(v))}>
                {Array.from({ length: 10 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
              </Sel>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Start</label>
                <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={fieldCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">End</label>
                <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={fieldCls} />
              </div>
              <Sel label="Subject" value={subjectId} onChange={setSubjectId}>
                {current?.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Sel>
              <Button type="submit" variant="primary" size="md">Save slot{days.length > 1 ? 's' : ''}</Button>
            </div>
          </form>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DAYS.map((d, i) => {
              const daySlots = slots.filter((s) => s.dayOfWeek === i + 1).sort((a, b) => a.period - b.period);
              return (
                <div key={d} className="bg-white border border-border rounded-2xl shadow-soft p-4">
                  <h3 className="font-display text-heading-sm text-navy mb-3">{d}</h3>
                  {daySlots.length === 0 ? (
                    <p className="text-text-faint text-sm">No periods.</p>
                  ) : (
                    <div className="space-y-2">
                      {daySlots.map((s) => (
                        <div key={s.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-surface border border-border text-sm">
                          <div>
                            <p className="text-navy font-medium">P{s.period} · {s.subject?.name || '—'}</p>
                            <p className="text-xs text-text-faint">{s.startTime}–{s.endTime} · {s.faculty?.user.fullName || '—'}</p>
                          </div>
                          <button onClick={() => removeSlot(s.id)} className="text-text-faint hover:text-error" data-cursor="hover">
                            <Icon name="XMarkIcon" className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function Sel({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-navy mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={fieldCls}>{children}</select>
    </div>
  );
}

export default function AdminTimetablePage() {
  return (
    <PortalShell requiredRole="ADMIN" brand="Vertex Admin" navItems={ADMIN_NAV} accent="primary">
      <TimetableManager />
    </PortalShell>
  );
}
