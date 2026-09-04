"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Admin stats (must be before /:slug to avoid conflict)
router.get('/admin/stats', auth_middleware_1.authenticate, product_controller_1.getAdminStats);
// Admin get by ID (must be before /:slug)
router.get('/admin/:id', auth_middleware_1.authenticate, product_controller_1.getProductById);
// Public
router.get('/', product_controller_1.getProducts);
router.get('/:slug', product_controller_1.getProductBySlug);
// Admin protected
router.post('/', auth_middleware_1.authenticate, product_controller_1.createProduct);
router.put('/:id', auth_middleware_1.authenticate, product_controller_1.updateProduct);
router.delete('/:id', auth_middleware_1.authenticate, product_controller_1.deleteProduct);
router.patch('/:id/flag', auth_middleware_1.authenticate, product_controller_1.toggleProductFlag);
router.post('/:productId/images', auth_middleware_1.authenticate, product_controller_1.addProductImage);
router.delete('/:productId/images/:imageId', auth_middleware_1.authenticate, product_controller_1.deleteProductImage);
exports.default = router;
//# sourceMappingURL=product.routes.js.map