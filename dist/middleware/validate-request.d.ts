/**
 * Request Validation Middleware
 * Validates request data using express-validator
 */
import { Request, Response, NextFunction } from 'express';
export declare const validateRequest: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validate-request.d.ts.map