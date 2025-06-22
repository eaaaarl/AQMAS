"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailableError = exports.QueueError = exports.ConflictError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.DatabaseErrors = exports.CustomErrors = void 0;
class CustomErrors extends Error {
    constructor(message, statusCode, code, details) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomErrors = CustomErrors;
class DatabaseErrors extends CustomErrors {
    constructor(message, details) {
        super(message, 500, 'DATABASE_ERROR', details);
    }
}
exports.DatabaseErrors = DatabaseErrors;
class ValidationError extends CustomErrors {
    constructor(message, details) {
        super(message, 400, 'VALIDATION_ERROR', details);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends CustomErrors {
    constructor(message = 'Resource not found', details) {
        super(message, 404, 'NOT_FOUND', details);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends CustomErrors {
    constructor(message = 'Unauthorized access', details) {
        super(message, 401, 'UNAUTHORIZED', details);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ConflictError extends CustomErrors {
    constructor(message = 'Resource conflict', details) {
        super(message, 409, 'CONFLICT', details);
    }
}
exports.ConflictError = ConflictError;
class QueueError extends CustomErrors {
    constructor(message, details) {
        super(message, 400, 'QUEUE_ERROR', details);
    }
}
exports.QueueError = QueueError;
class ServiceUnavailableError extends CustomErrors {
    constructor(message = 'Service temporarily unavailable', details) {
        super(message, 503, 'SERVICE_UNAVAILABLE', details);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
