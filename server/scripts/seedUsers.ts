import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../src/models/user.model';
import { env } from '../src/config/env';

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to DB');

    await User.deleteMany({ email: { $in: ['sk0990670@gmail.com', 'solosahej@gmail.com'] } });

    await User.create([
      {
        name: 'Admin',
        email: 'sk0990670@gmail.com',
        password: '91Saymyname',
        role: 'admin',
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Solo Sahej',
        email: 'solosahej@gmail.com',
        password: '91Saymyname',
        role: 'customer',
        isVerified: true,
        isActive: true,
      }
    ]);

    console.log('Users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
