/**
 * Supplier Model
 */

import { db } from './database';

export interface Supplier {
  id?: number;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export class SupplierModel {
  static async create(supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> {
    const result = await db.query(
      'INSERT INTO suppliers (name, contact_email, contact_phone) VALUES ($1, $2, $3) RETURNING *',
      [supplier.name, supplier.contact_email, supplier.contact_phone]
    );
    return result.rows[0];
  }

  static async findAll(): Promise<Supplier[]> {
    const result = await db.query('SELECT * FROM suppliers ORDER BY name ASC');
    return result.rows;
  }

  static async findById(id: number): Promise<Supplier | null> {
    const result = await db.query('SELECT * FROM suppliers WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByName(name: string): Promise<Supplier | null> {
    const result = await db.query('SELECT * FROM suppliers WHERE name = $1', [name]);
    return result.rows[0] || null;
  }

  static async findOrCreate(name: string): Promise<Supplier> {
    const existing = await this.findByName(name);
    if (existing) {
      return existing;
    }
    return this.create({ name });
  }
}