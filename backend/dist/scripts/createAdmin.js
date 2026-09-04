"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_model_1 = require("../models/Admin.model");
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kelebri_db';
const createAdmin = async () => {
    console.log(' Connecting to MongoDB...');
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log(` Connected to: ${mongoose_1.default.connection.host}`);
        const emails = ['jemilchovatiya18@gmail.com', 'jemilchovatiya18gmail.com'];
        const password = '123456789';
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        for (const email of emails) {
            const existing = await Admin_model_1.Admin.findOne({ email });
            if (existing) {
                existing.passwordHash = passwordHash;
                await existing.save();
                console.log(` Admin user password updated for ${email}`);
            }
            else {
                await Admin_model_1.Admin.create({
                    email,
                    passwordHash,
                    name: 'Jemil Chovatiya',
                });
                console.log(` Admin user created for ${email}`);
            }
        }
        console.log('\n Admin user setup completed successfully!\n');
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error(' Admin setup failed:', error);
        process.exit(1);
    }
};
createAdmin();
//# sourceMappingURL=createAdmin.js.map