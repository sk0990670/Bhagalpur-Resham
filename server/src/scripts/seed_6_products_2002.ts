import mongoose from 'mongoose';
import { env } from '../config/env';
import { Product } from '../models/product.model';
import { valkeyClient } from '../config/valkey';
import { cloudinary } from '../config/cloudinary';

const DB_URI = env.db.uri;
const PLACEHOLDER_IMG_PATH = 'd:\\Course\\MERN\\bhagalpur-resham\\client\\public\\assets\\product-placeholder.webp';

const productsToSeed = [
  {
    name: 'Kashi Heritage Golden Tussar Saree',
    sku: 'TSS-2002',
    description: 'Inspired by the ghats of Kashi, this Pure Tussar Silk Weave features a heavy Zari Patta border and intricate lotus motifs on the pallu. The golden base radiates traditional elegance.',
    price: 24500,
    stock: 10,
    weaveType: 'Pure Tussar Silk Weave',
    weight: 680,
    isActive: true,
    gstPercent: 5,
    careInstructions: 'Dry Clean Only',
    badge: 'Authentic Collection',
    attributes: { color: 'Gold', occasion: 'Festive' },
  },
  {
    name: 'Bengal Jamdani Motif Matka Saree',
    sku: 'MTK-2002',
    description: 'A tribute to Bengal\'s Jamdani art woven on thick Matka Silk. This royal blue drape is adorned with floral motifs and a distinct woven temple border.',
    price: 15800,
    stock: 14,
    weaveType: 'Matka Silk Weave',
    weight: 820,
    isActive: true,
    gstPercent: 5,
    careInstructions: 'Dry Clean Only',
    badge: 'New Arrival',
    attributes: { color: 'Royal Blue', occasion: 'Wedding' },
  },
  {
    name: 'Madhubani Painted Cotton-Silk Saree',
    sku: 'CSB-2002',
    description: 'A breathable Cotton-Silk Bhagalpuri weave featuring traditional Madhubani hand-painted fish and peacock motifs along a striking contrast border.',
    price: 5200,
    stock: 30,
    weaveType: 'Cotton-Silk Bhagalpuri Weave',
    weight: 480,
    isActive: true,
    gstPercent: 5,
    careInstructions: 'Hand Wash Cold',
    badge: 'Best Seller',
    attributes: { color: 'Mehendi Green', occasion: 'Casual' },
  },
  {
    name: 'Regal Crimson Dupion Silk Saree',
    sku: 'DUP-2002',
    description: 'A crisp and lustrous Dupion Silk weave. This deep maroon saree boasts a modern scalloped border and geometric zari patterns across the body.',
    price: 13500,
    stock: 8,
    weaveType: 'Dupion Silk Weave',
    weight: 610,
    isActive: true,
    gstPercent: 5,
    careInstructions: 'Dry Clean Only',
    badge: 'Normal',
    attributes: { color: 'Maroon', occasion: 'Festive' },
  },
  {
    name: 'Tribal Warli Art Ghicha Silk Saree',
    sku: 'GHC-2002',
    description: 'A celebration of tribal heritage. This coarse and rustic Ghicha silk saree in a warm rust tone features authentic Warli art motifs and a solid earthy border.',
    price: 19000,
    stock: 6,
    weaveType: 'Ghicha Silk Weave',
    weight: 710,
    isActive: true,
    gstPercent: 5,
    careInstructions: 'Dry Clean Only',
    badge: 'Authentic Collection',
    attributes: { color: 'Rust', occasion: 'Casual' },
  },
  {
    name: 'Royal Nizam Zari Bhagalpuri Saree',
    sku: 'ZAR-2002',
    description: 'Woven for royalty. This spectacular purple Zari Bhagalpuri weave is heavily infused with metallic threads, featuring traditional Nizam paisley motifs and a dense zari border.',
    price: 38000,
    stock: 4,
    weaveType: 'Zari Bhagalpuri Weave',
    weight: 950,
    isActive: true,
    gstPercent: 5,
    careInstructions: 'Dry Clean Only',
    badge: 'Authentic Collection',
    attributes: { color: 'Purple', occasion: 'Wedding' },
  }
];

const uploadImageToCloudinary = async (filePath: string, folderPath: string, publicId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: folderPath,
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
        format: 'webp' // enforce webp for performance
      },
      (error, result) => {
        if (error || !result) {
          console.error(`Failed to upload ${filePath} to Cloudinary:`, error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
};

const runSeed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB_URI);
    console.log('Connected to DB');

    console.log('Starting seed process for 2002 products with PLACEHOLDER IMAGES...');
    for (const item of productsToSeed) {
      const prefix = item.sku.split('-')[0];
      const folderPath = `bhagalpur-resham/products/${prefix}/${item.sku}`;

      console.log(`Processing ${item.sku}...`);

      const fullBodyUrl = await uploadImageToCloudinary(PLACEHOLDER_IMG_PATH, folderPath, 'full-body');
      const closeupUrl = await uploadImageToCloudinary(PLACEHOLDER_IMG_PATH, folderPath, 'closeup');
      const microUrl = await uploadImageToCloudinary(PLACEHOLDER_IMG_PATH, folderPath, 'micro');

      const productToInsert = {
        name: item.name,
        slug: item.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        description: item.description,
        sku: item.sku,
        price: item.price,
        stock: item.stock,
        weaveType: item.weaveType as any,
        weight: item.weight,
        isActive: item.isActive,
        gstPercent: item.gstPercent,
        careInstructions: item.careInstructions,
        badge: item.badge as any,
        attributes: item.attributes,
        images: {
          fullBody: fullBodyUrl,
          closeup: closeupUrl,
          micro: microUrl
        }
      };

      await Product.create(productToInsert);
      console.log(`Successfully created ${item.sku} and uploaded placeholder images.`);
    }

    console.log('Flushing Valkey Cache...');
    if (valkeyClient.status !== 'ready') {
      await valkeyClient.connect();
    }
    const keys = await valkeyClient.keys('*');
    for (const key of keys) {
      if (key.includes('product') || key.includes('inventory') || key.includes('featured') || key.includes('category')) {
        await valkeyClient.del(key);
      }
    }
    console.log('Valkey cache flushed.');
    await valkeyClient.quit();

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed script failed:', err);
    process.exit(1);
  }
};

runSeed();
