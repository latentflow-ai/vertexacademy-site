import { apiFetch, API_BASE } from './api';

export interface PortalUser {
  id: string;
  email: string;
  idNumber: string | null;
  fullName: string;
  phone: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
}

export type Board = 'CBSE' | 'SAMACHEER' | 'ICSE' | 'JEE';
export type Stream = 'SCIENCE' | 'COMMERCE';
export const BOARDS: Board[] = ['CBSE', 'SAMACHEER', 'ICSE', 'JEE'];
export const STREAMS: Stream[] = ['SCIENCE', 'COMMERCE'];

// ---- Faculty ----------------------------------------------------------------

export interface Faculty {
  id: string;
  employeeId: string | null;
  subjects: string[];
  joinedAt: string;
  user: PortalUser;
  _count?: { assignments: number };
}

export interface CreateFacultyInput {
  fullName: string;
  email: string;
  phone?: string;
  employeeId?: string;
  subjects?: string[];
}

export async function listFaculty(): Promise<Faculty[]> {
  return (await apiFetch<{ faculty: Faculty[] }>('/faculty')).faculty;
}
export async function createFaculty(input: CreateFacultyInput): Promise<{ faculty: Faculty; tempPassword: string; loginId: string | null }> {
  return apiFetch('/faculty', { method: 'POST', body: JSON.stringify(input) });
}
export async function updateFaculty(id: string, input: Partial<CreateFacultyInput> & { isActive?: boolean }): Promise<{ faculty: Faculty }> {
  return apiFetch(`/faculty/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}
export async function resetFacultyPassword(id: string): Promise<{ tempPassword: string }> {
  return apiFetch(`/faculty/${id}/reset-password`, { method: 'POST' });
}
export async function deleteFaculty(id: string): Promise<void> {
  await apiFetch(`/faculty/${id}`, { method: 'DELETE' });
}

// ---- Classes ----------------------------------------------------------------

export interface ClassSubject {
  id: string;
  name: string;
  assignments: { faculty: { id: string; user: { fullName: string } } }[];
}
export interface ClassRec {
  id: string;
  name: string;
  board: Board;
  stream: Stream | null;
  academicYear: string;
  classTeacher: { id: string; user: { fullName: string } } | null;
  subjects: ClassSubject[];
  _count?: { students: number };
}

export interface CreateClassInput {
  name: string;
  board: Board;
  stream?: Stream | null;
  academicYear: string;
  classTeacherFacultyId?: string | null;
  subjects: { name: string; facultyId: string }[];
}

export async function listClasses(): Promise<ClassRec[]> {
  return (await apiFetch<{ classes: ClassRec[] }>('/classes')).classes;
}
export async function createClass(input: CreateClassInput): Promise<{ class: ClassRec }> {
  return apiFetch('/classes', { method: 'POST', body: JSON.stringify(input) });
}
export async function updateClass(
  id: string,
  input: Partial<Omit<CreateClassInput, 'subjects'>> & {
    addSubjects?: { name: string; facultyId: string }[];
    updateSubjects?: { subjectId: string; name?: string; facultyId?: string }[];
    removeSubjectIds?: string[];
  }
): Promise<{ class: ClassRec }> {
  return apiFetch(`/classes/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}
export async function deleteClass(id: string): Promise<void> {
  await apiFetch(`/classes/${id}`, { method: 'DELETE' });
}

// ---- Students ---------------------------------------------------------------

export interface Student {
  id: string;
  parentPhone: string;
  dob: string | null;
  admissionDate: string;
  user: PortalUser;
  class: { id: string; name: string; board: Board; stream: Stream | null; academicYear: string } | null;
  subjects: { id: string; name: string }[];
}

export interface CreateStudentInput {
  fullName: string;
  classId: string;
  parentPhone: string;
  subjectIds: string[];
  email?: string;
  dob?: string;
}

export async function listStudents(classId?: string): Promise<Student[]> {
  const qs = classId ? `?classId=${encodeURIComponent(classId)}` : '';
  return (await apiFetch<{ students: Student[] }>(`/students${qs}`)).students;
}
export async function createStudent(input: CreateStudentInput): Promise<{ student: Student; tempPassword: string; loginId: string | null }> {
  return apiFetch('/students', { method: 'POST', body: JSON.stringify(input) });
}
export async function updateStudent(id: string, input: Partial<CreateStudentInput> & { phone?: string; isActive?: boolean }): Promise<{ student: Student }> {
  return apiFetch(`/students/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}
export async function resetStudentPassword(id: string): Promise<{ tempPassword: string }> {
  return apiFetch(`/students/${id}/reset-password`, { method: 'POST' });
}
export async function deleteStudent(id: string): Promise<void> {
  await apiFetch(`/students/${id}`, { method: 'DELETE' });
}

// Bulk import via spreadsheet (FormData — not JSON).
export interface BulkResult {
  createdCount: number;
  created: { fullName: string; idNumber: string; tempPassword: string }[];
  errors: { row: number; reason: string }[];
}
export async function bulkImportStudents(classId: string, file: File): Promise<BulkResult> {
  const fd = new FormData();
  fd.append('classId', classId);
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/students/bulk`, { method: 'POST', credentials: 'include', body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || data?.error || 'Bulk import failed');
  return data;
}
// Download URLs (GET with the auth cookie — same-site, so the browser sends it).
export const studentTemplateUrl = () => `${API_BASE}/students/template`;
export const studentExportUrl = (classId?: string) =>
  `${API_BASE}/students/export${classId ? `?classId=${encodeURIComponent(classId)}` : ''}`;

// ---- Timetable (admin) ------------------------------------------------------

export interface TimetableSlot {
  id: string;
  classId: string;
  dayOfWeek: number;
  period: number;
  startTime: string;
  endTime: string;
  subjectId: string | null;
  facultyId: string | null;
  subject?: { name: string } | null;
  faculty?: { user: { fullName: string } } | null;
}
export async function listTimetable(classId: string): Promise<TimetableSlot[]> {
  return (await apiFetch<{ slots: TimetableSlot[] }>(`/timetable?classId=${encodeURIComponent(classId)}`)).slots;
}
export async function saveSlot(input: {
  classId: string;
  dayOfWeek: number;
  period: number;
  startTime: string;
  endTime: string;
  subjectId?: string | null;
  facultyId?: string | null;
}): Promise<void> {
  await apiFetch('/timetable', { method: 'POST', body: JSON.stringify(input) });
}
export async function deleteSlot(id: string): Promise<void> {
  await apiFetch(`/timetable/${id}`, { method: 'DELETE' });
}

// ---- Audit log --------------------------------------------------------------

export interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  ip: string | null;
  createdAt: string;
  user: { fullName: string; email: string; role: string } | null;
}
export async function listAudit(limit = 150): Promise<AuditEntry[]> {
  return (await apiFetch<{ logs: AuditEntry[] }>(`/audit?limit=${limit}`)).logs;
}

// Label helper for class display.
export function classLabel(c: { name: string; board: Board | string; stream?: Stream | string | null; academicYear: string }): string {
  return `${c.name} · ${c.board}${c.stream ? ` · ${c.stream}` : ''} (${c.academicYear})`;
}
