'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import PortalShell from '@/components/portal/PortalShell';
import { ADMIN_NAV } from '@/components/portal/adminNav';
import { ActionBtn, CredentialModal, Field, Modal, SelectField, StatusBadge, fieldCls } from '@/components/portal/adminUI';
import RefreshButton from '@/components/portal/RefreshButton';
import {
  BulkResult,
  ClassRec,
  Student,
  bulkImportStudents,
  classLabel,
  createStudent,
  deleteStudent,
  listClasses,
  listStudents,
  resetStudentPassword,
  studentExportUrl,
  studentTemplateUrl,
  updateStudent,
} from '@/lib/admin';

interface Cred { title: string; email: string; loginId: string | null; password: string; }

function StudentsManager() {
  const [rows, setRows] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassRec[]>([]);
  const [filterClass, setFilterClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [cred, setCred] = useState<Cred | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([listStudents(filterClass || undefined), listClasses()]);
      setRows(s);
      setClasses(c);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterClass]);

  const reset = async (s: Student) => {
    const { tempPassword } = await resetStudentPassword(s.id);
    setCred({ title: 'Password reset', email: s.user.email, loginId: s.user.idNumber, password: tempPassword });
  };
  const toggleActive = async (s: Student) => { await updateStudent(s.id, { isActive: !s.user.isActive }); refresh(); };
  const remove = async (s: Student) => {
    if (!confirm(`Permanently remove ${s.user.fullName}?`)) return;
    await deleteStudent(s.id);
    refresh();
  };

  const noClasses = classes.length === 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="font-display text-display-sm text-navy">Students</h1>
          <p className="text-text-secondary text-sm">Enrol individually or in bulk; export anytime.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <RefreshButton onClick={refresh} />
          <Button variant="secondary" size="md" onClick={() => window.open(studentExportUrl(filterClass || undefined), '_blank')}>
            <Icon name="ArrowUpRightIcon" className="w-5 h-5" /> Export
          </Button>
          <Button variant="green" size="md" onClick={() => setShowBulk(true)} disabled={noClasses}>
            <Icon name="DocumentChartBarIcon" className="w-5 h-5" /> Bulk add
          </Button>
          <Button variant="primary" size="md" onClick={() => setShowAdd(true)} disabled={noClasses}>
            <Icon name="UserIcon" className="w-5 h-5" /> Add Student
          </Button>
        </div>
      </div>

      {noClasses && <div className="mb-4 p-3 rounded-xl bg-gold-tint text-gold-strong text-sm">Create a class first — students must belong to a class.</div>}
      {error && <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}

      <div className="mb-4 max-w-sm">
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className={fieldCls}>
          <option value="">All classes</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{classLabel(c)}</option>)}
        </select>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-text-secondary">Loading students…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-text-secondary">No students yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-text-secondary">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Name</th>
                  <th className="text-left font-medium px-4 py-3">Student ID</th>
                  <th className="text-left font-medium px-4 py-3">Class</th>
                  <th className="text-left font-medium px-4 py-3">Subjects</th>
                  <th className="text-left font-medium px-4 py-3">Parent phone</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-right font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((s) => (
                  <tr key={s.id} className="hover:bg-surface/60">
                    <td className="px-4 py-3 text-navy font-medium">{s.user.fullName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-secondary">{s.user.idNumber}</td>
                    <td className="px-4 py-3 text-text-secondary">{s.class ? `${s.class.name} · ${s.class.board}${s.class.stream ? ` · ${s.class.stream}` : ''}` : '—'}</td>
                    <td className="px-4 py-3 text-text-secondary" title={s.subjects.map((x) => x.name).join(', ')}>{s.subjects.length}</td>
                    <td className="px-4 py-3 text-text-secondary">{s.parentPhone}</td>
                    <td className="px-4 py-3"><StatusBadge active={s.user.isActive} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <ActionBtn label="Edit" icon="PencilSquareIcon" onClick={() => setEditing(s)} />
                        <ActionBtn label="Reset password" icon="LockClosedIcon" onClick={() => reset(s)} />
                        <ActionBtn label={s.user.isActive ? 'Deactivate' : 'Activate'} icon={s.user.isActive ? 'XCircleIcon' : 'CheckCircleIcon'} onClick={() => toggleActive(s)} />
                        <ActionBtn label="Delete" icon="ExclamationTriangleIcon" danger onClick={() => remove(s)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && <AddStudentModal classes={classes} onClose={() => setShowAdd(false)} onCreated={(c) => { setShowAdd(false); setCred(c); refresh(); }} />}
      {showBulk && <BulkModal classes={classes} onClose={() => setShowBulk(false)} onDone={refresh} />}
      {editing && <EditStudentModal student={editing} classes={classes} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />}
      {cred && <CredentialModal {...cred} onClose={() => setCred(null)} />}
    </div>
  );
}

function SubjectPicker({ subjects, selected, onChange }: { subjects: { id: string; name: string }[]; selected: string[]; onChange: (ids: string[]) => void }) {
  const allSelected = subjects.length > 0 && selected.length === subjects.length;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-navy">Subjects *</label>
        {subjects.length > 0 && (
          <button type="button" onClick={() => onChange(allSelected ? [] : subjects.map((s) => s.id))} className="text-xs font-semibold text-primary hover:underline" data-cursor="hover">
            {allSelected ? 'Clear all' : 'Select all'}
          </button>
        )}
      </div>
      {subjects.length === 0 ? (
        <p className="text-xs text-text-faint">This class has no subjects.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {subjects.map((s) => {
            const checked = selected.includes(s.id);
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => onChange(checked ? selected.filter((x) => x !== s.id) : [...selected, s.id])}
                data-cursor="hover"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm text-left transition-colors ${
                  checked ? 'bg-primary-tint border-primary/40 text-navy' : 'bg-surface border-border text-text-secondary hover:text-navy'
                }`}
              >
                <span className={`w-4 h-4 rounded flex items-center justify-center border ${checked ? 'bg-primary border-primary text-white' : 'border-input bg-white'}`}>
                  {checked && <Icon name="CheckCircleIcon" className="w-3.5 h-3.5" />}
                </span>
                {s.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EditStudentModal({ student, classes, onClose, onSaved }: { student: Student; classes: ClassRec[]; onClose: () => void; onSaved: () => void }) {
  const [fullName, setFullName] = useState(student.user.fullName);
  const [classId, setClassId] = useState(student.class?.id || '');
  const [subjectIds, setSubjectIds] = useState<string[]>(student.subjects.map((s) => s.id));
  const [parentPhone, setParentPhone] = useState(student.parentPhone);
  const [dob, setDob] = useState(student.dob ? student.dob.slice(0, 10) : '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const currentClass = classes.find((c) => c.id === classId);
  const classSubjects = currentClass?.subjects || [];
  const phoneOk = parentPhone.replace(/\D/g, '').length >= 10;

  const changeClass = (id: string) => {
    setClassId(id);
    // When moving to a different class, default to all subjects of the new class.
    if (id !== student.class?.id) setSubjectIds(classes.find((c) => c.id === id)?.subjects.map((s) => s.id) || []);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phoneOk) return setError('Enter a valid 10-digit parent phone');
    if (subjectIds.length === 0) return setError('Select at least one subject');
    setSaving(true);
    try {
      await updateStudent(student.id, {
        fullName: fullName.trim(),
        classId,
        subjectIds,
        parentPhone: parentPhone.trim(),
        dob: dob || undefined,
      });
      onSaved();
    } catch (e: any) {
      setError(e.message || 'Could not save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} title={`Edit · ${student.user.idNumber || student.user.fullName}`}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name *" value={fullName} onChange={setFullName} />
        <SelectField label="Class *" value={classId} onChange={changeClass}>
          {classes.map((c) => <option key={c.id} value={c.id}>{classLabel(c)}</option>)}
        </SelectField>
        <SubjectPicker subjects={classSubjects} selected={subjectIds} onChange={setSubjectIds} />
        <Field label="Parent / guardian phone *" value={parentPhone} onChange={setParentPhone} placeholder="10-digit mobile" />
        <Field label="Date of birth" type="date" value={dob} onChange={setDob} />
        {error && <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary hover:text-navy" data-cursor="hover">Cancel</button>
          <Button type="submit" variant="primary" size="md" disabled={saving || !fullName || !classId || !phoneOk}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function AddStudentModal({ classes, onClose, onCreated }: { classes: ClassRec[]; onClose: () => void; onCreated: (c: Cred) => void }) {
  const firstClass = classes[0];
  const [form, setForm] = useState({ fullName: '', classId: firstClass?.id || '', parentPhone: '', email: '', dob: '' });
  const [subjectIds, setSubjectIds] = useState<string[]>(firstClass?.subjects.map((s) => s.id) || []);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const phoneOk = form.parentPhone.replace(/\D/g, '').length >= 10;

  const currentClass = classes.find((c) => c.id === form.classId);
  const classSubjects = currentClass?.subjects || [];

  // Changing the class resets the subject selection to "all" of the new class.
  const changeClass = (id: string) => {
    set('classId', id);
    const cls = classes.find((c) => c.id === id);
    setSubjectIds(cls?.subjects.map((s) => s.id) || []);
  };
  const toggleSubject = (id: string) =>
    setSubjectIds((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]));
  const allSelected = classSubjects.length > 0 && subjectIds.length === classSubjects.length;
  const toggleAll = () => setSubjectIds(allSelected ? [] : classSubjects.map((s) => s.id));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phoneOk) return setError('Enter a valid 10-digit parent phone');
    if (subjectIds.length === 0) return setError('Select at least one subject (or choose All)');
    setSaving(true);
    try {
      const { student, tempPassword, loginId } = await createStudent({
        fullName: form.fullName.trim(), classId: form.classId,
        parentPhone: form.parentPhone.trim(), subjectIds,
        email: form.email.trim() || undefined, dob: form.dob || undefined,
      });
      onCreated({ title: 'Student enrolled', email: student.user.email, loginId, password: tempPassword });
    } catch (e: any) {
      setError(e.message || 'Could not enrol student');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Add Student">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name *" value={form.fullName} onChange={(v) => set('fullName', v)} placeholder="Student name" />
        <SelectField label="Class *" value={form.classId} onChange={changeClass}>
          {classes.map((c) => <option key={c.id} value={c.id}>{classLabel(c)}</option>)}
        </SelectField>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-navy">Subjects *</label>
            {classSubjects.length > 0 && (
              <button type="button" onClick={toggleAll} className="text-xs font-semibold text-primary hover:underline" data-cursor="hover">
                {allSelected ? 'Clear all' : 'Select all'}
              </button>
            )}
          </div>
          {classSubjects.length === 0 ? (
            <p className="text-xs text-text-faint">This class has no subjects.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {classSubjects.map((s) => {
                const checked = subjectIds.includes(s.id);
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleSubject(s.id)}
                    data-cursor="hover"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm text-left transition-colors ${
                      checked ? 'bg-primary-tint border-primary/40 text-navy' : 'bg-surface border-border text-text-secondary hover:text-navy'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center border ${checked ? 'bg-primary border-primary text-white' : 'border-input bg-white'}`}>
                      {checked && <Icon name="CheckCircleIcon" className="w-3.5 h-3.5" />}
                    </span>
                    {s.name}
                  </button>
                );
              })}
            </div>
          )}
          <p className="text-xs text-text-faint mt-1.5">Faculty of the selected subjects will see this student in their roster.</p>
        </div>

        <Field label="Parent / guardian phone *" value={form.parentPhone} onChange={(v) => set('parentPhone', v)} placeholder="10-digit mobile — used for parent OTP login" />
        <Field label="Email" value={form.email} onChange={(v) => set('email', v)} placeholder="Optional — login also works by Student ID" />
        <Field label="Date of birth" type="date" value={form.dob} onChange={(v) => set('dob', v)} />
        <p className="text-xs text-text-faint">A Student ID (e.g. VA-26-0001) is generated automatically — no roll number needed.</p>
        {error && <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary hover:text-navy" data-cursor="hover">Cancel</button>
          <Button type="submit" variant="primary" size="md" disabled={saving || !form.fullName || !form.classId || !phoneOk}>
            {saving ? 'Enrolling…' : 'Enrol student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function BulkModal({ classes, onClose, onDone }: { classes: ClassRec[]; onClose: () => void; onDone: () => void }) {
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BulkResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!file) return setError('Choose a filled template file');
    setBusy(true);
    try {
      const r = await bulkImportStudents(classId, file);
      setResult(r);
      onDone();
    } catch (e: any) {
      setError(e.message || 'Import failed');
    } finally {
      setBusy(false);
    }
  };

  const downloadCreds = () => {
    if (!result) return;
    const rows = [['Student ID', 'Name', 'Temporary Password'], ...result.created.map((c) => [c.idNumber, c.fullName, c.tempPassword])];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'student-credentials.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal onClose={onClose} title="Bulk add students">
      {!result ? (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-text-secondary text-sm">
            1) Download the template, 2) fill student rows, 3) pick the class and upload.
          </p>
          <a href={studentTemplateUrl()} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline" data-cursor="hover">
            <Icon name="ArrowUpRightIcon" className="w-4 h-4" /> Download template (.xlsx)
          </a>
          <SelectField label="Target class *" value={classId} onChange={setClassId}>
            {classes.map((c) => <option key={c.id} value={c.id}>{classLabel(c)}</option>)}
          </SelectField>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Spreadsheet (.xlsx) *</label>
            <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-text-secondary file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-white file:font-semibold" />
          </div>
          {error && <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary hover:text-navy" data-cursor="hover">Cancel</button>
            <Button type="submit" variant="green" size="md" disabled={busy || !classId}>{busy ? 'Importing…' : 'Import'}</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-green-tint text-green text-sm font-medium">
            Imported {result.createdCount} student{result.createdCount === 1 ? '' : 's'}.
          </div>
          {result.errors.length > 0 && (
            <div className="p-3 rounded-xl bg-gold-tint text-gold-strong text-sm">
              {result.errors.length} row(s) skipped:
              <ul className="mt-1 list-disc list-inside">
                {result.errors.slice(0, 8).map((e, i) => <li key={i}>Row {e.row}: {e.reason}</li>)}
              </ul>
            </div>
          )}
          {result.createdCount > 0 && (
            <p className="text-text-secondary text-sm">Download the credentials (ID + temporary password) to hand out — shown only once.</p>
          )}
          <div className="flex justify-end gap-3">
            {result.createdCount > 0 && <Button variant="primary" size="md" onClick={downloadCreds}>Download credentials</Button>}
            <Button variant="secondary" size="md" onClick={onClose}>Done</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function AdminStudentsPage() {
  return (
    <PortalShell requiredRole="ADMIN" brand="Vertex Admin" navItems={ADMIN_NAV} accent="primary">
      <StudentsManager />
    </PortalShell>
  );
}
