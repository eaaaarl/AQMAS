"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.DatabaseErrors = exports.CustomErrors = void 0;
class CustomErrors extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.CustomErrors = CustomErrors;
class DatabaseErrors extends CustomErrors {
    constructor(message) {
        super(message, 500);
    }
}
exports.DatabaseErrors = DatabaseErrors;
class ValidationError extends CustomErrors {
    constructor(message) {
        super(message, 400);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends CustomErrors {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends CustomErrors {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
