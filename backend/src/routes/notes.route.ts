import { Router, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { logAudit } from '../lib/audit';
import { AuthedRequest, requireAuth, requireRole } from '../middleware/auth.middleware';
import { facultyIdForUser, facultyTeachesClass, studentIdForUser } from '../lib/access';

const router = Router();
router.use(requireAuth);

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'notes');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt', '.png', '.jpg', '.jpeg', '.zip'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ALLOWED.includes(path.extname(file.originalname).toLowerCase()));
  },
});

// POST /api/notes — faculty uploads a note file for a class (+ optional subject)
router.post('/', requireRole(Role.FACULTY), upload.single('file'), async (req: AuthedRequest, res: Response) => {
  const { classId, subjectId, title, description } = req.body as Record<string, string>;
  if (!classId || !title) {
    if (req.file) fs.unlink(path.join(UPLOAD_DIR, req.file.filename), () => {});
    return res.status(400).json({ error: 'Invalid request', message: 'classId and title are required' });
  }
  if (!req.file) return res.status(400).json({ error: 'Invalid request', message: 'A file is required' });

  const fid = await facultyIdForUser(req.user!.sub);
  if (!fid || !(await facultyTeachesClass(fid, classId))) {
    fs.unlink(path.join(UPLOAD_DIR, req.file.filename), () => {});
    return res.status(403).json({ error: 'Forbidden', message: 'You do not teach this class' });
  }

  const note = await prisma.note.create({
    data: {
      classId,
      subjectId: subjectId || null,
      title,
      description: description || null,
      fileUrl: req.file.filename,
      fileName: req.file.originalname,
      uploadedById: fid,
    },
  });
  await logAudit({ userId: req.user!.sub, action: 'NOTE_UPLOADED', entity: 'Note', entityId: note.id, req });
  res.status(201).json({ note });
});

async function canViewClass(user: { sub: string; role: string }, classId: string): Promise<boolean> {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'FACULTY') {
    const fid = await facultyIdForUser(user.sub);
    return !!fid && facultyTeachesClass(fid, classId);
  }
  if (user.role === 'STUDENT') {
    const sid = await studentIdForUser(user.sub);
    if (!sid) return false;
    const s = await prisma.student.findUnique({ where: { id: sid }, select: { classId: true } });
    return s?.classId === classId;
  }
  if (user.role === 'PARENT') {
    const parent = await prisma.user.findUnique({ where: { id: user.sub }, select: { phone: true } });
    if (!parent?.phone) return false;
    const ward = await prisma.student.findFirst({ where: { parentPhone: parent.phone, classId } });
    return !!ward;
  }
  return false;
}

// GET /api/notes?classId=&subjectId= — list notes for a class (all roles, scoped)
router.get('/', async (req: AuthedRequest, res: Response) => {
  const classId = String(req.query.classId || '');
  const subjectId = req.query.subjectId ? String(req.query.subjectId) : undefined;
  if (!classId) return res.status(400).json({ error: 'Invalid request', message: 'classId is required' });
  if (!(await canViewClass(req.user!, classId))) return res.status(403).json({ error: 'Forbidden' });

  const notes = await prisma.note.findMany({
    where: { classId, ...(subjectId ? { subjectId } : {}) },
    orderBy: { createdAt: 'desc' },
    include: {
      subject: { select: { name: true } },
      uploadedBy: { select: { user: { select: { fullName: true } } } },
    },
  });
  res.json({ notes });
});

// GET /api/notes/:id/download — stream the file (auth + scope checked)
router.get('/:id/download', async (req: AuthedRequest, res: Response) => {
  const note = await prisma.note.findUnique({ where: { id: req.params.id } });
  if (!note) return res.status(404).json({ error: 'Not found' });
  if (!(await canViewClass(req.user!, note.classId))) return res.status(403).json({ error: 'Forbidden' });

  const filePath = path.join(UPLOAD_DIR, note.fileUrl);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing' });
  res.download(filePath, note.fileName || 'note');
});

// DELETE /api/notes/:id — uploader (faculty) or admin
router.delete('/:id', async (req: AuthedRequest, res: Response) => {
  const note = await prisma.note.findUnique({ where: { id: req.params.id } });
  if (!note) return res.status(404).json({ error: 'Not found' });

  if (req.user!.role !== Role.ADMIN) {
    const fid = await facultyIdForUser(req.user!.sub);
    if (!fid || fid !== note.uploadedById) return res.status(403).json({ error: 'Forbidden' });
  }
  await prisma.note.delete({ where: { id: note.id } });
  fs.unlink(path.join(UPLOAD_DIR, note.fileUrl), () => {});
  await logAudit({ userId: req.user!.sub, action: 'NOTE_DELETED', entity: 'Note', entityId: note.id, req });
  res.json({ success: true });
});

export default router;
