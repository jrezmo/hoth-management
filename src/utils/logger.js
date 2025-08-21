"use strict";
/**
 * Logging Utility
 * Structured logging with different levels and formats
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerStream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const environment_1 = require("../config/environment");
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}] ${message}`;
    if (Object.keys(meta).length > 0) {
        log += ` ${JSON.stringify(meta)}`;
    }
    return log;
}));
exports.logger = winston_1.default.createLogger({
    level: environment_1.config.logging.level,
    format: logFormat,
    defaultMeta: {
        service: 'hoth-management',
    },
    transports: [
        // Write all logs to file in production
        ...(environment_1.config.nodeEnv === 'production' ? [
            new winston_1.default.transports.File({
                filename: 'logs/error.log',
                level: 'error',
            }),
            new winston_1.default.transports.File({
                filename: 'logs/combined.log',
            }),
        ] : []),
        // Console output for development
        new winston_1.default.transports.Console({
            format: environment_1.config.nodeEnv === 'development' ? consoleFormat : logFormat,
        }),
    ],
});
// Stream interface for Morgan HTTP request logging
exports.loggerStream = {
    write: (message) => {
        exports.logger.info(message.trim());
    },
};
//# sourceMappingURL=logger.js.map