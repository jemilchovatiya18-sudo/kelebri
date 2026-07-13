import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product.model';
import { Category } from '../models/Category.model';
import { AuthRequest } from '../middleware/auth.middleware';

// Helper to build a slug from a product name
const buildSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      diamondType,
      search,
      bestSeller,
      hero,
      page = '1',
      limit = '20',
    } = req.query;

    const filter: Record<string, any> = {};

    if (diamondType) filter.diamondType = String(diamondType);
    if (bestSeller === 'true') filter.isBestSeller = true;
    if (hero === 'true') filter.isHeroProduct = true;

    // Filter by category slug — look up the category ID first
    if (category) {
      const cat = await Category.findOne({ slug: String(category) });
      if (cat) filter.categoryId = cat._id;
      else filter.categoryId = null; // no match → return empty
    }

    // Full-text search
    if (search) {
      const s = String(search);
      filter.$or = [
        { name: { $regex: s, $options: 'i' } },
        { sku: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { metalType: { $regex: s, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(String(page));
    const limitNum = parseInt(String(limit));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('categoryId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramId = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(paramId)) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    const product = await Product.findById(paramId).populate('categoryId');
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, data: product });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('categoryId');
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Get related products from same category
    const related = await Product.find({
      categoryId: product.categoryId,
      _id: { $ne: product._id },
    })
      .populate('categoryId')
      .limit(4);

    res.json({ success: true, data: { ...product.toObject(), related } });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { images, ...productData } = req.body;

    // Build unique slug
    const baseSlug = buildSlug(productData.name);
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Check SKU uniqueness
    const skuExists = await Product.findOne({ sku: productData.sku });
    if (skuExists) {
      res.status(409).json({ success: false, message: 'SKU already exists' });
      return;
    }

    const productImages = Array.isArray(images)
      ? images.map((img: any, i: number) => ({
          url: img.url,
          publicId: img.publicId,
          isPrimary: i === 0,
          sortOrder: i,
          createdAt: new Date(),
        }))
      : [];

    const product = new Product({
      ...productData,
      slug,
      images: productImages,
    });

    await product.save();
    await product.populate('categoryId');

    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    console.error('❌ Error creating product:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: 'Validation error', details: error.errors });
      return;
    }
    if (error.code === 11000) {
      res.status(409).json({ success: false, message: 'SKU or slug already exists' });
      return;
    }
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const { images, ...productData } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { ...productData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('categoryId');

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, data: product });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Product.findByIdAndDelete(id);
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const toggleProductFlag = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { flag, value } = req.body;

    const allowedFlags = ['isBestSeller', 'isHeroProduct', 'isSoldOut', 'isAvailable', 'showPrice'];
    if (!allowedFlags.includes(flag)) {
      res.status(400).json({ success: false, message: 'Invalid flag' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { [flag]: value, updatedAt: new Date() },
      { new: true }
    ).populate('categoryId');

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, data: product });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addProductImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productId = String(req.params.productId);
    const { url, publicId, isPrimary } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    if (isPrimary) {
      product.images.forEach((img) => { img.isPrimary = false; });
    }

    const newImage = {
      url,
      publicId,
      isPrimary: isPrimary || false,
      sortOrder: product.images.length,
      createdAt: new Date(),
    };

    product.images.push(newImage as any);
    await product.save();

    const addedImage = product.images[product.images.length - 1];
    res.status(201).json({ success: true, data: addedImage });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteProductImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productId = String(req.params.productId);
    const imageId = String(req.params.imageId);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    product.images = product.images.filter(
      (img: any) => img._id.toString() !== imageId
    );
    await product.save();

    res.json({ success: true, message: 'Image deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAdminStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [total, bestSellers, heroProducts, soldOut] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isBestSeller: true }),
      Product.countDocuments({ isHeroProduct: true }),
      Product.countDocuments({ isSoldOut: true }),
    ]);

    res.json({
      success: true,
      data: { total, bestSellers, heroProducts, soldOut },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
