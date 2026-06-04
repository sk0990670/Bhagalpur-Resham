import { Worker, Job } from 'bullmq';
import { createValkeyConnection, valkeyClient } from '../config/valkey';
import { cloudinary } from '../config/cloudinary';
import { productRepository } from '../repositories/product.repository';
import slugify from 'slugify';
import { CreateProductInput, UpdateProductInput } from '../validations/product.validation';
import { IProductImage } from '../models/product.model';

interface ProcessProductJob {
  productData: CreateProductInput;
  tempImages: Array<{ tempId: string, shotType: 'full_body' | 'close_up' | 'micro' }>;
}

interface UpdateProductJob {
  productId: string;
  productData: UpdateProductInput;
  imageUpdates: Array<{ type: 'keep' | 'new', publicId?: string, tempId?: string, shotType: 'full_body' | 'close_up' | 'micro' }>;
  existingImages: IProductImage[];
}

export const productWorker = new Worker<any>(
  'product-queue',
  async (job: Job<any>) => {
    if (job.name === 'process-product') {
      console.log(`[Worker] Processing product creation job ${job.id}...`);
      const { productData, tempImages } = job.data as ProcessProductJob;

      // 1. Fetch temp images from Valkey and upload to Cloudinary
      const images = [];
      for (let i = 0; i < tempImages.length; i++) {
        const { tempId, shotType } = tempImages[i];
        const imageDataStr = await valkeyClient.get(`temp_image:${tempId}`);
        
        if (!imageDataStr) {
          throw new Error(`Temp image ${tempId} not found or expired in Valkey`);
        }

        const { data } = JSON.parse(imageDataStr);
        const buffer = Buffer.from(data, 'base64');

        console.log(`[Worker] Uploading image ${i + 1}/${tempImages.length} to Cloudinary...`);
        
        // Upload memory buffer to Cloudinary
        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'bhagalpur-resham/products' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        images.push({
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: shotType === 'full_body', // Keep isPrimary for storefront backward compatibility
          shotType,
        });

        // Cleanup temp image from Valkey
        await valkeyClient.del(`temp_image:${tempId}`);
      }

      // 2. Save the final Product record to MongoDB
      console.log(`[Worker] Images uploaded. Saving product to MongoDB...`);
      const slug = slugify(productData.name, { lower: true, strict: true });
      
      await productRepository.create({
        ...productData,
        slug,
        images
      } as any);

      console.log(`[Worker] Successfully processed product job ${job.id}!`);
      
    } else if (job.name === 'update-product') {
      console.log(`[Worker] Processing product update job ${job.id}...`);
      const { productId, productData, imageUpdates, existingImages } = job.data as UpdateProductJob;

      const finalImages = [];
      const publicIdsToKeep = new Set<string>();

      // Process new images and retain kept images
      for (let i = 0; i < imageUpdates.length; i++) {
        const update = imageUpdates[i];
        if (update.type === 'keep' && update.publicId) {
          const existingImg = existingImages.find((img: IProductImage) => img.publicId === update.publicId);
          if (existingImg) {
            finalImages.push({
              url: existingImg.url,
              publicId: existingImg.publicId,
              isPrimary: update.shotType === 'full_body',
              shotType: update.shotType,
            });
            publicIdsToKeep.add(update.publicId);
          }
        } else if (update.type === 'new' && update.tempId) {
          const tempId = update.tempId;
          const imageDataStr = await valkeyClient.get(`temp_image:${tempId}`);
          
          if (!imageDataStr) {
            console.error(`[Worker] Temp image ${tempId} not found or expired in Valkey`);
            continue;
          }

          const { data } = JSON.parse(imageDataStr);
          const buffer = Buffer.from(data, 'base64');

          console.log(`[Worker] Uploading new image for update to Cloudinary...`);
          const result: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'bhagalpur-resham/products' },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );
            uploadStream.end(buffer);
          });

          finalImages.push({
            url: result.secure_url,
            publicId: result.public_id,
            isPrimary: update.shotType === 'full_body',
            shotType: update.shotType,
          });

          await valkeyClient.del(`temp_image:${tempId}`);
        }
      }

      // Delete discarded images from Cloudinary
      for (const oldImg of existingImages) {
        if (!publicIdsToKeep.has(oldImg.publicId)) {
          console.log(`[Worker] Deleting old image ${oldImg.publicId} from Cloudinary...`);
          try {
            await cloudinary.uploader.destroy(oldImg.publicId);
          } catch (err) {
            console.error(`[Worker] Failed to delete image ${oldImg.publicId} from Cloudinary`, err);
          }
        }
      }

      // Update product in DB
      console.log(`[Worker] Images processed. Updating product in MongoDB...`);
      await productRepository.updateById(productId, {
        ...productData,
        images: finalImages
      } as any);

      console.log(`[Worker] Successfully processed update product job ${job.id}!`);
    }
  },
  {
    connection: createValkeyConnection() as any,
    concurrency: 5,
  }
);

productWorker.on('failed', (job, err) => {
  console.error(`❌ [Worker] Job ${job?.id} failed:`, err);
});
