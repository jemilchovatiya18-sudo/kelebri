"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.ensureAdminsExist = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_model_1 = require("../models/Admin.model");
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kelebri_db';
const ensureAdminsExist = async () => {
    try {
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
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log(`✅ MongoDB connected: ${mongoose_1.default.connection.host}`);
        await (0, exports.ensureAdminsExist)();
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
    }
};
exports.connectDB = connectDB;
exports.default = exports.connectDB;
//# sourceMappingURL=db.js.map