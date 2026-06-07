import mongoose from 'mongoose';
import slugify from 'slugify';
import { connectDB } from '../config/db';
import { Product } from '../models/product.model';

const products = [
  {
    name: 'White Striped Pattern Tussar Silk Saree',
    sku: 'TSS-2001',
    description: 'A stunning white pure tussar silk saree with striped patterns, ideal for festive wear.',
    price: 18500,
    stock: 12,
    weaveType: 'Pure Tussar Silk Weave',
    weight: 650,
    isActive: true,
    isFeatured: true,
    gstPercent: 5,
    attributes: { color: 'White', occasion: 'Festive' },
    careInstructions: 'Dry Clean Only',
    badge: 'New Arrival',
    images: {
      fullBody: 'https://res.cloudinary.com/dmkkta67i/image/upload/v1780768205/bhagalpur-resham/products/TSS/TSS-2001/fullBody.jpg',
      closeup: 'https://res.cloudinary.com/dmkkta67i/image/upload/v1780768211/bhagalpur-resham/products/TSS/TSS-2001/closeup.jpg',
      micro: 'https://res.cloudinary.com/dmkkta67i/image/upload/v1780768222/bhagalpur-resham/products/TSS/TSS-2001/micro.jpg'
    }
  },
  {
    name: 'Cream Temple Border Matka Silk Saree',
    sku: 'MTK-2001',
    description: 'Elegant cream matka silk saree featuring a traditional temple border.',
    price: 9500,
    stock: 8,
    weaveType: 'Matka Silk Weave',
    weight: 600,
    isActive: true,
    isFeatured: false,
    gstPercent: 5,
    attributes: { color: 'Cream', occasion: 'Wedding' },
    careInstructions: 'Dry Clean Only',
    badge: 'Authentic Collection',
    images: {
      fullBody: 'https://res.cloudinary.com/dmkkta67i/image/upload/v1780768217/bhagalpur-resham/products/MTK/MTK-2001/fullBody.jpg',
      closeup: 'https://res.cloudinary.com/dmkkta67i/image/upload/v1780768222/bhagalpur-resham/products/MTK/MTK-2001/closeup.jpg',
      micro: 'https://res.cloudinary.com/dmkkta67i/image/upload/v1780768241/bhagalpur-resham/products/MTK/MTK-2001/micro.jpg'
    }
  },
  {
    name: 'Pure Sky Blue Handloom Cotton-Silk Bhagalpuri Saree',
    sku: 'CSB-2001',
    description: 'Comfortable sky blue cotton-silk bhagalpuri saree, perfect for casual outings.',
    price: 4200,
    stock: 25,
    weaveType: 'Cotton-Silk Bhagalpuri Weave',
    weight: 550,
    isActive: true,
    isFeatured: false,
    gstPercent: 5,
    attributes: { color: 'Sky Blue', occasion: 'Casual' },
    careInstructions: 'Hand Wash in Cold Water',
    badge: 'Normal',
    images: {
      fullBody: 'https://res.cloudinary.com/dmkkta67i/image/upload/v1780768237/bhagalpur-resham/products/CSB/CSB-2001/fullBody.jpg',
      closeup: 'https://res.cloudinary.com/dmkkta67i/image/upload/v1780768239/bhagalpur-resham/products/CSB/CSB-2001/closeup.jpg',
      micro: 'https://res.cloudinary.com/dmkkta67i/image/upload/v1780768241/bhagalpur-resham/products/CSB/CSB-2001/micro.jpg'
    }
  }
];

async function seedProducts() {
  await connectDB();
  console.log('Connected to MongoDB.');

  for (const p of products) {
    const exists = await Product.findOne({ sku: p.sku });
    if (!exists) {
      await Product.create({ ...p, slug: slugify(p.name, { lower: true, strict: true }) } as any);
      console.log(`✅ Created ${p.sku}`);
    } else {
      console.log(`⚠️ ${p.sku} already exists.`);
    }
  }

  mongoose.disconnect();
  console.log('Done!');
}

seedProducts().catch(err => console.error(err));
