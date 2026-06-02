import { BaseRepository } from './base.repository';
import { Cart, ICart } from '../models/cart.model';

export class CartRepository extends BaseRepository<ICart> {
  constructor() { super(Cart); }

  async findByUser(userId: string) {
    return Cart.findOne({ user: userId }).populate('items.product', 'name images price discountPrice stock isActive').exec();
  }

  async upsertCart(userId: string, data: Partial<ICart>) {
    return Cart.findOneAndUpdate(
      { user: userId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    ).exec();
  }

  async clearCart(userId: string) {
    return Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } }, { new: true }).exec();
  }
}
export const cartRepository = new CartRepository();
