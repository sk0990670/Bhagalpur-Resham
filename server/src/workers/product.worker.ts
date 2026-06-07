import { Worker, Job } from 'bullmq';
import { createValkeyConnection, valkeyClient } from '../config/valkey';
import { cloudinary } from '../config/cloudinary';
import { productRepository } from '../repositories/product.repository';
import slugify from 'slugify';
import { CreateProductInput, UpdateProductInput } from '../validations/product.validation';
import { IProductImages } from '../models/product.model';

interface ProcessProductJob {
  productData: CreateProductInput;
  tempImages: Array<{ tempId: string, shotType: 'fullBody' | 'closeup' | 'micro' }>;
}

interface UpdateProductJob {
  productId: string;
  productSku: string;
  productData: UpdateProductInput;
  imageUpdates: Array<{ type: 'keep' | 'new', tempId?: string, shotType: 'fullBody' | 'closeup' | 'micro' }>;
  existingImages: IProductImages;
}

export const productWorker = new Worker<any>(
  'product-queue',
  async (job: Job<any>) => {
    if (job.name === 'process-product') {
      console.log(`[Worker] Processing product creation job ${job.id}...`);
      const { productData, tempImages } = job.data as ProcessProductJob;

      // 1. Fetch temp images from Valkey and upload to Cloudinary
      const images: Record<string, string> = {};
      const prefix = productData.sku.split('-')[0];
      const folderPath = `bhagalpur-resham/products/${prefix}/${productData.sku}`;
      const PUBLIC_ID_MAP: Record<string, string> = { fullBody: 'full-body', closeup: 'closeup', micro: 'micro' };

      for (let i = 0; i < tempImages.length; i++) {
        const { tempId, shotType } = tempImages[i];
        const imageDataStr = await valkeyClient.get(`temp_image:${tempId}`);
        
        if (!imageDataStr) {
          throw new Error(`Temp image ${tempId} not found or expired in Valkey`);
        }

        const { data } = JSON.parse(imageDataStr);
        const buffer = Buffer.from(data, 'base64');

        console.log(`[Worker] Uploading image ${shotType} to Cloudinary...`);
        
        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: folderPath,
              public_id: PUBLIC_ID_MAP[shotType],
              overwrite: true,
              invalidate: true,
              resource_type: 'image',
              format: 'webp'
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        images[shotType] = result.secure_url;
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
      
      // Clear Valkey cache
      const keys = await valkeyClient.keys('*');
      for (const key of keys) {
        if (key.includes('product') || key.includes('inventory') || key.includes('featured') || key.includes('category')) {
          await valkeyClient.del(key);
        }
      }
      console.log(`[Worker] Cache cleared for ${job.id}`);
      
    } else if (job.name === 'update-product') {
      console.log(`[Worker] Processing product update job ${job.id}...`);
      const { productId, productSku, productData, imageUpdates, existingImages } = job.data as UpdateProductJob;

      const finalImages: Record<string, string> = { ...existingImages };
      const prefix = productSku.split('-')[0];
      const folderPath = `bhagalpur-resham/products/${prefix}/${productSku}`;
      const PUBLIC_ID_MAP: Record<string, string> = { fullBody: 'full-body', closeup: 'closeup', micro: 'micro' };

      // Process new images
      for (let i = 0; i < imageUpdates.length; i++) {
        const update = imageUpdates[i];
        if (update.type === 'new' && update.tempId) {
          const tempId = update.tempId;
          const imageDataStr = await valkeyClient.get(`temp_image:${tempId}`);
          
          if (!imageDataStr) {
            console.error(`[Worker] Temp image ${tempId} not found or expired in Valkey`);
            continue;
          }

          const { data } = JSON.parse(imageDataStr);
          const buffer = Buffer.from(data, 'base64');

          console.log(`[Worker] Uploading new image ${update.shotType} to Cloudinary...`);
          const result: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { 
                folder: folderPath,
                public_id: PUBLIC_ID_MAP[update.shotType],
                overwrite: true,
                invalidate: true,
                resource_type: 'image',
                format: 'webp'
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );
            uploadStream.end(buffer);
          });

          finalImages[update.shotType] = result.secure_url;
          await valkeyClient.del(`temp_image:${tempId}`);
        }
      }

      // Delete discarded images
      for (const shot of ['fullBody', 'closeup', 'micro'] as const) {
        const existsInUpdates = imageUpdates.find(u => u.shotType === shot);
        if (!existsInUpdates && finalImages[shot]) {
          console.log(`[Worker] Deleting discarded image ${shot} from Cloudinary...`);
          try {
            await cloudinary.uploader.destroy(`${folderPath}/${PUBLIC_ID_MAP[shot]}`);
          } catch (err) {
            console.error(`[Worker] Failed to delete image ${shot} from Cloudinary`, err);
          }
          delete finalImages[shot];
        }
      }

      // Update product in DB
      console.log(`[Worker] Images processed. Updating product in MongoDB...`);
      await productRepository.updateById(productId, {
        ...productData,
        images: finalImages
      } as any);

      console.log(`[Worker] Successfully processed update product job ${job.id}!`);

      // Clear Valkey cache
      const keys = await valkeyClient.keys('*');
      for (const key of keys) {
        if (key.includes('product') || key.includes('inventory') || key.includes('featured') || key.includes('category')) {
          await valkeyClient.del(key);
        }
      }
      console.log(`[Worker] Cache cleared for ${job.id}`);
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
