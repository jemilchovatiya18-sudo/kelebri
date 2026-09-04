import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.model';
import { Category, CategoryType } from '../models/Category.model';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kelebri_db';

const defaultCategories: Array<{ name: string; slug: string; type: CategoryType; imageUrl: string; sortOrder: number }> = [
  { name: 'Rings', slug: 'rings', type: 'JEWELRY', imageUrl: '/images/categories/rings.jpg', sortOrder: 1 },
  { name: 'Earrings', slug: 'earrings', type: 'JEWELRY', imageUrl: '/images/categories/earrings.jpg', sortOrder: 2 },
  { name: 'Pendants', slug: 'pendants', type: 'JEWELRY', imageUrl: '/images/categories/pendants.jpg', sortOrder: 3 },
  { name: 'Bracelets & Bangles', slug: 'bracelets-bangles', type: 'JEWELRY', imageUrl: '/images/categories/bracelets.jpg', sortOrder: 4 },
  { name: 'Necklaces', slug: 'necklaces', type: 'JEWELRY', imageUrl: '/images/categories/necklace.jpg', sortOrder: 5 },
  { name: 'Tennis Collection', slug: 'tennis-collection', type: 'JEWELRY', imageUrl: '/images/categories/tennis.jpg', sortOrder: 6 },
  { name: 'Lab Grown Diamonds', slug: 'lab-grown-diamonds', type: 'DIAMOND', imageUrl: '/images/categories/lab-grown.jpg', sortOrder: 7 },
  { name: 'Natural Diamonds', slug: 'natural-diamonds', type: 'DIAMOND', imageUrl: '/images/categories/natural.jpg', sortOrder: 8 },
  { name: 'Moissanite', slug: 'moissanite', type: 'DIAMOND', imageUrl: '/images/categories/lab-grown.jpg', sortOrder: 9 },
  { name: 'Custom Jewelry', slug: 'custom-jewelry', type: 'CUSTOM', imageUrl: '/images/categories/necklace.jpg', sortOrder: 10 },
];

export const ensureCategoriesExist = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) return;
    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
      }
    }
  } catch (error) {
    console.error('⚠️ Category auto-seeding warning:', error);
  }
};

export const ensureAdminsExist = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) return;

    // 1. Primary admin account
    const defaultAdmin = await Admin.findOne({ email: 'admin@kelebri.com' });
    if (!defaultAdmin) {
      const passwordHash = await bcrypt.hash('Kelebri@Admin2024', 12);
      await Admin.create({ email: 'admin@kelebri.com', passwordHash, name: 'Admin' });
      console.log('✅ Default admin created: admin@kelebri.com / Kelebri@Admin2024');
    }

    // 2. Second admin account (jemilchovatiya18@gmail.com)
    const secondAdminEmails = ['jemilchovatiya18@gmail.com', 'jemilchovatiya18gmail.com'];
    const secondAdminHash = await bcrypt.hash('123456789', 12);
    for (const email of secondAdminEmails) {
      const existing = await Admin.findOne({ email });
      if (!existing) {
        await Admin.create({ email, passwordHash: secondAdminHash, name: 'Jemil Chovatiya' });
        console.log(`✅ Admin created: ${email} / 123456789`);
      } else {
        existing.passwordHash = secondAdminHash;
        await existing.save();
      }
    }
  } catch (error) {
    console.error('⚠️ Admin auto-seeding warning:', error);
  }
};

let isConnecting = false;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return;
  if (isConnecting) return;
  isConnecting = true;

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
    await ensureAdminsExist();
    await ensureCategoriesExist();
  } catch (error) {
    console.warn('⚠️ MongoDB connection warning:', (error as Error).message);
  } finally {
    isConnecting = false;
  }
};

export default connectDB;
