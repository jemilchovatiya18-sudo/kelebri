import { Request, Response } from 'express';
import { categories, generateId } from '../data/mockData';
import { AuthRequest } from '../middleware/auth.middleware';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const sortedCategories = [...categories].sort((a, b) => {
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return a.sortOrder - b.sortOrder;
    });
    res.json({ success: true, data: sortedCategories });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = categories.find((c) => c.slug === req.params.slug);
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
    
    if (categories.some((c) => c.slug === slug)) {
      res.status(409).json({ success: false, message: 'Category slug already exists' });
      return;
    }

    const category = {
      id: generateId(),
      name,
      slug,
      type: type || 'JEWELRY',
      imageUrl,
      publicId,
      sortOrder: sortOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    categories.push(category);
    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    categories[index] = { ...categories[index], ...req.body, updatedAt: new Date() };
    res.json({ success: true, data: categories[index] });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories.splice(index, 1);
    }
    res.json({ success: true, message: 'Category deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
