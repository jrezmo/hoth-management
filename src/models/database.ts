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
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,

      // Create indexes for better performance
      `CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id)`,
      `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`,
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