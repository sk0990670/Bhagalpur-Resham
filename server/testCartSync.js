require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { cartRepository } = require('./src/repositories/cart.repository');
const { productRepository } = require('./src/repositories/product.repository');
require('ts-node').register({ transpileOnly: true });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  const carts = await cartRepository.model.find();
  for (const cart of carts) {
    if (!cart.items.length) continue;
    
    console.log(`Syncing cart for user ${cart.user}`);
    const syncedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await productRepository.findById(item.product.toString());
        if (!product || !product.isActive) return null;
        
        let color = undefined;
        if (product.attributes) {
            if (typeof product.attributes.get === 'function') {
                color = product.attributes.get('color');
            } else {
                color = product.attributes.color;
            }
        }
        
        return {
          product: item.product,
          name: product.name,
          image: product.images[0]?.url || item.image,
          addedToCartAt: item.addedToCartAt,
          price: product.price,
          discountPrice: product.discountPrice,
          stock: product.stock,
          qty: Math.min(item.qty, product.stock),
          sku: product.sku,
          gstPercent: product.gstPercent || 5,
          weight: product.weight,
          color: color,
          weaveType: product.weaveType,
        };
      })
    );
    
    const validItems = syncedItems.filter(Boolean);
    try {
        const updated = await cartRepository.upsertCart(cart.user.toString(), { items: validItems });
        console.log('Successfully synced:', JSON.stringify(updated.items.map(i => i.sku)));
    } catch(err) {
        console.error('Error syncing:', err.message);
    }
  }
  process.exit(0);
}
run();
