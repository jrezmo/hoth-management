/**
 * Supplier Routes - Now using distinct values from products table
 */

import { Router, Request, Response } from 'express';
import { ProductModel } from '../models/product';
import { logger } from '../utils/logger';

const router = Router();

// Get all distinct suppliers from products
router.get('/', async (req: Request, res: Response) => {
  try {
    const suppliers = await ProductModel.getDistinctSuppliers();
    res.json({
      data: suppliers,
      message: 'Suppliers retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Failed to fetch suppliers', { error });
    res.status(500).json({
      error: 'Failed to fetch suppliers',
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as supplierRoutes };