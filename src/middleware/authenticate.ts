/**
 * Authentication Middleware
 * JWT token validation for business users
 */

import { Request, Response, NextFunction } from 'express';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: {
        message: 'Access token is required',
        statusCode: 401,
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  // Placeholder token validation
  // In real implementation, verify JWT token here
  (req as any).user = {
    id: '1',
    email: 'user@example.com',
    role: 'business_manager',
  };

  next();
};