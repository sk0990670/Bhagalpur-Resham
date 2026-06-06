const mongoose = require('mongoose');
require('dotenv').config({path: '../versal.env'});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const db = mongoose.connection.db;
    const orders = await db.collection('orders').find({}).toArray();
    let updatedCount = 0;
    
    for (const order of orders) {
      let modified = false;
      for (const item of order.items) {
        if (!item.product) continue;
        const product = await db.collection('products').findOne({ _id: item.product });
        if (product && product.images && product.images.fullBody && product.images.fullBody !== item.image) {
          item.image = product.images.fullBody;
          modified = true;
        }
      }
      if (modified) {
        await db.collection('orders').updateOne({ _id: order._id }, { $set: { items: order.items } });
        updatedCount++;
      }
    }
    console.log(`Fixed ${updatedCount} orders with broken images.`);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
});
