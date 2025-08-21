"use strict";
/**
 * Size Model
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeModel = void 0;
const database_1 = require("./database");
class SizeModel {
    static async create(size) {
        const result = await database_1.db.query('INSERT INTO sizes (name) VALUES ($1) RETURNING *', [size.name]);
        return result.rows[0];
    }
    static async findAll() {
        const result = await database_1.db.query('SELECT * FROM sizes ORDER BY name ASC');
        return result.rows;
    }
    static async findById(id) {
        const result = await database_1.db.query('SELECT * FROM sizes WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    static async findByName(name) {
        const result = await database_1.db.query('SELECT * FROM sizes WHERE name = $1', [name]);
        return result.rows[0] || null;
    }
    static async findOrCreate(name) {
        const existing = await this.findByName(name);
        if (existing) {
            return existing;
        }
        return this.create({ name });
    }
}
exports.SizeModel = SizeModel;
//# sourceMappingURL=size.js.map