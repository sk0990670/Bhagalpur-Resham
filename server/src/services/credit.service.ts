import { ArtisanCreditWallet, ArtisanCreditTransaction } from '../models/credit.model';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Order } from '../models/order.model';
import { ApiError } from '../utils/ApiError';

class CreditService {
  /**
   * Retrieves or creates a wallet for the user, and calculates lifetime spend/families supported.
   */
  async getBalance(userId: string) {
    let wallet = await ArtisanCreditWallet.findOne({ customerId: userId });
    
    if (!wallet) {
      wallet = await ArtisanCreditWallet.create({
        customerId: userId,
        availableCredits: 0,
        earnedCredits: 0,
        redeemedCredits: 0
      });
    }

    // Calculate Lifetime Spend (only for delivered orders)
    const orders = await Order.find({ user: userId, status: 'delivered' });
    const lifetimeSpend = orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
    
    // 1 Family supported per 50,000 INR
    const familiesSupported = Math.floor(lifetimeSpend / 50000);

    return {
      availableCredits: wallet.availableCredits,
      earnedCredits: wallet.earnedCredits,
      redeemedCredits: wallet.redeemedCredits,
      lifetimeSpend,
      familiesSupported,
      deliveredOrdersCount: orders.length
    };
  }

  /**
   * Gets ledger transactions for a user.
   */
  async getLedger(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      ArtisanCreditTransaction.find({ customerId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('orderId', 'orderId createdAt'),
      ArtisanCreditTransaction.countDocuments({ customerId: userId })
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Earns credits when an order is delivered.
   */
  async earnCredits(userId: string, orderId: string, orderTotal: number) {
    const creditsToEarn = Math.floor(orderTotal / 100);
    if (creditsToEarn <= 0) return null;

    // Check if we already granted credits for this order to avoid duplicates
    const existingTransaction = await ArtisanCreditTransaction.findOne({
      customerId: userId,
      orderId: orderId,
      type: 'CREDIT_EARNED'
    });

    if (existingTransaction) return null;

    const wallet = await ArtisanCreditWallet.findOneAndUpdate(
      { customerId: userId },
      { 
        $inc: { availableCredits: creditsToEarn, earnedCredits: creditsToEarn },
        $setOnInsert: { redeemedCredits: 0 }
      },
      { new: true, upsert: true }
    );

    const transaction = await ArtisanCreditTransaction.create({
      transactionId: `TXN-${uuidv4().substring(0,8).toUpperCase()}`,
      customerId: userId,
      orderId: orderId,
      type: 'CREDIT_EARNED',
      credits: creditsToEarn,
      amount: creditsToEarn // 1 credit = 1 INR
    });

    return { wallet, transaction };
  }

  /**
   * Reverses credits if an order is refunded.
   */
  async reverseCredits(userId: string, orderId: string) {
    const earnTransaction = await ArtisanCreditTransaction.findOne({
      customerId: userId,
      orderId: orderId,
      type: 'CREDIT_EARNED'
    });

    if (!earnTransaction) return null; // No credits were earned for this order

    // Check if already reversed
    const existingReverse = await ArtisanCreditTransaction.findOne({
      customerId: userId,
      orderId: orderId,
      type: 'CREDIT_REVERSAL'
    });

    if (existingReverse) return null;

    const creditsToReverse = earnTransaction.credits;

    const wallet = await ArtisanCreditWallet.findOneAndUpdate(
      { customerId: userId },
      { 
        $inc: { availableCredits: -creditsToReverse, earnedCredits: -creditsToReverse }
      },
      { new: true }
    );

    const transaction = await ArtisanCreditTransaction.create({
      transactionId: `TXN-${uuidv4().substring(0,8).toUpperCase()}`,
      customerId: userId,
      orderId: orderId,
      type: 'CREDIT_REVERSAL',
      credits: creditsToReverse,
      amount: creditsToReverse
    });

    return { wallet, transaction };
  }

  /**
   * Checks if user has enough credits and rules are met (Min 100, Max 20% of order).
   * Does NOT actually deduct them. Useful for checkout validation.
   */
  async validateRedemption(userId: string, creditsToRedeem: number, orderTotal: number) {
    if (creditsToRedeem < 100) {
      throw new ApiError(400, 'Minimum redemption is 100 credits');
    }

    const maxAllowed = Math.floor(orderTotal * 0.20);
    if (creditsToRedeem > maxAllowed) {
      throw new ApiError(400, `Maximum allowed redemption for this order is ${maxAllowed} credits`);
    }

    const wallet = await ArtisanCreditWallet.findOne({ customerId: userId });
    if (!wallet || wallet.availableCredits < creditsToRedeem) {
      throw new ApiError(400, 'Insufficient Artisan Credits');
    }

    return true;
  }

  /**
   * Redeems credits during order creation.
   */
  async redeemCredits(userId: string, orderId: string, creditsToRedeem: number) {
    if (creditsToRedeem <= 0) return null;

    const wallet = await ArtisanCreditWallet.findOneAndUpdate(
      { customerId: userId },
      { 
        $inc: { availableCredits: -creditsToRedeem, redeemedCredits: creditsToRedeem }
      },
      { new: true }
    );

    if (!wallet) throw new ApiError(400, 'Wallet not found');

    const transaction = await ArtisanCreditTransaction.create({
      transactionId: `TXN-${uuidv4().substring(0,8).toUpperCase()}`,
      customerId: userId,
      orderId: orderId,
      type: 'CREDIT_REDEEMED',
      credits: creditsToRedeem,
      amount: creditsToRedeem // 1 credit = 1 INR discount
    });

    return { wallet, transaction };
  }
}

export const creditService = new CreditService();
