"use strict";
/**
 * Authentication Routes
 * Business user authentication and authorization
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth-controller");
const validate_request_1 = require("../middleware/validate-request");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
exports.authRoutes = router;
const authController = new auth_controller_1.AuthController();
// Business user login
router.post('/login', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
], validate_request_1.validateRequest, authController.login);
// Get current user profile
router.get('/me', authenticate_1.authenticateToken, authController.getProfile);
// Update user profile
router.put('/profile', authenticate_1.authenticateToken, [
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
], validate_request_1.validateRequest, authController.updateProfile);
// Change password
router.put('/password', authenticate_1.authenticateToken, [
    (0, express_validator_1.body)('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
], validate_request_1.validateRequest, authController.changePassword);
// Logout
router.post('/logout', authenticate_1.authenticateToken, authController.logout);
//# sourceMappingURL=auth.js.map