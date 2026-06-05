import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { creditService } from '../services/credit.service';

class CreditController {
  getBalance = asyncHandler(async (req: Request, res: Response) => {
    const balance = await creditService.getBalance(req.user!.userId);
    res.json(ApiResponse.ok('Credit balance retrieved successfully', balance));
  });

  getLedger = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const ledger = await creditService.getLedger(req.user!.userId, page, limit);
    res.json(ApiResponse.ok('Credit ledger retrieved successfully', ledger.data, ledger.meta));
  });

  validateRedemption = asyncHandler(async (req: Request, res: Response) => {
    const { creditsToRedeem, orderTotal } = req.body;
    await creditService.validateRedemption(req.user!.userId, Number(creditsToRedeem), Number(orderTotal));
    res.json(ApiResponse.ok('Redemption is valid', { valid: true }));
  });
}

export const creditController = new CreditController();
