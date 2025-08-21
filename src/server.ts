/**
 * Management System Server
 * Business operations, inventory management, and order processing
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { authRoutes } from './routes/auth';
import { productRoutes } from './routes/products';
import { orderRoutes } from './routes/orders';
import { userRoutes } from './routes/users';
import { catalogRoutes } from './routes/catalog';
import { supplierRoutes } from './routes/suppliers';
import { categoryRoutes } from './routes/categories';
import { sizeRoutes } from './routes/sizes';
import { db } from './models/database';

const app = express();
const PORT = config.port;

// Security middleware
app.use(helmet({
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
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
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
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sizes', sizeRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await db.connect();
    app.listen(PORT, () => {
      logger.info(`🚀 Management system running on port ${PORT}`);
      logger.info(`📊 Environment: ${config.nodeEnv}`);
      logger.info(`🔒 CORS allowed origins: ${config.cors.allowedOrigins.join(', ')}`);
      logger.info(`🗄️  Database connected and tables initialized`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

startServer();

export default app;