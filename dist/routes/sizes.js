"use strict";
/**
 * Size Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sizeRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const size_1 = require("../models/size");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
exports.sizeRoutes = router;
// Get all sizes
router.get('/', async (req, res) => {
    try {
        const sizes = await size_1.SizeModel.findAll();
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
// Create new size
router.post('/', [(0, express_validator_1.body)('name').notEmpty().withMessage('Size name is required')], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array(),
                timestamp: new Date().toISOString(),
            });
        }
        const size = await size_1.SizeModel.create(req.body);
        res.status(201).json({
            data: size,
            message: 'Size created successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to create size', { error, body: req.body });
        res.status(500).json({
            error: 'Failed to create size',
            timestamp: new Date().toISOString(),
        });
    }
});
//# sourceMappingURL=sizes.js.map