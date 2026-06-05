import { Router } from 'express';
import { creditController } from '../controllers/credit.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All credit routes require authentication
router.use(authenticate);

router.get('/balance', creditController.getBalance);
router.get('/ledger', creditController.getLedger);
router.post('/validate-redemption', creditController.validateRedemption);

export default router;
