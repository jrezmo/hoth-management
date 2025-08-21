"use strict";
/**
 * Error Handling Middleware
 * Centralized error handling with proper logging and response formatting
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = void 0;
const logger_1 = require("../utils/logger");
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.isOperational = true;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.statusCode = 404;
        this.isOperational = true;
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.statusCode = 401;
        this.isOperational = true;
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends Error {
    constructor(message = 'Forbidden') {
        super(message);
        this.statusCode = 403;
        this.isOperational = true;
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
const notFoundHandler = (req, res, next) => {
    const error = new NotFoundError(`Route ${req.method} ${req.path} not found`);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    // Log error details
    logger_1.logger.error('Request error', {
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
        },
        request: {
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
        },
        statusCode,
    });
    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    const responseMessage = statusCode >= 500 && !isDevelopment
        ? 'Internal Server Error'
        : message;
    res.status(statusCode).json({
        error: {
            message: responseMessage,
            statusCode,
            ...(isDevelopment && error.stack && { stack: error.stack }),
        },
        timestamp: new Date().toISOString(),
        path: req.path,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map