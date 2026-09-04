"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryBySlug = exports.getCategories = void 0;
const Category_model_1 = require("../models/Category.model");
const getCategories = async (_req, res) => {
    try {
        const categories = await Category_model_1.Category.find().sort({ type: 1, sortOrder: 1 });
        res.json({ success: true, data: categories });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getCategories = getCategories;
const getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category_model_1.Category.findOne({ slug: req.params.slug });
        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found' });
            return;
        }
        res.json({ success: true, data: category });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getCategoryBySlug = getCategoryBySlug;
const createCategory = async (req, res) => {
    try {
        const { name, slug, type, imageUrl, publicId, sortOrder } = req.body;
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
        const category = await Category_model_1.Category.findByIdAndUpdate(id, { ...req.body, updatedAt: new Date() }, { new: true, runValidators: true });
        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found' });
            return;
        }
        res.json({ success: true, data: category });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category_model_1.Category.findByIdAndDelete(id);
        res.json({ success: true, message: 'Category deleted' });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.controller.js.map