import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      data: {
        token,
        admin: { id: admin._id, email: admin.email, name: admin.name },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = await Admin.findById(req.adminId).select('-passwordHash');

    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    res.json({
      success: true,
      data: { id: admin._id, email: admin.email, name: admin.name, createdAt: admin.createdAt },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    const isValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isValid) {
      res.status(400).json({ success: false, message: 'Current password is incorrect' });
      return;
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 12);
    await admin.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
