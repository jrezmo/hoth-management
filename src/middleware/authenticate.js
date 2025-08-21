"use strict";
/**
 * Authentication Middleware
 * JWT token validation for business users
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            error: {
                message: 'Access token is required',
                statusCode: 401,
            },
            timestamp: new Date().toISOString(),
            path: req.path,
        });
    }
    // Placeholder token validation
    // In real implementation, verify JWT token here
    req.user = {
        id: '1',
        email: 'user@example.com',
        role: 'business_manager',
    };
    next();
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=authenticate.js.map