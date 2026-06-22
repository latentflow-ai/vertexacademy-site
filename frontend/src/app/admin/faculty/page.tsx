'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import PortalShell from '@/components/portal/PortalShell';
import { ADMIN_NAV } from '@/components/portal/adminNav';
import { ActionBtn, CredentialModal, Field, Modal, StatusBadge } from '@/components/portal/adminUI';
import RefreshButton from '@/components/portal/RefreshButton';
import {
  Faculty,
  createFaculty,
  deleteFaculty,
  listFaculty,
  resetFacultyPassword,
  updateFaculty,
} from '@/lib/admin';

interface Cred {
  title: string;
  email: string;
  loginId: string | null;
  password: string;
}

function FacultyManager() {
  const [rows, setRows] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Faculty | null>(null);
  const [cred, setCred] = useState<Cred | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setRows(await listFaculty());
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);

  const toggleActive = async (f: Faculty) => {
    await updateFaculty(f.id, { isActive: !f.user.isActive });
    refresh();
  };
  const reset = async (f: Faculty) => {
    const { tempPassword } = await resetFacultyPassword(f.id);
    setCred({ title: 'Password reset', email: f.user.email, loginId: f.user.idNumber, password: tempPassword });
  };
  const remove = async (f: Faculty) => {
    if (!confirm(`Permanently remove ${f.user.fullName}? This deletes their account.`)) return;
    await deleteFaculty(f.id);
    refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="font-display text-display-sm text-navy">Faculty</h1>
          <p className="text-text-secondary text-sm">Add, manage and remove faculty accounts.</p>
        </div>
        <div className="flex gap-2">
          <RefreshButton onClick={refresh} />
          <Button variant="gold" size="md" onClick={() => setShowAdd(true)}>
            <Icon name="UserIcon" className="w-5 h-5" /> Add Faculty
          </Button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}

      <div className="bg-white border border-border rounded-2xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-text-secondary">Loading faculty…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-text-secondary">
            No faculty yet. Click <span className="text-navy font-medium">Add Faculty</span> to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-text-secondary">
                <tr>
                  <Th>Name</Th>
                  <Th>Faculty ID</Th>
                  <Th>Email</Th>
                  <Th>Subjects</Th>
                  <Th>Status</Th>
                  <Th right>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((f) => (
                  <tr key={f.id} className="hover:bg-surface/60">
                    <Td className="text-navy font-medium">{f.user.fullName}</Td>
                    <Td className="font-mono text-xs text-text-secondary">{f.user.idNumber}</Td>
                    <Td className="text-text-secondary">{f.user.email}</Td>
                    <Td className="text-text-secondary">{f.subjects.length ? f.subjects.join(', ') : '—'}</Td>
                    <Td><StatusBadge active={f.user.isActive} /></Td>
                    <Td right>
                      <div className="flex items-center justify-end gap-1">
                        <ActionBtn label="Edit" icon="PencilSquareIcon" onClick={() => setEditing(f)} />
                        <ActionBtn label="Reset password" icon="LockClosedIcon" onClick={() => reset(f)} />
                        <ActionBtn
                          label={f.user.isActive ? 'Deactivate' : 'Activate'}
                          icon={f.user.isActive ? 'XCircleIcon' : 'CheckCircleIcon'}
                          onClick={() => toggleActive(f)}
                        />
                        <ActionBtn label="Delete" icon="ExclamationTriangleIcon" danger onClick={() => remove(f)} />
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && (
        <AddFacultyModal
          onClose={() => setShowAdd(false)}
          onCreated={(c) => {
            setShowAdd(false);
            setCred(c);
            refresh();
          }}
        />
      )}
      {editing && (
        <EditFacultyModal
          faculty={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); refresh(); }}
        />
      )}
      {cred && <CredentialModal {...cred} onClose={() => setCred(null)} />}
    </div>
  );
}

function EditFacultyModal({ faculty, onClose, onSaved }: { faculty: Faculty; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    fullName: faculty.user.fullName,
    phone: faculty.user.phone || '',
    employeeId: faculty.employeeId || '',
    subjects: faculty.subjects.join(', '),
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateFaculty(faculty.id, {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        employeeId: form.employeeId.trim(),
        subjects: form.subjects ? form.subjects.split(',').map((s) => s.trim()).filter(Boolean) : [],
      });
      onSaved();
    } catch (e: any) {
      setError(e.message || 'Could not save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} title={`Edit · ${faculty.user.idNumber || faculty.user.fullName}`}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name *" value={form.fullName} onChange={(v) => set('fullName', v)} />
        <Field label="Phone" value={form.phone} onChange={(v) => set('phone', v)} placeholder="Optional" />
        <Field label="Employee ID" value={form.employeeId} onChange={(v) => set('employeeId', v)} placeholder="Optional" />
        <Field label="Subjects" value={form.subjects} onChange={(v) => set('subjects', v)} placeholder="Comma separated" />
        <p className="text-xs text-text-faint">Email / login ID cannot be changed. Use Reset password for credentials.</p>
        {error && <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary hover:text-navy" data-cursor="hover">Cancel</button>
          <Button type="submit" variant="gold" size="md" disabled={saving || !form.fullName}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function AddFacultyModal({ onClose, onCreated }: { onClose: () => void; onCreated: (c: Cred) => void }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', employeeId: '', subjects: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { faculty, tempPassword, loginId } = await createFaculty({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        employeeId: form.employeeId.trim() || undefined,
        subjects: form.subjects ? form.subjects.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      });
      onCreated({ title: 'Faculty created', email: faculty.user.email, loginId, password: tempPassword });
    } catch (e: any) {
      setError(e.message || 'Could not create faculty');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Add Faculty">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name *" value={form.fullName} onChange={(v) => set('fullName', v)} placeholder="Jane Doe" />
        <Field label="Email *" value={form.email} onChange={(v) => set('email', v)} placeholder="jane@vertex" />
        <Field label="Phone" value={form.phone} onChange={(v) => set('phone', v)} placeholder="Optional" />
        <Field label="Employee ID" value={form.employeeId} onChange={(v) => set('employeeId', v)} placeholder="Optional" />
        <Field label="Subjects" value={form.subjects} onChange={(v) => set('subjects', v)} placeholder="Comma separated, e.g. Maths, Physics" />
        {error && <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary hover:text-navy" data-cursor="hover">Cancel</button>
          <Button type="submit" variant="gold" size="md" disabled={saving || !form.fullName || !form.email}>
            {saving ? 'Creating…' : 'Create faculty'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th className={`font-medium px-4 py-3 ${right ? 'text-right' : 'text-left'}`}>{children}</th>;
}
function Td({ children, right, className = '' }: { children: React.ReactNode; right?: boolean; className?: string }) {
  return <td className={`px-4 py-3 ${right ? 'text-right' : ''} ${className}`}>{children}</td>;
}

export default function AdminFacultyPage() {
  return (
    <PortalShell requiredRole="ADMIN" brand="Vertex Admin" navItems={ADMIN_NAV} accent="primary">
      <FacultyManager />
    </PortalShell>
  );
}
