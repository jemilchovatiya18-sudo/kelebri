"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getMe = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const Admin_model_1 = require("../models/Admin.model");
const mockData_1 = require("../data/mockData");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanPassword = String(password).trim();
        let adminUser = null;
        // Try MongoDB query if connected
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                const doc = await Admin_model_1.Admin.findOne({ email: cleanEmail });
                if (doc) {
                    adminUser = {
                        id: doc._id.toString(),
                        email: doc.email,
                        name: doc.name,
                        passwordHash: doc.passwordHash,
                    };
                }
            }
            catch (err) {
                console.warn('MongoDB query warning in login, falling back to mockData:', err);
            }
        }
        // Fallback to mockData if not found in MongoDB or MongoDB offline
        if (!adminUser) {
            const mockAdmin = mockData_1.admins.find((a) => a.email.toLowerCase() === cleanEmail);
            if (mockAdmin) {
                adminUser = {
                    id: mockAdmin.id,
                    email: mockAdmin.email,
                    name: mockAdmin.name,
                    passwordHash: mockAdmin.passwordHash,
                };
            }
        }
        if (!adminUser) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(cleanPassword, adminUser.passwordHash);
        if (!isValid) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ adminId: adminUser.id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d',
        });
        res.json({
            success: true,
            data: {
                token,
                admin: { id: adminUser.id, email: adminUser.email, name: adminUser.name },
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
        let adminUser = null;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                const doc = await Admin_model_1.Admin.findById(req.adminId).select('-passwordHash');
                if (doc) {
                    adminUser = {
                        id: doc._id.toString(),
                        email: doc.email,
                        name: doc.name,
                        createdAt: doc.createdAt,
                    };
                }
            }
            catch (err) {
                console.warn('MongoDB query warning in getMe:', err);
            }
        }
        if (!adminUser) {
            const mockAdmin = mockData_1.admins.find((a) => a.id === req.adminId);
            if (mockAdmin) {
                adminUser = {
                    id: mockAdmin.id,
                    email: mockAdmin.email,
                    name: mockAdmin.name,
                    createdAt: mockAdmin.createdAt,
                };
            }
        }
        if (!adminUser) {
            res.status(404).json({ success: false, message: 'Admin not found' });
            return;
        }
        res.json({
            success: true,
            data: adminUser,
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
        const cleanCurrent = String(currentPassword).trim();
        const cleanNew = String(newPassword).trim();
        if (mongoose_1.default.connection.readyState === 1) {
            const admin = await Admin_model_1.Admin.findById(req.adminId);
            if (admin) {
                const isValid = await bcryptjs_1.default.compare(cleanCurrent, admin.passwordHash);
                if (!isValid) {
                    res.status(400).json({ success: false, message: 'Current password is incorrect' });
                    return;
                }
                admin.passwordHash = await bcryptjs_1.default.hash(cleanNew, 12);
                await admin.save();
                res.json({ success: true, message: 'Password changed successfully' });
                return;
            }
        }
        const mockAdmin = mockData_1.admins.find((a) => a.id === req.adminId);
        if (mockAdmin) {
            const isValid = await bcryptjs_1.default.compare(cleanCurrent, mockAdmin.passwordHash);
            if (!isValid) {
                res.status(400).json({ success: false, message: 'Current password is incorrect' });
                return;
            }
            mockAdmin.passwordHash = await bcryptjs_1.default.hashSync(cleanNew, 12);
            res.json({ success: true, message: 'Password changed successfully' });
            return;
        }
        res.status(404).json({ success: false, message: 'Admin not found' });
    }
    catch (error) {
        console.error('changePassword error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map