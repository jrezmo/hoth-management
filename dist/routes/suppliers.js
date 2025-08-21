"use strict";
/**
 * Supplier Routes - Now using distinct values from products table
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierRoutes = void 0;
const express_1 = require("express");
const product_1 = require("../models/product");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
exports.supplierRoutes = router;
// Get all distinct suppliers from products
router.get('/', async (req, res) => {
    try {
        const suppliers = await product_1.ProductModel.getDistinctSuppliers();
        res.json({
            data: suppliers,
            message: 'Suppliers retrieved successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch suppliers', { error });
        res.status(500).json({
            error: 'Failed to fetch suppliers',
            timestamp: new Date().toISOString(),
        });
    }
});
//# sourceMappingURL=suppliers.js.map