require('dotenv').config({ path: '../versal.env' });
const mongoose = require('mongoose');

async function fixOrders() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const orders = await db.collection('orders').find({}).toArray();

  let updatedCount = 0;

  for (const order of orders) {
    let modified = false;
    
    order.items = order.items.map(item => {
      if (item.image && typeof item.image === 'string' && !item.image.includes('full-body.webp') && !item.image.includes('product-placeholder.webp')) {
        // e.g. "https://res.cloudinary.com/dmkkta67i/image/upload/v17282828/products/TSS-3VNYMU.jpg"
        // Target: "https://res.cloudinary.com/dmkkta67i/image/upload/products/TSS/TSS-3VNYMU/full-body.webp"
        
        // Extract prefix and sku
        const sku = item.sku;
        if (sku) {
          const prefixMatch = sku.match(/^([A-Z]+)-/);
          if (prefixMatch) {
            const prefix = prefixMatch[1];
            item.image = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/products/${prefix}/${sku}/full-body.webp`;
            modified = true;
          }
        }
      }
      return item;
    });

    if (modified) {
      await db.collection('orders').updateOne(
        { _id: order._id },
        { $set: { items: order.items } }
      );
      updatedCount++;
      console.log(`Updated order ${order.orderId}`);
    }
  }

  console.log(`Fixed ${updatedCount} orders.`);
  await mongoose.disconnect();
}

fixOrders().catch(console.error);
