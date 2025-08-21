"use strict";
/**
 * Category Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const category_1 = require("../models/category");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
exports.categoryRoutes = router;
// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await category_1.CategoryModel.findAll();
        res.json({
            data: categories,
            message: 'Categories retrieved successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch categories', { error });
        res.status(500).json({
            error: 'Failed to fetch categories',
            timestamp: new Date().toISOString(),
        });
    }
});
// Create new category
router.post('/', [(0, express_validator_1.body)('name').notEmpty().withMessage('Category name is required')], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array(),
                timestamp: new Date().toISOString(),
            });
        }
        const category = await category_1.CategoryModel.create(req.body);
        res.status(201).json({
            data: category,
            message: 'Category created successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to create category', { error, body: req.body });
        res.status(500).json({
            error: 'Failed to create category',
            timestamp: new Date().toISOString(),
        });
    }
});
//# sourceMappingURL=categories.js.map