import { Router, Response } from 'express';
import multer from 'multer';
import ExcelJS from 'exceljs';
import { z } from 'zod';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { generateTempPassword, hashPassword } from '../lib/auth';
import { nextStudentId, withIdRetry } from '../lib/ids';
import { normalizePhone, isValidPhone } from '../lib/phone';
import { logAudit } from '../lib/audit';
import { AuthedRequest, requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();
router.use(requireAuth, requireRole(Role.ADMIN));

// In-memory upload for the bulk-import spreadsheet (parsed, never stored).
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const studentInclude = {
  user: {
    select: { id: true, email: true, idNumber: true, fullName: true, phone: true, isActive: true, lastLoginAt: true },
  },
  class: { select: { id: true, name: true, board: true, stream: true, academicYear: true } },
  subjects: { select: { id: true, name: true }, orderBy: { name: 'asc' as const } },
} as const;

// Validate that the given subject ids all belong to the class.
async function validateSubjects(classId: string, subjectIds: string[]): Promise<boolean> {
  if (subjectIds.length === 0) return false;
  const found = await prisma.subject.findMany({ where: { id: { in: subjectIds }, classId }, select: { id: true } });
  return found.length === subjectIds.length;
}

const BULK_HEADERS = ['Full Name', 'Parent Phone', 'Email (optional)', 'Date of Birth (YYYY-MM-DD)'];

// GET /api/students — list students (optionally filter by class)
router.get('/', async (req: AuthedRequest, res: Response) => {
  const classId = typeof req.query.classId === 'string' ? req.query.classId : undefined;
  const students = await prisma.student.findMany({
    where: classId ? { classId } : undefined,
    orderBy: { admissionDate: 'desc' },
    include: studentInclude,
  });
  res.json({ students });
});

const createSchema = z.object({
  fullName: z.string().min(2),
  classId: z.string().min(1),
  parentPhone: z.string().min(1),
  subjectIds: z.array(z.string()).min(1, 'Select at least one subject'),
  email: z.string().email().optional(),
  dob: z.string().optional(), // ISO date
  admissionDate: z.string().optional(), // ISO date; defaults to now
});

// POST /api/students — create a student record + login; returns one-time creds.
// Identifier is the auto-generated Student ID (VA-YY-####); no roll number.
router.post('/', async (req: AuthedRequest, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request', message: parsed.error.issues[0]?.message || 'Invalid input' });
  }
  const d = parsed.data;
  if (!isValidPhone(d.parentPhone)) {
    return res.status(400).json({ error: 'Invalid request', message: 'Enter a valid 10-digit parent phone' });
  }
  const parentPhone = normalizePhone(d.parentPhone);

  const cls = await prisma.class.findUnique({ where: { id: d.classId } });
  if (!cls) return res.status(400).json({ error: 'Invalid request', message: 'Selected class does not exist' });

  if (!(await validateSubjects(d.classId, d.subjectIds))) {
    return res.status(400).json({ error: 'Invalid request', message: 'Some selected subjects do not belong to this class' });
  }

  if (d.email) {
    const dupEmail = await prisma.user.findUnique({ where: { email: d.email.toLowerCase() } });
    if (dupEmail) return res.status(409).json({ error: 'Conflict', message: 'An account with this email already exists' });
  }

  const admissionDate = d.admissionDate ? new Date(d.admissionDate) : new Date();
  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  const student = await withIdRetry(() => prisma.$transaction(async (tx) => {
    const idNumber = await nextStudentId(tx, admissionDate.getFullYear());
    const email = d.email?.trim().toLowerCase() || `${idNumber.toLowerCase()}@students.vertex.local`;
    return tx.student.create({
      data: {
        class: { connect: { id: d.classId } },
        parentPhone,
        dob: d.dob ? new Date(d.dob) : undefined,
        admissionDate,
        subjects: { connect: d.subjectIds.map((id) => ({ id })) },
        user: {
          create: { email, idNumber, fullName: d.fullName, passwordHash, role: Role.STUDENT, mustChangePassword: true },
        },
      },
      include: studentInclude,
    });
  }));

  await logAudit({ userId: req.user!.sub, action: 'STUDENT_CREATED', entity: 'Student', entityId: student.id, req });
  res.status(201).json({ student, tempPassword, loginId: student.user.idNumber });
});

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  classId: z.string().optional(),
  parentPhone: z.string().optional(),
  subjectIds: z.array(z.string()).optional(),
  phone: z.string().optional(),
  dob: z.string().optional(),
  isActive: z.boolean().optional(),
});

// PATCH /api/students/:id — edit details, move class, set subjects, activate/deactivate
router.patch('/:id', async (req: AuthedRequest, res: Response) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request', message: 'Invalid input' });
  const d = parsed.data;
  if (d.parentPhone !== undefined && !isValidPhone(d.parentPhone)) {
    return res.status(400).json({ error: 'Invalid request', message: 'Enter a valid 10-digit parent phone' });
  }

  const student = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!student) return res.status(404).json({ error: 'Not found' });

  if (d.subjectIds) {
    const effectiveClassId = d.classId || student.classId;
    if (!effectiveClassId || !(await validateSubjects(effectiveClassId, d.subjectIds))) {
      return res.status(400).json({ error: 'Invalid request', message: 'Some selected subjects do not belong to this class' });
    }
  }

  const updated = await prisma.student.update({
    where: { id: student.id },
    data: {
      ...(d.classId ? { class: { connect: { id: d.classId } } } : {}),
      ...(d.subjectIds ? { subjects: { set: d.subjectIds.map((id) => ({ id })) } } : {}),
      ...(d.parentPhone !== undefined ? { parentPhone: normalizePhone(d.parentPhone) } : {}),
      ...(d.dob !== undefined ? { dob: d.dob ? new Date(d.dob) : null } : {}),
      user: {
        update: {
          ...(d.fullName !== undefined ? { fullName: d.fullName } : {}),
          ...(d.phone !== undefined ? { phone: d.phone } : {}),
          ...(d.isActive !== undefined ? { isActive: d.isActive } : {}),
        },
      },
    },
    include: studentInclude,
  });

  await logAudit({ userId: req.user!.sub, action: 'STUDENT_UPDATED', entity: 'Student', entityId: student.id, req });
  res.json({ student: updated });
});

// POST /api/students/:id/reset-password — issue a new one-time temp password
router.post('/:id/reset-password', async (req: AuthedRequest, res: Response) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!student) return res.status(404).json({ error: 'Not found' });

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);
  await prisma.user.update({ where: { id: student.userId }, data: { passwordHash, mustChangePassword: true } });

  await logAudit({ userId: req.user!.sub, action: 'STUDENT_PASSWORD_RESET', entity: 'Student', entityId: student.id, req });
  res.json({ tempPassword });
});

// DELETE /api/students/:id — permanently remove the student and account
router.delete('/:id', async (req: AuthedRequest, res: Response) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!student) return res.status(404).json({ error: 'Not found' });
  await prisma.user.delete({ where: { id: student.userId } });
  await logAudit({ userId: req.user!.sub, action: 'STUDENT_DELETED', entity: 'Student', entityId: student.id, req });
  res.json({ success: true });
});

// GET /api/students/template — downloadable .xlsx with headers + example row
router.get('/template', async (_req: AuthedRequest, res: Response) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Students');
  ws.addRow(BULK_HEADERS);
  ws.getRow(1).font = { bold: true };
  ws.addRow(['Ravi Kumar', '9876543210', 'ravi@example.com', '2010-05-14']);
  ws.columns.forEach((c) => (c.width = 26));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="student-import-template.xlsx"');
  await wb.xlsx.write(res);
  res.end();
});

// POST /api/students/bulk — create many students from an uploaded spreadsheet
router.post('/bulk', upload.single('file'), async (req: AuthedRequest, res: Response) => {
  const classId = req.body.classId as string;
  if (!classId) return res.status(400).json({ error: 'Invalid request', message: 'classId is required' });
  if (!req.file) return res.status(400).json({ error: 'Invalid request', message: 'No file uploaded' });

  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls) return res.status(400).json({ error: 'Invalid request', message: 'Selected class does not exist' });

  // Bulk-imported students are enrolled in all subjects of the class.
  const classSubjectIds = (await prisma.subject.findMany({ where: { classId }, select: { id: true } })).map((s) => s.id);

  const wb = new ExcelJS.Workbook();
  try {
    await wb.xlsx.load(req.file.buffer as any);
  } catch {
    return res.status(400).json({ error: 'Invalid file', message: 'Could not read the spreadsheet' });
  }
  const ws = wb.worksheets[0];
  if (!ws) return res.status(400).json({ error: 'Invalid file', message: 'The spreadsheet has no sheets' });

  const cell = (row: ExcelJS.Row, i: number) => {
    const v = row.getCell(i).value as any;
    if (v == null) return '';
    if (typeof v === 'object' && 'text' in v) return String(v.text).trim();
    return String(v).trim();
  };

  type Parsed = { row: number; fullName: string; parentPhone: string; email?: string; dob?: string };
  const rows: Parsed[] = [];
  const errors: { row: number; reason: string }[] = [];

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // header
    const fullName = cell(row, 1);
    const parentPhoneRaw = cell(row, 2);
    if (!fullName && !parentPhoneRaw) return; // blank line
    if (!fullName || !parentPhoneRaw) {
      errors.push({ row: rowNumber, reason: 'Full Name and Parent Phone are required' });
      return;
    }
    if (!isValidPhone(parentPhoneRaw)) {
      errors.push({ row: rowNumber, reason: `Invalid parent phone "${parentPhoneRaw}"` });
      return;
    }
    rows.push({
      row: rowNumber,
      fullName,
      parentPhone: normalizePhone(parentPhoneRaw),
      email: cell(row, 3) || undefined,
      dob: cell(row, 4) || undefined,
    });
  });

  const created: { fullName: string; idNumber: string | null; tempPassword: string }[] = [];

  await prisma.$transaction(async (tx) => {
    for (const r of rows) {
      try {
        if (r.email) {
          const dupEmail = await tx.user.findUnique({ where: { email: r.email.toLowerCase() } });
          if (dupEmail) {
            errors.push({ row: r.row, reason: `Email ${r.email} already in use` });
            continue;
          }
        }
        const tempPassword = generateTempPassword();
        const passwordHash = await hashPassword(tempPassword);
        const idNumber = await nextStudentId(tx, new Date().getFullYear());
        const email = r.email?.toLowerCase() || `${idNumber.toLowerCase()}@students.vertex.local`;
        await tx.student.create({
          data: {
            class: { connect: { id: classId } },
            parentPhone: r.parentPhone,
            dob: r.dob ? new Date(r.dob) : undefined,
            subjects: { connect: classSubjectIds.map((id) => ({ id })) },
            user: { create: { email, idNumber, fullName: r.fullName, passwordHash, role: Role.STUDENT, mustChangePassword: true } },
          },
        });
        created.push({ fullName: r.fullName, idNumber, tempPassword });
      } catch {
        errors.push({ row: r.row, reason: 'Could not create (unexpected error)' });
      }
    }
  });

  await logAudit({ userId: req.user!.sub, action: 'STUDENTS_BULK_IMPORTED', entity: 'Class', entityId: classId, req });
  res.json({ created, createdCount: created.length, errors });
});

// GET /api/students/export?classId= — export to .xlsx (class-wise or all)
router.get('/export', async (req: AuthedRequest, res: Response) => {
  const classId = typeof req.query.classId === 'string' ? req.query.classId : undefined;
  const students = await prisma.student.findMany({
    where: classId ? { classId } : undefined,
    orderBy: [{ classId: 'asc' }, { admissionDate: 'asc' }],
    include: studentInclude,
  });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Students');
  ws.addRow(['Student ID', 'Full Name', 'Class', 'Board', 'Stream', 'Email', 'Parent Phone', 'DOB', 'Status', 'Admission Date']);
  ws.getRow(1).font = { bold: true };
  for (const s of students) {
    ws.addRow([
      s.user.idNumber || '',
      s.user.fullName,
      s.class ? s.class.name : '',
      s.class ? s.class.board : '',
      s.class?.stream || '',
      s.user.email,
      s.parentPhone,
      s.dob ? s.dob.toISOString().slice(0, 10) : '',
      s.user.isActive ? 'Active' : 'Inactive',
      s.admissionDate.toISOString().slice(0, 10),
    ]);
  }
  ws.columns.forEach((c) => (c.width = 18));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="students${classId ? '-class' : '-all'}.xlsx"`);
  await wb.xlsx.write(res);
  res.end();
});

export default router;
