"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = exports.deleteProductImage = exports.addProductImage = exports.toggleProductFlag = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProducts = void 0;
const mockData_1 = require("../data/mockData");
const populateProduct = (product) => {
    return {
        ...product,
        category: mockData_1.categories.find((c) => c.id === product.categoryId) || null,
    };
};
const getProducts = async (req, res) => {
    try {
        const { category, diamondType, search, bestSeller, hero, page = '1', limit = '20', } = req.query;
        let filtered = mockData_1.products.map(populateProduct);
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
                return (p.name.toLowerCase().includes(s) ||
                    p.sku.toLowerCase().includes(s) ||
                    (p.description && p.description.toLowerCase().includes(s)) ||
                    (p.category && p.category.name.toLowerCase().includes(s)) ||
                    p.metalType.toLowerCase() === s);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProducts = getProducts;
const getProductBySlug = async (req, res) => {
    try {
        let product = mockData_1.products.find((p) => p.slug === req.params.slug);
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        const populatedProduct = populateProduct(product);
        // Get related products
        const related = mockData_1.products
            .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
            .slice(0, 4)
            .map(populateProduct);
        res.json({ success: true, data: { ...populatedProduct, related } });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProductBySlug = getProductBySlug;
const createProduct = async (req, res) => {
    try {
        const { images, ...productData } = req.body;
        const baseSlug = productData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        let slug = baseSlug;
        let counter = 1;
        while (mockData_1.products.some((p) => p.slug === slug)) {
            slug = `${baseSlug}-${counter++}`;
        }
        if (mockData_1.products.some((p) => p.sku === productData.sku)) {
            res.status(409).json({ success: false, message: 'SKU already exists' });
            return;
        }
        const newProductId = (0, mockData_1.generateId)();
        const productImages = images ? images.map((img, i) => ({
            id: (0, mockData_1.generateId)(),
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
        mockData_1.products.push(product);
        res.status(201).json({ success: true, data: populateProduct(product) });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { images, ...productData } = req.body;
        const index = mockData_1.products.findIndex((p) => p.id === id);
        if (index === -1) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        mockData_1.products[index] = { ...mockData_1.products[index], ...productData, updatedAt: new Date() };
        res.json({ success: true, data: populateProduct(mockData_1.products[index]) });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const index = mockData_1.products.findIndex((p) => p.id === id);
        if (index !== -1) {
            mockData_1.products.splice(index, 1);
        }
        res.json({ success: true, message: 'Product deleted' });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteProduct = deleteProduct;
const toggleProductFlag = async (req, res) => {
    try {
        const { id } = req.params;
        const { flag, value } = req.body;
        const allowedFlags = ['isBestSeller', 'isHeroProduct', 'isSoldOut', 'isAvailable', 'showPrice'];
        if (!allowedFlags.includes(flag)) {
            res.status(400).json({ success: false, message: 'Invalid flag' });
            return;
        }
        const index = mockData_1.products.findIndex((p) => p.id === id);
        if (index === -1) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        mockData_1.products[index] = { ...mockData_1.products[index], [flag]: value, updatedAt: new Date() };
        res.json({ success: true, data: populateProduct(mockData_1.products[index]) });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.toggleProductFlag = toggleProductFlag;
const addProductImage = async (req, res) => {
    try {
        const { productId } = req.params;
        const { url, publicId, isPrimary } = req.body;
        const product = mockData_1.products.find((p) => p.id === productId);
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        if (isPrimary) {
            product.images.forEach((img) => img.isPrimary = false);
        }
        const image = {
            id: (0, mockData_1.generateId)(),
            productId: String(productId),
            url,
            publicId,
            isPrimary: isPrimary || false,
            sortOrder: 0,
            createdAt: new Date(),
        };
        product.images.push(image);
        res.status(201).json({ success: true, data: image });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.addProductImage = addProductImage;
const deleteProductImage = async (req, res) => {
    try {
        const { productId, imageId } = req.params;
        const product = mockData_1.products.find((p) => p.images.some((i) => i.id === imageId));
        if (product) {
            const imgIndex = product.images.findIndex((i) => i.id === imageId);
            if (imgIndex !== -1) {
                product.images.splice(imgIndex, 1);
            }
        }
        res.json({ success: true, message: 'Image deleted' });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteProductImage = deleteProductImage;
const getAdminStats = async (_req, res) => {
    try {
        const total = mockData_1.products.length;
        const bestSellers = mockData_1.products.filter((p) => p.isBestSeller).length;
        const heroProducts = mockData_1.products.filter((p) => p.isHeroProduct).length;
        const soldOut = mockData_1.products.filter((p) => p.isSoldOut).length;
        res.json({
            success: true,
            data: { total, bestSellers, heroProducts, soldOut },
        });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAdminStats = getAdminStats;
//# sourceMappingURL=product.controller.js.map