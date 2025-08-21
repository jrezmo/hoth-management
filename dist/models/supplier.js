"use strict";
/**
 * Supplier Model
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierModel = void 0;
const database_1 = require("./database");
class SupplierModel {
    static async create(supplier) {
        const result = await database_1.db.query('INSERT INTO suppliers (name, contact_email, contact_phone) VALUES ($1, $2, $3) RETURNING *', [supplier.name, supplier.contact_email, supplier.contact_phone]);
        return result.rows[0];
    }
    static async findAll() {
        const result = await database_1.db.query('SELECT * FROM suppliers ORDER BY name ASC');
        return result.rows;
    }
    static async findById(id) {
        const result = await database_1.db.query('SELECT * FROM suppliers WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    static async findByName(name) {
        const result = await database_1.db.query('SELECT * FROM suppliers WHERE name = $1', [name]);
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
exports.SupplierModel = SupplierModel;
//# sourceMappingURL=supplier.js.map