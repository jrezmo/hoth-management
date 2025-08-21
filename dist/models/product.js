"use strict";
/**
 * Product Model
 * Database operations for product management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const database_1 = require("./database");
class ProductModel {
    static async create(product) {
        const result = await database_1.db.query(`INSERT INTO products (supplier_name, category_name, size_name, name, description, 
       wholesale_price, customer_price, quantity, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`, [
            product.supplier_name,
            product.category_name,
            product.size_name,
            product.name,
            product.description,
            product.wholesale_price,
            product.customer_price,
            product.quantity,
            product.is_active ?? true
        ]);
        return result.rows[0];
    }
    static async findAll() {
        const result = await database_1.db.query(`
      SELECT * FROM products 
      WHERE is_active = true
      ORDER BY created_at DESC
    `);
        return result.rows;
    }
    static async findById(id) {
        const result = await database_1.db.query(`
      SELECT * FROM products 
      WHERE id = $1 AND is_active = true
    `, [id]);
        return result.rows[0] || null;
    }
    static async update(id, product) {
        const fields = [];
        const values = [];
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
        const result = await database_1.db.query(`UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
        return result.rows[0] || null;
    }
    static async delete(id) {
        const result = await database_1.db.query('UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id', [id]);
        return result.rows.length > 0;
    }
    static async search(term) {
        const result = await database_1.db.query(`
      SELECT * FROM products
      WHERE is_active = true 
        AND (name ILIKE $1 OR description ILIKE $1 OR supplier_name ILIKE $1 OR category_name ILIKE $1)
      ORDER BY created_at DESC
    `, [`%${term}%`]);
        return result.rows;
    }
    // Get distinct values for picklists
    static async getDistinctSuppliers() {
        const result = await database_1.db.query(`
      SELECT DISTINCT supplier_name as name 
      FROM products 
      WHERE is_active = true AND supplier_name IS NOT NULL
      ORDER BY supplier_name ASC
    `);
        return result.rows;
    }
    static async getDistinctCategories() {
        const result = await database_1.db.query(`
      SELECT DISTINCT category_name as name 
      FROM products 
      WHERE is_active = true AND category_name IS NOT NULL
      ORDER BY category_name ASC
    `);
        return result.rows;
    }
    static async getDistinctSizes() {
        const result = await database_1.db.query(`
      SELECT DISTINCT size_name as name 
      FROM products 
      WHERE is_active = true AND size_name IS NOT NULL
      ORDER BY size_name ASC
    `);
        return result.rows;
    }
}
exports.ProductModel = ProductModel;
//# sourceMappingURL=product.js.map