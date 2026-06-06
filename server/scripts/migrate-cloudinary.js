const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
require('dotenv').config({path: '../versal.env'});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
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

const copyOrRename = async (sourcePublicId, targetPublicId) => {
  try {
    // If target already exists, just return success
    try {
      await cloudinary.api.resource(targetPublicId);
      return true; // Target already exists
    } catch(e) {
      // Target doesn't exist, proceed to rename/copy
    }

    try {
      await cloudinary.uploader.rename(sourcePublicId, targetPublicId, { overwrite: true });
      return true;
    } catch(err) {
      if (err.message && err.message.includes('not found')) {
        // Maybe it was already renamed, let's search if the source exists
        return false;
      }
      throw err;
    }
  } catch (e) {
    console.error(`Error moving ${sourcePublicId} to ${targetPublicId}:`, e.message);
    return false;
  }
};

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    
    let updatedCount = 0;
    const report = [];
    
    console.log(`Processing ${products.length} products...`);
    
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
        
        let targetFilename = key;
        if (key === 'fullBody') targetFilename = 'full-body';
        
        const newFolder = `bhagalpur-resham/products/${prefix}/${sku}`;
        const newPublicId = `${newFolder}/${targetFilename}`;
        const newUrlWebp = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${newPublicId}.webp`;
        
        if (currentUrl.includes(newPublicId) && currentUrl.endsWith('.webp')) {
           report.push({
              sku,
              name: product.name,
              oldUrl: currentUrl,
              newUrl: newUrlWebp,
              status: 'Skipped',
              success: true,
              reason: 'Already in correct format'
           });
           continue;
        }

        let sourcePublicId = getPublicIdFromUrl(currentUrl);
        
        if (sourcePublicId) {
          console.log(`[${sku}] Moving ${sourcePublicId} -> ${newPublicId}`);
          
          const success = await copyOrRename(sourcePublicId, newPublicId);
          
          if (success) {
            newImages[key] = newUrlWebp;
            modified = true;
            report.push({
               sku,
               name: product.name,
               oldUrl: currentUrl,
               newUrl: newUrlWebp,
               status: 'Migrated',
               success: true,
               reason: 'Renamed successfully'
            });
          } else {
             // If source not found, maybe it was a duplicate and deleted, or already missing
             // Let's attempt to find any resource with this SKU tag as a fallback
             try {
                const searchRes = await cloudinary.search.expression(`tags=${sku}`).execute();
                if (searchRes.resources && searchRes.resources.length > 0) {
                   const fallbackId = searchRes.resources[0].public_id;
                   console.log(`[${sku}] Found fallback asset ${fallbackId}`);
                   await copyOrRename(fallbackId, newPublicId);
                   newImages[key] = newUrlWebp;
                   modified = true;
                   report.push({
                      sku, name: product.name, oldUrl: currentUrl, newUrl: newUrlWebp, status: 'Recovered', success: true, reason: 'Recovered via tags'
                   });
                } else {
                   report.push({
                      sku, name: product.name, oldUrl: currentUrl, newUrl: newUrlWebp, status: 'Failed', success: false, reason: 'Source asset not found'
                   });
                }
             } catch(e) {
                report.push({
                   sku, name: product.name, oldUrl: currentUrl, newUrl: newUrlWebp, status: 'Failed', success: false, reason: e.message
                });
             }
          }
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
    
    // Deduplication & Cleanup: Delete loose files in bhagalpur-resham/products/
    console.log(`\nStarting cleanup of loose files in bhagalpur-resham/products/ ...`);
    let nextCursor = null;
    let deletedCount = 0;
    
    do {
       const res = await cloudinary.api.resources({
          type: 'upload',
          prefix: 'bhagalpur-resham/products/',
          max_results: 500,
          next_cursor: nextCursor
       });
       
       const looseFiles = res.resources.filter(r => {
          // Check if it's directly in bhagalpur-resham/products/ (no subfolders)
          // public_id is like "bhagalpur-resham/products/image1"
          const parts = r.public_id.split('/');
          return parts.length === 3; // bhagalpur-resham, products, filename
       });
       
       if (looseFiles.length > 0) {
          const publicIds = looseFiles.map(r => r.public_id);
          console.log(`Deleting ${publicIds.length} loose/duplicate files...`);
          await cloudinary.api.delete_resources(publicIds);
          deletedCount += publicIds.length;
       }
       
       nextCursor = res.next_cursor;
    } while (nextCursor);
    
    console.log(`Cleanup complete. Deleted ${deletedCount} loose files.`);
    
    fs.writeFileSync('migration-report.json', JSON.stringify(report, null, 2));
    console.log(`Successfully migrated ${updatedCount} products. Report saved to migration-report.json`);
    
  } catch(e) {
    console.error('Fatal Error:', e);
  } finally {
    process.exit(0);
  }
});
