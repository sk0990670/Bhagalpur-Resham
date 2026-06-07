import mongoose from 'mongoose';
import { cloudinary } from '../config/cloudinary';
import { connectDB } from '../config/db';
import { Product } from '../models/product.model';
import { valkeyClient } from '../config/valkey';
import fs from 'fs';
import path from 'path';

const BRAIN_DIR = 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0';

const uploadToCloudinary = async (localPath: string, folder: string, filename: string) => {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder,
      public_id: filename,
      overwrite: true,
      invalidate: true
    });
    return result.secure_url;
  } catch (err) {
    console.error(`Error uploading ${localPath}:`, err);
    throw err;
  }
};

const productsToSeed = [
  {
    sku: 'TSS-2001',
    weaveType: 'Pure Tussar Silk Weave',
    name: 'Royal Ivory Heritage Tussar Silk Saree',
    occasion: 'Festive',
    price: 22300,
    stock: 12,
    status: 'Active',
    description: 'A luxurious handwoven Pure Tussar Silk Saree in Royal Ivory, showcasing intricate traditional craftsmanship perfect for festive occasions.',
    color: 'White',
    prefix: 'TSS',
    localImages: {
      fullBody: path.join(BRAIN_DIR, 'tss_fullbody_1780827140744.png'),
      closeup: path.join(BRAIN_DIR, 'tss_closeup_1780827161991.png'),
      micro: path.join(BRAIN_DIR, 'tss_micro_1780827182207.png')
    }
  },
  {
    sku: 'MTK-2001',
    weaveType: 'Matka Silk Weave',
    name: 'Cream Temple Border Matka Silk Saree',
    occasion: 'Casual',
    price: 4600,
    stock: 7,
    status: 'Active',
    description: 'Elegant Cream Matka Silk Saree featuring a contrasting temple border, combining traditional heritage with casual comfort.',
    color: 'Cream',
    prefix: 'MTK',
    localImages: {
      fullBody: path.join(BRAIN_DIR, 'mtk_fullbody_1780827241654.png'),
      closeup: path.join(BRAIN_DIR, 'mtk_closeup_1780827258932.png'),
      micro: path.join(BRAIN_DIR, 'mtk_micro_1780827276466.png')
    }
  },
  {
    sku: 'CSB-2001',
    weaveType: 'Cotton-Silk Bhagalpuri Weave',
    name: 'Pure Sky Blue Handloom Cotton-Silk Bhagalpuri Saree',
    occasion: 'Festive',
    price: 8400,
    stock: 9,
    status: 'Active',
    description: 'Breathtaking Sky Blue Cotton-Silk Bhagalpuri Saree, handloomed with meticulous detail for a premium festive experience.',
    color: 'Sky Blue',
    prefix: 'CSB',
    localImages: {
      fullBody: path.join(BRAIN_DIR, 'csb_fullbody_1780827302407.png'),
      closeup: path.join(BRAIN_DIR, 'csb_closeup_1780827315878.png'),
      micro: path.join(BRAIN_DIR, 'csb_micro_1780827328459.png')
    }
  }
];

async function run() {
  await connectDB();
  console.log('Connected to DB');

  let report = '# Product Seeding Report\\n\\n';
  report += '| Product Name | SKU | Cloudinary Folder | Image Count | Database Status | Cache Status |\\n';
  report += '|---|---|---|---|---|---|\\n';

  for (const item of productsToSeed) {
    console.log(`Processing ${item.sku}...`);

    // 1. Delete existing product
    await Product.deleteOne({ sku: item.sku });

    // 2. Upload images
    const folder = `bhagalpur-resham/products/${item.prefix}/${item.sku}`;
    
    console.log(`  Uploading full-body...`);
    const fullBodyUrl = await uploadToCloudinary(item.localImages.fullBody, folder, 'full-body');
    
    console.log(`  Uploading closeup...`);
    const closeupUrl = await uploadToCloudinary(item.localImages.closeup, folder, 'closeup');
    
    console.log(`  Uploading micro...`);
    const microUrl = await uploadToCloudinary(item.localImages.micro, folder, 'micro');

    // 3. Save to DB
    const p = new Product({
      name: item.name,
      slug: item.sku.toLowerCase(),
      sku: item.sku,
      description: item.description,
      price: item.price,
      stock: item.stock,
      weaveType: item.weaveType as any,
      isActive: item.status === 'Active',
      attributes: {
        color: item.color,
        occasion: item.occasion
      },
      images: {
        fullBody: fullBodyUrl,
        closeup: closeupUrl,
        micro: microUrl
      }
    });

    await p.save();
    console.log(`  Saved ${item.sku} to DB!`);
    
    report += `| ${item.name} | ${item.sku} | ${folder} | 3 | Created | Pending |\\n`;
  }

  // 4. Flush Valkey cache
  console.log('Flushing Valkey Cache...');
  if (valkeyClient.status !== 'ready') {
    console.log('Valkey not ready, skipping flush...');
  } else {
    const keys = await valkeyClient.keys('*');
    for (const key of keys) {
      if (key.includes('product') || key.includes('inventory')) {
        await valkeyClient.del(key);
      }
    }
    console.log('Cache flushed.');
  }

  // Update report cache status
  report = report.replace(/Pending/g, 'Flushed');

  fs.writeFileSync(path.join(BRAIN_DIR, 'final_report.md'), report);
  console.log('Report generated at final_report.md');

  await mongoose.disconnect();
  await valkeyClient.quit();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
