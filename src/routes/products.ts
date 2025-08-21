/**
 * Product Routes
 * Complete product management with sensitive business data
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { ProductModel } from '../models/product';
import { SupplierModel } from '../models/supplier';
import { CategoryModel } from '../models/category';
import { SizeModel } from '../models/size';
import { logger } from '../utils/logger';

const router = Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.findAll();
    res.json({
      data: products,
      message: 'Products retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Failed to fetch products', { error });
    res.status(500).json({
      error: 'Failed to fetch products',
      timestamp: new Date().toISOString(),
    });
  }
});

// Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(parseInt(req.params.id));
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
  } catch (error) {
    logger.error('Failed to fetch product', { error, productId: req.params.id });
    res.status(500).json({
      error: 'Failed to fetch product',
      timestamp: new Date().toISOString(),
    });
  }
});

// Create new product
router.post('/',
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('supplier_name').notEmpty().withMessage('Supplier is required'),
    body('category_name').notEmpty().withMessage('Category is required'),
    body('size_name').notEmpty().withMessage('Size is required'),
    body('wholesale_price').isNumeric().withMessage('Wholesale price must be a number'),
    body('customer_price').isNumeric().withMessage('Customer price must be a number'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
          timestamp: new Date().toISOString(),
        });
      }

      const { 
        name, 
        description, 
        supplier_name, 
        category_name, 
        size_name, 
        wholesale_price, 
        customer_price, 
        quantity,
        sku 
      } = req.body;

      // Find or create supplier, category, and size
      const supplier = await SupplierModel.findOrCreate(supplier_name);
      const category = await CategoryModel.findOrCreate(category_name);
      const size = await SizeModel.findOrCreate(size_name);

      const product = await ProductModel.create({
        name,
        description,
        supplier_id: supplier.id!,
        category_id: category.id!,
        size_id: size.id!,
        wholesale_price: parseFloat(wholesale_price),
        customer_price: parseFloat(customer_price),
        quantity: parseInt(quantity),
        sku,
      });

      res.status(201).json({
        data: product,
        message: 'Product created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Failed to create product', { error, body: req.body });
      res.status(500).json({
        error: 'Failed to create product',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// Update product
router.put('/:id',
  [
    body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
    body('wholesale_price').optional().isNumeric().withMessage('Wholesale price must be a number'),
    body('customer_price').optional().isNumeric().withMessage('Customer price must be a number'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
          timestamp: new Date().toISOString(),
        });
      }

      const productId = parseInt(req.params.id);
      const updates: any = { ...req.body };

      // Handle supplier, category, size updates
      if (req.body.supplier_name) {
        const supplier = await SupplierModel.findOrCreate(req.body.supplier_name);
        updates.supplier_id = supplier.id;
        delete updates.supplier_name;
      }
      if (req.body.category_name) {
        const category = await CategoryModel.findOrCreate(req.body.category_name);
        updates.category_id = category.id;
        delete updates.category_name;
      }
      if (req.body.size_name) {
        const size = await SizeModel.findOrCreate(req.body.size_name);
        updates.size_id = size.id;
        delete updates.size_name;
      }

      const product = await ProductModel.update(productId, updates);
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
    } catch (error) {
      logger.error('Failed to update product', { error, productId: req.params.id, body: req.body });
      res.status(500).json({
        error: 'Failed to update product',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// Delete product (soft delete)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const deleted = await ProductModel.delete(productId);
    
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
  } catch (error) {
    logger.error('Failed to delete product', { error, productId: req.params.id });
    res.status(500).json({
      error: 'Failed to delete product',
      timestamp: new Date().toISOString(),
    });
  }
});

// Search products
router.get('/search/:term', async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.search(req.params.term);
    res.json({
      data: products,
      message: 'Search completed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Failed to search products', { error, term: req.params.term });
    res.status(500).json({
      error: 'Failed to search products',
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as productRoutes };