const mongoose = require('mongoose');
const https = require('https');
require('dotenv').config({path: '../versal.env'});

const checkUrl = (url) => new Promise((resolve) => {
  https.get(url, (res) => {
    resolve(res.statusCode === 200);
  }).on('error', () => resolve(false));
});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const p = await db.collection('products').find({}).toArray();
  for (const prod of p) {
    const url = prod.images && prod.images.fullBody;
    if (url) {
      const ok = await checkUrl(url);
      if (!ok) {
        console.log(`BROKEN: ${prod.sku} -> ${url}`);
      }
    }
  }
  console.log('Done checking images.');
  process.exit(0);
});
