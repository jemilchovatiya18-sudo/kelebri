import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.model';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kelebri_db';

export const ensureAdminsExist = async (): Promise<void> => {
  try {
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

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
    await ensureAdminsExist();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
};

export default connectDB;
