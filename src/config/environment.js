"use strict";
/**
 * Environment Configuration
 * Centralized configuration management with validation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from the project root - search upward from current directory
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
// Also try loading from the monorepo root in case we're in a workspace
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '../../.env') });
// In development, provide fallback values
if (process.env.NODE_ENV !== 'production') {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'development-jwt-secret-change-in-production';
}
const requiredEnvVars = ['JWT_SECRET'];
// Validate required environment variables
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Required environment variable ${envVar} is not set`);
    }
}
exports.config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '8001', 10),
    database: {
        url: process.env.DATABASE_URL,
        type: process.env.DATABASE_URL?.includes('postgresql') ? 'postgresql' : 'sqlite',
        sqlite: {
            filename: process.env.SQLITE_FILENAME || 'management.db',
        },
        postgresql: {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            database: process.env.DB_NAME || 'hoth_management',
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || '',
        },
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
    cors: {
        allowedOrigins: process.env.CORS_ORIGINS
            ? process.env.CORS_ORIGINS.split(',')
            : ['http://localhost:3000', 'http://localhost:3001'],
    },
    storefront: {
        apiUrl: process.env.STOREFRONT_API_URL || 'http://localhost:8002',
        deployHook: process.env.STOREFRONT_DEPLOY_HOOK,
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },
};
//# sourceMappingURL=environment.js.map