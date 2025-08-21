/**
 * Database Connection and Schema Management
 */

import { Pool } from 'pg';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

export class Database {
  private pool: Pool | null = null;

  async connect(): Promise<void> {
    if (!config.database.url) {
      throw new Error('Database URL is not configured');
    }

    this.pool = new Pool({
      connectionString: config.database.url,
      ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
    });

    try {
      await this.pool.query('SELECT NOW()');
      logger.info('Database connected successfully');
      await this.createTables();
    } catch (error) {
      logger.error('Database connection failed', { error });
      throw error;
    }
  }

  async query(text: string, params?: any[]): Promise<any> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }
    return this.pool.query(text, params);
  }

  private async createTables(): Promise<void> {
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
        logger.info('Table created/verified successfully');
      } catch (error) {
        logger.error('Failed to create table', { error, sql: table });
        throw error;
      }
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      logger.info('Database connection closed');
    }
  }
}

export const db = new Database();