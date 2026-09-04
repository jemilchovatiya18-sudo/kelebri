"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = exports.deleteProductImage = exports.addProductImage = exports.toggleProductFlag = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProductById = exports.getProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Product_model_1 = require("../models/Product.model");
const Category_model_1 = require("../models/Category.model");
// Helper to build a slug from a product name
const buildSlug = (name) => name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
const getProducts = async (req, res) => {
    try {
        const { category, diamondType, search, bestSeller, hero, page = '1', limit = '20', } = req.query;
        const filter = {};
        if (diamondType)
            filter.diamondType = String(diamondType);
        if (bestSeller === 'true')
            filter.isBestSeller = true;
        if (hero === 'true')
            filter.isHeroProduct = true;
        // Filter by category slug — look up the category ID first
        if (category) {
            const cat = await Category_model_1.Category.findOne({ slug: String(category) });
            if (cat)
                filter.categoryId = cat._id;
            else
                filter.categoryId = null; // no match → return empty
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
            Product_model_1.Product.find(filter)
                .populate('categoryId')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Product_model_1.Product.countDocuments(filter),
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const paramId = String(req.params.id);
        if (!mongoose_1.default.Types.ObjectId.isValid(paramId)) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        const product = await Product_model_1.Product.findById(paramId).populate('categoryId');
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.json({ success: true, data: product });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProductById = getProductById;
const getProductBySlug = async (req, res) => {
    try {
        const product = await Product_model_1.Product.findOne({ slug: req.params.slug }).populate('categoryId');
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        // Get related products from same category
        const related = await Product_model_1.Product.find({
            categoryId: product.categoryId,
            _id: { $ne: product._id },
        })
            .populate('categoryId')
            .limit(4);
        res.json({ success: true, data: { ...product.toObject(), related } });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProductBySlug = getProductBySlug;
const createProduct = async (req, res) => {
    try {
        const { images, ...productData } = req.body;
        // Build unique slug
        const baseSlug = buildSlug(productData.name);
        let slug = baseSlug;
        let counter = 1;
        while (await Product_model_1.Product.findOne({ slug })) {
            slug = `${baseSlug}-${counter++}`;
        }
        // Check SKU uniqueness
        const skuExists = await Product_model_1.Product.findOne({ sku: productData.sku });
        if (skuExists) {
            res.status(409).json({ success: false, message: 'SKU already exists' });
            return;
        }
        const productImages = Array.isArray(images)
            ? images.map((img, i) => ({
                url: img.url,
                publicId: img.publicId,
                isPrimary: i === 0,
                sortOrder: i,
                createdAt: new Date(),
            }))
            : [];
        const product = new Product_model_1.Product({
            ...productData,
            slug,
            images: productImages,
        });
        await product.save();
        await product.populate('categoryId');
        res.status(201).json({ success: true, data: product });
    }
    catch (error) {
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
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        const { images, ...productData } = req.body;
        const product = await Product_model_1.Product.findByIdAndUpdate(id, { ...productData, updatedAt: new Date() }, { new: true, runValidators: true }).populate('categoryId');
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.json({ success: true, data: product });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (mongoose_1.default.Types.ObjectId.isValid(id)) {
            await Product_model_1.Product.findByIdAndDelete(id);
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
        const id = String(req.params.id);
        const { flag, value } = req.body;
        const allowedFlags = ['isBestSeller', 'isHeroProduct', 'isSoldOut', 'isAvailable', 'showPrice'];
        if (!allowedFlags.includes(flag)) {
            res.status(400).json({ success: false, message: 'Invalid flag' });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        const product = await Product_model_1.Product.findByIdAndUpdate(id, { [flag]: value, updatedAt: new Date() }, { new: true }).populate('categoryId');
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.json({ success: true, data: product });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.toggleProductFlag = toggleProductFlag;
const addProductImage = async (req, res) => {
    try {
        const productId = String(req.params.productId);
        const { url, publicId, isPrimary } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        const product = await Product_model_1.Product.findById(productId);
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
        product.images.push(newImage);
        await product.save();
        const addedImage = product.images[product.images.length - 1];
        res.status(201).json({ success: true, data: addedImage });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.addProductImage = addProductImage;
const deleteProductImage = async (req, res) => {
    try {
        const productId = String(req.params.productId);
        const imageId = String(req.params.imageId);
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        const product = await Product_model_1.Product.findById(productId);
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        product.images = product.images.filter((img) => img._id.toString() !== imageId);
        await product.save();
        res.json({ success: true, message: 'Image deleted' });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteProductImage = deleteProductImage;
const getAdminStats = async (_req, res) => {
    try {
        const [total, bestSellers, heroProducts, soldOut] = await Promise.all([
            Product_model_1.Product.countDocuments(),
            Product_model_1.Product.countDocuments({ isBestSeller: true }),
            Product_model_1.Product.countDocuments({ isHeroProduct: true }),
            Product_model_1.Product.countDocuments({ isSoldOut: true }),
        ]);
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