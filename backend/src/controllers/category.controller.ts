import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category } from '../models/Category.model';
import { categories as mockCategories } from '../data/mockData';
import { AuthRequest } from '../middleware/auth.middleware';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const cats = await Category.find().sort({ type: 1, sortOrder: 1 });
      if (cats && cats.length > 0) {
        res.json({ success: true, data: cats });
        return;
      }
    }
    res.json({ success: true, data: mockCategories });
  } catch (error) {
    console.warn('getCategories warning, using fallback:', error);
    res.json({ success: true, data: mockCategories });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    if (mongoose.connection.readyState === 1) {
      const category = await Category.findOne({ slug });
      if (category) {
        res.json({ success: true, data: category });
        return;
      }
    }
    const mockCat = mockCategories.find((c) => c.slug === slug);
    if (!mockCat) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    res.json({ success: true, data: mockCat });
  } catch (error) {
    console.warn('getCategoryBySlug error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, type, imageUrl, publicId, sortOrder } = req.body;

    if (mongoose.connection.readyState === 1) {
      const existing = await Category.findOne({ slug });
      if (existing) {
        res.status(409).json({ success: false, message: 'Category slug already exists' });
        return;
      }

      const category = new Category({
        name,
        slug,
        type: type || 'JEWELRY',
        imageUrl,
        publicId,
        sortOrder: sortOrder || 0,
      });

      await category.save();
      res.status(201).json({ success: true, data: category });
      return;
    }

    const newCat = {
      id: 'cat_' + Date.now(),
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: type || 'JEWELRY',
      imageUrl,
      publicId,
      sortOrder: sortOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCategories.push(newCat);
    res.status(201).json({ success: true, data: newCat });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, message: 'Category slug already exists' });
      return;
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const category = await Category.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (category) {
        res.json({ success: true, data: category });
        return;
      }
    }

    const index = mockCategories.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockCategories[index] = { ...mockCategories[index], ...req.body, updatedAt: new Date() };
      res.json({ success: true, data: mockCategories[index] });
      return;
    }

    res.status(404).json({ success: false, message: 'Category not found' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await Category.findByIdAndDelete(id);
    }
    const index = mockCategories.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockCategories.splice(index, 1);
    }
    res.json({ success: true, message: 'Category deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
