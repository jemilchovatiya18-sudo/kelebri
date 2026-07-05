"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getMe = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mockData_1 = require("../data/mockData");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }
        const admin = mockData_1.admins.find((a) => a.email === email);
        if (!admin) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(password, admin.passwordHash);
        if (!isValid) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ adminId: admin.id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d',
        });
        res.json({
            success: true,
            data: {
                token,
                admin: { id: admin.id, email: admin.email, name: admin.name },
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const admin = mockData_1.admins.find((a) => a.id === req.adminId);
        if (!admin) {
            res.status(404).json({ success: false, message: 'Admin not found' });
            return;
        }
        res.json({
            success: true,
            data: { id: admin.id, email: admin.email, name: admin.name, createdAt: admin.createdAt },
        });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getMe = getMe;
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const adminIndex = mockData_1.admins.findIndex((a) => a.id === req.adminId);
        if (adminIndex === -1) {
            res.status(404).json({ success: false, message: 'Admin not found' });
            return;
        }
        const admin = mockData_1.admins[adminIndex];
        const isValid = await bcryptjs_1.default.compare(currentPassword, admin.passwordHash);
        if (!isValid) {
            res.status(400).json({ success: false, message: 'Current password is incorrect' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        mockData_1.admins[adminIndex].passwordHash = hashedPassword;
        mockData_1.admins[adminIndex].updatedAt = new Date();
        res.json({ success: true, message: 'Password changed successfully' });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map