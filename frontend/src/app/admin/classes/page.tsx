'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import PortalShell from '@/components/portal/PortalShell';
import { ADMIN_NAV } from '@/components/portal/adminNav';
import { ActionBtn, Field, Modal, SelectField, fieldCls } from '@/components/portal/adminUI';
import RefreshButton from '@/components/portal/RefreshButton';
import {
  BOARDS,
  Board,
  ClassRec,
  Faculty,
  STREAMS,
  Stream,
  classLabel,
  createClass,
  deleteClass,
  listClasses,
  listFaculty,
  updateClass,
} from '@/lib/admin';

const LEVELS = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const needsStream = (name: string) => name === 'Class 11' || name === 'Class 12';

function ClassesManager() {
  const [rows, setRows] = useState<ClassRec[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<ClassRec | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const [c, f] = await Promise.all([listClasses(), listFaculty()]);
      setRows(c);
      setFaculty(f);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);

  const remove = async (c: ClassRec) => {
    if (!confirm(`Delete ${classLabel(c)}? Students are detached, not deleted.`)) return;
    await deleteClass(c.id);
    refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="font-display text-display-sm text-navy">Classes</h1>
          <p className="text-text-secondary text-sm">Create a class with its board, stream, and subject-wise faculty.</p>
        </div>
        <div className="flex gap-2">
          <RefreshButton onClick={refresh} />
          <Button variant="green" size="md" onClick={() => setShowAdd(true)} disabled={faculty.length === 0}>
            <Icon name="BookOpenIcon" className="w-5 h-5" /> Add Class
          </Button>
        </div>
      </div>

      {faculty.length === 0 && (
        <div className="mb-4 p-3 rounded-xl bg-gold-tint text-gold-strong text-sm">
          Add faculty first — every subject needs an assigned faculty.
        </div>
      )}
      {error && <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white border border-border rounded-2xl shadow-soft p-10 text-center text-text-secondary">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl shadow-soft p-10 text-center text-text-secondary">
            No classes yet. Click <span className="text-navy font-medium">Add Class</span>.
          </div>
        ) : (
          rows.map((c) => (
            <div key={c.id} className="bg-white border border-border rounded-2xl shadow-soft p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="font-display text-heading-md text-navy">{c.name}</h2>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Tag tone="primary">{c.board}</Tag>
                    {c.stream && <Tag tone="gold">{c.stream}</Tag>}
                    <Tag tone="muted">{c.academicYear}</Tag>
                    <Tag tone="muted">{c._count?.students ?? 0} students</Tag>
                    {c.classTeacher && <Tag tone="green">Class teacher: {c.classTeacher.user.fullName}</Tag>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <ActionBtn label="Edit" icon="PencilSquareIcon" onClick={() => setEditing(c)} />
                  <ActionBtn label="Delete" icon="ExclamationTriangleIcon" danger onClick={() => remove(c)} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {c.subjects.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-surface border border-border text-sm">
                    <span className="text-navy font-medium">{s.name}</span>
                    <span className="text-text-faint text-xs">{s.assignments[0]?.faculty.user.fullName || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && <AddClassModal faculty={faculty} onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); refresh(); }} />}
      {editing && <EditClassModal cls={editing} faculty={faculty} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />}
    </div>
  );
}

interface EditSubjectRow { subjectId: string; name: string; facultyId: string; originalName: string; originalFacultyId: string; }

function EditClassModal({ cls, faculty, onClose, onSaved }: { cls: ClassRec; faculty: Faculty[]; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(cls.name);
  const [board, setBoard] = useState<Board>(cls.board);
  const [stream, setStream] = useState<Stream>(cls.stream || 'SCIENCE');
  const [academicYear, setAcademicYear] = useState(cls.academicYear);
  const [classTeacherFacultyId, setClassTeacher] = useState(cls.classTeacher?.id || '');
  const [existing, setExisting] = useState<EditSubjectRow[]>(
    cls.subjects.map((s) => {
      const fid = s.assignments[0]?.faculty.id || '';
      return { subjectId: s.id, name: s.name, facultyId: fid, originalName: s.name, originalFacultyId: fid };
    })
  );
  const [removed, setRemoved] = useState<string[]>([]);
  const [added, setAdded] = useState<{ name: string; facultyId: string }[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const setExist = (i: number, patch: Partial<EditSubjectRow>) =>
    setExisting((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const setAddRow = (i: number, patch: Partial<{ name: string; facultyId: string }>) =>
    setAdded((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const newRows = added.map((a) => ({ name: a.name.trim(), facultyId: a.facultyId })).filter((a) => a.name && a.facultyId);
    const kept = existing.filter((r) => !removed.includes(r.subjectId));
    const updates = kept
      .filter((r) => r.name.trim() && r.facultyId && (r.name.trim() !== r.originalName || r.facultyId !== r.originalFacultyId))
      .map((r) => ({ subjectId: r.subjectId, name: r.name.trim(), facultyId: r.facultyId }));
    if (kept.length + newRows.length === 0) return setError('A class must have at least one subject');
    setSaving(true);
    try {
      await updateClass(cls.id, {
        name,
        board,
        stream: needsStream(name) ? stream : null,
        academicYear: academicYear.trim(),
        classTeacherFacultyId: classTeacherFacultyId || null,
        updateSubjects: updates.length ? updates : undefined,
        removeSubjectIds: removed.length ? removed : undefined,
        addSubjects: newRows.length ? newRows : undefined,
      });
      onSaved();
    } catch (e: any) {
      setError(e.message || 'Could not save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} title={`Edit · ${cls.name}`}>
      <form onSubmit={submit} className="space-y-4">
        <SelectField label="Class *" value={name} onChange={setName}>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </SelectField>
        <SelectField label="Board *" value={board} onChange={(v) => setBoard(v as Board)}>
          {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </SelectField>
        {needsStream(name) && (
          <SelectField label="Stream *" value={stream} onChange={(v) => setStream(v as Stream)}>
            {STREAMS.map((s) => <option key={s} value={s}>{s}</option>)}
          </SelectField>
        )}
        <Field label="Academic year *" value={academicYear} onChange={setAcademicYear} />

        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Subjects & faculty</label>
          <div className="space-y-2">
            {existing.map((r, i) => {
              const isRemoved = removed.includes(r.subjectId);
              return (
                <div key={r.subjectId} className={`flex gap-2 ${isRemoved ? 'opacity-40' : ''}`}>
                  <input className={fieldCls} value={r.name} disabled={isRemoved} onChange={(e) => setExist(i, { name: e.target.value })} />
                  <select className={fieldCls} value={r.facultyId} disabled={isRemoved} onChange={(e) => setExist(i, { facultyId: e.target.value })}>
                    {faculty.map((f) => <option key={f.id} value={f.id}>{f.user.fullName}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={() => setRemoved((rm) => (isRemoved ? rm.filter((x) => x !== r.subjectId) : [...rm, r.subjectId]))}
                    title={isRemoved ? 'Undo remove' : 'Remove subject'}
                    className={`px-1 ${isRemoved ? 'text-primary' : 'text-text-faint hover:text-error'}`}
                    data-cursor="hover"
                  >
                    <Icon name={isRemoved ? 'ArrowPathIcon' : 'XMarkIcon'} className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
            {added.map((r, i) => (
              <div key={`new-${i}`} className="flex gap-2">
                <input className={fieldCls} placeholder="New subject" value={r.name} onChange={(e) => setAddRow(i, { name: e.target.value })} />
                <select className={fieldCls} value={r.facultyId} onChange={(e) => setAddRow(i, { facultyId: e.target.value })}>
                  {faculty.map((f) => <option key={f.id} value={f.id}>{f.user.fullName}</option>)}
                </select>
                <button type="button" onClick={() => setAdded((rs) => rs.filter((_, idx) => idx !== i))} className="text-text-faint hover:text-error px-1" data-cursor="hover">
                  <Icon name="XMarkIcon" className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setAdded((rs) => [...rs, { name: '', facultyId: faculty[0]?.id || '' }])} className="mt-2 text-sm font-medium text-primary hover:underline" data-cursor="hover">
            + Add subject
          </button>
          {removed.length > 0 && (
            <p className="text-xs text-error mt-2">Removing a subject deletes its attendance, marks and notes. This cannot be undone after saving.</p>
          )}
        </div>

        <SelectField label="Class teacher (optional)" value={classTeacherFacultyId} onChange={setClassTeacher}>
          <option value="">— None —</option>
          {faculty.map((f) => <option key={f.id} value={f.id}>{f.user.fullName}</option>)}
        </SelectField>

        {error && <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary hover:text-navy" data-cursor="hover">Cancel</button>
          <Button type="submit" variant="green" size="md" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
        </div>
      </form>
    </Modal>
  );
}

function Tag({ children, tone }: { children: React.ReactNode; tone: 'primary' | 'gold' | 'green' | 'muted' }) {
  const cls = {
    primary: 'bg-primary-tint text-primary',
    gold: 'bg-gold-tint text-gold-strong',
    green: 'bg-green-tint text-green',
    muted: 'bg-muted text-text-secondary',
  }[tone];
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{children}</span>;
}

interface Row { name: string; facultyId: string; }

function AddClassModal({ faculty, onClose, onCreated }: { faculty: Faculty[]; onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('Class 6');
  const [board, setBoard] = useState<Board>('CBSE');
  const [stream, setStream] = useState<Stream>('SCIENCE');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [classTeacherFacultyId, setClassTeacher] = useState('');
  const [subjects, setSubjects] = useState<Row[]>([{ name: '', facultyId: faculty[0]?.id || '' }]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const setRow = (i: number, patch: Partial<Row>) =>
    setSubjects((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () => setSubjects((rs) => [...rs, { name: '', facultyId: faculty[0]?.id || '' }]);
  const removeRow = (i: number) => setSubjects((rs) => rs.filter((_, idx) => idx !== i));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const rows = subjects.map((s) => ({ name: s.name.trim(), facultyId: s.facultyId })).filter((s) => s.name && s.facultyId);
    if (rows.length === 0) return setError('Add at least one subject with a faculty');
    setSaving(true);
    try {
      await createClass({
        name,
        board,
        stream: needsStream(name) ? stream : null,
        academicYear: academicYear.trim(),
        classTeacherFacultyId: classTeacherFacultyId || null,
        subjects: rows,
      });
      onCreated();
    } catch (e: any) {
      setError(e.message || 'Could not create class');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Add Class">
      <form onSubmit={submit} className="space-y-4">
        <SelectField label="Class *" value={name} onChange={setName}>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </SelectField>
        <SelectField label="Board of Education *" value={board} onChange={(v) => setBoard(v as Board)}>
          {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </SelectField>
        {needsStream(name) && (
          <SelectField label="Stream * (Class 11 & 12)" value={stream} onChange={(v) => setStream(v as Stream)}>
            {STREAMS.map((s) => <option key={s} value={s}>{s}</option>)}
          </SelectField>
        )}
        <Field label="Academic year *" value={academicYear} onChange={setAcademicYear} placeholder="2026-2027" />

        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Subjects & faculty *</label>
          <div className="space-y-2">
            {subjects.map((r, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={fieldCls}
                  placeholder="Subject (e.g. Physics)"
                  value={r.name}
                  onChange={(e) => setRow(i, { name: e.target.value })}
                />
                <select className={fieldCls} value={r.facultyId} onChange={(e) => setRow(i, { facultyId: e.target.value })}>
                  {faculty.map((f) => <option key={f.id} value={f.id}>{f.user.fullName}</option>)}
                </select>
                {subjects.length > 1 && (
                  <button type="button" onClick={() => removeRow(i)} className="text-text-faint hover:text-error px-1" data-cursor="hover">
                    <Icon name="XMarkIcon" className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addRow} className="mt-2 text-sm font-medium text-primary hover:underline" data-cursor="hover">
            + Add subject
          </button>
        </div>

        <SelectField label="Class teacher (optional)" value={classTeacherFacultyId} onChange={setClassTeacher}>
          <option value="">— None —</option>
          {faculty.map((f) => <option key={f.id} value={f.id}>{f.user.fullName}</option>)}
        </SelectField>

        {error && <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary hover:text-navy" data-cursor="hover">Cancel</button>
          <Button type="submit" variant="green" size="md" disabled={saving}>
            {saving ? 'Creating…' : 'Create class'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminClassesPage() {
  return (
    <PortalShell requiredRole="ADMIN" brand="Vertex Admin" navItems={ADMIN_NAV} accent="primary">
      <ClassesManager />
    </PortalShell>
  );
}
