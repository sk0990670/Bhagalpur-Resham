import { wishlistRepository } from '../repositories/wishlist.repository';
import { productRepository } from '../repositories/product.repository';
import { ApiError } from '../utils/ApiError';

class WishlistService {
  async getWishlist(userId: string) {
    return wishlistRepository.findByUser(userId);
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) throw ApiError.notFound('Product not found');

    const alreadyIn = await wishlistRepository.hasItem(userId, productId);
    if (alreadyIn) throw ApiError.conflict('Product already in wishlist');

    return wishlistRepository.addItem(userId, productId);
  }

  async removeFromWishlist(userId: string, productId: string) {
    return wishlistRepository.removeItem(userId, productId);
  }

  async clearWishlist(userId: string) {
    return wishlistRepository.clearWishlist(userId);
  }

  async isInWishlist(userId: string, productId: string) {
    return wishlistRepository.hasItem(userId, productId);
  }
}
export const wishlistService = new WishlistService();
