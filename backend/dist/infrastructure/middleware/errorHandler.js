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
    if (err instanceof zod_1.ZodError) {
        console.log('Validation errors raw:', err.errors);
        const formattedErrors = err.errors.map(error => ({
            path: error.path.join('.'),
            message: error.message,
        }));
        res.status(400).json({
            message: 'Validation Error',
            errors: formattedErrors,
        });
        return;
    }
    res.status(500).json({
        message: 'Internal Server Error',
    });
};
exports.errorHandler = errorHandler;
