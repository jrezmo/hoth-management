/**
 * Request Validation Middleware
 * Validates request data using express-validator
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        statusCode: 400,
        details: errors.array(),
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }
  
  next();
};