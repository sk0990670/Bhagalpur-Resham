import { Router } from 'express';
import { uploadController } from '../controllers/all.controllers';
import { uploadSingle } from '../middleware/upload.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';

const router = Router();

// Only admins can upload images directly
router.post('/image', authenticate, authorize('admin', 'superadmin'), uploadSingle, uploadController.uploadImage);

// Valkey temporary upload (async processing)
router.post('/temp', authenticate, authorize('admin', 'superadmin'), uploadSingle, uploadController.uploadImageTemp);
router.get('/preview/:tempId', uploadController.getPreview);

export default router;
