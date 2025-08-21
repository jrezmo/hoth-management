"use strict";
/**
 * Database Routes - Schema inspection and table viewing
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseRoutes = void 0;
const express_1 = require("express");
const database_1 = require("../models/database");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
exports.databaseRoutes = router;
// Get database schema information
router.get('/schema', async (req, res) => {
    try {
        // Get table information from PostgreSQL information_schema
        const tablesResult = await database_1.db.query(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns 
         WHERE table_name = t.table_name AND table_schema = 'public') as field_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
        const tables = [];
        for (const table of tablesResult.rows) {
            // Get field information for each table
            const fieldsResult = await database_1.db.query(`
        SELECT 
          column_name as name,
          data_type as type,
          is_nullable = 'YES' as nullable,
          column_default as default
        FROM information_schema.columns
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [table.table_name]);
            // Get record count for each table
            const countResult = await database_1.db.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
            tables.push({
                name: table.table_name,
                fields: fieldsResult.rows,
                record_count: parseInt(countResult.rows[0].count)
            });
        }
        res.json({
            data: tables,
            message: 'Database schema retrieved successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch database schema', { error });
        res.status(500).json({
            error: 'Failed to fetch database schema',
            timestamp: new Date().toISOString(),
        });
    }
});
// Get all records from a specific table
router.get('/table/:tableName', async (req, res) => {
    try {
        const tableName = req.params.tableName;
        // Validate table name to prevent SQL injection
        const validTablesResult = await database_1.db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name = $1
    `, [tableName]);
        if (validTablesResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Table not found',
                timestamp: new Date().toISOString(),
            });
        }
        // Get all records from the table
        const result = await database_1.db.query(`SELECT * FROM ${tableName} ORDER BY id ASC`);
        res.json({
            data: result.rows,
            message: `Records from ${tableName} retrieved successfully`,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch table records', { error, tableName: req.params.tableName });
        res.status(500).json({
            error: 'Failed to fetch table records',
            timestamp: new Date().toISOString(),
        });
    }
});
//# sourceMappingURL=database.js.map