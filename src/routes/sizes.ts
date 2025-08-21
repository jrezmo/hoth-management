/**
 * Size Routes - Now using distinct values from products table
 */

import { Router, Request, Response } from 'express';
import { ProductModel } from '../models/product';
import { logger } from '../utils/logger';

const router = Router();

// Get all distinct sizes from products
router.get('/', async (req: Request, res: Response) => {
  try {
    const sizes = await ProductModel.getDistinctSizes();
    res.json({
      data: sizes,
      message: 'Sizes retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Failed to fetch sizes', { error });
    res.status(500).json({
      error: 'Failed to fetch sizes',
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as sizeRoutes };