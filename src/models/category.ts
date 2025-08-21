/**
 * Category Model
 */

import { db } from './database';

export interface Category {
  id?: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export class CategoryModel {
  static async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const result = await db.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [category.name, category.description]
    );
    return result.rows[0];
  }

  static async findAll(): Promise<Category[]> {
    const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
    return result.rows;
  }

  static async findById(id: number): Promise<Category | null> {
    const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByName(name: string): Promise<Category | null> {
    const result = await db.query('SELECT * FROM categories WHERE name = $1', [name]);
    return result.rows[0] || null;
  }

  static async findOrCreate(name: string, description?: string): Promise<Category> {
    const existing = await this.findByName(name);
    if (existing) {
      return existing;
    }
    return this.create({ name, description });
  }
}