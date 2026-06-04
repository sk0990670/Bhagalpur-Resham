import { cartRepository } from '../repositories/cart.repository';
import { productRepository } from '../repositories/product.repository';
import { ApiError } from '../utils/ApiError';

class CartService {
  private formatCartResponse(cart: any) {
    if (!cart) return null;
    const cartObj = cart.toObject ? cart.toObject({ virtuals: true }) : cart;
    cartObj.items = cartObj.items.filter((item: any) => item.product).map((item: any) => {
      const p = item.product;
      let color = p.attributes?.color;
      if (p.attributes && typeof p.attributes.get === 'function') {
        color = p.attributes.get('color');
      }
      return {
        id: item._id || p._id,
        quantity: item.qty,
        addedToCartAt: item.addedToCartAt,
        product: {
          id: p._id,
          name: p.name,
          sku: p.sku,
          primaryColor: color,
          weight: p.weight,
          weaveType: p.weaveType,
          price: p.price,
          discountPrice: p.discountPrice,
          gstPercent: p.gstPercent || 5,
          image: p.images?.[0]?.url || '',
          images: p.images,
          stock: p.stock
        }
      };
    });
    return cartObj;
  }

  async getCart(userId: string) {
    const cart = await cartRepository.findByUser(userId);
    return this.formatCartResponse(cart);
  }

  async addToCart(userId: string, productId: string, qty: number) {
    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) throw ApiError.notFound('Product not found');
    if (product.stock < qty) throw ApiError.badRequest(`Only ${product.stock} units available`);

    const cart = await cartRepository.findByUser(userId);
    const items = cart?.items ?? [];
    const existingIdx = items.findIndex((i) => {
      const pId = typeof i.product === 'string' ? i.product : (i.product as any)?._id?.toString();
      return pId === productId;
    });

    if (existingIdx >= 0) {
      const newQty = items[existingIdx].qty + qty;
      if (newQty > product.stock) throw ApiError.badRequest(`Only ${product.stock} units available`);
      items[existingIdx].qty = newQty;
    } else {
      items.push({
        product: product._id as any,
        qty,
        addedToCartAt: new Date(),
      });
    }
    await cartRepository.upsertCart(userId, { items } as any);
    return this.getCart(userId);
  }

  async updateCartItem(userId: string, productId: string, qty: number) {
    if (qty === 0) return this.removeFromCart(userId, productId);
    const cart = await cartRepository.findByUser(userId);
    if (!cart) throw ApiError.notFound('Cart not found');

    const item = cart.items.find((i) => {
      const pId = typeof i.product === 'string' ? i.product : (i.product as any)?._id?.toString();
      return pId === productId;
    });
    if (!item) throw ApiError.notFound('Item not in cart');
    if (qty > (item.product as any).stock) throw ApiError.badRequest(`Only ${(item.product as any).stock} units available`);

    item.qty = qty;
    await cartRepository.upsertCart(userId, { items: cart.items } as any);
    return this.getCart(userId);
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await cartRepository.findByUser(userId);
    if (!cart) throw ApiError.notFound('Cart not found');
    const items = cart.items.filter((i) => i.product.toString() !== productId && (i.product as any)?._id?.toString() !== productId);
    await cartRepository.upsertCart(userId, { items } as any);
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    return cartRepository.clearCart(userId);
  }

  // Refresh cart prices/stock from current product data
  async syncCart(userId: string) {
    const cart = await cartRepository.findByUser(userId);
    if (!cart || !cart.items.length) return this.formatCartResponse(cart);

    const syncedItems = await Promise.all(
      cart.items.map(async (item) => {
        const pId = typeof item.product === 'string' ? item.product : (item.product as any)._id;
        const product = await productRepository.findById(pId.toString());
        if (!product || !product.isActive) return null; // Remove unavailable
        return {
          product: pId,
          qty: Math.min(item.qty, product.stock),
          addedToCartAt: item.addedToCartAt,
        };
      })
    );

    const validItems = syncedItems.filter(Boolean);
    await cartRepository.upsertCart(userId, { items: validItems } as any);
    return this.getCart(userId);
  }
}
export const cartService = new CartService();
