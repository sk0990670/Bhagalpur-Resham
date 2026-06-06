import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { artisanRepository } from '../models/artisan.model';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function extractPublicId(url: string): Promise<string | null> {
  if (!url) return null;
  const matches = url.match(/\/v\d+\/(.+?)\.[a-z]+$/i);
  return matches ? matches[1] : null;
}

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bhagalpur-resham');
  console.log('Connected.');

  try {
    const artisans = await artisanRepository.find({});
    console.log(`Found ${artisans.length} artisans to process.`);

    for (const artisan of artisans) {
      console.log(`\nMigrating Artisan: ${artisan.name} (ID: ${artisan.artisanId})`);
      
      const doc = artisan.toObject() as any;
      const existingImageUrl = doc.photo || doc.image;
      
      if (existingImageUrl) {
        const publicId = await extractPublicId(existingImageUrl);
        
        if (publicId) {
          const newPublicId = `bhagalpur-resham/artisans/${artisan.artisanId}`;
          
          if (publicId !== newPublicId) {
            console.log(`  Renaming Cloudinary Asset: ${publicId} -> ${newPublicId}`);
            try {
              const result = await cloudinary.uploader.rename(publicId, newPublicId, { overwrite: true });
              artisan.image = result.secure_url;
              console.log(`    Success: ${result.secure_url}`);
            } catch (err: any) {
              if (err.http_code === 404) {
                 console.log(`    Warning: Cloudinary asset ${publicId} not found. Retaining old URL or falling back.`);
                 artisan.image = existingImageUrl;
              } else {
                 console.error(`    Failed to rename asset:`, err);
              }
            }
          } else {
            console.log(`  Asset already in correct location.`);
            artisan.image = existingImageUrl;
          }
        } else {
          artisan.image = existingImageUrl;
        }
      } else {
         console.log(`  No existing image. Falling back to default.`);
         // We do not store the default image in the DB, we just leave it undefined so the frontend handles the fallback, or we can store it.
         // Wait, the prompt says "If no image exists: Use default fallback image." 
         // Let's leave it undefined and rely on frontend fallback to avoid storing `/assets/default-artisan.webp` hardcoded.
         artisan.image = undefined;
      }
      
      // We must explicitly unset `photo` if it exists.
      await artisanRepository.updateOne(
        { _id: artisan._id },
        { 
          $set: { image: artisan.image },
          $unset: { photo: "", profileImage: "", workshopImage: "", galleryImage: "" }
        }
      );
      console.log(`  Updated MongoDB for ${artisan.artisanId}.`);
    }

    console.log('\nMigration Complete.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
