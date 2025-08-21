"use strict";
/**
 * Category Routes - Now using distinct values from products table
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const product_1 = require("../models/product");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
exports.categoryRoutes = router;
// Get all distinct categories from products
router.get('/', async (req, res) => {
    try {
        const categories = await product_1.ProductModel.getDistinctCategories();
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
//# sourceMappingURL=categories.js.map