const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const https = require('https');
require('dotenv').config({path: '../versal.env'});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const checkUrl = (url) => new Promise((resolve) => {
  if (!url) return resolve(false);
  https.get(url, (res) => {
    resolve(res.statusCode === 200);
  }).on('error', () => resolve(false));
});

const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    let path = parts[1];
    // remove version
    if (path.match(/^v\d+\//)) {
      path = path.substring(path.indexOf('/') + 1);
    }
    // remove extension
    const dotIndex = path.lastIndexOf('.');
    if (dotIndex !== -1) {
      path = path.substring(0, dotIndex);
    }
    return path;
  } catch(e) {
    return null;
  }
}

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    let updatedCount = 0;
    const failedMigrations = [];
    
    for (const product of products) {
      if (!product.images) continue;
      
      let modified = false;
      const sku = product.sku;
      const prefix = sku.split('-')[0];
      
      const newImages = { ...product.images };
      const imageKeys = ['fullBody', 'closeup', 'micro'];
      
      for (let i = 0; i < imageKeys.length; i++) {
        const key = imageKeys[i];
        const currentUrl = newImages[key];
        if (!currentUrl) continue;
        
        // Target filename
        let targetFilename = key;
        if (key === 'fullBody') targetFilename = 'full-body';
        
        const newFolder = `products/${prefix}/${sku}`;
        const newPublicId = `${newFolder}/${targetFilename}`;
        const newUrlWebp = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${newPublicId}.webp`;
        
        // Check if the target is already correctly placed and available
        if (currentUrl.includes(newPublicId)) {
           // Wait, what if the database URL uses .jpg but we want .webp?
           if (!currentUrl.endsWith('.webp')) {
             newImages[key] = newUrlWebp;
             modified = true;
           }
           continue;
        }

        // We need to move it.
        let sourcePublicId = getPublicIdFromUrl(currentUrl);
        
        // Check if current URL is broken
        const isOk = await checkUrl(currentUrl);
        
        let validAssetFound = false;
        
        if (!isOk) {
           console.log(`[${sku}] ${key} is broken. Attempting recovery...`);
           // Attempt to search cloudinary
           try {
             const searchResult = await cloudinary.search
                .expression(`folder:bhagalpur-resham/products AND filename:${sourcePublicId.split('/').pop()}`)
                .execute();
             if (searchResult.resources.length > 0) {
               sourcePublicId = searchResult.resources[0].public_id;
               validAssetFound = true;
               console.log(`[${sku}] Recovered asset: ${sourcePublicId}`);
             } else {
               // Try searching by SKU tag or prefix if possible
               const searchResult2 = await cloudinary.search
                 .expression(`folder:bhagalpur-resham/products AND tags=${sku}`)
                 .execute();
                 
               if (searchResult2.resources.length > i) {
                 sourcePublicId = searchResult2.resources[i].public_id;
                 validAssetFound = true;
               }
             }
           } catch(e) {
             console.error(`Search failed for ${sku}`, e.message);
           }
        } else {
           validAssetFound = true;
        }
        
        if (validAssetFound && sourcePublicId) {
          try {
             // ensure folder exists by creating dummy or just rename (cloudinary auto creates folders)
             console.log(`[${sku}] Moving ${sourcePublicId} -> ${newPublicId}`);
             await cloudinary.uploader.rename(sourcePublicId, newPublicId, { overwrite: true });
             
             newImages[key] = newUrlWebp;
             modified = true;
          } catch(e) {
             console.error(`[${sku}] Failed to rename asset:`, e.message);
             // if it says 'not found', it might already be renamed
             failedMigrations.push({ sku, key, url: currentUrl, error: e.message });
          }
        } else {
          failedMigrations.push({ sku, key, url: currentUrl, error: 'Asset not found or broken' });
        }
      }
      
      if (modified) {
        await db.collection('products').updateOne(
          { _id: product._id }, 
          { $set: { images: newImages } }
        );
        updatedCount++;
        console.log(`[${sku}] Database updated successfully.`);
      }
    }
    
    if (failedMigrations.length > 0) {
       fs.writeFileSync('migration-failed.json', JSON.stringify(failedMigrations, null, 2));
       console.log(`Written ${failedMigrations.length} failures to migration-failed.json`);
    }
    
    console.log(`Successfully migrated ${updatedCount} products to the new organized Cloudinary structure.`);
  } catch(e) {
    console.error('Error:', e);
  } finally {
    process.exit(0);
  }
});
