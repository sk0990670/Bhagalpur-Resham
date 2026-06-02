import { BaseRepository } from './base.repository';
import { Review, IReview } from '../models/review.model';
import { REVIEW_STATUS } from '../utils/constants';

export class ReviewRepository extends BaseRepository<IReview> {
  constructor() { super(Review); }

  async findForProduct(productId: string, pagination: any, sort: any) {
    return this.findAll({
      filter: { product: productId, status: REVIEW_STATUS.APPROVED },
      pagination,
      sort,
      populate: 'user',
    });
  }

  async findPendingModeration(pagination: any) {
    return this.findAll({ filter: { status: REVIEW_STATUS.PENDING }, pagination, sort: { createdAt: 1 }, populate: ['user', 'product'] });
  }

  async userReviewForProduct(userId: string, productId: string) {
    return Review.findOne({ user: userId, product: productId }).exec();
  }

  async moderate(reviewId: string, status: string, reason?: string, adminResponse?: string) {
    return Review.findByIdAndUpdate(
      reviewId,
      { status, rejectionReason: reason, adminResponse, adminRespondedAt: adminResponse ? new Date() : undefined },
      { new: true }
    ).exec();
  }

  async voteHelpful(reviewId: string, userId: string) {
    return Review.findByIdAndUpdate(
      reviewId,
      { $addToSet: { votedBy: userId }, $inc: { helpfulVotes: 1 } },
      { new: true }
    ).exec();
  }

  async getRatingDistribution(productId: string) {
    return Review.aggregate([
      { $match: { product: productId as any, status: REVIEW_STATUS.APPROVED } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);
  }
}
export const reviewRepository = new ReviewRepository();
