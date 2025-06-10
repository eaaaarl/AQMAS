"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseErrors = exports.CustomErrors = void 0;
class CustomErrors extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.CustomErrors = CustomErrors;
class DatabaseErrors extends CustomErrors {
    constructor(message) {
        super(message, 500);
    }
}
exports.DatabaseErrors = DatabaseErrors;
