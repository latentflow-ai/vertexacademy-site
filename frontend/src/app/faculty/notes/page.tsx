'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import PortalShell from '@/components/portal/PortalShell';
import { FACULTY_NAV } from '@/components/portal/facultyNav';
import { fieldCls } from '@/components/portal/adminUI';
import { NoteItem, deleteNote, listNotes, noteDownloadUrl, uploadNote } from '@/lib/portal';

function NotesInner() {
  const sp = useSearchParams();
  const classId = sp.get('classId') || '';
  const subjectId = sp.get('subjectId') || undefined;
  const cn = sp.get('cn') || 'Class';
  const sn = sp.get('sn') || '';

  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try { setNotes(await listNotes(classId, subjectId)); } catch (e: any) { setMsg(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { if (classId) load(); }, []); // eslint-disable-line

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!file || !title.trim()) { setMsg('Title and file are required'); return; }
    setBusy(true);
    try {
      await uploadNote({ classId, subjectId, title: title.trim(), description: description.trim() || undefined, file });
      setTitle(''); setDescription(''); setFile(null);
      (document.getElementById('note-file') as HTMLInputElement | null)?.value && ((document.getElementById('note-file') as HTMLInputElement).value = '');
      await load();
      setMsg('Note uploaded ✓');
    } catch (e: any) {
      setMsg(e.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    await deleteNote(id);
    load();
  };

  return (
    <div>
      <Link href="/faculty/dashboard" className="text-sm text-text-secondary hover:text-navy" data-cursor="hover">← My Classes</Link>
      <div className="mt-2 mb-6">
        <p className="eyebrow mb-1">Notes</p>
        <h1 className="font-display text-display-sm text-navy">{sn || 'Class notes'}</h1>
        <p className="text-text-secondary text-sm">{cn}</p>
      </div>

      <form onSubmit={submit} className="bg-white border border-border rounded-2xl shadow-soft p-5 mb-6 space-y-3">
        <input className={fieldCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. Chapter 3 — Notes)" />
        <input className={fieldCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" />
        <input id="note-file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-text-secondary file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green file:text-white file:font-semibold" />
        <p className="text-xs text-text-faint">PDF, Office docs, images or zip · up to 25 MB.</p>
        <div className="flex justify-end">
          <Button type="submit" variant="green" size="md" disabled={busy}>{busy ? 'Uploading…' : 'Upload note'}</Button>
        </div>
      </form>

      {msg && <div className="mb-4 p-3 rounded-xl bg-surface border border-border text-navy text-sm">{msg}</div>}

      <div className="bg-white border border-border rounded-2xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-text-secondary">Loading…</div>
        ) : notes.length === 0 ? (
          <div className="p-10 text-center text-text-secondary">No notes shared yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {notes.map((n) => (
              <div key={n.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Icon name="DocumentTextIcon" className="w-6 h-6 text-green" />
                  <div>
                    <p className="text-navy font-medium">{n.title}</p>
                    <p className="text-xs text-text-faint">{n.subject?.name ? `${n.subject.name} · ` : ''}{n.fileName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={noteDownloadUrl(n.id)} className="px-3 py-1.5 rounded-full text-sm font-medium border border-border text-navy hover:bg-surface" data-cursor="hover">Download</a>
                  <button onClick={() => remove(n.id)} className="text-text-faint hover:text-error" data-cursor="hover"><Icon name="ExclamationTriangleIcon" className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FacultyNotesPage() {
  return (
    <PortalShell requiredRole="FACULTY" brand="Vertex Faculty" navItems={FACULTY_NAV} accent="gold">
      <Suspense fallback={<div className="text-text-secondary">Loading…</div>}>
        <NotesInner />
      </Suspense>
    </PortalShell>
  );
}
