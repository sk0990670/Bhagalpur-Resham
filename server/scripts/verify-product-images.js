const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
require('dotenv').config({path: '../versal.env'});

const checkUrl = (url) => new Promise((resolve) => {
  if (!url) return resolve(false);
  https.get(url, (res) => {
    resolve(res.statusCode === 200);
  }).on('error', () => resolve(false));
});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    const report = [];
    
    console.log(`Verifying ${products.length} products...`);
    
    for (const product of products) {
      const sku = product.sku;
      const prefix = sku.split('-')[0];
      
      const pReport = {
        sku,
        name: product.name,
        urls: {},
        status: 'Success'
      };
      
      let allOk = true;
      const keys = ['fullBody', 'closeup', 'micro'];
      
      for (const key of keys) {
        const url = product.images?.[key];
        pReport.urls[key] = { url, status: 'Missing' };
        
        if (url) {
          const isOk = await checkUrl(url);
          const isCorrectFormat = url.includes(`products/${prefix}/${sku}/`);
          
          if (isOk && isCorrectFormat) {
             pReport.urls[key].status = 'OK';
          } else if (!isOk) {
             pReport.urls[key].status = 'Broken Link (404)';
             allOk = false;
          } else if (!isCorrectFormat) {
             pReport.urls[key].status = 'Wrong Format (Not migrated)';
             allOk = false;
          }
        } else {
          allOk = false;
        }
      }
      
      if (!allOk) pReport.status = 'Failed / Incomplete';
      report.push(pReport);
    }
    
    fs.writeFileSync('migration-report.json', JSON.stringify(report, null, 2));
    console.log('Verification completed. Check migration-report.json.');
  } catch(e) {
    console.error('Error:', e);
  } finally {
    process.exit(0);
  }
});
