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
            // Products table with denormalized supplier/category/size names
            `CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        supplier_name VARCHAR(255) NOT NULL,
        category_name VARCHAR(255) NOT NULL,
        size_name VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        wholesale_price DECIMAL(10,2) NOT NULL,
        customer_price DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,
            // Create indexes for better performance
            `CREATE INDEX IF NOT EXISTS idx_products_supplier_name ON products(supplier_name)`,
            `CREATE INDEX IF NOT EXISTS idx_products_category_name ON products(category_name)`,
            `CREATE INDEX IF NOT EXISTS idx_products_size_name ON products(size_name)`,
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