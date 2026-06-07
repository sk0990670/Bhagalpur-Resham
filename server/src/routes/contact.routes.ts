import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
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
  .get(authenticate, authorize('admin', 'superadmin'), contactController.getInquiries);

router.route('/:id')
  .delete(authenticate, authorize('admin', 'superadmin'), contactController.deleteInquiry);

router.route('/:id/status')
  .put(authenticate, authorize('admin', 'superadmin'), contactController.updateInquiryStatus);

export default router;
