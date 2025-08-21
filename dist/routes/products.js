"use strict";
/**
 * Product Routes
 * Complete product management with sensitive business data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const product_1 = require("../models/product");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
exports.productRoutes = router;
// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await product_1.ProductModel.findAll();
        res.json({
            data: products,
            message: 'Products retrieved successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch products', { error });
        res.status(500).json({
            error: 'Failed to fetch products',
            timestamp: new Date().toISOString(),
        });
    }
});
// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await product_1.ProductModel.findById(parseInt(req.params.id));
        if (!product) {
            return res.status(404).json({
                error: 'Product not found',
                timestamp: new Date().toISOString(),
            });
        }
        res.json({
            data: product,
            message: 'Product retrieved successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch product', { error, productId: req.params.id });
        res.status(500).json({
            error: 'Failed to fetch product',
            timestamp: new Date().toISOString(),
        });
    }
});
// Create new product
router.post('/', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Product name is required'),
    (0, express_validator_1.body)('supplier_name').notEmpty().withMessage('Supplier is required'),
    (0, express_validator_1.body)('category_name').notEmpty().withMessage('Category is required'),
    (0, express_validator_1.body)('size_name').notEmpty().withMessage('Size is required'),
    (0, express_validator_1.body)('wholesale_price').isNumeric().withMessage('Wholesale price must be a number'),
    (0, express_validator_1.body)('customer_price').isNumeric().withMessage('Customer price must be a number'),
    (0, express_validator_1.body)('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array(),
                timestamp: new Date().toISOString(),
            });
        }
        const { name, description, supplier_name, category_name, size_name, wholesale_price, customer_price, quantity } = req.body;
        const product = await product_1.ProductModel.create({
            name,
            description: description || null,
            supplier_name,
            category_name,
            size_name,
            wholesale_price: parseFloat(wholesale_price),
            customer_price: parseFloat(customer_price),
            quantity: parseInt(quantity) || 0,
        });
        res.status(201).json({
            data: product,
            message: 'Product created successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to create product', { error, body: req.body });
        res.status(500).json({
            error: 'Failed to create product',
            timestamp: new Date().toISOString(),
        });
    }
});
// Update product
router.put('/:id', [
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Product name cannot be empty'),
    (0, express_validator_1.body)('wholesale_price').optional().isNumeric().withMessage('Wholesale price must be a number'),
    (0, express_validator_1.body)('customer_price').optional().isNumeric().withMessage('Customer price must be a number'),
    (0, express_validator_1.body)('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array(),
                timestamp: new Date().toISOString(),
            });
        }
        const productId = parseInt(req.params.id);
        const updates = { ...req.body };
        const product = await product_1.ProductModel.update(productId, updates);
        if (!product) {
            return res.status(404).json({
                error: 'Product not found',
                timestamp: new Date().toISOString(),
            });
        }
        res.json({
            data: product,
            message: 'Product updated successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to update product', { error, productId: req.params.id, body: req.body });
        res.status(500).json({
            error: 'Failed to update product',
            timestamp: new Date().toISOString(),
        });
    }
});
// Delete product (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const deleted = await product_1.ProductModel.delete(productId);
        if (!deleted) {
            return res.status(404).json({
                error: 'Product not found',
                timestamp: new Date().toISOString(),
            });
        }
        res.json({
            message: 'Product deleted successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to delete product', { error, productId: req.params.id });
        res.status(500).json({
            error: 'Failed to delete product',
            timestamp: new Date().toISOString(),
        });
    }
});
// Search products
router.get('/search/:term', async (req, res) => {
    try {
        const products = await product_1.ProductModel.search(req.params.term);
        res.json({
            data: products,
            message: 'Search completed successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to search products', { error, term: req.params.term });
        res.status(500).json({
            error: 'Failed to search products',
            timestamp: new Date().toISOString(),
        });
    }
});
//# sourceMappingURL=products.js.map