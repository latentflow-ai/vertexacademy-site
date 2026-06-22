'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import PortalShell from '@/components/portal/PortalShell';
import { FACULTY_NAV } from '@/components/portal/facultyNav';
import { fieldCls } from '@/components/portal/adminUI';
import { RosterRow, enterMarks, getMarksRoster } from '@/lib/portal';

function MarksInner() {
  const sp = useSearchParams();
  const classId = sp.get('classId') || '';
  const subjectId = sp.get('subjectId') || '';
  const cn = sp.get('cn') || 'Class';
  const sn = sp.get('sn') || 'Subject';

  const [assessment, setAssessment] = useState('');
  const [maxScore, setMaxScore] = useState('100');
  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    if (!assessment.trim()) { setMsg('Enter an assessment name (e.g. Unit Test 1)'); return; }
    setMsg('');
    try {
      const r = await getMarksRoster(classId, subjectId, assessment.trim());
      setRoster(r);
      const s: Record<string, string> = {};
      r.forEach((row) => { s[row.studentId] = row.score != null ? String(row.score) : ''; });
      setScores(s);
      setLoaded(true);
    } catch (e: any) {
      setMsg(e.message || 'Failed to load');
    }
  };

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const max = Number(maxScore);
      const entries = roster
        .filter((r) => scores[r.studentId] !== '' && scores[r.studentId] != null)
        .map((r) => ({ studentId: r.studentId, score: Number(scores[r.studentId]) }));
      if (entries.length === 0) { setMsg('Enter at least one score'); setSaving(false); return; }
      if (entries.some((e) => e.score > max)) { setMsg('A score exceeds the maximum'); setSaving(false); return; }
      await enterMarks({ classId, subjectId, assessment: assessment.trim(), maxScore: max, entries });
      setMsg('Marks saved ✓');
    } catch (e: any) {
      setMsg(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link href="/faculty/dashboard" className="text-sm text-text-secondary hover:text-navy" data-cursor="hover">← My Classes</Link>
      <div className="mt-2 mb-6">
        <p className="eyebrow mb-1">Marks</p>
        <h1 className="font-display text-display-sm text-navy">{sn}</h1>
        <p className="text-text-secondary text-sm">{cn}</p>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-soft p-5 mb-5 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[12rem]">
          <label className="block text-xs font-medium text-navy mb-1">Assessment</label>
          <input className={fieldCls} value={assessment} onChange={(e) => { setAssessment(e.target.value); setLoaded(false); }} placeholder="e.g. Unit Test 1" />
        </div>
        <div className="w-28">
          <label className="block text-xs font-medium text-navy mb-1">Max score</label>
          <input className={fieldCls} type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} />
        </div>
        <Button variant="primary" size="md" onClick={load}>Load roster</Button>
      </div>

      {msg && <div className="mb-4 p-3 rounded-xl bg-surface border border-border text-navy text-sm">{msg}</div>}

      {loaded && (
        <>
          <div className="bg-white border border-border rounded-2xl shadow-soft overflow-hidden">
            {roster.length === 0 ? (
              <div className="p-10 text-center text-text-secondary">No students in this class.</div>
            ) : (
              <div className="divide-y divide-border">
                {roster.map((r) => (
                  <div key={r.studentId} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div>
                      <p className="text-navy font-medium">{r.name}</p>
                      <p className="text-xs text-text-faint">{r.idNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-24 px-3 py-2 bg-surface border border-input rounded-xl text-navy text-right focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                        value={scores[r.studentId] ?? ''}
                        onChange={(e) => setScores((s) => ({ ...s, [r.studentId]: e.target.value }))}
                        placeholder="—"
                      />
                      <span className="text-text-faint text-sm">/ {maxScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {roster.length > 0 && (
            <div className="mt-5 flex justify-end">
              <Button variant="primary" size="lg" onClick={save} disabled={saving}>
                <Icon name="CheckCircleIcon" className="w-5 h-5" /> {saving ? 'Saving…' : 'Save marks'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function FacultyMarksPage() {
  return (
    <PortalShell requiredRole="FACULTY" brand="Vertex Faculty" navItems={FACULTY_NAV} accent="gold">
      <Suspense fallback={<div className="text-text-secondary">Loading…</div>}>
        <MarksInner />
      </Suspense>
    </PortalShell>
  );
}
