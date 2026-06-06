import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Adjust path based on where this runs from
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { Product } from '../models/product.model';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function runMigration() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bhagalpur-resham';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // Find products that still have images array
    // Wait, Mongoose model already has it defined as an object. We might need to bypass mongoose schema typing or use raw db methods if mongoose strict mode gets in the way.
    // Let's use db.collection('products') directly to avoid schema validation errors during fetch
    const collection = mongoose.connection.collection('products');
    
    // Find all products
    const products = await collection.find({}).toArray();
    console.log(`Found ${products.length} products to process.`);

    const PUBLIC_ID_MAP: Record<number, string> = {
      0: 'full-body',
      1: 'closeup',
      2: 'micro'
    };

    let updatedCount = 0;

    for (const product of products) {
      if (Array.isArray(product.images)) {
        console.log(`Migrating Product: ${product.name} (SKU: ${product.sku})`);
        const prefix = product.sku.split('-')[0];
        const newImages: any = {};

        for (let i = 0; i < product.images.length; i++) {
          if (i > 2) break; // Only 3 images max

          const oldImg = product.images[i];
          if (!oldImg || !oldImg.publicId) continue;

          const shotKey = i === 0 ? 'fullBody' : i === 1 ? 'closeup' : 'micro';
          const newPublicId = `products/${prefix}/${product.sku}/${PUBLIC_ID_MAP[i]}`;

          console.log(`  Renaming Cloudinary Asset: ${oldImg.publicId} -> ${newPublicId}`);
          try {
            // Cloudinary rename doesn't need extension for public_id
            const result = await cloudinary.uploader.rename(oldImg.publicId, newPublicId, {
              overwrite: true,
              invalidate: true
            });
            newImages[shotKey] = result.secure_url;
            console.log(`    Success: ${result.secure_url}`);
          } catch (err: any) {
            console.error(`    Failed to rename in Cloudinary:`, err.message);
            // If the rename failed because it doesn't exist or is already moved, we might just keep the old url, but let's try to assume it's already there
            // Usually, Cloudinary throws 'Resource not found' if already moved.
            if (err.message.includes('not found')) {
              // Construct new URL manually just in case
               // url format: https://res.cloudinary.com/.../image/upload/v1234/products/PREFIX/SKU/full-body
               // But it's risky. Let's just keep the old URL if rename fails so we don't break the frontend.
               newImages[shotKey] = oldImg.url;
            }
          }
        }

        // Update document
        console.log(`  Updating MongoDB for ${product.sku}...`);
        await collection.updateOne(
          { _id: product._id },
          { $set: { images: newImages } }
        );
        updatedCount++;
      } else {
        console.log(`Skipping Product: ${product.name} (Already migrated)`);
      }
    }

    console.log(`Migration Complete. Updated ${updatedCount} products.`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

runMigration();
