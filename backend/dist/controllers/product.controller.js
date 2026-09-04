"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = exports.deleteProductImage = exports.addProductImage = exports.toggleProductFlag = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProductById = exports.getProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Product_model_1 = require("../models/Product.model");
const Category_model_1 = require("../models/Category.model");
const mockData_1 = require("../data/mockData");
const db_1 = require("../lib/db");
// Helper to build a slug from a product name
const buildSlug = (name) => name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
// Helper to format product object and attach category safely
const formatProduct = (p) => {
    if (!p)
        return null;
    const obj = p.toObject ? p.toObject() : { ...p };
    let catObj = null;
    if (obj.categoryId && typeof obj.categoryId === 'object') {
        catObj = obj.categoryId;
        obj.categoryId = obj.categoryId._id ? obj.categoryId._id.toString() : (obj.categoryId.id || obj.categoryId._id);
    }
    else if (obj.categoryId) {
        catObj = mockData_1.categories.find((c) => c.id === obj.categoryId || c._id === obj.categoryId);
    }
    if (catObj && catObj.toObject)
        catObj = catObj.toObject();
    return {
        ...obj,
        id: obj.id || (obj._id ? obj._id.toString() : obj.id),
        category: catObj || obj.category || null,
    };
};
// Helper to resolve a valid Category ObjectId from any categoryId input
const resolveCategoryObjectId = async (inputCatId) => {
    await (0, db_1.connectDB)();
    // If already a valid Mongo ObjectId, verify if document exists
    if (mongoose_1.default.Types.ObjectId.isValid(inputCatId)) {
        const existing = await Category_model_1.Category.findById(inputCatId);
        if (existing)
            return existing._id;
    }
    // Look up by slug or custom id
    let catDoc = await Category_model_1.Category.findOne({
        $or: [{ slug: inputCatId }, { id: inputCatId }, { name: inputCatId }],
    });
    if (catDoc) {
        return catDoc._id;
    }
    // Fallback: pick the first available Category or create a default 'Rings' category
    catDoc = await Category_model_1.Category.findOne();
    if (catDoc)
        return catDoc._id;
    const newCat = await Category_model_1.Category.create({
        name: 'General',
        slug: 'general',
        type: 'JEWELRY',
        sortOrder: 1,
    });
    return newCat._id;
};
const getProducts = async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const { category, diamondType, search, bestSeller, hero, page = '1', limit = '20', } = req.query;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                const filter = {};
                if (diamondType)
                    filter.diamondType = String(diamondType);
                if (bestSeller === 'true')
                    filter.isBestSeller = true;
                if (hero === 'true')
                    filter.isHeroProduct = true;
                if (category) {
                    const cat = await Category_model_1.Category.findOne({ slug: String(category) });
                    if (cat)
                        filter.categoryId = cat._id;
                    else
                        filter.categoryId = null;
                }
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
                const [dbProducts, total] = await Promise.all([
                    Product_model_1.Product.find(filter)
                        .populate('categoryId')
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limitNum),
                    Product_model_1.Product.countDocuments(filter),
                ]);
                const formatted = dbProducts.map(formatProduct);
                res.json({
                    success: true,
                    data: formatted,
                    meta: {
                        total,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: Math.ceil(total / limitNum) || 1,
                    },
                });
                return;
            }
            catch (dbErr) {
                console.warn('DB getProducts error, falling back to mockProducts:', dbErr);
            }
        }
        // Mock fallback
        let filtered = [...mockData_1.products];
        if (diamondType)
            filtered = filtered.filter(p => p.diamondType === String(diamondType));
        if (bestSeller === 'true')
            filtered = filtered.filter(p => p.isBestSeller);
        if (hero === 'true')
            filtered = filtered.filter(p => p.isHeroProduct);
        if (category) {
            const cat = mockData_1.categories.find(c => c.slug === String(category));
            filtered = cat ? filtered.filter(p => p.categoryId === cat.id) : [];
        }
        if (search) {
            const s = String(search).toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(s) ||
                p.sku.toLowerCase().includes(s) ||
                (p.description && p.description.toLowerCase().includes(s)));
        }
        const pageNum = parseInt(String(page));
        const limitNum = parseInt(String(limit));
        const total = filtered.length;
        const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum).map(formatProduct);
        res.json({
            success: true,
            data: paginated,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum) || 1,
            },
        });
    }
    catch (error) {
        console.error('getProducts error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const paramId = String(req.params.id);
        if (mongoose_1.default.connection.readyState === 1 && mongoose_1.default.Types.ObjectId.isValid(paramId)) {
            try {
                const product = await Product_model_1.Product.findById(paramId).populate('categoryId');
                if (product) {
                    res.json({ success: true, data: formatProduct(product) });
                    return;
                }
            }
            catch (err) {
                console.warn('DB getProductById error, checking mockProducts:', err);
            }
        }
        const mockProd = mockData_1.products.find(p => p.id === paramId);
        if (!mockProd) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.json({ success: true, data: formatProduct(mockProd) });
    }
    catch (error) {
        console.error('getProductById error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProductById = getProductById;
const getProductBySlug = async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const { slug } = req.params;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                const product = await Product_model_1.Product.findOne({ slug }).populate('categoryId');
                if (product) {
                    const related = await Product_model_1.Product.find({
                        categoryId: product.categoryId,
                        _id: { $ne: product._id },
                    })
                        .populate('categoryId')
                        .limit(4);
                    const formattedProd = formatProduct(product);
                    const formattedRelated = related.map(formatProduct);
                    res.json({ success: true, data: { ...formattedProd, related: formattedRelated } });
                    return;
                }
            }
            catch (err) {
                console.warn('DB getProductBySlug error, fallback to mockProducts:', err);
            }
        }
        const mockProd = mockData_1.products.find(p => p.slug === slug);
        if (!mockProd) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        const related = mockData_1.products.filter(p => p.categoryId === mockProd.categoryId && p.id !== mockProd.id).slice(0, 4).map(formatProduct);
        res.json({ success: true, data: { ...formatProduct(mockProd), related } });
    }
    catch (error) {
        console.error('getProductBySlug error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProductBySlug = getProductBySlug;
const createProduct = async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const { images, categoryId, ...productData } = req.body;
        if (!productData.name || !productData.sku) {
            res.status(400).json({ success: false, message: 'Product name and SKU are required' });
            return;
        }
        // Resolve a valid MongoDB Category ObjectId
        const validCatObjectId = await resolveCategoryObjectId(String(categoryId || ''));
        const baseSlug = buildSlug(productData.name || 'product');
        if (mongoose_1.default.connection.readyState === 1) {
            let slug = baseSlug;
            let counter = 1;
            while (await Product_model_1.Product.findOne({ slug })) {
                slug = `${baseSlug}-${counter++}`;
            }
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
                categoryId: validCatObjectId,
                slug,
                images: productImages,
            });
            await product.save();
            await product.populate('categoryId');
            console.log(`✅ Product created permanently in MongoDB: ${product.name} (ID: ${product._id})`);
            res.status(201).json({ success: true, data: formatProduct(product) });
            return;
        }
        // Mock fallback creation (only if DB is completely unavailable)
        const mockSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
        const mockId = 'prod_' + Date.now();
        const productImages = Array.isArray(images)
            ? images.map((img, i) => ({
                id: 'img_' + Date.now() + '_' + i,
                productId: mockId,
                url: img.url,
                publicId: img.publicId,
                isPrimary: i === 0,
                sortOrder: i,
                createdAt: new Date(),
            }))
            : [];
        const newProduct = {
            id: mockId,
            ...productData,
            categoryId: String(categoryId),
            slug: mockSlug,
            images: productImages,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        mockData_1.products.unshift(newProduct);
        res.status(201).json({ success: true, data: formatProduct(newProduct) });
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
        await (0, db_1.connectDB)();
        const id = String(req.params.id);
        const { images, categoryId, ...productData } = req.body;
        const updatePayload = { ...productData, updatedAt: new Date() };
        if (categoryId) {
            updatePayload.categoryId = await resolveCategoryObjectId(String(categoryId));
        }
        if (mongoose_1.default.connection.readyState === 1 && mongoose_1.default.Types.ObjectId.isValid(id)) {
            try {
                const product = await Product_model_1.Product.findByIdAndUpdate(id, updatePayload, { new: true, runValidators: true }).populate('categoryId');
                if (product) {
                    console.log(`✅ Product updated permanently in MongoDB: ${product.name} (ID: ${product._id})`);
                    res.json({ success: true, data: formatProduct(product) });
                    return;
                }
            }
            catch (dbErr) {
                console.warn('DB updateProduct warning:', dbErr);
            }
        }
        const index = mockData_1.products.findIndex(p => p.id === id);
        if (index !== -1) {
            mockData_1.products[index] = { ...mockData_1.products[index], ...updatePayload, updatedAt: new Date() };
            res.json({ success: true, data: formatProduct(mockData_1.products[index]) });
            return;
        }
        res.status(404).json({ success: false, message: 'Product not found' });
    }
    catch (error) {
        console.error('updateProduct error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const id = String(req.params.id);
        if (mongoose_1.default.connection.readyState === 1 && mongoose_1.default.Types.ObjectId.isValid(id)) {
            try {
                await Product_model_1.Product.findByIdAndDelete(id);
                console.log(`✅ Product deleted permanently from MongoDB (ID: ${id})`);
            }
            catch (dbErr) {
                console.warn('DB deleteProduct warning:', dbErr);
            }
        }
        const index = mockData_1.products.findIndex(p => p.id === id);
        if (index !== -1) {
            mockData_1.products.splice(index, 1);
        }
        res.json({ success: true, message: 'Product deleted' });
    }
    catch (error) {
        console.error('deleteProduct error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteProduct = deleteProduct;
const toggleProductFlag = async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const id = String(req.params.id);
        const { flag, value } = req.body;
        const allowedFlags = ['isBestSeller', 'isHeroProduct', 'isSoldOut', 'isAvailable', 'showPrice'];
        if (!allowedFlags.includes(flag)) {
            res.status(400).json({ success: false, message: 'Invalid flag' });
            return;
        }
        if (mongoose_1.default.connection.readyState === 1 && mongoose_1.default.Types.ObjectId.isValid(id)) {
            try {
                const product = await Product_model_1.Product.findByIdAndUpdate(id, { [flag]: value, updatedAt: new Date() }, { new: true }).populate('categoryId');
                if (product) {
                    res.json({ success: true, data: formatProduct(product) });
                    return;
                }
            }
            catch (dbErr) {
                console.warn('DB toggleProductFlag warning:', dbErr);
            }
        }
        const index = mockData_1.products.findIndex(p => p.id === id);
        if (index !== -1) {
            mockData_1.products[index][flag] = value;
            mockData_1.products[index].updatedAt = new Date();
            res.json({ success: true, data: formatProduct(mockData_1.products[index]) });
            return;
        }
        res.status(404).json({ success: false, message: 'Product not found' });
    }
    catch (error) {
        console.error('toggleProductFlag error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.toggleProductFlag = toggleProductFlag;
const addProductImage = async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const productId = String(req.params.productId);
        const { url, publicId, isPrimary } = req.body;
        if (mongoose_1.default.connection.readyState === 1 && mongoose_1.default.Types.ObjectId.isValid(productId)) {
            try {
                const product = await Product_model_1.Product.findById(productId);
                if (product) {
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
                    return;
                }
            }
            catch (dbErr) {
                console.warn('DB addProductImage warning:', dbErr);
            }
        }
        const mockProd = mockData_1.products.find(p => p.id === productId);
        if (mockProd) {
            const newImg = {
                id: 'img_' + Date.now(),
                productId,
                url,
                publicId,
                isPrimary: isPrimary || false,
                sortOrder: mockProd.images ? mockProd.images.length : 0,
                createdAt: new Date(),
            };
            if (!mockProd.images)
                mockProd.images = [];
            if (isPrimary) {
                mockProd.images.forEach((img) => { img.isPrimary = false; });
            }
            mockProd.images.push(newImg);
            res.status(201).json({ success: true, data: newImg });
            return;
        }
        res.status(404).json({ success: false, message: 'Product not found' });
    }
    catch (error) {
        console.error('addProductImage error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.addProductImage = addProductImage;
const deleteProductImage = async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const productId = String(req.params.productId);
        const imageId = String(req.params.imageId);
        if (mongoose_1.default.connection.readyState === 1 && mongoose_1.default.Types.ObjectId.isValid(productId)) {
            try {
                const product = await Product_model_1.Product.findById(productId);
                if (product) {
                    product.images = product.images.filter((img) => img._id.toString() !== imageId);
                    await product.save();
                    res.json({ success: true, message: 'Image deleted' });
                    return;
                }
            }
            catch (dbErr) {
                console.warn('DB deleteProductImage warning:', dbErr);
            }
        }
        const mockProd = mockData_1.products.find(p => p.id === productId);
        if (mockProd && mockProd.images) {
            mockProd.images = mockProd.images.filter((img) => (img.id || img._id) !== imageId);
            res.json({ success: true, message: 'Image deleted' });
            return;
        }
        res.status(404).json({ success: false, message: 'Product not found' });
    }
    catch (error) {
        console.error('deleteProductImage error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteProductImage = deleteProductImage;
const getAdminStats = async (_req, res) => {
    try {
        await (0, db_1.connectDB)();
        if (mongoose_1.default.connection.readyState === 1) {
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
                return;
            }
            catch (dbErr) {
                console.warn('DB getAdminStats warning, fallback to mockProducts:', dbErr);
            }
        }
        const total = mockData_1.products.length;
        const bestSellers = mockData_1.products.filter(p => p.isBestSeller).length;
        const heroProducts = mockData_1.products.filter(p => p.isHeroProduct).length;
        const soldOut = mockData_1.products.filter(p => p.isSoldOut).length;
        res.json({
            success: true,
            data: { total, bestSellers, heroProducts, soldOut },
        });
    }
    catch (error) {
        console.error('getAdminStats error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAdminStats = getAdminStats;
//# sourceMappingURL=product.controller.js.map