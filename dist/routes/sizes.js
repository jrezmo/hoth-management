"use strict";
/**
 * Size Routes - Now using distinct values from products table
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sizeRoutes = void 0;
const express_1 = require("express");
const product_1 = require("../models/product");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
exports.sizeRoutes = router;
// Get all distinct sizes from products
router.get('/', async (req, res) => {
    try {
        const sizes = await product_1.ProductModel.getDistinctSizes();
        res.json({
            data: sizes,
            message: 'Sizes retrieved successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch sizes', { error });
        res.status(500).json({
            error: 'Failed to fetch sizes',
            timestamp: new Date().toISOString(),
        });
    }
});
//# sourceMappingURL=sizes.js.map