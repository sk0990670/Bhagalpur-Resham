import { BaseRepository } from './base.repository';
import { Wishlist, IWishlist } from '../models/wishlist.model';

export class WishlistRepository extends BaseRepository<IWishlist> {
  constructor() { super(Wishlist); }

  async findByUser(userId: string) {
    return Wishlist.findOne({ user: userId }).populate('items.product', 'name images price discountPrice stock avgRating isFeatured').exec();
  }

  async addItem(userId: string, productId: string) {
    return Wishlist.findOneAndUpdate(
      { user: userId },
      { $addToSet: { items: { product: productId, addedAt: new Date() } } },
      { new: true, upsert: true }
    ).exec();
  }

  async removeItem(userId: string, productId: string) {
    return Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { new: true }
    ).exec();
  }

  async hasItem(userId: string, productId: string): Promise<boolean> {
    return !!(await Wishlist.exists({ user: userId, 'items.product': productId }));
  }

  async clearWishlist(userId: string) {
    return Wishlist.findOneAndUpdate({ user: userId }, { $set: { items: [] } }, { new: true }).exec();
  }
}
export const wishlistRepository = new WishlistRepository();
