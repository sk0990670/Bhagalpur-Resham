const mongoose = require('mongoose');
require('dotenv').config({path: '../versal.env'});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const p1 = await db.collection('products').findOne({ images: { $type: 'array' } });
  const p2 = await db.collection('products').findOne({ images: { $type: 'object' } });
  console.log('ARRAY TYPE:', JSON.stringify(p1?.images || null));
  console.log('OBJECT TYPE:', JSON.stringify(p2?.images || null));
  process.exit(0);
});
