"use strict";
/**
 * Management System Server
 * Business operations, inventory management, and order processing
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const environment_1 = require("./config/environment");
const logger_1 = require("./utils/logger");
const error_handler_1 = require("./middleware/error-handler");
const auth_1 = require("./routes/auth");
const products_1 = require("./routes/products");
const orders_1 = require("./routes/orders");
const users_1 = require("./routes/users");
const catalog_1 = require("./routes/catalog");
const app = (0, express_1.default)();
const PORT = environment_1.config.port;
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
    },
});
app.use(limiter);
// CORS configuration
app.use((0, cors_1.default)({
    origin: environment_1.config.cors.allowedOrigins,
    credentials: true,
}));
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Request logging
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    next();
});
// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'hoth-management',
        version: '1.0.0',
    });
});
// API routes
app.use('/api/auth', auth_1.authRoutes);
app.use('/api/products', products_1.productRoutes);
app.use('/api/orders', orders_1.orderRoutes);
app.use('/api/users', users_1.userRoutes);
app.use('/api/catalog', catalog_1.catalogRoutes);
// Error handling
app.use(error_handler_1.notFoundHandler);
app.use(error_handler_1.errorHandler);
// Start server
app.listen(PORT, () => {
    logger_1.logger.info(`🚀 Management system running on port ${PORT}`);
    logger_1.logger.info(`📊 Environment: ${environment_1.config.nodeEnv}`);
    logger_1.logger.info(`🔒 CORS allowed origins: ${environment_1.config.cors.allowedOrigins.join(', ')}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map