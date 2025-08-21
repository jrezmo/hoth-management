/**
 * Authentication Routes
 * Business user authentication and authorization
 */

import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth-controller';
import { validateRequest } from '../middleware/validate-request';
import { authenticateToken } from '../middleware/authenticate';

const router = Router();
const authController = new AuthController();

// Business user login
router.post('/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  validateRequest,
  authController.login
);

// Get current user profile
router.get('/me',
  authenticateToken,
  authController.getProfile
);

// Update user profile
router.put('/profile',
  authenticateToken,
  [
    body('name')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
  ],
  validateRequest,
  authController.updateProfile
);

// Change password
router.put('/password',
  authenticateToken,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  ],
  validateRequest,
  authController.changePassword
);

// Logout
router.post('/logout',
  authenticateToken,
  authController.logout
);

export { router as authRoutes };