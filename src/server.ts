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
import { databaseRoutes } from './routes/database';
import { db } from './models/database';

const app = express();
const PORT = config.port;

// Security middleware
app.use(helmet({
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

// Static file serving
app.use(express.static('public'));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Enhanced health check with diagnostics
app.get('/api/health', async (req, res) => {
  const startTime = Date.now();
  const healthStatus: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'hoth-management',
    version: '1.0.0',
    environment: config.nodeEnv,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    responseTime: 0,
    checks: {}
  };

  try {
    // Database health check
    try {
      const dbStart = Date.now();
      await db.query('SELECT 1 as health_check');
      healthStatus.checks.database = {
        status: 'healthy',
        responseTime: Date.now() - dbStart,
        message: 'Database connection successful'
      };
    } catch (dbError: any) {
      healthStatus.status = 'unhealthy';
      healthStatus.checks.database = {
        status: 'unhealthy',
        error: dbError.message,
        stack: dbError.stack,
        message: 'Database connection failed'
      };
      logger.error('Health check: Database connection failed', { error: dbError });
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
    } else {
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
    } catch (routeError: any) {
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
    
  } catch (error: any) {
    logger.error('Health check endpoint failed', { error: error.message, stack: error.stack });
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
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sizes', sizeRoutes);
app.use('/api/database', databaseRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Startup diagnostics
async function runStartupDiagnostics() {
  logger.info('🔍 Running startup diagnostics...');
  
  const diagnostics: any = {
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      nodeEnv: config.nodeEnv,
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
    await db.query('SELECT NOW() as current_time');
    diagnostics.database = { status: 'connected', message: 'Database connection successful' };
    logger.info('✅ Database connection test passed');
  } catch (error: any) {
    diagnostics.database = { status: 'failed', error: error.message, stack: error.stack };
    logger.error('❌ Database connection test failed', { error });
  }

  logger.info('📊 Startup diagnostics complete', diagnostics);
  return diagnostics;
}

// Process error handlers
process.on('uncaughtException', (error) => {
  logger.error('🚨 Uncaught Exception - Server will exit', { 
    error: error.message, 
    stack: error.stack,
    pid: process.pid 
  });
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise) => {
  logger.error('🚨 Unhandled Promise Rejection', { 
    reason: reason?.toString(), 
    stack: reason?.stack,
    promise: promise.toString(),
    pid: process.pid 
  });
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Initialize database and start server
async function startServer() {
  try {
    logger.info('🚀 Starting Hoth Management System...');
    
    // Run startup diagnostics
    const diagnostics = await runStartupDiagnostics();
    
    // Check if diagnostics passed
    const hasRequiredEnvVars = Object.values(diagnostics.requiredEnvVars).every(Boolean);
    const hasDatabaseConnection = diagnostics.database.status === 'connected';
    
    if (!hasRequiredEnvVars) {
      logger.error('❌ Startup failed: Missing required environment variables', diagnostics.requiredEnvVars);
      process.exit(1);
    }
    
    if (!hasDatabaseConnection) {
      logger.error('❌ Startup failed: Database connection failed', diagnostics.database);
      process.exit(1);
    }

    // Connect to database
    await db.connect();
    
    // Start the server
    const server = app.listen(PORT, () => {
      logger.info('✅ Server started successfully');
      logger.info(`🚀 Management system running on port ${PORT}`);
      logger.info(`📊 Environment: ${config.nodeEnv}`);
      logger.info(`🔒 CORS allowed origins: ${config.cors.allowedOrigins.join(', ')}`);
      logger.info(`🗄️  Database connected and tables initialized`);
      logger.info('🎯 Server ready to accept connections');
    });

    // Handle server errors
    server.on('error', (error) => {
      logger.error('❌ Server error', { error: error.message, stack: error.stack });
      process.exit(1);
    });

    return server;
  } catch (error: any) {
    logger.error('❌ Failed to start server', { 
      error: error.message, 
      stack: error.stack,
      config: {
        port: PORT,
        nodeEnv: config.nodeEnv,
        databaseUrl: config.database.url ? 'configured' : 'missing'
      }
    });
    console.error('Startup Error:', error);
    process.exit(1);
  }
}

startServer();

export default app;