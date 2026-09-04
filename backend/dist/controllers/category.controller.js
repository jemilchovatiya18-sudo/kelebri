"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryBySlug = exports.getCategories = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Category_model_1 = require("../models/Category.model");
const mockData_1 = require("../data/mockData");
const getCategories = async (_req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            const cats = await Category_model_1.Category.find().sort({ type: 1, sortOrder: 1 });
            if (cats && cats.length > 0) {
                res.json({ success: true, data: cats });
                return;
            }
        }
        res.json({ success: true, data: mockData_1.categories });
    }
    catch (error) {
        console.warn('getCategories warning, using fallback:', error);
        res.json({ success: true, data: mockData_1.categories });
    }
};
exports.getCategories = getCategories;
const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        if (mongoose_1.default.connection.readyState === 1) {
            const category = await Category_model_1.Category.findOne({ slug });
            if (category) {
                res.json({ success: true, data: category });
                return;
            }
        }
        const mockCat = mockData_1.categories.find((c) => c.slug === slug);
        if (!mockCat) {
            res.status(404).json({ success: false, message: 'Category not found' });
            return;
        }
        res.json({ success: true, data: mockCat });
    }
    catch (error) {
        console.warn('getCategoryBySlug error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getCategoryBySlug = getCategoryBySlug;
const createCategory = async (req, res) => {
    try {
        const { name, slug, type, imageUrl, publicId, sortOrder } = req.body;
        if (mongoose_1.default.connection.readyState === 1) {
            const existing = await Category_model_1.Category.findOne({ slug });
            if (existing) {
                res.status(409).json({ success: false, message: 'Category slug already exists' });
                return;
            }
            const category = new Category_model_1.Category({
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
        mockData_1.categories.push(newCat);
        res.status(201).json({ success: true, data: newCat });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ success: false, message: 'Category slug already exists' });
            return;
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (mongoose_1.default.connection.readyState === 1) {
            const category = await Category_model_1.Category.findByIdAndUpdate(id, { ...req.body, updatedAt: new Date() }, { new: true, runValidators: true });
            if (category) {
                res.json({ success: true, data: category });
                return;
            }
        }
        const index = mockData_1.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
            mockData_1.categories[index] = { ...mockData_1.categories[index], ...req.body, updatedAt: new Date() };
            res.json({ success: true, data: mockData_1.categories[index] });
            return;
        }
        res.status(404).json({ success: false, message: 'Category not found' });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (mongoose_1.default.connection.readyState === 1) {
            await Category_model_1.Category.findByIdAndDelete(id);
        }
        const index = mockData_1.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
            mockData_1.categories.splice(index, 1);
        }
        res.json({ success: true, message: 'Category deleted' });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.controller.js.map