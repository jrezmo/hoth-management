/**
 * Category Routes - Now using distinct values from products table
 */

import { Router, Request, Response } from 'express';
import { ProductModel } from '../models/product';
import { logger } from '../utils/logger';

const router = Router();

// Get all distinct categories from products
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await ProductModel.getDistinctCategories();
    res.json({
      data: categories,
      message: 'Categories retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Failed to fetch categories', { error });
    res.status(500).json({
      error: 'Failed to fetch categories',
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as categoryRoutes };