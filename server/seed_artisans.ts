import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(__dirname, '../.env') });

import { artisanRepository } from './src/models/artisan.model';
import { Order } from './src/models/order.model';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bhagalpur_resham';

const artisans = [
  {
    artisanId: 'ART-001',
    name: 'Rahul Weaver',
    phone: '+91 9876543001',
    email: 'rahul.weaver@example.com',
    location: 'Nathnagar, Bhagalpur',
    experience: 12,
    specialization: ['Tussar Silk', 'Dyeing', 'Handloom'],
    status: 'available',
    maxCapacity: 4,
    activeOrders: 0,
    completedOrders: 85,
    averageCompletionTime: 10,
    qualityRating: 4.8,
    earnings: 320000
  },
  {
    artisanId: 'ART-002',
    name: 'Laksham Das',
    phone: '+91 9876543002',
    email: 'laksham.das@example.com',
    location: 'Champanagar, Bhagalpur',
    experience: 25,
    specialization: ['Matka Silk', 'Madhubani Weaving'],
    status: 'busy',
    maxCapacity: 5,
    activeOrders: 0,
    completedOrders: 310,
    averageCompletionTime: 14,
    qualityRating: 4.9,
    earnings: 950000
  },
  {
    artisanId: 'ART-003',
    name: 'Anjali Devi',
    phone: '+91 9876543210',
    email: 'anjali.d@example.com',
    location: 'Nathnagar, Bhagalpur',
    experience: 15,
    specialization: ['Tussar Silk', 'Madhubani Weaving'],
    status: 'available',
    maxCapacity: 3,
    activeOrders: 0,
    completedOrders: 142,
    averageCompletionTime: 12,
    qualityRating: 4.9,
    earnings: 450000
  },
  {
    artisanId: 'ART-004',
    name: 'Sita Ram Weavers Group',
    phone: '+91 9876543212',
    email: 'sitaram@example.com',
    location: 'Kharik, Bhagalpur',
    experience: 8,
    specialization: ['Linen Silk', 'Handloom'],
    status: 'available',
    maxCapacity: 10,
    activeOrders: 0,
    completedOrders: 56,
    averageCompletionTime: 15,
    qualityRating: 4.5,
    earnings: 120000
  }
];

const seedArtisans = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await artisanRepository.deleteMany({});
    console.log('Cleared existing artisans');

    const insertedArtisans = await artisanRepository.insertMany(artisans);
    console.log('Seeded real artisans successfully: Rahul and Laksham included.');

    // We can also try to fix any broken order assignments if needed
    // But since order IDs were strings and now ObjectId, we might need to reset active orders or migrate them.
    // For now, this just seeds the artisans.

  } catch (error) {
    console.error('Error seeding artisans:', error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
};

seedArtisans();
