/**
 * Size Routes
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { SizeModel } from '../models/size';
import { logger } from '../utils/logger';

const router = Router();

// Get all sizes
router.get('/', async (req: Request, res: Response) => {
  try {
    const sizes = await SizeModel.findAll();
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

// Create new size
router.post('/',
  [body('name').notEmpty().withMessage('Size name is required')],
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

      const size = await SizeModel.create(req.body);
      res.status(201).json({
        data: size,
        message: 'Size created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Failed to create size', { error, body: req.body });
      res.status(500).json({
        error: 'Failed to create size',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export { router as sizeRoutes };