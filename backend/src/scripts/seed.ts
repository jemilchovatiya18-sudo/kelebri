/**
 * Seed Script — run once to populate MongoDB with default data.
 * Usage: npx ts-node src/scripts/seed.ts
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.model';
import { Category, CategoryType } from '../models/Category.model';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kelebri_db';

const defaultCategories: Array<{ name: string; slug: string; type: CategoryType; sortOrder: number }> = [
  { name: 'Rings', slug: 'rings', type: 'JEWELRY', sortOrder: 1 },
  { name: 'Earrings', slug: 'earrings', type: 'JEWELRY', sortOrder: 2 },
  { name: 'Pendants', slug: 'pendants', type: 'JEWELRY', sortOrder: 3 },
  { name: 'Bracelets & Bangles', slug: 'bracelets-bangles', type: 'JEWELRY', sortOrder: 4 },
  { name: 'Necklaces', slug: 'necklaces', type: 'JEWELRY', sortOrder: 5 },
  { name: 'Tennis Collection', slug: 'tennis-collection', type: 'JEWELRY', sortOrder: 6 },
  { name: 'Lab Grown Diamonds', slug: 'lab-grown-diamonds', type: 'DIAMOND', sortOrder: 7 },
  { name: 'Natural Diamonds', slug: 'natural-diamonds', type: 'DIAMOND', sortOrder: 8 },
  { name: 'Moissanite', slug: 'moissanite', type: 'DIAMOND', sortOrder: 9 },
  { name: 'Custom Jewelry', slug: 'custom-jewelry', type: 'CUSTOM', sortOrder: 10 },
];

const seed = async () => {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log(`✅ Connected to: ${mongoose.connection.host}`);

  // ── Seed Admin Accounts ───────────────────────────────────────
  const defaultAdmin = await Admin.findOne({ email: 'admin@kelebri.com' });
  if (!defaultAdmin) {
    const passwordHash = await bcrypt.hash('Kelebri@Admin2024', 12);
    await Admin.create({ email: 'admin@kelebri.com', passwordHash, name: 'Admin' });
    console.log('✅ Default admin created: admin@kelebri.com / Kelebri@Admin2024');
  } else {
    console.log('ℹ️  Default admin already exists — skipping');
  }

  const secondAdminEmails = ['jemilchovatiya18@gmail.com', 'jemilchovatiya18gmail.com'];
  const secondAdminHash = await bcrypt.hash('123456789', 12);
  for (const email of secondAdminEmails) {
    const existing = await Admin.findOne({ email });
    if (!existing) {
      await Admin.create({ email, passwordHash: secondAdminHash, name: 'Jemil Chovatiya' });
      console.log(`✅ Second admin created: ${email} / 123456789`);
    } else {
      existing.passwordHash = secondAdminHash;
      await existing.save();
      console.log(`ℹ️  Second admin already exists — updated password for ${email}`);
    }
  }

  // ── Seed Categories ───────────────────────────────────────────
  let categoriesCreated = 0;
  for (const cat of defaultCategories) {
    const exists = await Category.findOne({ slug: cat.slug });
    if (!exists) {
      await Category.create(cat);
      categoriesCreated++;
    }
  }
  console.log(`✅ ${categoriesCreated} categories seeded (${defaultCategories.length - categoriesCreated} already existed)`);

  console.log('\n🎉 Seed complete! You can now start the server.\n');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
