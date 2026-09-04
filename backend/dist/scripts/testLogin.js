"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mockData_1 = require("../data/mockData");
const testLogin = async (email, pass) => {
    const cleanEmail = email.trim().toLowerCase();
    const mockAdmin = mockData_1.admins.find((a) => a.email.toLowerCase() === cleanEmail);
    if (!mockAdmin) {
        console.log(`❌ Login failed for ${email}: Admin not found`);
        return false;
    }
    const isValid = await bcryptjs_1.default.compare(pass.trim(), mockAdmin.passwordHash);
    if (!isValid) {
        console.log(`❌ Login failed for ${email}: Password incorrect`);
        return false;
    }
    const token = jsonwebtoken_1.default.sign({ adminId: mockAdmin.id }, 'secret', { expiresIn: '7d' });
    console.log(`✅ Login SUCCESS for ${email}! Token generated (${token.substring(0, 20)}...)`);
    return true;
};
const run = async () => {
    console.log('--- Testing Admin 1 ---');
    await testLogin('admin@kelebri.com', 'Kelebri@Admin2024');
    console.log('\n--- Testing Admin 2 ---');
    await testLogin('jemilchovatiya18@gmail.com', '123456789');
};
run();
//# sourceMappingURL=testLogin.js.map