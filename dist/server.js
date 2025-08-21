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
const database_1 = require("./models/database");
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
// Landing page
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hoth Management System</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; }
        .container { max-width: 800px; margin: 0 auto; text-align: center; }
        h1 { font-size: 3rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .subtitle { font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem; }
        .card { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 15px; padding: 30px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.2); }
        .api-list { text-align: left; max-width: 500px; margin: 0 auto; }
        .api-endpoint { background: rgba(255,255,255,0.1); padding: 10px 15px; margin: 10px 0; border-radius: 8px; font-family: monospace; }
        .status { display: inline-block; background: #10b981; padding: 5px 15px; border-radius: 20px; font-size: 0.9rem; margin: 10px 0; }
        .emoji { font-size: 2rem; margin: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>❄️ Hoth Management System</h1>
        <p class="subtitle">Business operations for the galaxy's coldest e-commerce platform</p>
        
        <div class="card">
          <div class="status">🟢 System Online</div>
          <p>The rebellion's supply chain management is operational on Hoth Base.</p>
        </div>

        <div class="card">
          <h3>🚀 Available API Endpoints</h3>
          <div class="api-list">
            <div class="api-endpoint">GET /api/health - System status</div>
            <div class="api-endpoint">POST /api/auth/* - Authentication</div>
            <div class="api-endpoint">GET /api/products/* - Product management</div>
            <div class="api-endpoint">GET /api/orders/* - Order processing</div>
            <div class="api-endpoint">GET /api/users/* - User management</div>
            <div class="api-endpoint">GET /api/catalog/* - Product catalog</div>
          </div>
        </div>

        <div class="card">
          <div class="emoji">🏔️</div>
          <p><em>"Sir, the possibility of successfully managing an e-commerce platform on an ice planet is approximately 3,720 to 1!"</em></p>
          <p><strong>- C-3PO, probably</strong></p>
        </div>
      </div>
    </body>
    </html>
  `);
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
// Error handling
app.use(error_handler_1.notFoundHandler);
app.use(error_handler_1.errorHandler);
// Initialize database and start server
async function startServer() {
    try {
        await database_1.db.connect();
        app.listen(PORT, () => {
            logger_1.logger.info(`🚀 Management system running on port ${PORT}`);
            logger_1.logger.info(`📊 Environment: ${environment_1.config.nodeEnv}`);
            logger_1.logger.info(`🔒 CORS allowed origins: ${environment_1.config.cors.allowedOrigins.join(', ')}`);
            logger_1.logger.info(`🗄️  Database connected and tables initialized`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server', { error });
        process.exit(1);
    }
}
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map