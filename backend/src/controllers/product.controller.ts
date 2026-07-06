import { Request, Response } from 'express';
import { products, categories, generateId } from '../data/mockData';
import { AuthRequest } from '../middleware/auth.middleware';

const populateProduct = (product: any) => {
  return {
    ...product,
    category: categories.find((c) => c.id === product.categoryId) || null,
  };
};

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

    let filtered = products.map(populateProduct);

    if (category) {
      filtered = filtered.filter((p) => p.category?.slug === String(category));
    }
    if (diamondType) {
      filtered = filtered.filter((p) => p.diamondType === String(diamondType));
    }
    if (bestSeller === 'true') {
      filtered = filtered.filter((p) => p.isBestSeller);
    }
    if (hero === 'true') {
      filtered = filtered.filter((p) => p.isHeroProduct);
    }
    if (search) {
      const s = String(search).toLowerCase();
      filtered = filtered.filter((p) => {
        return (
          p.name.toLowerCase().includes(s) ||
          p.sku.toLowerCase().includes(s) ||
          (p.description && p.description.toLowerCase().includes(s)) ||
          (p.category && p.category.name.toLowerCase().includes(s)) ||
          p.metalType.toLowerCase() === s
        );
      });
    }

    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const pageNum = parseInt(String(page));
    const limitNum = parseInt(String(limit));
    const skip = (pageNum - 1) * limitNum;
    
    const paginated = filtered.slice(skip, skip + limitNum);

    res.json({
      success: true,
      data: paginated,
      meta: { total: filtered.length, page: pageNum, limit: limitNum, totalPages: Math.ceil(filtered.length / limitNum) },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const populatedProduct = populateProduct(product);
    res.json({ success: true, data: populatedProduct });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    let product = products.find((p) => p.slug === req.params.slug);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const populatedProduct = populateProduct(product);

    // Get related products
    const related = products
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4)
      .map(populateProduct);

    res.json({ success: true, data: { ...populatedProduct, related } });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { images, ...productData } = req.body;

    const baseSlug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let slug = baseSlug;
    let counter = 1;
    while (products.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    if (products.some((p) => p.sku === productData.sku)) {
      res.status(409).json({ success: false, message: 'SKU already exists' });
      return;
    }

    const newProductId = generateId();
    const productImages = images ? images.map((img: any, i: number) => ({
      id: generateId(),
      productId: newProductId,
      url: img.url,
      publicId: img.publicId,
      isPrimary: i === 0,
      sortOrder: i,
      createdAt: new Date(),
    })) : [];

    const product = {
      id: newProductId,
      ...productData,
      slug,
      images: productImages,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    products.push(product);

    res.status(201).json({ success: true, data: populateProduct(product) });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { images, ...productData } = req.body;

    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    products[index] = { ...products[index], ...productData, updatedAt: new Date() };

    res.json({ success: true, data: populateProduct(products[index]) });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products.splice(index, 1);
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const toggleProductFlag = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { flag, value } = req.body;

    const allowedFlags = ['isBestSeller', 'isHeroProduct', 'isSoldOut', 'isAvailable', 'showPrice'];
    if (!allowedFlags.includes(flag)) {
      res.status(400).json({ success: false, message: 'Invalid flag' });
      return;
    }

    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    products[index] = { ...products[index], [flag]: value, updatedAt: new Date() };

    res.json({ success: true, data: populateProduct(products[index]) });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addProductImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { url, publicId, isPrimary } = req.body;

    const product = products.find((p) => p.id === productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    if (isPrimary) {
      product.images.forEach((img: any) => img.isPrimary = false);
    }

    const image = {
      id: generateId(),
      productId: String(productId),
      url,
      publicId,
      isPrimary: isPrimary || false,
      sortOrder: 0,
      createdAt: new Date(),
    };
    
    product.images.push(image);

    res.status(201).json({ success: true, data: image });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteProductImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, imageId } = req.params;
    
    const product = products.find((p) => p.images.some((i: any) => i.id === imageId));
    if (product) {
      const imgIndex = product.images.findIndex((i: any) => i.id === imageId);
      if (imgIndex !== -1) {
        product.images.splice(imgIndex, 1);
      }
    }
    
    res.json({ success: true, message: 'Image deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAdminStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const total = products.length;
    const bestSellers = products.filter((p) => p.isBestSeller).length;
    const heroProducts = products.filter((p) => p.isHeroProduct).length;
    const soldOut = products.filter((p) => p.isSoldOut).length;

    res.json({
      success: true,
      data: { total, bestSellers, heroProducts, soldOut },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
