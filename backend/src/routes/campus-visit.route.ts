import { Router, Request, Response } from 'express';
import emailService from '../services/email.service';

interface CampusVisitRequest {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  numberOfStudents: string;
  message?: string;
}

const router = Router();

const validateCampusVisitData = (data: CampusVisitRequest): string | null => {
  if (!data.name?.trim()) return 'Name is required';
  if (!data.email?.trim()) return 'Email is required';
  if (!data.phone?.trim()) return 'Phone is required';
  if (!data.preferredDate?.trim()) return 'Preferred date is required';
  if (!data.numberOfStudents?.trim()) return 'Number of students is required';

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) return 'Invalid email format';

  // Basic phone validation
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  if (!phoneRegex.test(data.phone)) return 'Invalid phone format';

  return null;
};

router.post('/', async (req: Request<{}, {}, CampusVisitRequest>, res: Response) => {
  try {
    // Validate input
    const validationError = validateCampusVisitData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Send campus visit notification
    await emailService.sendCampusVisitNotification({
      ...req.body,
      message: req.body.message || '',
    });

    res.status(201).json({
      success: true,
      message:
        'Campus visit request submitted successfully. We will confirm your visit shortly!',
    });
  } catch (error: any) {
    console.error('Campus Visit API Error:', error);
    res.status(500).json({
      error: 'Failed to submit campus visit request',
      message: error.message,
    });
  }
});

export default router;
