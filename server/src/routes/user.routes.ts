import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema, addAddressSchema, changePasswordSchema, updateRoleSchema, createUserSchema } from '../validations/user.validation';

const router = Router();

// ── Customer routes (authenticated) ──────────────────────────
router.get('/profile', authenticate, userController.getProfile);
router.patch('/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);
router.patch('/change-password', authenticate, validate(changePasswordSchema), userController.changePassword);
router.post('/addresses', authenticate, validate(addAddressSchema), userController.addAddress);
router.delete('/addresses/:addressId', authenticate, userController.removeAddress);
router.patch('/addresses/:addressId/default', authenticate, userController.setDefaultAddress);

// ── Admin routes ──────────────────────────────────────────────
router.get('/', authenticate, authorize('admin', 'superadmin'), userController.listUsers);
router.post('/', authenticate, authorize('superadmin'), validate(createUserSchema), userController.createUser);
router.get('/:id', authenticate, authorize('admin', 'superadmin'), userController.getUserById);
router.patch('/:id/role', authenticate, authorize('superadmin'), validate(updateRoleSchema), userController.updateRole);
router.patch('/:id/deactivate', authenticate, authorize('admin', 'superadmin'), userController.deactivateUser);
router.patch('/:id/activate', authenticate, authorize('admin', 'superadmin'), userController.activateUser);
router.get('/role/artisans', authenticate, authorize('admin', 'superadmin'), userController.listAvailableArtisans);

export default router;
