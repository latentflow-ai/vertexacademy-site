import { Router, Request, Response, NextFunction } from 'express';

interface AdminLoginRequest {
  username: string;
  password: string;
}

interface AdminAuthRequest extends Request {
  adminAuthenticated?: boolean;
}

// Simple admin authentication middleware
const adminAuthMiddleware = (
  req: AdminAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Admin token is required',
    });
  }

  const token = authHeader.substring(7);

  // Simple token validation (replace with JWT in production)
  if (token === process.env.ADMIN_TOKEN) {
    (req as AdminAuthRequest).adminAuthenticated = true;
    next();
  } else {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid admin token',
    });
  }
};

const router = Router();

// Admin login endpoint
router.post('/login', (req: Request<{}, {}, AdminLoginRequest>, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required',
      });
    }

    const adminUsername = process.env.ADMIN_USERNAME || 'stalin@vertex';
    const adminPassword = process.env.ADMIN_PASSWORD || 'VertexAcademy41';

    if (username === adminUsername && password === adminPassword) {
      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(
        `${adminUsername}:${Date.now()}`
      ).toString('base64');

      res.json({
        success: true,
        token,
        message: 'Admin login successful',
      });
    } else {
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password is incorrect',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      error: 'Login failed',
      message: error.message,
    });
  }
});

// Protected admin routes (placeholder for future implementation)
router.get('/dashboard', adminAuthMiddleware, (req: AdminAuthRequest, res: Response) => {
  res.json({
    message: 'Admin Dashboard',
    data: {
      totalEnquiries: 42,
      totalCampusVisits: 15,
      enrolledStudents: 156,
      recentActivityCount: 8,
    },
  });
});

router.get(
  '/inquiries',
  adminAuthMiddleware,
  (req: AdminAuthRequest, res: Response) => {
    res.json({
      message: 'Enrollment Inquiries',
      data: [],
      total: 0,
    });
  }
);

router.get(
  '/campus-visits',
  adminAuthMiddleware,
  (req: AdminAuthRequest, res: Response) => {
    res.json({
      message: 'Campus Visit Requests',
      data: [],
      total: 0,
    });
  }
);

export default router;
