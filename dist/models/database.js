"use strict";
/**
 * Database Connection and Schema Management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.Database = void 0;
const pg_1 = require("pg");
const environment_1 = require("../config/environment");
const logger_1 = require("../utils/logger");
class Database {
    constructor() {
        this.pool = null;
    }
    async connect() {
        if (!environment_1.config.database.url) {
            throw new Error('Database URL is not configured');
        }
        this.pool = new pg_1.Pool({
            connectionString: environment_1.config.database.url,
            ssl: environment_1.config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
        });
        try {
            await this.pool.query('SELECT NOW()');
            logger_1.logger.info('Database connected successfully');
            await this.createTables();
        }
        catch (error) {
            logger_1.logger.error('Database connection failed', { error });
            throw error;
        }
    }
    async query(text, params) {
        if (!this.pool) {
            throw new Error('Database not connected');
        }
        return this.pool.query(text, params);
    }
    async createTables() {
        const tables = [
            // Suppliers table
            `CREATE TABLE IF NOT EXISTS suppliers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,
            // Categories table
            `CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,
            // Sizes table
            `CREATE TABLE IF NOT EXISTS sizes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      )`,
            // Products table
            `CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        supplier_id INTEGER REFERENCES suppliers(id),
        category_id INTEGER REFERENCES categories(id),
        size_id INTEGER REFERENCES sizes(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        wholesale_price DECIMAL(10,2) NOT NULL,
        customer_price DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        sku VARCHAR(100) UNIQUE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,
            // Create indexes for better performance
            `CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id)`,
            `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`,
            `CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)`,
            `CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active)`,
        ];
        for (const table of tables) {
            try {
                await this.query(table);
                logger_1.logger.info('Table created/verified successfully');
            }
            catch (error) {
                logger_1.logger.error('Failed to create table', { error, sql: table });
                throw error;
            }
        }
    }
    async close() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            logger_1.logger.info('Database connection closed');
        }
    }
}
exports.Database = Database;
exports.db = new Database();
//# sourceMappingURL=database.js.map