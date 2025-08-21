/**
 * Size Model
 */

import { db } from './database';

export interface Size {
  id?: number;
  name: string;
  created_at?: string;
}

export class SizeModel {
  static async create(size: Omit<Size, 'id' | 'created_at'>): Promise<Size> {
    const result = await db.query(
      'INSERT INTO sizes (name) VALUES ($1) RETURNING *',
      [size.name]
    );
    return result.rows[0];
  }

  static async findAll(): Promise<Size[]> {
    const result = await db.query('SELECT * FROM sizes ORDER BY name ASC');
    return result.rows;
  }

  static async findById(id: number): Promise<Size | null> {
    const result = await db.query('SELECT * FROM sizes WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByName(name: string): Promise<Size | null> {
    const result = await db.query('SELECT * FROM sizes WHERE name = $1', [name]);
    return result.rows[0] || null;
  }

  static async findOrCreate(name: string): Promise<Size> {
    const existing = await this.findByName(name);
    if (existing) {
      return existing;
    }
    return this.create({ name });
  }
}