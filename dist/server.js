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
const suppliers_1 = require("./routes/suppliers");
const categories_1 = require("./routes/categories");
const sizes_1 = require("./routes/sizes");
const database_1 = require("./routes/database");
const database_2 = require("./models/database");
const app = (0, express_1.default)();
const PORT = environment_1.config.port;
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            scriptSrcAttr: ["'unsafe-inline'"],
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
// Static file serving
app.use(express_1.default.static('public'));
// Request logging
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    next();
});
// Enhanced health check with diagnostics
app.get('/api/health', async (req, res) => {
    const startTime = Date.now();
    const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'hoth-management',
        version: '1.0.0',
        environment: environment_1.config.nodeEnv,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        responseTime: 0,
        checks: {}
    };
    try {
        // Database health check
        try {
            const dbStart = Date.now();
            await database_2.db.query('SELECT 1 as health_check');
            healthStatus.checks.database = {
                status: 'healthy',
                responseTime: Date.now() - dbStart,
                message: 'Database connection successful'
            };
        }
        catch (dbError) {
            healthStatus.status = 'unhealthy';
            healthStatus.checks.database = {
                status: 'unhealthy',
                error: dbError.message,
                stack: dbError.stack,
                message: 'Database connection failed'
            };
            logger_1.logger.error('Health check: Database connection failed', { error: dbError });
        }
        // Environment variables check
        const requiredEnvVars = ['JWT_SECRET'];
        const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
        if (missingEnvVars.length > 0) {
            healthStatus.status = 'unhealthy';
            healthStatus.checks.environment = {
                status: 'unhealthy',
                message: `Missing required environment variables: ${missingEnvVars.join(', ')}`
            };
        }
        else {
            healthStatus.checks.environment = {
                status: 'healthy',
                message: 'All required environment variables present'
            };
        }
        // Routes health check
        try {
            healthStatus.checks.routes = {
                status: 'healthy',
                message: 'All routes loaded successfully',
                availableRoutes: [
                    '/api/health',
                    '/api/products',
                    '/api/suppliers',
                    '/api/categories',
                    '/api/sizes',
                    '/api/database'
                ]
            };
        }
        catch (routeError) {
            healthStatus.status = 'unhealthy';
            healthStatus.checks.routes = {
                status: 'unhealthy',
                error: routeError.message,
                message: 'Route initialization failed'
            };
        }
        healthStatus.responseTime = Date.now() - startTime;
        const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
        res.status(statusCode).json(healthStatus);
    }
    catch (error) {
        logger_1.logger.error('Health check endpoint failed', { error: error.message, stack: error.stack });
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            service: 'hoth-management',
            error: error.message,
            stack: error.stack,
            message: 'Health check endpoint failed'
        });
    }
});
// Landing page - serve static HTML file
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
// API routes
app.use('/api/auth', auth_1.authRoutes);
app.use('/api/products', products_1.productRoutes);
app.use('/api/orders', orders_1.orderRoutes);
app.use('/api/users', users_1.userRoutes);
app.use('/api/catalog', catalog_1.catalogRoutes);
app.use('/api/suppliers', suppliers_1.supplierRoutes);
app.use('/api/categories', categories_1.categoryRoutes);
app.use('/api/sizes', sizes_1.sizeRoutes);
app.use('/api/database', database_1.databaseRoutes);
// Error handling
app.use(error_handler_1.notFoundHandler);
app.use(error_handler_1.errorHandler);
// Startup diagnostics
async function runStartupDiagnostics() {
    logger_1.logger.info('🔍 Running startup diagnostics...');
    const diagnostics = {
        environment: {
            nodeVersion: process.version,
            platform: process.platform,
            nodeEnv: environment_1.config.nodeEnv,
            port: PORT,
        },
        requiredEnvVars: {},
        database: {},
        memory: process.memoryUsage(),
    };
    // Check required environment variables
    const requiredVars = ['JWT_SECRET'];
    requiredVars.forEach(varName => {
        diagnostics.requiredEnvVars[varName] = !!process.env[varName];
    });
    // Test database connection
    try {
        await database_2.db.query('SELECT NOW() as current_time');
        diagnostics.database = { status: 'connected', message: 'Database connection successful' };
        logger_1.logger.info('✅ Database connection test passed');
    }
    catch (error) {
        diagnostics.database = { status: 'failed', error: error.message, stack: error.stack };
        logger_1.logger.error('❌ Database connection test failed', { error });
    }
    logger_1.logger.info('📊 Startup diagnostics complete', diagnostics);
    return diagnostics;
}
// Process error handlers
process.on('uncaughtException', (error) => {
    logger_1.logger.error('🚨 Uncaught Exception - Server will exit', {
        error: error.message,
        stack: error.stack,
        pid: process.pid
    });
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('🚨 Unhandled Promise Rejection', {
        reason: reason?.toString(),
        stack: reason?.stack,
        promise: promise.toString(),
        pid: process.pid
    });
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('SIGTERM', () => {
    logger_1.logger.info('📴 SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger_1.logger.info('📴 SIGINT received, shutting down gracefully');
    process.exit(0);
});
// Initialize database and start server
async function startServer() {
    try {
        logger_1.logger.info('🚀 Starting Hoth Management System...');
        // Run startup diagnostics
        const diagnostics = await runStartupDiagnostics();
        // Check if diagnostics passed
        const hasRequiredEnvVars = Object.values(diagnostics.requiredEnvVars).every(Boolean);
        const hasDatabaseConnection = diagnostics.database.status === 'connected';
        if (!hasRequiredEnvVars) {
            logger_1.logger.error('❌ Startup failed: Missing required environment variables', diagnostics.requiredEnvVars);
            process.exit(1);
        }
        if (!hasDatabaseConnection) {
            logger_1.logger.error('❌ Startup failed: Database connection failed', diagnostics.database);
            process.exit(1);
        }
        // Connect to database
        await database_2.db.connect();
        // Start the server
        const server = app.listen(PORT, () => {
            logger_1.logger.info('✅ Server started successfully');
            logger_1.logger.info(`🚀 Management system running on port ${PORT}`);
            logger_1.logger.info(`📊 Environment: ${environment_1.config.nodeEnv}`);
            logger_1.logger.info(`🔒 CORS allowed origins: ${environment_1.config.cors.allowedOrigins.join(', ')}`);
            logger_1.logger.info(`🗄️  Database connected and tables initialized`);
            logger_1.logger.info('🎯 Server ready to accept connections');
        });
        // Handle server errors
        server.on('error', (error) => {
            logger_1.logger.error('❌ Server error', { error: error.message, stack: error.stack });
            process.exit(1);
        });
        return server;
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to start server', {
            error: error.message,
            stack: error.stack,
            config: {
                port: PORT,
                nodeEnv: environment_1.config.nodeEnv,
                databaseUrl: environment_1.config.database.url ? 'configured' : 'missing'
            }
        });
        console.error('Startup Error:', error);
        process.exit(1);
    }
}
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map