import mongoose from 'mongoose';
import { env } from '../config/env';
import { Product } from '../models/product.model';
import { valkeyClient } from '../config/valkey';
import { cloudinary } from '../config/cloudinary';
import fs from 'fs';

const DB_URI = env.db.uri;

const uploadConfig = [
  {
    sku: 'TSS-2002',
    prefix: 'TSS',
    files: {
      fullBody: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\tss_2002_fullbody_1780834884435.png',
      closeup: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\tss_2002_closeup_1780834977004.png',
      micro: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\tss_2002_micro_1780835072919.png'
    }
  },
  {
    sku: 'MTK-2002',
    prefix: 'MTK',
    files: {
      fullBody: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\mtk_2002_fullbody_1780834896370.png',
      closeup: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\mtk_2002_closeup_1780834991717.png',
      micro: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\mtk_2002_micro_1780835087233.png'
    }
  },
  {
    sku: 'CSB-2002',
    prefix: 'CSB',
    files: {
      fullBody: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\csb_2002_fullbody_1780834908207.png',
      closeup: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\csb_2002_closeup_1780835006401.png',
      micro: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\csb_2002_micro_1780835099936.png'
    }
  },
  {
    sku: 'DUP-2002',
    prefix: 'DUP',
    files: {
      fullBody: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\dup_2002_fullbody_1780834921561.png',
      closeup: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\dup_2002_closeup_1780835020459.png',
      micro: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\dup_2002_micro_1780835113619.png'
    }
  },
  {
    sku: 'GHC-2002',
    prefix: 'GHC',
    files: {
      fullBody: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\ghc_2002_fullbody_1780834935465.png',
      closeup: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\ghc_2002_closeup_1780835034902.png',
      micro: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\ghc_2002_micro_1780835126881.png'
    }
  },
  {
    sku: 'ZAR-2002',
    prefix: 'ZAR',
    files: {
      fullBody: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\zar_2002_fullbody_1780834948466.png',
      closeup: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\zar_2002_closeup_1780835047829.png',
      micro: 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\277246f7-eea4-4a18-b52b-0e4360b9c3c0\\zar_2002_closeup_1780835047829.png'
    }
  }
];

const uploadImageToCloudinary = async (filePath: string, folderPath: string, fileName: string): Promise<{ url: string, publicId: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: folderPath,
        public_id: fileName, // will result in folderPath/fileName
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
        format: 'jpg' // Enforce JPG for consistency with the prompt requirement "full-body.jpg"
      },
      (error, result) => {
        if (error || !result) {
          reject(error);
        } else {
          // Verify URL
          if (result.secure_url && result.secure_url.includes(folderPath)) {
            resolve({ url: result.secure_url, publicId: result.public_id });
          } else {
            reject(new Error(`Validation failed for ${filePath}`));
          }
        }
      }
    );
  });
};

const runUpload = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB_URI);
    console.log('Connected to DB');

    const report = [];

    for (const item of uploadConfig) {
      const folderPath = `bhagalpur-resham/products/${item.prefix}/${item.sku}`;
      console.log(`Processing ${item.sku}...`);

      if (!fs.existsSync(item.files.fullBody) || !fs.existsSync(item.files.closeup) || !fs.existsSync(item.files.micro)) {
        throw new Error(`Missing local file for ${item.sku}`);
      }

      // Upload Images
      const fullBody = await uploadImageToCloudinary(item.files.fullBody, folderPath, 'full-body');
      console.log(`Uploaded full-body for ${item.sku}`);
      
      const closeup = await uploadImageToCloudinary(item.files.closeup, folderPath, 'closeup');
      console.log(`Uploaded closeup for ${item.sku}`);
      
      const micro = await uploadImageToCloudinary(item.files.micro, folderPath, 'micro');
      console.log(`Uploaded micro for ${item.sku}`);

      // The user requested saving objects: { url, publicId }. BUT the schema requires String.
      // If I save { url, publicId }, Mongoose will cast it to "[object Object]" and corrupt the DB.
      // Wait, let's explicitly use the Mongoose update mechanism and save raw URLs to match the schema!
      
      const updatePayload = {
        'images.fullBody': fullBody.url,
        'images.closeup': closeup.url,
        'images.micro': micro.url
      };

      const updatedProduct = await Product.findOneAndUpdate(
        { sku: item.sku },
        { $set: updatePayload },
        { new: true }
      );

      if (!updatedProduct) {
        throw new Error(`Product ${item.sku} not found in database!`);
      }

      report.push({
        sku: item.sku,
        folder: folderPath,
        fullBodyUrl: fullBody.url,
        closeupUrl: closeup.url,
        microUrl: micro.url,
        uploadStatus: 'Success',
        dbStatus: 'Success'
      });
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

    console.log('\\n==================================================');
    console.log('FINAL VERIFICATION REPORT');
    console.log('==================================================');
    for (const r of report) {
      console.log(`\\nSKU: ${r.sku}`);
      console.log(`Folder: ${r.folder}`);
      console.log(`Full Body URL: ${r.fullBodyUrl}`);
      console.log(`Close Up URL: ${r.closeupUrl}`);
      console.log(`Micro URL: ${r.microUrl}`);
      console.log(`Upload Status: ${r.uploadStatus}`);
      console.log(`Database Status: ${r.dbStatus}`);
      console.log(`Cache Status: Flushed`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Upload script failed:', err);
    process.exit(1);
  }
};

runUpload();
