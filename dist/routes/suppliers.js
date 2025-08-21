"use strict";
/**
 * Supplier Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const supplier_1 = require("../models/supplier");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
exports.supplierRoutes = router;
// Get all suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await supplier_1.SupplierModel.findAll();
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
// Create new supplier
router.post('/', [(0, express_validator_1.body)('name').notEmpty().withMessage('Supplier name is required')], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array(),
                timestamp: new Date().toISOString(),
            });
        }
        const supplier = await supplier_1.SupplierModel.create(req.body);
        res.status(201).json({
            data: supplier,
            message: 'Supplier created successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to create supplier', { error, body: req.body });
        res.status(500).json({
            error: 'Failed to create supplier',
            timestamp: new Date().toISOString(),
        });
    }
});
//# sourceMappingURL=suppliers.js.map