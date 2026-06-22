import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import dotenv from 'dotenv';

// Import routes
// Chat route removed (chat disabled)
import enrollmentRoute from './routes/enrollment.route';
import campusVisitRoute from './routes/campus-visit.route';
import authRoute from './routes/auth.route';
import facultyRoute from './routes/faculty.route';
import studentsRoute from './routes/students.route';
import classesRoute from './routes/classes.route';
import attendanceRoute from './routes/attendance.route';
import marksRoute from './routes/marks.route';
import timetableRoute from './routes/timetable.route';
import notesRoute from './routes/notes.route';
import meRoute from './routes/me.route';
import auditRoute from './routes/audit.route';

// Load environment variables
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = [
    'SMTP_USER',
    'SMTP_PASS',
    'DATABASE_URL',
    'JWT_SECRET',
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
}

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:4028',
        credentials: true,
    })
);
app.use(cookieParser());
app.use(morgan('combined'));

const MAX_SIZE = `${process.env.MAX_FILE_SIZE || 10}mb`;
app.use(express.json({ limit: MAX_SIZE }));
app.use(express.urlencoded({ limit: MAX_SIZE, extended: true }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        message: 'Vertex Academy Backend Server is running',
        timestamp: new Date(),
    });
});

// API Routes
// /api/chat route removed
app.use('/api/enrollment', enrollmentRoute);
app.use('/api/campus-visit', campusVisitRoute);
app.use('/api/auth', authRoute);
app.use('/api/faculty', facultyRoute);
app.use('/api/students', studentsRoute);
app.use('/api/classes', classesRoute);
app.use('/api/attendance', attendanceRoute);
app.use('/api/marks', marksRoute);
app.use('/api/timetable', timetableRoute);
app.use('/api/notes', notesRoute);
app.use('/api/me', meRoute);
app.use('/api/audit', auditRoute);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path,
        method: req.method,
    });
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Error:', error);
    res.status(error.status || 500).json({
        error: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   Vertex Academy Backend Server          ║
║   Running on: http://localhost:${PORT}       ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   Frontend: ${process.env.FRONTEND_URL}     ║
║   Email: ${process.env.SMTP_USER ? '✅ Configured' : '❌ Missing'}            ║
     ║   Groq AI: ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Missing'}         ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Vertex Academy Backend...');
    process.exit(0);
});

export default app;
