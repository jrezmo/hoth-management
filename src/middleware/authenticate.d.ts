/**
 * Authentication Middleware
 * JWT token validation for business users
 */
import { Request, Response, NextFunction } from 'express';
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authenticate.d.ts.map