"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const CustomErrors_1 = require("../../libs/CustomErrors");
const ResponseUtils_1 = require("../../libs/ResponseUtils");
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    console.error('Error Handler:', {
        error: err.message,
        stack: err.stack,
        constructor: err.constructor.name,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
    // Handle custom application errors
    if (err instanceof CustomErrors_1.CustomErrors) {
        const errorResponse = {
            code: err.code || 'CUSTOM_ERROR',
            details: err.details || null,
        };
        ResponseUtils_1.ResponseUtils.error(res, err.message, err.statusCode, undefined, { path: req.path });
        return;
    }
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
    // Handle specific error types with appropriate status codes
    if (err instanceof CustomErrors_1.ValidationError) {
        ResponseUtils_1.ResponseUtils.validationError(res, err.message);
        return;
    }
    if (err instanceof CustomErrors_1.NotFoundError) {
        ResponseUtils_1.ResponseUtils.notFound(res, err.message);
        return;
    }
    if (err instanceof CustomErrors_1.ConflictError) {
        ResponseUtils_1.ResponseUtils.conflict(res, err.message);
        return;
    }
    if (err instanceof CustomErrors_1.UnauthorizedError) {
        ResponseUtils_1.ResponseUtils.unauthorized(res, err.message);
        return;
    }
    if (err instanceof CustomErrors_1.QueueError) {
        ResponseUtils_1.ResponseUtils.error(res, err.message, 400);
        return;
    }
    if (err instanceof CustomErrors_1.DatabaseErrors) {
        ResponseUtils_1.ResponseUtils.error(res, 'Database operation failed', 500);
        return;
    }
    // Handle unknown errors
    ResponseUtils_1.ResponseUtils.internalServerError(res, 'An unexpected error occurred');
};
exports.errorHandler = errorHandler;
