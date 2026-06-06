const mongoose = require('mongoose');
require('dotenv').config({path: '../versal.env'});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const p = await db.collection('products').find({ 'images.fullBody': { $regex: 'bhagalpur-resham/products' } }).toArray();
  console.log('Products with old URL structure:', p.length);
  if (p.length > 0) {
    console.log(p[0].sku, p[0].images);
  }
  process.exit(0);
});
