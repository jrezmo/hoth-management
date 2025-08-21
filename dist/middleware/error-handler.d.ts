/**
 * Error Handling Middleware
 * Centralized error handling with proper logging and response formatting
 */
import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare class ValidationError extends Error implements AppError {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string);
}
export declare class NotFoundError extends Error implements AppError {
    statusCode: number;
    isOperational: boolean;
    constructor(message?: string);
}
export declare class UnauthorizedError extends Error implements AppError {
    statusCode: number;
    isOperational: boolean;
    constructor(message?: string);
}
export declare class ForbiddenError extends Error implements AppError {
    statusCode: number;
    isOperational: boolean;
    constructor(message?: string);
}
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorHandler: (error: AppError, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error-handler.d.ts.map