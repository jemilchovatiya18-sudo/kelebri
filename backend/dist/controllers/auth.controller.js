"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getMe = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_model_1 = require("../models/Admin.model");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanPassword = String(password).trim();
        const admin = await Admin_model_1.Admin.findOne({ email: cleanEmail });
        if (!admin) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(cleanPassword, admin.passwordHash);
        if (!isValid) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ adminId: admin._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d',
        });
        res.json({
            success: true,
            data: {
                token,
                admin: { id: admin._id, email: admin.email, name: admin.name },
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const admin = await Admin_model_1.Admin.findById(req.adminId).select('-passwordHash');
        if (!admin) {
            res.status(404).json({ success: false, message: 'Admin not found' });
            return;
        }
        res.json({
            success: true,
            data: { id: admin._id, email: admin.email, name: admin.name, createdAt: admin.createdAt },
        });
    }
    catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getMe = getMe;
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await Admin_model_1.Admin.findById(req.adminId);
        if (!admin) {
            res.status(404).json({ success: false, message: 'Admin not found' });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(String(currentPassword).trim(), admin.passwordHash);
        if (!isValid) {
            res.status(400).json({ success: false, message: 'Current password is incorrect' });
            return;
        }
        admin.passwordHash = await bcryptjs_1.default.hash(String(newPassword).trim(), 12);
        await admin.save();
        res.json({ success: true, message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('changePassword error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map