import { Request, Response } from 'express';
import { Category } from '../models/Category.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ type: 1, sortOrder: 1 });
    res.json({ success: true, data: categories });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    res.json({ success: true, data: category });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, type, imageUrl, publicId, sortOrder } = req.body;

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

    const category = await Category.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    res.json({ success: true, data: category });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ success: true, message: 'Category deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
