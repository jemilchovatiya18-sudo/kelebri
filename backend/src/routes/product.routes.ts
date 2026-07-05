import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductFlag,
  addProductImage,
  deleteProductImage,
  getAdminStats,
} from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin protected
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);
router.patch('/:id/flag', authenticate, toggleProductFlag);
router.post('/:productId/images', authenticate, addProductImage);
router.delete('/:productId/images/:imageId', authenticate, deleteProductImage);

// Admin stats
router.get('/admin/stats', authenticate, getAdminStats);

export default router;
