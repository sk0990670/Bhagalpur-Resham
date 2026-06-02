import { reviewRepository } from '../repositories/review.repository';
import { orderRepository } from '../repositories/order.repository';
import { ApiError } from '../utils/ApiError';
import { getPaginationOptions } from '../utils/pagination';
import { Request } from 'express';

class ReviewService {
  async getProductReviews(productId: string, req: Request) {
    const pagination = getPaginationOptions(req);
    const { sort } = req.query as any;
    const sortMap: Record<string, any> = {
      newest: { createdAt: -1 }, highest: { rating: -1 }, lowest: { rating: 1 }, helpful: { helpfulVotes: -1 },
    };
    const [reviews, distribution] = await Promise.all([
      reviewRepository.findForProduct(productId, pagination, sortMap[sort] ?? { createdAt: -1 }),
      reviewRepository.getRatingDistribution(productId),
    ]);
    return { ...reviews, distribution };
  }

  async submitReview(userId: string, data: any) {
    const existing = await reviewRepository.userReviewForProduct(userId, data.productId);
    if (existing) throw ApiError.conflict('You have already reviewed this product');

    let isVerifiedPurchase = false;
    if (data.orderId) {
      const order = await orderRepository.findById(data.orderId);
      if (order && order.user.toString() === userId && order.items.some((i) => i.product.toString() === data.productId)) {
        isVerifiedPurchase = true;
      }
    }

    return reviewRepository.create({
      user: userId as any,
      product: data.productId as any,
      order: data.orderId as any,
      rating: data.rating,
      title: data.title,
      body: data.body,
      isVerifiedPurchase,
    } as any);
  }

  async moderateReview(reviewId: string, data: { status: string; rejectionReason?: string; adminResponse?: string }) {
    const review = await reviewRepository.moderate(reviewId, data.status, data.rejectionReason, data.adminResponse);
    if (!review) throw ApiError.notFound('Review not found');
    return review;
  }

  async voteHelpful(reviewId: string, userId: string) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) throw ApiError.notFound('Review not found');
    if (review.votedBy.map(String).includes(userId)) throw ApiError.conflict('Already voted');
    return reviewRepository.voteHelpful(reviewId, userId);
  }

  async deleteReview(reviewId: string, userId: string, role: string) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) throw ApiError.notFound('Review not found');
    if (role === 'customer' && review.user.toString() !== userId) throw ApiError.forbidden('Access denied');
    return reviewRepository.deleteById(reviewId);
  }

  async getPendingReviews(req: Request) {
    const pagination = getPaginationOptions(req);
    return reviewRepository.findPendingModeration(pagination);
  }
}
export const reviewService = new ReviewService();
