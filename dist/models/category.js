"use strict";
/**
 * Category Model
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const database_1 = require("./database");
class CategoryModel {
    static async create(category) {
        const result = await database_1.db.query('INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *', [category.name, category.description]);
        return result.rows[0];
    }
    static async findAll() {
        const result = await database_1.db.query('SELECT * FROM categories ORDER BY name ASC');
        return result.rows;
    }
    static async findById(id) {
        const result = await database_1.db.query('SELECT * FROM categories WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    static async findByName(name) {
        const result = await database_1.db.query('SELECT * FROM categories WHERE name = $1', [name]);
        return result.rows[0] || null;
    }
    static async findOrCreate(name, description) {
        const existing = await this.findByName(name);
        if (existing) {
            return existing;
        }
        return this.create({ name, description });
    }
}
exports.CategoryModel = CategoryModel;
//# sourceMappingURL=category.js.map