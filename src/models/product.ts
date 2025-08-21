/**
 * Product Model
 * Database operations for product management
 */

import { db } from './database';

export interface Product {
  id?: number;
  supplier_id: number;
  category_id: number;
  size_id: number;
  name: string;
  description?: string;
  wholesale_price: number;
  customer_price: number;
  quantity: number;
  sku?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductWithDetails extends Product {
  supplier_name?: string;
  category_name?: string;
  size_name?: string;
}

export class ProductModel {
  static async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const result = await db.query(
      `INSERT INTO products (supplier_id, category_id, size_id, name, description, 
       wholesale_price, customer_price, quantity, sku, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        product.supplier_id,
        product.category_id, 
        product.size_id,
        product.name,
        product.description,
        product.wholesale_price,
        product.customer_price,
        product.quantity,
        product.sku,
        product.is_active ?? true
      ]
    );
    return result.rows[0];
  }

  static async findAll(): Promise<ProductWithDetails[]> {
    const result = await db.query(`
      SELECT 
        p.*,
        s.name as supplier_name,
        c.name as category_name,
        sz.name as size_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id  
      LEFT JOIN sizes sz ON p.size_id = sz.id
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
    `);
    return result.rows;
  }

  static async findById(id: number): Promise<ProductWithDetails | null> {
    const result = await db.query(`
      SELECT 
        p.*,
        s.name as supplier_name,
        c.name as category_name,
        sz.name as size_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sizes sz ON p.size_id = sz.id  
      WHERE p.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  static async update(id: number, product: Partial<Product>): Promise<Product | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(product).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return null;
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await db.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db.query(
      'UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows.length > 0;
  }

  static async search(term: string): Promise<ProductWithDetails[]> {
    const result = await db.query(`
      SELECT 
        p.*,
        s.name as supplier_name,
        c.name as category_name,
        sz.name as size_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sizes sz ON p.size_id = sz.id
      WHERE p.is_active = true 
        AND (p.name ILIKE $1 OR p.description ILIKE $1 OR p.sku ILIKE $1)
      ORDER BY p.created_at DESC
    `, [`%${term}%`]);
    return result.rows;
  }
}