"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Seed Script — run once to populate MongoDB with default data.
 * Usage: npx ts-node src/scripts/seed.ts
 */
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_model_1 = require("../models/Admin.model");
const Category_model_1 = require("../models/Category.model");
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kelebri_db';
const defaultCategories = [
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
    await mongoose_1.default.connect(MONGODB_URI);
    console.log(`✅ Connected to: ${mongoose_1.default.connection.host}`);
    // ── Seed Admin Accounts ───────────────────────────────────────
    const defaultAdmin = await Admin_model_1.Admin.findOne({ email: 'admin@kelebri.com' });
    if (!defaultAdmin) {
        const passwordHash = await bcryptjs_1.default.hash('Kelebri@Admin2024', 12);
        await Admin_model_1.Admin.create({ email: 'admin@kelebri.com', passwordHash, name: 'Admin' });
        console.log('✅ Default admin created: admin@kelebri.com / Kelebri@Admin2024');
    }
    else {
        console.log('ℹ️  Default admin already exists — skipping');
    }
    const secondAdminEmails = ['jemilchovatiya18@gmail.com', 'jemilchovatiya18gmail.com'];
    const secondAdminHash = await bcryptjs_1.default.hash('123456789', 12);
    for (const email of secondAdminEmails) {
        const existing = await Admin_model_1.Admin.findOne({ email });
        if (!existing) {
            await Admin_model_1.Admin.create({ email, passwordHash: secondAdminHash, name: 'Jemil Chovatiya' });
            console.log(`✅ Second admin created: ${email} / 123456789`);
        }
        else {
            existing.passwordHash = secondAdminHash;
            await existing.save();
            console.log(`ℹ️  Second admin already exists — updated password for ${email}`);
        }
    }
    // ── Seed Categories ───────────────────────────────────────────
    let categoriesCreated = 0;
    for (const cat of defaultCategories) {
        const exists = await Category_model_1.Category.findOne({ slug: cat.slug });
        if (!exists) {
            await Category_model_1.Category.create(cat);
            categoriesCreated++;
        }
    }
    console.log(`✅ ${categoriesCreated} categories seeded (${defaultCategories.length - categoriesCreated} already existed)`);
    console.log('\n🎉 Seed complete! You can now start the server.\n');
    await mongoose_1.default.disconnect();
    process.exit(0);
};
seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map