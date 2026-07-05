"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryBySlug = exports.getCategories = void 0;
const mockData_1 = require("../data/mockData");
const getCategories = async (_req, res) => {
    try {
        const sortedCategories = [...mockData_1.categories].sort((a, b) => {
            if (a.type !== b.type)
                return a.type.localeCompare(b.type);
            return a.sortOrder - b.sortOrder;
        });
        res.json({ success: true, data: sortedCategories });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getCategories = getCategories;
const getCategoryBySlug = async (req, res) => {
    try {
        const category = mockData_1.categories.find((c) => c.slug === req.params.slug);
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
        if (mockData_1.categories.some((c) => c.slug === slug)) {
            res.status(409).json({ success: false, message: 'Category slug already exists' });
            return;
        }
        const category = {
            id: (0, mockData_1.generateId)(),
            name,
            slug,
            type: type || 'JEWELRY',
            imageUrl,
            publicId,
            sortOrder: sortOrder || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        mockData_1.categories.push(category);
        res.status(201).json({ success: true, data: category });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const index = mockData_1.categories.findIndex((c) => c.id === id);
        if (index === -1) {
            res.status(404).json({ success: false, message: 'Category not found' });
            return;
        }
        mockData_1.categories[index] = { ...mockData_1.categories[index], ...req.body, updatedAt: new Date() };
        res.json({ success: true, data: mockData_1.categories[index] });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
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