const mongoose = require('mongoose');
require('dotenv').config({path: '../versal.env'});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const p = await db.collection('products').find({}).toArray();
  const types = {};
  for (const prod of p) {
    const t = Array.isArray(prod.images) ? 'array' : typeof prod.images;
    types[t] = (types[t] || 0) + 1;
    if (t === 'array') {
      console.log('ARRAY PRODUCT:', prod.sku, prod.images);
    }
  }
  console.log('TYPES:', types);
  process.exit(0);
});
