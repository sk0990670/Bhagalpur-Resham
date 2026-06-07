import mongoose from 'mongoose';
import { env } from './src/config/env';
import { Cart } from './src/models/cart.model';

async function run() {
  await mongoose.connect(env.db.uri);
  const userId = new mongoose.Types.ObjectId().toString();
  const productId = new mongoose.Types.ObjectId().toString();

  try {
    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [{ product: { _id: productId, name: 'Saree', price: 100 }, qty: 1, addedToCartAt: new Date() }] } },
      { new: true, upsert: true, runValidators: true }
    ).exec();
    console.log("Success!");
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      console.log("Validation Error:", JSON.stringify(err.errors, null, 2));
    } else {
      console.log("Other Error:", err.message);
    }
  }
  process.exit(0);
}
run();
