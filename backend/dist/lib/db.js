"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.ensureAdminsExist = exports.ensureCategoriesExist = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_model_1 = require("../models/Admin.model");
const Category_model_1 = require("../models/Category.model");
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kelebri_db';
const defaultCategories = [
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
const ensureCategoriesExist = async () => {
    try {
        if (mongoose_1.default.connection.readyState !== 1)
            return;
        for (const cat of defaultCategories) {
            const exists = await Category_model_1.Category.findOne({ slug: cat.slug });
            if (!exists) {
                await Category_model_1.Category.create(cat);
            }
        }
    }
    catch (error) {
        console.error('⚠️ Category auto-seeding warning:', error);
    }
};
exports.ensureCategoriesExist = ensureCategoriesExist;
const ensureAdminsExist = async () => {
    try {
        if (mongoose_1.default.connection.readyState !== 1)
            return;
        // 1. Primary admin account
        const defaultAdmin = await Admin_model_1.Admin.findOne({ email: 'admin@kelebri.com' });
        if (!defaultAdmin) {
            const passwordHash = await bcryptjs_1.default.hash('Kelebri@Admin2024', 12);
            await Admin_model_1.Admin.create({ email: 'admin@kelebri.com', passwordHash, name: 'Admin' });
            console.log('✅ Default admin created: admin@kelebri.com / Kelebri@Admin2024');
        }
        // 2. Second admin account (jemilchovatiya18@gmail.com)
        const secondAdminEmails = ['jemilchovatiya18@gmail.com', 'jemilchovatiya18gmail.com'];
        const secondAdminHash = await bcryptjs_1.default.hash('123456789', 12);
        for (const email of secondAdminEmails) {
            const existing = await Admin_model_1.Admin.findOne({ email });
            if (!existing) {
                await Admin_model_1.Admin.create({ email, passwordHash: secondAdminHash, name: 'Jemil Chovatiya' });
                console.log(`✅ Admin created: ${email} / 123456789`);
            }
            else {
                existing.passwordHash = secondAdminHash;
                await existing.save();
            }
        }
    }
    catch (error) {
        console.error('⚠️ Admin auto-seeding warning:', error);
    }
};
exports.ensureAdminsExist = ensureAdminsExist;
let isConnecting = false;
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState === 1)
        return;
    if (isConnecting)
        return;
    isConnecting = true;
    try {
        await mongoose_1.default.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`✅ MongoDB connected: ${mongoose_1.default.connection.host}`);
        await (0, exports.ensureAdminsExist)();
        await (0, exports.ensureCategoriesExist)();
    }
    catch (error) {
        console.warn('⚠️ MongoDB connection warning:', error.message);
    }
    finally {
        isConnecting = false;
    }
};
exports.connectDB = connectDB;
exports.default = exports.connectDB;
//# sourceMappingURL=db.js.map