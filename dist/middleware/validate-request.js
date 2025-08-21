"use strict";
/**
 * Request Validation Middleware
 * Validates request data using express-validator
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: {
                message: 'Validation failed',
                statusCode: 400,
                details: errors.array(),
            },
            timestamp: new Date().toISOString(),
            path: req.path,
        });
    }
    next();
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validate-request.js.map