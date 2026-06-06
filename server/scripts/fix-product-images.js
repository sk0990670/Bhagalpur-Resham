const mongoose = require('mongoose');
require('dotenv').config({path: '../versal.env'});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    let updatedCount = 0;
    
    for (const product of products) {
      if (!product.images) continue;
      
      let modified = false;
      const sku = product.sku;
      const prefix = sku.split('-')[0];
      
      const newImages = { ...product.images };
      
      for (const key of ['fullBody', 'closeup', 'micro']) {
        const url = newImages[key];
        if (url && url.includes('bhagalpur-resham/products')) {
          // It's using the old unorganized format!
          // Map key to organized filename format
          let filename = key;
          if (key === 'fullBody') filename = 'full-body';
          
          // Use standard .jpg extension for organized images
          const newUrl = `https://res.cloudinary.com/dmkkta67i/image/upload/products/${prefix}/${sku}/${filename}.jpg`;
          newImages[key] = newUrl;
          modified = true;
          console.log(`[${sku}] Updated ${key}: ${url} -> ${newUrl}`);
        }
      }
      
      if (modified) {
        await db.collection('products').updateOne(
          { _id: product._id }, 
          { $set: { images: newImages } }
        );
        updatedCount++;
      }
    }
    
    console.log(`Successfully migrated ${updatedCount} products to the new organized Cloudinary structure.`);
  } catch(e) {
    console.error('Error:', e);
  } finally {
    process.exit(0);
  }
});
