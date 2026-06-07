import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { protect, admin } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for public contact form (5 requests per 15 minutes per IP)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many inquiries submitted from this IP, please try again after 15 minutes'
  }
});

// Public Route
router.post('/', contactLimiter, contactController.submitInquiry);

// Admin Routes
router.route('/')
  .get(protect, admin, contactController.getInquiries);

router.route('/:id')
  .delete(protect, admin, contactController.deleteInquiry);

router.route('/:id/status')
  .put(protect, admin, contactController.updateInquiryStatus);

export default router;
