"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const CustomErrors_1 = require("../../libs/CustomErrors");
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    console.error('ERROR HANDLER', err);
    console.error('ERROR HANDLER CONSTRUCTOR NAME', err.constructor.name);
    if (err instanceof CustomErrors_1.CustomErrors) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
        });
        return;
    }
    if (err instanceof zod_1.z.ZodError) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code,
            })),
        });
        return;
    }
    if (err instanceof CustomErrors_1.ValidationError) {
        res.status(400).json({
            success: false,
            message: err.message,
            errors: err,
        });
        return;
    }
    res.status(500).json({
        message: 'Internal Server Error',
    });
};
exports.errorHandler = errorHandler;
