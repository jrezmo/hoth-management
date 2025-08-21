/**
 * Supplier Routes
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { SupplierModel } from '../models/supplier';
import { logger } from '../utils/logger';

const router = Router();

// Get all suppliers
router.get('/', async (req: Request, res: Response) => {
  try {
    const suppliers = await SupplierModel.findAll();
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

// Create new supplier
router.post('/',
  [body('name').notEmpty().withMessage('Supplier name is required')],
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

      const supplier = await SupplierModel.create(req.body);
      res.status(201).json({
        data: supplier,
        message: 'Supplier created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Failed to create supplier', { error, body: req.body });
      res.status(500).json({
        error: 'Failed to create supplier',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export { router as supplierRoutes };