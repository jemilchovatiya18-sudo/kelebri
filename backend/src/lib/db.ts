import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.model';
import { Category, CategoryType } from '../models/Category.model';

const DEFAULT_DB_NAME = 'kelebri_db';

const resolveMongoUri = (): string => {
  const uri = process.env.MONGODB_URI || `mongodb://localhost:27017/${DEFAULT_DB_NAME}`;
  if (!uri.includes('mongodb')) return uri;

  // Atlas/local URIs without a database path default to "test" — normalize to kelebri_db
  const withoutQuery = uri.split('?')[0];
  if (withoutQuery.endsWith('/') || !withoutQuery.split('/').slice(3).join('/')) {
    const base = withoutQuery.replace(/\/+$/, '');
    const query = uri.includes('?') ? uri.slice(uri.indexOf('?')) : '';
    return `${base}/${DEFAULT_DB_NAME}${query}`;
  }

  return uri;
};

const MONGODB_URI = resolveMongoUri();

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

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

    const defaultAdmin = await Admin.findOne({ email: 'admin@kelebri.com' });
    if (!defaultAdmin) {
      const passwordHash = await bcrypt.hash('Kelebri@Admin2024', 12);
      await Admin.create({ email: 'admin@kelebri.com', passwordHash, name: 'Admin' });
      console.log('✅ Default admin created: admin@kelebri.com / Kelebri@Admin2024');
    }

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

export const isDbConnected = (): boolean => mongoose.connection.readyState === 1;

export const getDbStatus = (): {
  connected: boolean;
  readyState: number;
  host?: string;
  database?: string;
} => ({
  connected: isDbConnected(),
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || undefined,
  database: mongoose.connection.name || undefined,
});

export const connectDB = async (): Promise<void> => {
  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Use global cache for Vercel serverless environment
  const cache = global.__mongooseCache ?? { conn: null, promise: null };
  global.__mongooseCache = cache;

  // If connection exists, return
  if (cache.conn) {
    return;
  }

  // If connection promise exists, wait for it
  if (cache.promise) {
    try {
      cache.conn = await cache.promise;
      return;
    } catch (error) {
      // If failed, clear cache and retry
      cache.promise = null;
      cache.conn = null;
    }
  }

  // Create new connection promise
  cache.promise = mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,  // Increased from 10000 for cold starts
      socketTimeoutMS: 45000,            // Added for slow networks
      connectTimeoutMS: 30000,           // Added for initial connection
      bufferCommands: false,
      maxPoolSize: 10,                   // Connection pooling for performance
      minPoolSize: 2,                    // Minimum connections to maintain
    })
    .then(async (connection) => {
      console.log(`✅ MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
      
      // Run seed operations AFTER connection confirmed
      try {
        await ensureAdminsExist();
        await ensureCategoriesExist();
      } catch (seedError) {
        console.warn('⚠️ Seeding warning:', seedError);
      }
      
      return connection;
    })
    .catch((error) => {
      cache.promise = null;
      cache.conn = null;
      console.error('❌ MongoDB connection error:', (error as Error).message);
      throw error;
    });

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.conn = null;
    cache.promise = null;
    throw error;
  }
};

export default connectDB;
