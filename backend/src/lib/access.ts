import prisma from './prisma';

// Resolve the Faculty row id for a logged-in faculty user (or null).
export async function facultyIdForUser(userId: string): Promise<string | null> {
  const f = await prisma.faculty.findUnique({ where: { userId }, select: { id: true } });
  return f?.id ?? null;
}

// Is this faculty assigned to teach the given subject in the given class?
export async function facultyAssignedTo(facultyId: string, classId: string, subjectId: string): Promise<boolean> {
  const a = await prisma.facultyAssignment.findFirst({ where: { facultyId, classId, subjectId } });
  return !!a;
}

// Does this faculty teach anything in the class (any subject) or is class teacher?
export async function facultyTeachesClass(facultyId: string, classId: string): Promise<boolean> {
  const a = await prisma.facultyAssignment.findFirst({ where: { facultyId, classId } });
  if (a) return true;
  const ct = await prisma.class.findFirst({ where: { id: classId, classTeacherId: facultyId } });
  return !!ct;
}

// A parent may view a student iff the student's parentPhone matches the
// parent's verified phone number.
export async function parentCanView(parentUserId: string, studentId: string): Promise<boolean> {
  const parent = await prisma.user.findUnique({ where: { id: parentUserId }, select: { phone: true } });
  if (!parent?.phone) return false;
  const student = await prisma.student.findUnique({ where: { id: studentId }, select: { parentPhone: true } });
  return !!student && student.parentPhone === parent.phone;
}

// Resolve the Student row id for a logged-in student user (or null).
export async function studentIdForUser(userId: string): Promise<string | null> {
  const s = await prisma.student.findUnique({ where: { userId }, select: { id: true } });
  return s?.id ?? null;
}

// Can the given user read this student's academic data?
// ADMIN: always. STUDENT: only self. PARENT: only phone-matched wards.
// FACULTY: only if they teach the student's class.
export async function canViewStudent(
  user: { sub: string; role: string },
  studentId: string
): Promise<boolean> {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'STUDENT') return (await studentIdForUser(user.sub)) === studentId;
  if (user.role === 'PARENT') return parentCanView(user.sub, studentId);
  if (user.role === 'FACULTY') {
    const fid = await facultyIdForUser(user.sub);
    if (!fid) return false;
    const s = await prisma.student.findUnique({ where: { id: studentId }, select: { classId: true } });
    return !!s?.classId && facultyTeachesClass(fid, s.classId);
  }
  return false;
}
