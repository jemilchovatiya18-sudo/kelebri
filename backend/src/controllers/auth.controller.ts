import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin.model';
import { admins } from '../data/mockData';
import { AuthRequest } from '../middleware/auth.middleware';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    let adminUser: { id: string; email: string; name: string; passwordHash: string } | null = null;

    // Try MongoDB query if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await Admin.findOne({ email: cleanEmail });
        if (doc) {
          adminUser = {
            id: doc._id.toString(),
            email: doc.email,
            name: doc.name,
            passwordHash: doc.passwordHash,
          };
        }
      } catch (err) {
        console.warn('MongoDB query warning in login, falling back to mockData:', err);
      }
    }

    // Fallback to mockData if not found in MongoDB or MongoDB offline
    if (!adminUser) {
      const mockAdmin = admins.find((a) => a.email.toLowerCase() === cleanEmail);
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

    const isValid = await bcrypt.compare(cleanPassword, adminUser.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ adminId: adminUser.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      data: {
        token,
        admin: { id: adminUser.id, email: adminUser.email, name: adminUser.name },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let adminUser: { id: string; email: string; name: string; createdAt?: Date } | null = null;

    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await Admin.findById(req.adminId).select('-passwordHash');
        if (doc) {
          adminUser = {
            id: doc._id.toString(),
            email: doc.email,
            name: doc.name,
            createdAt: doc.createdAt,
          };
        }
      } catch (err) {
        console.warn('MongoDB query warning in getMe:', err);
      }
    }

    if (!adminUser) {
      const mockAdmin = admins.find((a) => a.id === req.adminId);
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
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const cleanCurrent = String(currentPassword).trim();
    const cleanNew = String(newPassword).trim();

    if (mongoose.connection.readyState === 1) {
      const admin = await Admin.findById(req.adminId);
      if (admin) {
        const isValid = await bcrypt.compare(cleanCurrent, admin.passwordHash);
        if (!isValid) {
          res.status(400).json({ success: false, message: 'Current password is incorrect' });
          return;
        }
        admin.passwordHash = await bcrypt.hash(cleanNew, 12);
        await admin.save();
        res.json({ success: true, message: 'Password changed successfully' });
        return;
      }
    }

    const mockAdmin = admins.find((a) => a.id === req.adminId);
    if (mockAdmin) {
      const isValid = await bcrypt.compare(cleanCurrent, mockAdmin.passwordHash);
      if (!isValid) {
        res.status(400).json({ success: false, message: 'Current password is incorrect' });
        return;
      }
      mockAdmin.passwordHash = await bcrypt.hashSync(cleanNew, 12);
      res.json({ success: true, message: 'Password changed successfully' });
      return;
    }

    res.status(404).json({ success: false, message: 'Admin not found' });
  } catch (error) {
    console.error('changePassword error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
