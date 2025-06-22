"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const CustomErrors_1 = require("../../libs/CustomErrors");
const ResponseUtils_1 = require("../../libs/ResponseUtils");
const zod_1 = require("zod");
const logger_1 = require("../logger/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(err.message, {
        stack: err.stack,
        name: err.constructor.name,
        path: req.path,
        method: req.method,
    });
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        const validationErrors = err.errors.map(error => ({
            field: error.path.join('.'),
            message: error.message,
            code: error.code,
        }));
        ResponseUtils_1.ResponseUtils.validationError(res, 'Validation failed', validationErrors);
        return;
    }
    // Handle custom application errors
    if (err instanceof CustomErrors_1.CustomErrors) {
        ResponseUtils_1.ResponseUtils.error(res, err.message, err.statusCode, err.details ? (Array.isArray(err.details) ? err.details : [err.details]) : undefined, { path: req.path });
        return;
    }
    // Handle unknown errors
    ResponseUtils_1.ResponseUtils.internalServerError(res, 'An unexpected error occurred');
};
exports.errorHandler = errorHandler;
