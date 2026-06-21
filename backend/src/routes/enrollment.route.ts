import { Router, Request, Response } from 'express';
import emailService from '../services/email.service';

interface EnrollmentRequest {
  fullName: string;
  email: string;
  phone: string;
  studentName: string;
  grade: string;
  program: string;
  preferredDate: string;
  message?: string;
}

const router = Router();

const validateEnrollmentData = (data: EnrollmentRequest): string | null => {
  if (!data.fullName?.trim()) return 'Full name is required';
  if (!data.email?.trim()) return 'Email is required';
  if (!data.phone?.trim()) return 'Phone is required';
  if (!data.studentName?.trim()) return 'Student name is required';
  if (!data.grade?.trim()) return 'Grade is required';
  if (!data.program?.trim()) return 'Program is required';
  if (!data.preferredDate?.trim()) return 'Preferred date is required';

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) return 'Invalid email format';

  // Basic phone validation
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  if (!phoneRegex.test(data.phone)) return 'Invalid phone format';

  return null;
};

router.post('/', async (req: Request<{}, {}, EnrollmentRequest>, res: Response) => {
  try {
    // Validate input
    const validationError = validateEnrollmentData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Send enrollment inquiry notification
    await emailService.sendEnrollmentInquiryNotification({
      ...req.body,
      message: req.body.message || '',
    });

    res.status(201).json({
      success: true,
      message:
        'Enrollment inquiry submitted successfully. We will contact you soon!',
    });
  } catch (error: any) {
    console.error('Enrollment API Error:', error);
    res.status(500).json({
      error: 'Failed to submit enrollment inquiry',
      message: error.message,
    });
  }
});

export default router;
