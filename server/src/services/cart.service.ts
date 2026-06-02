import { cartRepository } from '../repositories/cart.repository';
import { productRepository } from '../repositories/product.repository';
import { ApiError } from '../utils/ApiError';

class CartService {
  async getCart(userId: string) {
    return cartRepository.findByUser(userId);
  }

  async addToCart(userId: string, productId: string, qty: number) {
    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) throw ApiError.notFound('Product not found');
    if (product.stock < qty) throw ApiError.badRequest(`Only ${product.stock} units available`);

    const cart = await cartRepository.findByUser(userId);
    const items = cart?.items ?? [];
    const existingIdx = items.findIndex((i) => i.product.toString() === productId);

    if (existingIdx >= 0) {
      const newQty = items[existingIdx].qty + qty;
      if (newQty > product.stock) throw ApiError.badRequest(`Only ${product.stock} units available`);
      items[existingIdx].qty = newQty;
    } else {
      items.push({
        product: product._id as any,
        name: product.name,
        image: product.images[0]?.url ?? '',
        price: product.price,
        discountPrice: product.discountPrice,
        qty,
        stock: product.stock,
      });
    }
    return cartRepository.upsertCart(userId, { items } as any);
  }

  async updateCartItem(userId: string, productId: string, qty: number) {
    if (qty === 0) return this.removeFromCart(userId, productId);
    const cart = await cartRepository.findByUser(userId);
    if (!cart) throw ApiError.notFound('Cart not found');

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) throw ApiError.notFound('Item not in cart');
    if (qty > item.stock) throw ApiError.badRequest(`Only ${item.stock} units available`);

    item.qty = qty;
    return cartRepository.upsertCart(userId, { items: cart.items } as any);
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await cartRepository.findByUser(userId);
    if (!cart) throw ApiError.notFound('Cart not found');
    const items = cart.items.filter((i) => i.product.toString() !== productId);
    return cartRepository.upsertCart(userId, { items } as any);
  }

  async clearCart(userId: string) {
    return cartRepository.clearCart(userId);
  }

  // Refresh cart prices/stock from current product data
  async syncCart(userId: string) {
    const cart = await cartRepository.findByUser(userId);
    if (!cart || !cart.items.length) return cart;

    const syncedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await productRepository.findById(item.product.toString());
        if (!product || !product.isActive) return null; // Remove unavailable
        return {
          ...item,
          price: product.price,
          discountPrice: product.discountPrice,
          stock: product.stock,
          qty: Math.min(item.qty, product.stock),
        };
      })
    );

    const validItems = syncedItems.filter(Boolean);
    return cartRepository.upsertCart(userId, { items: validItems } as any);
  }
}
export const cartService = new CartService();
