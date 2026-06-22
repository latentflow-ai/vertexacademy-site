import { apiFetch, API_BASE } from './api';
import type { Board, Stream } from './admin';

// ---- self-data --------------------------------------------------------------

export interface FacultyClass {
  classId: string;
  name: string;
  board: Board;
  stream: Stream | null;
  academicYear: string;
  isClassTeacher: boolean;
  subjects: { subjectId: string; name: string }[];
}
export async function getFacultyClasses(): Promise<FacultyClass[]> {
  return (await apiFetch<{ classes: FacultyClass[] }>('/me/faculty/classes')).classes;
}

export interface StudentSummary {
  id: string;
  user: { fullName: string; idNumber: string | null };
  class: {
    id: string;
    name: string;
    board: Board;
    stream: Stream | null;
    academicYear: string;
    subjects: { id: string; name: string }[];
  } | null;
}
export async function getStudentSummary(): Promise<StudentSummary> {
  return (await apiFetch<{ student: StudentSummary }>('/me/student/summary')).student;
}

export interface Ward {
  id: string;
  user: { fullName: string; idNumber: string | null };
  class: { id: string; name: string; board: Board; stream: Stream | null; academicYear: string } | null;
}
export async function getParentWards(): Promise<Ward[]> {
  return (await apiFetch<{ wards: Ward[] }>('/me/parent/wards')).wards;
}

// ---- attendance -------------------------------------------------------------

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export interface RosterRow {
  studentId: string;
  name: string;
  idNumber: string | null;
  status?: AttendanceStatus | null;
  score?: number | null;
  maxScore?: number | null;
}
export async function getAttendanceRoster(classId: string, subjectId: string, date: string): Promise<RosterRow[]> {
  return (await apiFetch<{ roster: RosterRow[] }>(`/attendance?classId=${classId}&subjectId=${subjectId}&date=${date}`)).roster;
}
export async function markAttendance(input: {
  classId: string;
  subjectId: string;
  date: string;
  entries: { studentId: string; status: AttendanceStatus }[];
}): Promise<void> {
  await apiFetch('/attendance', { method: 'POST', body: JSON.stringify(input) });
}
export interface AttendanceSummary {
  subjects: { subject: string; total: number; present: number; percentage: number }[];
  overall: number;
}
export async function getAttendanceSummary(studentId: string): Promise<AttendanceSummary> {
  return apiFetch(`/attendance/summary/${studentId}`);
}

// ---- marks ------------------------------------------------------------------

export async function getMarksRoster(classId: string, subjectId: string, assessment: string): Promise<RosterRow[]> {
  return (await apiFetch<{ roster: RosterRow[] }>(`/marks?classId=${classId}&subjectId=${subjectId}&assessment=${encodeURIComponent(assessment)}`)).roster;
}
export async function enterMarks(input: {
  classId: string;
  subjectId: string;
  assessment: string;
  maxScore: number;
  entries: { studentId: string; score: number }[];
}): Promise<void> {
  await apiFetch('/marks', { method: 'POST', body: JSON.stringify(input) });
}
export interface ReportCard {
  subjects: { subject: string; items: { assessment: string; score: number; maxScore: number }[]; total: number; max: number; percentage: number }[];
  overall: number;
}
export async function getReportCard(studentId: string): Promise<ReportCard> {
  return apiFetch(`/marks/report/${studentId}`);
}

// ---- timetable --------------------------------------------------------------

export interface Slot {
  id: string;
  dayOfWeek: number;
  period: number;
  startTime: string;
  endTime: string;
  subject?: { name: string } | null;
  faculty?: { user: { fullName: string } } | null;
}
export async function getTimetable(classId: string): Promise<Slot[]> {
  return (await apiFetch<{ slots: Slot[] }>(`/timetable?classId=${classId}`)).slots;
}

// ---- notes ------------------------------------------------------------------

export interface NoteItem {
  id: string;
  title: string;
  description: string | null;
  fileName: string | null;
  createdAt: string;
  subject?: { name: string } | null;
  uploadedBy?: { user: { fullName: string } } | null;
}
export async function listNotes(classId: string, subjectId?: string): Promise<NoteItem[]> {
  const qs = `?classId=${classId}${subjectId ? `&subjectId=${subjectId}` : ''}`;
  return (await apiFetch<{ notes: NoteItem[] }>(`/notes${qs}`)).notes;
}
export async function uploadNote(input: {
  classId: string;
  subjectId?: string;
  title: string;
  description?: string;
  file: File;
}): Promise<void> {
  const fd = new FormData();
  fd.append('classId', input.classId);
  if (input.subjectId) fd.append('subjectId', input.subjectId);
  fd.append('title', input.title);
  if (input.description) fd.append('description', input.description);
  fd.append('file', input.file);
  const res = await fetch(`${API_BASE}/notes`, { method: 'POST', credentials: 'include', body: fd });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d?.message || 'Upload failed');
  }
}
export const noteDownloadUrl = (id: string) => `${API_BASE}/notes/${id}/download`;
export async function deleteNote(id: string): Promise<void> {
  await apiFetch(`/notes/${id}`, { method: 'DELETE' });
}

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
