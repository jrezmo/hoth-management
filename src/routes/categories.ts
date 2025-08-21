/**
 * Category Routes
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { CategoryModel } from '../models/category';
import { logger } from '../utils/logger';

const router = Router();

// Get all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.findAll();
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

// Create new category
router.post('/',
  [body('name').notEmpty().withMessage('Category name is required')],
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

      const category = await CategoryModel.create(req.body);
      res.status(201).json({
        data: category,
        message: 'Category created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Failed to create category', { error, body: req.body });
      res.status(500).json({
        error: 'Failed to create category',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export { router as categoryRoutes };